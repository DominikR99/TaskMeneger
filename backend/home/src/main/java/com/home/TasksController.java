package com.home;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TasksController {
    private final UsersRepository usersRepository;
    private final TasksRepository tasksRepository;
    @Autowired
    public TasksController(UsersRepository usersRepository, TasksRepository tasksRepository) {
        this.usersRepository = usersRepository;
        this.tasksRepository = tasksRepository;
    }

    @PostMapping("/addTask")
    public String addTask(@RequestParam("username") String username, @RequestParam("name") String memberName,
                          @RequestParam("date") Date date, @RequestParam("description") String description,
                          @RequestParam("status") String status){

        Optional<Users> optionalUser = usersRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            Users user = optionalUser.get();
            List<GroupMembers> groupMembers = user.getGroupMembers();
            GroupMembers foundMember = null;

            for (GroupMembers member : groupMembers) {
                if (member.getName().equals(memberName)) {
                    foundMember = member;
                    break;
                }
            }

            Tasks newTask = new Tasks();
            newTask.setGroupMember(foundMember);
            newTask.setUser(user);
            newTask.setDescription(description);
            newTask.setDate(date);
            newTask.setStatus(status);
            tasksRepository.save(newTask);

            return "Task added successfully";
        } else {
            return "User not found";
        }
    }

    @GetMapping("/getTasks")
    public List<Tasks> getTasks(
            @RequestParam("username") String username,
            @RequestParam(value = "status", required = false) String status
    ) {
        Optional<Users> optionalUser = usersRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            Users user = optionalUser.get();
            List<Tasks> tasks;

            if (status != null && !status.isEmpty()) {
                // Jeżeli status jest przekazany, pobierz zadania tylko o danym statusie
                tasks = tasksRepository.findByUserAndStatus(user, status);
            } else {
                // Jeżeli status nie jest przekazany, pobierz wszystkie zadania użytkownika
                tasks = user.getTasks();
            }

            return tasks;
        } else {
            return List.of();
        }
    }

    @PutMapping("/updateStatus/{taskId}")
    public ResponseEntity<String> updateTaskDescription(@PathVariable Long taskId, @RequestBody String newStatus) {
        try {
            Optional<Tasks> optionalTask = tasksRepository.findById(taskId);

            if (optionalTask.isPresent()) {
                Tasks task = optionalTask.get();
                task.setStatus(newStatus);
                tasksRepository.save(task);
                return ResponseEntity.ok("Task description updated successfully.");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update task description.");
        }
    }

    @DeleteMapping("/deleteTask/{taskId}")
    public ResponseEntity<String> deleteTaskById(@PathVariable Long taskId) {
        try {
            Optional<Tasks> optionalTask = tasksRepository.findById(taskId);

            if (optionalTask.isPresent()) {
                tasksRepository.deleteById(taskId);
                return ResponseEntity.ok("Task deleted successfully.");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete task.");
        }
    }

    @PostMapping("/status")
    public ResponseEntity<String> updateTasksStatus() {
        try {
            tasksRepository.updateTaskStatus(); // Wywołanie procedury
            return ResponseEntity.ok("Task statuses updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update task statuses: " + e.getMessage());
        }
    }


}
