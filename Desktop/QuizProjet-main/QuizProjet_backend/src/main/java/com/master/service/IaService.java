package com.master.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.master.dto.IaGenerationRequest;
import com.master.dto.QuestionnaireRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class IaService {

    // Clé récupérée gratuitement sur https://console.groq.com/keys
    @Value("${app.ia.api.key:}")
    private String apiKey;

    @Value("${app.ia.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    @Value("${app.ia.model:llama-3.3-70b-versatile}")
    private String model;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Génère une liste de questions à choix multiples via l'API Groq (gratuite)
     * à partir d'un thème, d'un nombre de questions et d'un niveau.
     */
    public List<QuestionnaireRequest.QuestionDTO> genererQuestions(IaGenerationRequest request) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "Clé API IA non configurée (app.ia.api.key). " +
                            "Contactez l'administrateur du projet.");
        }

        String prompt = construirePrompt(request);

        String bodyJson = """
                {
                  "model": "%s",
                  "temperature": 0.7,
                  "max_tokens": 4000,
                  "response_format": { "type": "json_object" },
                  "messages": [
                    { "role": "user", "content": %s }
                  ]
                }
                """.formatted(model, objectMapper.valueToTree(prompt).toString());

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(bodyJson))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(
                    httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("Erreur API IA ({}) : {}", response.statusCode(), response.body());
                throw new IllegalStateException(
                        "Le service IA a renvoyé une erreur (code " + response.statusCode() + ")");
            }

            return extraireQuestions(response.body());

        } catch (java.io.IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Erreur lors de l'appel à l'API IA", e);
            throw new IllegalStateException("Impossible de contacter le service IA", e);
        }
    }

    private String construirePrompt(IaGenerationRequest request) {
        return """
                Tu es un générateur de questionnaires pédagogiques.
                Génère exactement %d questions à choix multiples (QCM) sur le thème "%s",
                de niveau de difficulté "%s".

                Règles strictes :
                - Chaque question a exactement 4 choix de réponse.
                - Un seul choix est correct.
                - Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, sans balises markdown.
                - Le format doit être exactement :
                  {
                    "questions": [
                      {
                        "contenu": "texte de la question",
                        "choix": ["choix A", "choix B", "choix C", "choix D"],
                        "bonneReponseIndex": 0,
                        "points": 1,
                        "ordre": 1
                      }
                    ]
                  }
                - "bonneReponseIndex" est l'index (0 à 3) du choix correct dans le tableau "choix".
                - "ordre" doit être un numéro séquentiel commençant à 1.
                """.formatted(request.getNombreQuestions(), request.getTheme(), request.getNiveau());
    }

    private List<QuestionnaireRequest.QuestionDTO> extraireQuestions(String responseBody) throws java.io.IOException {
        JsonNode root = objectMapper.readTree(responseBody);

        // Format OpenAI-compatible (Groq) : choices[0].message.content
        String texteBrut = root.path("choices")
                .path(0)
                .path("message")
                .path("content")
                .asText("");

        String texte = nettoyerJson(texteBrut);

        List<QuestionnaireRequest.QuestionDTO> questions = new ArrayList<>();
        JsonNode racineQuestions = objectMapper.readTree(texte);
        JsonNode tableauQuestions = racineQuestions.path("questions");

        if (!tableauQuestions.isArray()) {
            throw new IllegalStateException("Réponse IA invalide : champ 'questions' (tableau) attendu");
        }

        int ordre = 1;
        for (JsonNode node : tableauQuestions) {
            QuestionnaireRequest.QuestionDTO dto = new QuestionnaireRequest.QuestionDTO();
            dto.setContenu(node.path("contenu").asText());

            List<String> choix = new ArrayList<>();
            node.path("choix").forEach(c -> choix.add(c.asText()));
            dto.setChoix(choix);

            dto.setBonneReponseIndex(node.path("bonneReponseIndex").asInt(0));
            dto.setPoints(node.path("points").asInt(1));
            dto.setOrdre(node.path("ordre").asInt(ordre));
            ordre++;

            questions.add(dto);
        }

        return questions;
    }

    private String nettoyerJson(String texte) {
        String nettoye = texte.trim();
        // Retire les éventuelles balises markdown ```json ... ```
        if (nettoye.startsWith("```")) {
            nettoye = nettoye.replaceFirst("^```(json)?", "").trim();
            if (nettoye.endsWith("```")) {
                nettoye = nettoye.substring(0, nettoye.length() - 3).trim();
            }
        }
        return nettoye;
    }
}