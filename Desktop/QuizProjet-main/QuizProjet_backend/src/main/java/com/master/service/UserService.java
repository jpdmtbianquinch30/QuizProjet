package com.master.service;

import com.master.dto.CreateUserRequest;
import com.master.entity.User;
import com.master.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public User modifierUtilisateur(Long id, String nom, String prenom, String email) {

        User user = findById(id);

        user.setNom(nom);
        user.setPrenom(prenom);
        user.setEmail(email);

        return userRepository.save(user);
    }
    public User creerEvaluateur(CreateUserRequest request) {

        if (existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }

        User evaluateur = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(User.Role.EVALUATEUR)
                .build();

        return save(evaluateur);
    }
    public User creerUser(CreateUserRequest request) {

        if (existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }

        User user = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(User.Role.USER)
                .build();

        return save(user);
    }
    public User activerUtilisateur(Long id) {

        User user = findById(id);

        user.setActif(true);

        return userRepository.save(user);
    }
    public User desactiverUtilisateur(Long id) {

        User user = findById(id);

        user.setActif(false);

        return userRepository.save(user);
    }
    public void reinitialiserMotDePasse(Long id, String nouveauMotDePasse) {

        User user = findById(id);

        user.setPassword(
                passwordEncoder.encode(nouveauMotDePasse));

        userRepository.save(user);
    }
    public void supprimerUtilisateur(Long id) {

        User user = findById(id);

        userRepository.delete(user);
    }
    public User creerAdmin(CreateUserRequest request) {

        if (existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }

        User admin = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(User.Role.ADMIN)
                .build();

        return save(admin);
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
    public List<User> findAll() {
        return userRepository.findAll();
    }

    public List<User> findAdmins() {
        return userRepository.findByRole(User.Role.ADMIN);
    }

    public List<User> findEvaluateurs() {
        return userRepository.findByRole(User.Role.EVALUATEUR);
    }

    public List<User> findEtudiants() {
        return userRepository.findByRole(User.Role.USER);
    }
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur introuvable"));
    }
}