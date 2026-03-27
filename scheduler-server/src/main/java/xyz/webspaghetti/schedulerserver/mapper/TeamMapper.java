package xyz.webspaghetti.schedulerserver.mapper;

import org.mapstruct.Mapper;
import xyz.webspaghetti.schedulerserver.dto.TeamCreateDto;
import xyz.webspaghetti.schedulerserver.dto.TeamResponseDto;
import xyz.webspaghetti.schedulerserver.entity.Team;

@Mapper(componentModel = "spring")
public interface TeamMapper {

    Team toEntity(TeamCreateDto teamCreateDto);

    TeamResponseDto toResponseDto(Team team);
}
