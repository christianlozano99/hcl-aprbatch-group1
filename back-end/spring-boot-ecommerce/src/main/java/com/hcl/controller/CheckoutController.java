package com.hcl.controller;

import com.hcl.dto.Purchase;
import com.hcl.dto.PurchaseResponse;
import com.hcl.service.CheckoutService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    Logger logger = LoggerFactory.getLogger(CheckoutController.class);

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {

        logger.info("Purchase is being made");

        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);



        return purchaseResponse;
    }

}

