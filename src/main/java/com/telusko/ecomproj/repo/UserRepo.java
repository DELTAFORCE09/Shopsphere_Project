package com.telusko.ecomproj.repo;

import com.telusko.ecomproj.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Integer> {

}