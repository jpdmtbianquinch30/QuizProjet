package com.master.controller;

import com.master.dto.AuthRequest;
import com.master.dto.AuthResponse;
import com.master.entity.User;
import com.master.security.CustomUserDetailsService;
import com.master.service.JwtService;
import com.master.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtService jwtService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody AuthRequest request) {

        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Email déjà utilisé");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .nom(request.getEmail().split("@")[0])
                .role(User.Role.USER)
                .build();

        userService.save(user);

        UserDetails userDetails =
                customUserDetailsService.loadUserByUsername(user.getEmail());

        // Ajout du rôle dans le token
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        String token = jwtService.generateToken(claims, userDetails);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                AuthResponse.builder()
                        .token(token)
                        .email(user.getEmail())
                        .nom(user.getNom())
                        .role(user.getRole().name())
                        .build()
        );
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody AuthRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userService.findByEmail(request.getEmail());
        UserDetails userDetails =
                customUserDetailsService.loadUserByUsername(user.getEmail());

        // Ajout du rôle dans le token
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        String token = jwtService.generateToken(claims, userDetails);

        return ResponseEntity.ok(
                AuthResponse.builder()
                        .token(token)
                        .email(user.getEmail())
                        .nom(user.getNom())
                        .role(user.getRole().name())
                        .build()
        );
    }
}