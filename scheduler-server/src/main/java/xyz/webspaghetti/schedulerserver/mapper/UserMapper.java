package xyz.webspaghetti.schedulerserver.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import xyz.webspaghetti.schedulerserver.dto.create.UserCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.UserResponseDto;
import xyz.webspaghetti.schedulerserver.dto.update.UserUpdateDto;
import xyz.webspaghetti.schedulerserver.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toEntity(UserCreateDto userCreateDto);

    UserResponseDto toResponseDto(User user);

    void updateUserFromDto(@MappingTarget User user, UserUpdateDto userUpdateDto);
}
