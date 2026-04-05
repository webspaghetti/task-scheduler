package xyz.webspaghetti.schedulerserver.mapper;

import org.mapstruct.Mapper;
import xyz.webspaghetti.schedulerserver.dto.create.ActionHistoryCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.ActionHistoryResponseDto;
import xyz.webspaghetti.schedulerserver.entity.ActionHistory;

@Mapper(componentModel = "spring")
public interface ActionHistoryMapper {

    ActionHistory toEntity(ActionHistoryCreateDto actionHistoryCreateDto);

    ActionHistoryResponseDto toResponseDto(ActionHistory actionHistory);
}
