package xyz.webspaghetti.schedulerserver.aspect;


import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import xyz.webspaghetti.schedulerserver.annotation.TrackActionHistory;
import xyz.webspaghetti.schedulerserver.dto.create.ActionHistoryCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.RoleResponseDto;
import xyz.webspaghetti.schedulerserver.dto.response.TaskResponseDto;
import xyz.webspaghetti.schedulerserver.dto.response.TeamResponseDto;
import xyz.webspaghetti.schedulerserver.dto.response.UserResponseDto;
import xyz.webspaghetti.schedulerserver.enums.ActionType;
import xyz.webspaghetti.schedulerserver.service.*;

@Aspect
@Component
@RequiredArgsConstructor
public class ActionHistoryAspect {

    private final TeamService teamService;
    private final UserService userService;
    private final TaskService taskService;
    private final ActionHistoryService actionHistoryService;
    private final RoleService roleService;

    public String getUserFullName(UserResponseDto userToMerge) {
        return userToMerge.firstName() + " " + userToMerge.lastName() + "(" + userToMerge.username() + ")";
    }

    @AfterReturning(value = "@annotation(tRA)", returning = "result")
    public void trackHistory(JoinPoint joinPoint, TrackActionHistory tRA, Object result) {

        Object[] args = joinPoint.getArgs();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;

        UserResponseDto actionUser = userService.findUserByUsername(authentication.getName());

        StringBuilder actionMessage = new StringBuilder(getUserFullName(actionUser) +   " " + tRA.actionType() + " ");

        // Unwrap ResponseEntity
        Object body = result;
        if (result instanceof ResponseEntity<?> responseEntity) {
            body = responseEntity.getBody();
        }

        switch (tRA.actionType()) {
            case CREATED, UPDATED -> {
                switch (tRA.entityType()) {
                    case TASK -> {
                        TaskResponseDto taskResponseDto = (TaskResponseDto) body;
                        assert taskResponseDto != null;
                        TeamResponseDto tempTeam = teamService.findTeamById(taskResponseDto.teamId());
                        actionMessage.append("TASK: ").append(taskResponseDto.name()).append("(").append(taskResponseDto.id()).append(")").append(" in TEAM: ").append(tempTeam.name()).append("(").append(tempTeam.id()).append(")");
                    }
                    case TEAM -> {
                        TeamResponseDto teamResponseDto = (TeamResponseDto) body;
                        assert teamResponseDto != null;
                        actionMessage.append("TEAM: ").append(teamResponseDto.name()).append("(").append(teamResponseDto.id()).append(")");
                    }
                }
            }
            case ADDED,REMOVED -> {
                switch (tRA.entityType()) {
                    case TASK -> {
                        UserResponseDto assignedUser = userService.findUserById((Integer) args[1]);
                        TaskResponseDto task = taskService.findTaskById((Integer) args[0]);

                        actionMessage.append("USER: ").append(getUserFullName(assignedUser)).append(tRA.actionType() == ActionType.ADDED ? " to " : " from ").append("TASK: ").append(task.name()).append("(").append(task.id()).append(")");
                    }
                    case TEAM -> {
                        UserResponseDto assignedUser = userService.findUserById((Integer) args[1]);
                        TeamResponseDto team = teamService.findTeamById((Integer) args[0]);

                        actionMessage.append("USER: ").append(getUserFullName(assignedUser)).append(tRA.actionType() == ActionType.ADDED ? " to " : " from ").append("TEAM: ").append(team.name()).append("(").append(team.id()).append(")");
                    }
                    case USER -> {
                        RoleResponseDto assignedRole = roleService.findRoleById((Integer) args[1]);
                        UserResponseDto user = userService.findUserById((Integer) args[0]);

                        actionMessage.append("ROLE: ").append(assignedRole.name()).append(tRA.actionType() == ActionType.ADDED ? " to " : " from ").append("USER: ").append(getUserFullName(user));
                    }
                }
            }
            case DELETED -> {
                switch (tRA.entityType()) {
                    case TASK -> {
                        Integer taskId = (Integer) args[0];
                        actionMessage.append("TASK with ID: ").append(taskId);
                    }
                    case TEAM -> {
                        Integer teamId = (Integer) args[0];
                        actionMessage.append("TEAM with ID: ").append(teamId);
                    }
                }
            }
        }

        actionHistoryService.createHistory(
                new ActionHistoryCreateDto(actionMessage.toString())
        );
    }
}
