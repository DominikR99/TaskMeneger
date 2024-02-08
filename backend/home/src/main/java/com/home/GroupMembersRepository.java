package com.home;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupMembersRepository extends JpaRepository<GroupMembers, Long> {

    Optional<GroupMembers> findByName(String name);
}