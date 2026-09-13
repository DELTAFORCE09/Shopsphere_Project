package com.telusko.ecomproj.controller;

import com.telusko.ecomproj.model.Order;
import com.telusko.ecomproj.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderService orderService;


    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
            Authentication authentication) {

        try {

            Order order =
                    orderService.checkout(
                            authentication.getName()
                    );

            return new ResponseEntity<>(
                    order,
                    HttpStatus.CREATED
            );

        } catch (RuntimeException e) {

            return new ResponseEntity<>(
                    e.getMessage(),
                    HttpStatus.BAD_REQUEST
            );
        }
    }
}