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
import xyz.webspaghetti.schedulerserver.exception.UserAlreadyAssignedToTaskException;
import xyz.webspaghetti.schedulerserver.exception.UserNotAssignedToTaskException;
import xyz.webspaghetti.schedulerserver.exception.UserNotInTeamException;
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


    public TaskResponseDto findTaskById(Integer taskId) {

        return taskMapper.toResponseDto(taskRepository.findOrThrow(taskId, Task.class.getSimpleName()));
    }

    public List<TaskResponseDto> findTasksForUserInTeam(Integer userId, Integer teamId) {

        return DtoStaticHelper.entityCollectionToDtoList(taskRepository.findTasksInTeamByUser(userId, teamId), taskMapper::toResponseDto);
    }

    public List<TaskResponseDto> findAllTasksInTeam(Integer teamId) {

        Team tempTeam = teamRepository.findOrThrow(teamId, Team.class.getSimpleName());

        return DtoStaticHelper.entityCollectionToDtoList(tempTeam.getTasks(), taskMapper::toResponseDto);
    }

    @Transactional
    public TaskResponseDto createTask(TaskCreateDto taskCreateDto) {

        // Get Team
        int teamId = taskCreateDto.teamId();
        Team tempTeam = teamRepository.findOrThrow(teamId, Team.class.getSimpleName());

        // Get temp Task and set its Team
        Task tempTask = taskMapper.toEntity(taskCreateDto);
        tempTask.setTeam(tempTeam);

        // Save the Task adn return it
        Task savedTask = taskRepository.save(tempTask);

        return taskMapper.toResponseDto(savedTask);
    }

    @Transactional
    public TaskResponseDto updateTask(Integer taskId, TaskUpdateDto taskUpdateDto) {

        Task tempTask = taskRepository.findOrThrow(taskId, Task.class.getSimpleName());

        taskMapper.updateTaskFromDto(tempTask, taskUpdateDto);

        Task updatedTask = taskRepository.save(tempTask);
        return taskMapper.toResponseDto(updatedTask);
    }

    @Transactional
    public void deleteTask(Integer taskId) {

        // Get task
        Task taskToDelete = taskRepository.findOrThrow(taskId, Task.class.getSimpleName());

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
    public TaskResponseDto addUserToTask(Integer userId, Integer taskId) {

        Task existingTask = taskRepository.findOrThrow(taskId, Task.class.getSimpleName());
        User userToAdd = userRepository.findOrThrow(userId, User.class.getSimpleName());

        // Check if User is part of the Team
        if (!existingTask.getTeam().getUsers().contains(userToAdd)) {
            throw new UserNotInTeamException("User is not part of the Team");
        }

        // Check if User is already assigned to Task
        if (existingTask.getUsers().contains(userToAdd)) {
            throw new UserAlreadyAssignedToTaskException("User is not part of the Team");
        }

        existingTask.addUser(userToAdd);

        return taskMapper.toResponseDto(existingTask);
    }

    @Transactional
    public TaskResponseDto removeUserFromTask(Integer userId, Integer taskId) {

        Task existingTask = taskRepository.findOrThrow(taskId, Task.class.getSimpleName());
        User userToRemove = userRepository.findOrThrow(userId, User.class.getSimpleName());

        // Check if User is part of the Team
        if (!existingTask.getTeam().getUsers().contains(userToRemove)) {
            throw new UserNotInTeamException("User is not part of the Team");
        }

        // Check if User is assigned to Task
        if (!existingTask.getUsers().contains(userToRemove)) {
            throw new UserNotAssignedToTaskException("User is not assigned to Task");
        }

        existingTask.removeUser(userToRemove);

        return taskMapper.toResponseDto(existingTask);
    }
}
