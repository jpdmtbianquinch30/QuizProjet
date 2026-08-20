package com.master.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.master.dto.ConfigDto;
import com.master.entity.PlatformConfig;
import com.master.repository.PlatformConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConfigService {

    private final PlatformConfigRepository repository;
    private final ObjectMapper objectMapper;

    @Cacheable(value = "appConfig", key = "'platformSettings'")
    @Transactional(readOnly = true)
    public ConfigDto getPublicConfig() {
        log.info("Chargement de la configuration depuis la base de données...");
        PlatformConfig config = repository.findById(1L)
                .orElseGet(() -> {
                    // Créer une configuration par défaut si elle n'existe pas
                    PlatformConfig newConfig = new PlatformConfig();
                    newConfig.setId(1L);
                    Map<String, Object> defaultSettings = Map.of(
                            "platformName", "Mon Quiz",
                            "primaryColor", "#3498db",
                            "secondaryColor", "#2ecc71",
                            "logoUrl", "",
                            "maintenanceMode", false
                    );
                    newConfig.setSettings(defaultSettings);
                    return repository.save(newConfig);
                });
        return mapToDto(config.getSettings());
    }

    @CachePut(value = "appConfig", key = "'platformSettings'")
    @Transactional
    public ConfigDto updateConfig(ConfigDto dto) {
        PlatformConfig config = repository.findById(1L)
                .orElseThrow(() -> new IllegalArgumentException("Configuration non trouvée"));

        Map<String, Object> settings = objectMapper.convertValue(dto, new TypeReference<>() {});
        config.setSettings(settings);
        repository.save(config);
        return dto;
    }

    // Méthode utilitaire pour la conversion
    private ConfigDto mapToDto(Map<String, Object> map) {
        return objectMapper.convertValue(map, ConfigDto.class);
    }
}