package xyz.webspaghetti.schedulerserver.service;

import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.dto.create.UserCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.UserResponseDto;
import xyz.webspaghetti.schedulerserver.dto.update.UserUpdateDto;
import xyz.webspaghetti.schedulerserver.entity.Role;
import xyz.webspaghetti.schedulerserver.entity.User;
import xyz.webspaghetti.schedulerserver.mapper.UserMapper;
import xyz.webspaghetti.schedulerserver.repository.RoleRepository;
import xyz.webspaghetti.schedulerserver.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepository, RoleRepository roleRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }


    public UserResponseDto findUserById(Integer userId) {

        return userMapper.toResponseDto(userRepository.findOrThrow(userId, User.class.getSimpleName()));
    }

    @Transactional
    public UserResponseDto createUser(UserCreateDto userCreateDto) {

        // Create temp User object and encode its password
        User tempUser = userMapper.toEntity(userCreateDto);
        tempUser.setPassword(passwordEncoder.encode(userCreateDto.password()));

        int defaultRoleId = 1;

        // Give User default ROLE_USER
        Role tempRole = roleRepository.findOrThrow(defaultRoleId, Role.class.getSimpleName());
        tempUser.addRole(tempRole);

        // Create User object returned from persisting
        User savedUser = userRepository.save(tempUser);

        return userMapper.toResponseDto(savedUser);
    }

    @Transactional
    public UserResponseDto updateUser(Integer userId, UserUpdateDto userUpdateDto) {

        User tempUser = userRepository.findOrThrow(userId, User.class.getSimpleName());

        userMapper.updateUserFromDto(tempUser, userUpdateDto);

        User updatedUser = userRepository.save(tempUser);
        return userMapper.toResponseDto(updatedUser);
    }
}
