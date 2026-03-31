package xyz.webspaghetti.schedulerserver.security.authorization;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import xyz.webspaghetti.schedulerserver.security.model.CustomUserDetails;
import xyz.webspaghetti.schedulerserver.service.TaskService;
import xyz.webspaghetti.schedulerserver.service.TeamService;

import java.util.Objects;

@Component("taskAuthorization")
public class TaskAuthorization {

    private final TaskService taskService;
    private final TeamService teamService;


    public TaskAuthorization(TaskService taskService, TeamService teamService) {
        this.taskService = taskService;
        this.teamService = teamService;
    }


    public boolean isInTaskTeam(Integer taskId, Authentication authentication) {

        if (!(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            return false;
        }

        return teamService.isMemberOfTeam(userDetails.getId(), taskService.findTaskById(taskId).teamId());
    }

    public boolean isManagerInTaskTeam(Integer taskId, Authentication authentication) {

        if (!(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            return false;
        }

        boolean isMemberOfTeam = teamService.isMemberOfTeam(userDetails.getId(), taskService.findTaskById(taskId).teamId());

        boolean isManager =
                userDetails.getAuthorities().stream()
                        .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_MANAGER")
                        );

        return (isMemberOfTeam && isManager);
    }
}
