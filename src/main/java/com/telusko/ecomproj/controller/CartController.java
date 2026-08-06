package com.telusko.ecomproj.controller;

import com.telusko.ecomproj.model.Cart;
import com.telusko.ecomproj.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add/{productId}")
    public Cart addToCart(@PathVariable int productId,
                        Authentication authentication) {
        System.out.println("Inside addToCart()");
        return cartService.addToCart(
                authentication.getName(),
                productId
        );
    }

    @GetMapping
    public Cart getCart(Authentication authentication) {

        return cartService.getCart(
                authentication.getName()
        );
    }

    @DeleteMapping("/{productId}")
        public void removeFromCart(@PathVariable int productId,
                                Authentication authentication) {

            cartService.removeFromCart(
                    authentication.getName(),
                    productId
            );
        }

}

