package com.hcl.service;

import com.hcl.controller.CheckoutController;
import com.hcl.dao.CustomerRepository;
import com.hcl.dao.ProductRepository;
import com.hcl.dto.Purchase;
import com.hcl.dto.PurchaseResponse;
import com.hcl.entity.Customer;
import com.hcl.entity.Order;
import com.hcl.entity.OrderItem;
import com.hcl.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    Logger logger = LoggerFactory.getLogger(CheckoutServiceImpl.class);

    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        // ALbums to be logged for change
        StringBuilder albums = new StringBuilder();
        // retrieve the order info from dto
        Order order = purchase.getOrder();

        // generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        // populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        // save to the database
        customerRepository.save(customer);

        // update product quantity in DB
        for(OrderItem curr: orderItems) {
            Product productUpdate = productRepository.getById(curr.getProductId());
            productUpdate.setUnitsInStock(productUpdate.getUnitsInStock() - curr.getQuantity());

            albums.append(productUpdate.getName()+ " | ");

            productRepository.save(productUpdate);
        }


        // Double logging because there is a weird bug that logstash skips the last logged item
        logger.info("The following album(s) have been purchased: " + albums);
        logger.info("The following album(s) have been purchased: " + albums);

        // return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {

        // generate a random UUID number (UUID version-4)
        // For details see: https://en.wikipedia.org/wiki/Universally_unique_identifier
        //
        return UUID.randomUUID().toString();
    }
}





