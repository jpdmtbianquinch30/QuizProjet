package com.master.controller;

import com.master.dto.CreateUserRequest;
import com.master.dto.DashboardResponse;
import com.master.dto.ResetPasswordRequest;
import com.master.dto.UpdateUserRequest;
import com.master.dto.UserResponse;
import com.master.entity.User;
import com.master.service.AdminDashboardService;
import com.master.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {


    private final UserService userService;
    private final AdminDashboardService adminDashboardService;



    // ==========================
    // DASHBOARD ADMIN
    // ==========================

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> dashboard() {

        return ResponseEntity.ok(
                adminDashboardService.dashboard()
        );
    }



    // ==========================
    // LISTE TOUS LES UTILISATEURS
    // ==========================

    @GetMapping("/utilisateurs")
    public ResponseEntity<List<UserResponse>> utilisateurs() {

        return ResponseEntity.ok(
                userService.findAll()
                        .stream()
                        .map(this::convert)
                        .toList()
        );
    }



    @GetMapping("/utilisateurs/{id}")
    public ResponseEntity<UserResponse> utilisateur(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                convert(userService.findById(id))
        );
    }



    // ==========================
    // CREATION ADMIN
    // ==========================

    @PostMapping("/admins")
    public ResponseEntity<UserResponse> creerAdmin(
            @Valid @RequestBody CreateUserRequest request) {


        User admin = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(User.Role.ADMIN)
                .actif(true)
                .build();


        admin = userService.save(admin);


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(convert(admin));
    }




    // ==========================
    // CREATION EVALUATEUR
    // ==========================

    @PostMapping("/evaluateurs")
    public ResponseEntity<UserResponse> creerEvaluateur(
            @Valid @RequestBody CreateUserRequest request) {


        User evaluateur = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(User.Role.EVALUATEUR)
                .actif(true)
                .build();


        evaluateur = userService.save(evaluateur);


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(convert(evaluateur));
    }




    // ==========================
    // CREATION UTILISATEUR NORMAL
    // ==========================

    @PostMapping("/users")
    public ResponseEntity<UserResponse> creerUser(
            @Valid @RequestBody CreateUserRequest request) {


        User user = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(User.Role.USER)
                .actif(true)
                .build();


        user = userService.save(user);


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(convert(user));
    }





    // ==========================
    // MODIFICATION UTILISATEUR
    // ==========================

    @PutMapping("/utilisateurs/{id}")
    public ResponseEntity<UserResponse> modifier(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {


        User user = userService.modifierUtilisateur(
                id,
                request.getNom(),
                request.getPrenom(),
                request.getEmail()
        );


        return ResponseEntity.ok(convert(user));
    }




    // ==========================
    // SUPPRESSION
    // ==========================

    @DeleteMapping("/utilisateurs/{id}")
    public ResponseEntity<Void> supprimer(
            @PathVariable Long id) {


        userService.supprimerUtilisateur(id);


        return ResponseEntity.noContent().build();
    }




    // ==========================
    // ACTIVATION / DESACTIVATION
    // ==========================


    @PatchMapping("/utilisateurs/{id}/activer")
    public ResponseEntity<UserResponse> activer(
            @PathVariable Long id) {


        return ResponseEntity.ok(
                convert(userService.activerUtilisateur(id))
        );
    }



    @PatchMapping("/utilisateurs/{id}/desactiver")
    public ResponseEntity<UserResponse> desactiver(
            @PathVariable Long id) {


        return ResponseEntity.ok(
                convert(userService.desactiverUtilisateur(id))
        );
    }




    // ==========================
    // RESET PASSWORD
    // ==========================

    @PutMapping("/utilisateurs/{id}/reset-password")
    public ResponseEntity<?> resetPassword(
            @PathVariable Long id,
            @RequestBody ResetPasswordRequest request) {


        userService.reinitialiserMotDePasse(
                id,
                request.getNouveauMotDePasse()
        );


        return ResponseEntity.ok(
                "Mot de passe réinitialisé."
        );
    }





    // ==========================
    // CONVERSION ENTITY -> DTO
    // ==========================

    private UserResponse convert(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .role(user.getRole().name())
                .actif(user.getActif())
                .build();
    }

}