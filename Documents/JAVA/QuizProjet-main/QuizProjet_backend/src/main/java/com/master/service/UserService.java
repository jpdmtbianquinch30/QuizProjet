package com.master.service;

import com.master.entity.User;
import com.master.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Utilisateur non trouvé : " + email));
    }

    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Met à jour le nom et le prénom d'un utilisateur, sans toucher au mot de passe.
     */
    public User modifierProfil(String email, String nom, String prenom) {
        User user = findByEmail(email);
        user.setNom(nom);
        user.setPrenom(prenom);
        return userRepository.save(user);
    }

    /**
     * Change le mot de passe d'un utilisateur après vérification de l'ancien.
     */
    public void changerMotDePasse(String email, String ancienMotDePasse, String nouveauMotDePasse) {
        User user = findByEmail(email);

        if (!passwordEncoder.matches(ancienMotDePasse, user.getPassword())) {
            throw new IllegalArgumentException("Ancien mot de passe incorrect");
        }

        user.setPassword(passwordEncoder.encode(nouveauMotDePasse));
        userRepository.save(user);
    }
}