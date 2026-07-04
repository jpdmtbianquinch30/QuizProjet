package com.master.repository;

import com.master.entity.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupeRepository extends JpaRepository<Groupe, Long> {

    List<Groupe> findByCreatedById(Long evaluateurId);

    @Query("SELECT g FROM Groupe g JOIN g.apprenants a WHERE a.id = :apprenantId")
    List<Groupe> findByApprenantId(@Param("apprenantId") Long apprenantId);
}