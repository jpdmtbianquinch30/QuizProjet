package com.master.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "platform_config")
@Data
@NoArgsConstructor
public class PlatformConfig {

    @Id
    private Long id = 1L; // Une seule ligne

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> settings;

    @Version
    private Integer version;

    private LocalDateTime updatedAt;

    @PreUpdate
    @PrePersist
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}