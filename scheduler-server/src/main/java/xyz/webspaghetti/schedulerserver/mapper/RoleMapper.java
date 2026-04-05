package xyz.webspaghetti.schedulerserver.mapper;

import org.mapstruct.Mapper;
import xyz.webspaghetti.schedulerserver.dto.response.RoleResponseDto;
import xyz.webspaghetti.schedulerserver.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    RoleResponseDto toResponseDto(Role role);
}
