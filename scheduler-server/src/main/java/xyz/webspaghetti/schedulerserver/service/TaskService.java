package xyz.webspaghetti.schedulerserver.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.dto.DtoStaticHelper;
import xyz.webspaghetti.schedulerserver.dto.create.TaskCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.TaskResponseDto;
import xyz.webspaghetti.schedulerserver.dto.update.TaskUpdateDto;
import xyz.webspaghetti.schedulerserver.entity.Task;
import xyz.webspaghetti.schedulerserver.entity.Team;
import xyz.webspaghetti.schedulerserver.entity.User;
import xyz.webspaghetti.schedulerserver.mapper.TaskMapper;
import xyz.webspaghetti.schedulerserver.repository.TaskRepository;
import xyz.webspaghetti.schedulerserver.repository.TeamRepository;
import xyz.webspaghetti.schedulerserver.repository.UserRepository;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;


    public TaskService(TaskRepository taskRepository, TeamRepository teamRepository, UserRepository userRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
        this.taskMapper = taskMapper;
    }


    public List<TaskResponseDto> findTasksForUserInTeam(Integer userId, Integer teamId) {

        return DtoStaticHelper.taskCollectionToDtoList(taskRepository.findTasksInTeamByUser(userId, teamId), taskMapper);
    }

    public List<TaskResponseDto> findAllTasksInTeam(Integer teamId) {

        Team tempTeam =
                teamRepository.findById(teamId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find team with id: " + teamId
                        ));

        return DtoStaticHelper.taskCollectionToDtoList(tempTeam.getTasks(), taskMapper);
    }

    @Transactional
    public TaskResponseDto createTask(TaskCreateDto taskCreateDto) {

        // Get Team
        int teamId = taskCreateDto.teamId();
        Team tempTeam =
                teamRepository.findById(teamId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find team with id: " + teamId
                        ));

        // Get temp Task and set its Team
        Task tempTask = taskMapper.toEntity(taskCreateDto);
        tempTask.setTeam(tempTeam);

        // Save the Task adn return it
        Task savedTask = taskRepository.save(tempTask);

        return taskMapper.toResponseDto(savedTask);
    }

    @Transactional
    public TaskResponseDto updateTask(Integer taskId, TaskUpdateDto taskUpdateDto) {

        Task tempTask =
                taskRepository.findById(taskId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find task with id: " + taskId
                        ));

        taskMapper.updateTaskFromDto(tempTask, taskUpdateDto);

        Task updatedTask = taskRepository.save(tempTask);
        return taskMapper.toResponseDto(updatedTask);
    }

    @Transactional
    public void deleteTask(Integer taskId) {

        // Get task
        Task taskToDelete =
                taskRepository.findById(taskId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find task with id: " + taskId
                        ));

        // Get tasks team and remove it from its collection
        Team taskTeam = taskToDelete.getTeam();
        if (taskTeam != null) {
            taskTeam.getTasks().remove(taskToDelete);
        }

        // Get users assigned to the task and remove it from their collection
        for (User taskUser : taskToDelete.getUsers()) {
            taskUser.getTasks().remove(taskToDelete);
        }

        taskRepository.delete(taskToDelete);
    }

    @Transactional
    public void addUserToTask(Integer userId, Integer taskId) {

        User userToAdd =
                userRepository.findById(userId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find user with id: " + userId
                        ));

        Task taskToAddTo =
                taskRepository.findById(taskId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find task with id: " + taskId
                        ));

        // Check if User is in correct Team
        if (!taskToAddTo.getTeam().getUsers().contains(userToAdd)) {
            throw new RuntimeException("User is not part of the Team");
        }

        // Check if User is already assigned to Task
        if (taskToAddTo.getUsers().contains(userToAdd)) {
            throw new RuntimeException("User already assigned to Task");
        }

        taskToAddTo.addUser(userToAdd);
    }

    @Transactional
    public void removeUserFromTask(Integer userId, Integer taskId) {

        User userToRemove =
                userRepository.findById(userId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find user with id: " + userId
                        ));

        Task taskToRemoveFrom =
                taskRepository.findById(taskId).orElseThrow(() ->
                        new RuntimeException(
                                "Could not find task with id: " + taskId
                        ));

        // Check if User is part of the Team
        if (!taskToRemoveFrom.getTeam().getUsers().contains(userToRemove)) {
            throw new RuntimeException("User is not part of the Team");
        }

        // Check if User is assigned to Task
        if (!taskToRemoveFrom.getUsers().contains(userToRemove)) {
            throw new RuntimeException("User is not assigned to Task");
        }

        taskToRemoveFrom.removeUser(userToRemove);
    }
}
