package com.telusko.ecomproj.service;

import com.telusko.ecomproj.model.User;
import com.telusko.ecomproj.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return repo.save(user);
    }

}