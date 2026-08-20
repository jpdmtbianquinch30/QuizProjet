package com.master.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class AjouterApprenantsRequest {

    @NotEmpty(message = "Au moins un email est requis")
    private List<String> emails;
}