package com.master.controller;

import com.master.dto.ApprenantStatResponse;
import com.master.dto.EvaluateurStatResponse;
import com.master.dto.StatistiquesResponse;
import com.master.dto.QuestionnaireResponse;
import com.master.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // GET /api/admin/statistiques
    @GetMapping("/statistiques")
    public ResponseEntity<StatistiquesResponse> statistiques() {
        return ResponseEntity.ok(adminService.statistiques());
    }

    // GET /api/admin/apprenants
    @GetMapping("/apprenants")
    public ResponseEntity<List<ApprenantStatResponse>> apprenants() {
        return ResponseEntity.ok(adminService.listerApprenants());
    }

    // GET /api/admin/evaluateurs
    @GetMapping("/evaluateurs")
    public ResponseEntity<List<EvaluateurStatResponse>> evaluateurs() {
        return ResponseEntity.ok(adminService.listerEvaluateurs());
    }

    // PUT /api/admin/utilisateurs/{id}/statut — bloquer / débloquer un compte
    @PutMapping("/utilisateurs/{id}/statut")
    public ResponseEntity<?> changerStatut(@PathVariable Long id) {
        try {
            boolean actif = adminService.changerStatut(id);
            return ResponseEntity.ok(Map.of("actif", actif));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/admin/questionnaires — liste complète, vue admin uniquement
    @GetMapping("/questionnaires")
    public ResponseEntity<List<QuestionnaireResponse>> listerQuestionnaires() {
        return ResponseEntity.ok(adminService.listerQuestionnaires());
    }

    // PUT /api/admin/questionnaires/{id}/archiver — retire un quiz de la diffusion
    @PutMapping("/questionnaires/{id}/archiver")
    public ResponseEntity<?> archiverQuestionnaire(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.archiverQuestionnaire(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
