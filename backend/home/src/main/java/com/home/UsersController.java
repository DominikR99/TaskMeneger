package com.home;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UsersController {
    private final UsersRepository usersRepository;

    public UsersController(UsersRepository userRepository) {
        this.usersRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Users user) {
        // Sprawdzenie, czy użytkownik o podanej nazwie użytkownika już istnieje
        if (usersRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // Obsługa rejestracji użytkownika - zapis do bazy danych
        usersRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Users user) {
        // Obsługa logowania użytkownika
        // Sprawdzenie, czy użytkownik istnieje i czy hasło się zgadza
        // W praktyce używaj bezpiecznych praktyk, takich jak haszowanie haseł
        if (validateUser(user)) {
            return ResponseEntity.ok("Login successful!");
        } else {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

    private boolean validateUser(Users user) {
        // Prosta walidacja, w praktyce użyj bezpiecznych metod haszowania
        // Sprawdzamy, czy istnieje użytkownik o podanym username
        // i czy hasło się zgadza
        return usersRepository.findByUsername(user.getUsername())
                .filter(u -> u.getPassword().equals(user.getPassword()))
                .isPresent();
    }
}
