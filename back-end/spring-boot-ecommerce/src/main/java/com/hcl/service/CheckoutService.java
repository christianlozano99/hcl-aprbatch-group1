package com.hcl.service;


import com.hcl.dto.Purchase;
import com.hcl.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}