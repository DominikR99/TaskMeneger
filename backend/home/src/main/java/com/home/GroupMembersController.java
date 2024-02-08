package com.home;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/group")
public class GroupMembersController {

    private final UsersRepository usersRepository;
    private final GroupMembersRepository groupMembersRepository;

    @Autowired
    public GroupMembersController(UsersRepository usersRepository, GroupMembersRepository groupMembersRepository) {
        this.usersRepository = usersRepository;
        this.groupMembersRepository = groupMembersRepository;
    }

    @GetMapping("/members")
    public List<String> getGroupMembers(@RequestParam("username") String username) {
        Optional<Users> optionalUser = usersRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            Users user = optionalUser.get();
            List<GroupMembers> groupMembers = user.getGroupMembers();

            return groupMembers.stream()
                    .map(GroupMembers::getName)
                    .toList();
        } else {

            return List.of();
        }
    }

    @PostMapping("/addMember")
    public String addMemberToGroup(@RequestParam("username") String username, @RequestParam("name") String memberName){

        Optional<Users> optionalUser = usersRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            Users user = optionalUser.get();

            GroupMembers newMember = new GroupMembers();
            newMember.setName(memberName);
            newMember.setUser(user);
            groupMembersRepository.save(newMember);

            return "Member added successfully";
        } else {
            return "User not found";
        }
    }
}