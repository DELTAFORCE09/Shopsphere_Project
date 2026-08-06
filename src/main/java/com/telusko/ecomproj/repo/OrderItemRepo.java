package com.telusko.ecomproj.repo;

import com.telusko.ecomproj.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepo extends JpaRepository<OrderItem, Integer> {

}