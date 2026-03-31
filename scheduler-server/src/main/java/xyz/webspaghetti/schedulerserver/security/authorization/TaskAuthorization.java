package xyz.webspaghetti.schedulerserver.security.authorization;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import xyz.webspaghetti.schedulerserver.security.CustomUserDetails;
import xyz.webspaghetti.schedulerserver.service.TaskService;
import xyz.webspaghetti.schedulerserver.service.TeamService;

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
}
