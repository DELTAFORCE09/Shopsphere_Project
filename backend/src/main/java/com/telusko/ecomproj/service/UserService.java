package com.telusko.ecomproj.service;

import com.telusko.ecomproj.model.LoginRequest;
import com.telusko.ecomproj.model.User;
import com.telusko.ecomproj.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.telusko.ecomproj.model.LoginRequest;
import org.springframework.security.core.Authentication;
@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    public User register(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return repo.save(user);
    }
    public String verify(LoginRequest loginRequest) {

    Authentication authentication =
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

    if(authentication.isAuthenticated()){

        User user = repo.findByUsername(loginRequest.getUsername());

        return jwtService.generateToken(
                user.getUsername(),
                user.getRole().name()
        );
    }

    return "Failed";
}
}