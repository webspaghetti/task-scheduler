package xyz.webspaghetti.schedulerserver.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.dto.response.RoleResponseDto;
import xyz.webspaghetti.schedulerserver.entity.Role;
import xyz.webspaghetti.schedulerserver.mapper.RoleMapper;
import xyz.webspaghetti.schedulerserver.repository.RoleRepository;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    public RoleResponseDto findRoleById(Integer roleId) {

        return roleMapper.toResponseDto(roleRepository.findOrThrow(roleId, Role.class.getSimpleName()));
    }
}
