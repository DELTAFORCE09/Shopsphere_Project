package com.telusko.ecomproj.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

@Service
public class JWTService {

    private final SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(String username, String role) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .signWith(key)
                .compact();
    }

    public String extractUserName(String token) {

    return extractAllClaims(token).getSubject();

    }
    private Claims extractAllClaims(String token) {

    return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();

}
public boolean validateToken(String token, String username) {

    return extractUserName(token).equals(username)
            && !isTokenExpired(token);

}
private boolean isTokenExpired(String token) {

    return extractAllClaims(token)
            .getExpiration()
            .before(new Date());

}
}