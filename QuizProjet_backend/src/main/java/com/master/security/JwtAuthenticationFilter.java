package com.master.security;

import com.master.service.JwtService;
<<<<<<< HEAD
import io.jsonwebtoken.Claims;
=======
>>>>>>> 5df926eac586ed031ba21f3cb97d6613cc36c7e6
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
<<<<<<< HEAD
import org.springframework.security.core.authority.SimpleGrantedAuthority;
=======
>>>>>>> 5df926eac586ed031ba21f3cb97d6613cc36c7e6
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
<<<<<<< HEAD
import java.util.List;
=======
>>>>>>> 5df926eac586ed031ba21f3cb97d6613cc36c7e6

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        // Si le header ne contient pas un vrai token (vide, "null", "undefined", etc.)
        if (jwt.isBlank() || jwt.equalsIgnoreCase("null") || jwt.equalsIgnoreCase("undefined")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String userEmail = jwtService.extractUsername(jwt);

            if (userEmail != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails =
                        customUserDetailsService.loadUserByUsername(userEmail);

                if (jwtService.isTokenValid(jwt, userDetails)) {

<<<<<<< HEAD
                    // Extraire le rôle depuis le token
                    Claims claims = jwtService.extractAllClaims(jwt);
                    String role = claims.get("role", String.class);

                    List<SimpleGrantedAuthority> authorities = role != null
                            ? List.of(new SimpleGrantedAuthority("ROLE_" + role))
                            : List.copyOf(userDetails.getAuthorities().stream()
                            .map(a -> new SimpleGrantedAuthority(a.getAuthority()))
                            .toList());

=======
                    // IMPORTANT : on utilise le rôle actuel chargé depuis la base
                    // (userDetails.getAuthorities()), et non le claim "role" figé
                    // dans le token au moment de sa génération. Sinon, si le rôle
                    // d'un utilisateur change en base (ex: USER -> EVALUATEUR),
                    // ses anciens tokens continuent de porter l'ancien rôle et
                    // toutes ses requêtes sont rejetées avec un 403 tant qu'il
                    // ne se reconnecte pas.
>>>>>>> 5df926eac586ed031ba21f3cb97d6613cc36c7e6
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
<<<<<<< HEAD
                                    authorities
=======
                                    userDetails.getAuthorities()
>>>>>>> 5df926eac586ed031ba21f3cb97d6613cc36c7e6
                            );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request));
                    SecurityContextHolder.getContext()
                            .setAuthentication(authToken);
                }
            }
        } catch (JwtException | IllegalArgumentException e) {
            // Token invalide, malformé ou expiré : on ne bloque pas la requête ici,
            // c'est à SecurityConfig de décider si la route nécessite une authentification.
            log.warn("JWT invalide ignoré : {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}