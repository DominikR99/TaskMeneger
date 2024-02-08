package com.home;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface TasksRepository extends JpaRepository<Tasks, Long> {
    List<Tasks> findByUserAndStatus(Users user, String status);
    // Jeśli procedura nie wymaga argumentów i jest zdefiniowana w bazie
    @Modifying
    @Transactional
    @Query(value = "CALL UpdateTaskStatus()", nativeQuery = true)
    void updateTaskStatus();
}
