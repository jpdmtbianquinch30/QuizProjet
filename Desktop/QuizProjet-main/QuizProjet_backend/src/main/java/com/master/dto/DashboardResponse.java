package com.master.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {

    private long admins;

    private long evaluateurs;

    private long utilisateurs;

    private long questionnaires;

    private long publies;

    private long archives;

    private long brouillons;

    private long scores;
}