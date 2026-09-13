package com.telusko.ecomproj.controller;

import com.telusko.ecomproj.model.LoginRequest;
import com.telusko.ecomproj.model.User;
import com.telusko.ecomproj.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request){

        return service.verify(request);

    }
}