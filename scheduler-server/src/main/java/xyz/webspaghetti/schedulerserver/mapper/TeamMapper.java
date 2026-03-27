package xyz.webspaghetti.schedulerserver.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import xyz.webspaghetti.schedulerserver.dto.create.TeamCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.TeamResponseDto;
import xyz.webspaghetti.schedulerserver.dto.update.TeamUpdateDto;
import xyz.webspaghetti.schedulerserver.entity.Team;

@Mapper(componentModel = "spring")
public interface TeamMapper {

    Team toEntity(TeamCreateDto teamCreateDto);

    TeamResponseDto toResponseDto(Team team);

    void updateTeamFromDto(@MappingTarget Team team, TeamUpdateDto teamUpdateDto);
}
