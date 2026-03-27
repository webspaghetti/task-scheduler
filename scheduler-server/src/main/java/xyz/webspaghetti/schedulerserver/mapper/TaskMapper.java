package xyz.webspaghetti.schedulerserver.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import xyz.webspaghetti.schedulerserver.dto.TaskCreateDto;
import xyz.webspaghetti.schedulerserver.dto.TaskResponseDto;
import xyz.webspaghetti.schedulerserver.entity.Task;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    Task toEntity(TaskCreateDto taskCreateDto);

    @Mapping(target = "teamId", source = "team.id")
    TaskResponseDto toResponseDto(Task task);
}
