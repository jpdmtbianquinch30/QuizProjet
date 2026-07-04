package com.master.controller;

import com.master.dto.VerifierReponseRequest;
import com.master.dto.VerifierReponseResponse;
import com.master.entity.Question;
import com.master.repository.QuestionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class QuestionController {

    private final QuestionRepository questionRepository;

    // POST /api/questions/{id}/verifier
    @PostMapping("/{id}/verifier")
    @PreAuthorize("hasAnyRole('USER', 'EVALUATEUR', 'ADMIN')")
    public ResponseEntity<VerifierReponseResponse> verifier(
            @PathVariable Long id,
            @RequestBody VerifierReponseRequest request) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question introuvable : " + id));

        boolean correcte = request.getChoixIndex() != null
                && request.getChoixIndex().equals(question.getBonneReponseIndex());

        return ResponseEntity.ok(
                VerifierReponseResponse.builder()
                        .correcte(correcte)
                        .bonneReponseIndex(question.getBonneReponseIndex())
                        .build()
        );
    }
}