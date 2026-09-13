package com.telusko.ecomproj.repo;

import com.telusko.ecomproj.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepo extends JpaRepository<CartItem, Integer> {

}