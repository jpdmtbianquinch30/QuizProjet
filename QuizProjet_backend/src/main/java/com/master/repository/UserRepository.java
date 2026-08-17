package com.master.repository;

import com.master.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
<<<<<<< HEAD
=======
import java.util.List;
>>>>>>> 5df926eac586ed031ba21f3cb97d6613cc36c7e6
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
<<<<<<< HEAD
=======

    List<User> findByRole(User.Role role);
>>>>>>> 5df926eac586ed031ba21f3cb97d6613cc36c7e6
}