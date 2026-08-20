package com.master.repository;

import com.master.entity.PlatformConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlatformConfigRepository extends JpaRepository<PlatformConfig, Long> {
}