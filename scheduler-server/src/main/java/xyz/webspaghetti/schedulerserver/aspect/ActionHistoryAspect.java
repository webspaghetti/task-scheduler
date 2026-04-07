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

        StringBuilder actionMessageBuilder = new StringBuilder(getUserFullName(actionUser) + " " + tRA.actionType() + " ");

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

                        actionMessageBuilder.append(
                                "TASK: %s(%d) in TEAM: %s(%d)".formatted(
                                        taskResponseDto.name(),
                                        taskResponseDto.id(),
                                        tempTeam.name(),
                                        tempTeam.id()
                                )
                        );
                    }
                    case TEAM -> {
                        TeamResponseDto teamResponseDto = (TeamResponseDto) body;
                        assert teamResponseDto != null;

                        actionMessageBuilder.append(
                                "TEAM: %s(%d)".formatted(
                                        teamResponseDto.name(),
                                        teamResponseDto.id()
                                )
                        );
                    }
                }
            }
            case ADDED,REMOVED -> {
                switch (tRA.entityType()) {
                    case TASK -> {
                        UserResponseDto assignedUser = userService.findUserById((Integer) args[1]);
                        TaskResponseDto task = taskService.findTaskById((Integer) args[0]);

                        actionMessageBuilder.append(
                                "USER: %s %s TASK: %s(%d)".formatted(
                                        getUserFullName(assignedUser),
                                        tRA.actionType() == ActionType.ADDED ? "to" : "from",
                                        task.name(),
                                        task.id()
                                )
                        );
                    }
                    case TEAM -> {
                        UserResponseDto assignedUser = userService.findUserById((Integer) args[1]);
                        TeamResponseDto team = teamService.findTeamById((Integer) args[0]);

                        actionMessageBuilder.append(
                                "USER: %s %s TEAM: %s(%d)".formatted(
                                        getUserFullName(assignedUser),
                                        tRA.actionType() == ActionType.ADDED ? "to" : "from",
                                        team.name(),
                                        team.id()
                                )
                        );
                    }
                    case USER -> {
                        RoleResponseDto assignedRole = roleService.findRoleById((Integer) args[1]);
                        UserResponseDto user = userService.findUserById((Integer) args[0]);

                        actionMessageBuilder.append(
                                "ROLE: %s %s USER: %s".formatted(
                                        assignedRole.name(),
                                        tRA.actionType() == ActionType.ADDED ? "to" : "from",
                                        getUserFullName(user)
                                )
                        );
                    }
                }
            }
            case DELETED -> {
                switch (tRA.entityType()) {
                    case TASK -> {
                        Integer taskId = (Integer) args[0];

                        actionMessageBuilder.append(
                                "TASK WITH ID: %d".formatted(
                                        taskId
                                )
                        );
                    }
                    case TEAM -> {
                        Integer teamId = (Integer) args[0];

                        actionMessageBuilder.append(
                                "TEAM WITH ID: %d".formatted(
                                        teamId
                                )
                        );
                    }
                }
            }
        }

        actionHistoryService.createHistory(
                new ActionHistoryCreateDto(actionMessageBuilder.toString())
        );
    }
}
