package com.telusko.ecomproj.service;

import com.telusko.ecomproj.model.Cart;
import com.telusko.ecomproj.model.CartItem;
import com.telusko.ecomproj.model.Product;
import com.telusko.ecomproj.model.User;
import com.telusko.ecomproj.repo.CartItemRepo;
import com.telusko.ecomproj.repo.CartRepo;
import com.telusko.ecomproj.repo.ProductRepo;
import com.telusko.ecomproj.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private UserRepo userRepo;

    private Cart getOrCreateCart(User user) {

    return cartRepo.findByUser(user)
            .orElseGet(() -> {
                Cart cart = new Cart();
                cart.setUser(user);
                return cartRepo.save(cart);
            });

    }

    public Cart addToCart(String username, int productId) {

        User user = userRepo.findByUsername(username);

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = getOrCreateCart(user);

        for (CartItem item : cart.getItems()) {

            if (item.getProduct().getId() == productId) {

                item.setQuantity(item.getQuantity() + 1);
                cartItemRepo.save(item);

                return cart;
            }
        }

        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(1);

        cart.getItems().add(cartItem);

        cartRepo.save(cart);

        return cart;
    }

    public Cart getCart(String username) {

        User user = userRepo.findByUsername(username);

        return getOrCreateCart(user);
    }

    public void removeFromCart(String username, int productId) {

        User user = userRepo.findByUsername(username);

        Cart cart = getOrCreateCart(user);

        cart.getItems().removeIf(item ->
                item.getProduct().getId() == productId
        );

        cartRepo.save(cart);
    }


}