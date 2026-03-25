package xyz.webspaghetti.schedulerserver.mapper;

import org.mapstruct.Mapper;
import xyz.webspaghetti.schedulerserver.dto.UserCreateDto;
import xyz.webspaghetti.schedulerserver.dto.UserResponseDto;
import xyz.webspaghetti.schedulerserver.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toEntity(UserCreateDto userResponseDto);

    UserResponseDto toResponseDto(User user);
}
