package com.master.controller;

import com.master.dto.IaGenerationRequest;
import com.master.dto.IaGenerationResponse;
import com.master.service.IaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ia")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class IaController {

    private final IaService iaService;

    // POST /api/ia/generer
    @PostMapping("/generer")
    @PreAuthorize("hasAnyRole('EVALUATEUR', 'ADMIN')")
    public ResponseEntity<?> generer(@Valid @RequestBody IaGenerationRequest request) {
        try {
            IaGenerationResponse response = IaGenerationResponse.builder()
                    .questions(iaService.genererQuestions(request))
                    .build();
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_GATEWAY)
                    .body(e.getMessage());
        }
    }
}