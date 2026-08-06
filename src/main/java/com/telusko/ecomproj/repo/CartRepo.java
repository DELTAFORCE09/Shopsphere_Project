package com.telusko.ecomproj.repo;

import com.telusko.ecomproj.model.Cart;
import com.telusko.ecomproj.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepo extends JpaRepository<Cart, Integer> {

    Optional<Cart> findByUser(User user);

}