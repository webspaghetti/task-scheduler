package xyz.webspaghetti.schedulerserver.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import xyz.webspaghetti.schedulerserver.dto.create.TaskCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.TaskResponseDto;
import xyz.webspaghetti.schedulerserver.entity.Task;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    // Ignore the team field, we will handle it in Service
    @Mapping(target = "team", ignore = true)
    Task toEntity(TaskCreateDto taskCreateDto);

    @Mapping(target = "teamId", source = "team.id")
    TaskResponseDto toResponseDto(Task task);
}
