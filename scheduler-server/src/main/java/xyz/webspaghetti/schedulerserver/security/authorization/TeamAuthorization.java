package xyz.webspaghetti.schedulerserver.security.authorization;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import xyz.webspaghetti.schedulerserver.security.model.CustomUserDetails;
import xyz.webspaghetti.schedulerserver.service.TeamService;

import java.util.Objects;

@Component("teamAuthorization")
@RequiredArgsConstructor
public class TeamAuthorization {

    private final TeamService teamService;


    public boolean isMember(Integer teamId, Authentication authentication) {

        if (!(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            return false;
        }

        return teamService.isMemberOfTeam(userDetails.getId(), teamId);
    }

    public boolean isManagerMember(Integer teamId, Authentication authentication) {

        if (!(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            return false;
        }

        boolean isTeamMember = teamService.isMemberOfTeam(userDetails.getId(), teamId);

        boolean isManager = userDetails.getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_MANAGER"));

        return (isTeamMember && isManager);
    }
}
