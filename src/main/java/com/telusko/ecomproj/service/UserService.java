package com.telusko.ecomproj.service;

import com.telusko.ecomproj.model.User;
import com.telusko.ecomproj.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    public User register(User user) {
        return repo.save(user);
    }

}