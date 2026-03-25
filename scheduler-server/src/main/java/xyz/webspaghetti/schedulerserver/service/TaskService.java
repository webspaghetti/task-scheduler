package xyz.webspaghetti.schedulerserver.service;

import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.repository.TaskRepository;


@Service
public class TaskService {

    private final TaskRepository taskRepository;


    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

}
