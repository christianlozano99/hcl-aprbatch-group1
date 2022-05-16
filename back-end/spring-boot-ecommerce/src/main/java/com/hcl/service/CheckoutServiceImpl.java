package com.hcl.service;

import com.hcl.dao.CustomerRepository;
import com.hcl.dto.Purchase;
import com.hcl.dto.PurchaseResponse;
import com.hcl.entity.Customer;
import com.hcl.entity.Order;
import com.hcl.entity.OrderItem;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {
    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository=customerRepository;
    }
    @Override
    public PurchaseResponse placeOrder(Purchase purchase) {
        // retrieve the order info from dto
        Order order = purchase.getOrder();

        // generate tracking number
        String orderTrackingNumber =generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        
//        populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(order::add);

//        populate customer with order
        order.setBillingAddress(purchase.getBillingAddress());
        order.setBillingAddress(purchase.getShippingAddress());

//         save to the database
        Customer customer = purchase.getCustomer();
        customer.add(order);
        customerRepository.save(customer);
//        return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        // generate a random UUID number (UUID version-4)
        return UUID.randomUUID().toString();
    }
}
