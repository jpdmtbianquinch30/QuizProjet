package com.master.repository;

import com.master.entity.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupeRepository extends JpaRepository<Groupe, Long> {

    List<Groupe> findByCreatedById(Long evaluateurId);
}