package com.telusko.ecomproj.repo;

import com.telusko.ecomproj.model.Order;
import com.telusko.ecomproj.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Integer> {

    List<Order> findByUser(User user);

}