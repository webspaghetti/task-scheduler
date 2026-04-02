package xyz.webspaghetti.schedulerserver.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.dto.create.UserCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.UserResponseDto;
import xyz.webspaghetti.schedulerserver.dto.update.UserUpdateDto;
import xyz.webspaghetti.schedulerserver.entity.Role;
import xyz.webspaghetti.schedulerserver.entity.Task;
import xyz.webspaghetti.schedulerserver.entity.Team;
import xyz.webspaghetti.schedulerserver.entity.User;
import xyz.webspaghetti.schedulerserver.exception.UserAlreadyAssignedRoleException;
import xyz.webspaghetti.schedulerserver.exception.UserNotAssignedRoleException;
import xyz.webspaghetti.schedulerserver.exception.UsernameAlreadyExistsException;
import xyz.webspaghetti.schedulerserver.mapper.UserMapper;
import xyz.webspaghetti.schedulerserver.repository.RoleRepository;
import xyz.webspaghetti.schedulerserver.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


    public UserResponseDto findUserById(Integer userId) {

        return userMapper.toResponseDto(userRepository.findOrThrow(userId, User.class.getSimpleName()));
    }

    @Transactional
    public UserResponseDto createUser(UserCreateDto userCreateDto) {

        // Check if username already exists
        if (userRepository.existsByUsername(userCreateDto.username())) {
            throw new UsernameAlreadyExistsException("This username is already taken");
        }

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

    @Transactional
    public void deleteUser(Integer userId) {

        User userToDelete = userRepository.findOrThrow(userId, User.class.getSimpleName());

        // User is inverse side = modify owning side
        for (Team userTeam : userToDelete.getTeams()) {
            userTeam.getUsers().remove(userToDelete);
        }
        for (Task userTask : userToDelete.getTasks()) {
            userTask.getUsers().remove(userToDelete);
        }

        // User is owning side = clear directly
        userToDelete.getRoles().clear();

        userRepository.delete(userToDelete);
    }

    @Transactional
    public UserResponseDto addUserRole(Integer userId, Integer roleId) {

        User existingUser = userRepository.findOrThrow(userId, User.class.getSimpleName());
        Role roleToAdd = roleRepository.findOrThrow(roleId, Role.class.getSimpleName());

        // Check if user already has the role
        if (existingUser.getRoles().contains(roleToAdd)) {
            throw new UserAlreadyAssignedRoleException("User is already assigned to this Role");
        }

        existingUser.addRole(roleToAdd);

        return userMapper.toResponseDto(existingUser);
    }

    @Transactional
    public UserResponseDto removeUserRole(Integer userId, Integer roleId) {

        User existingUser = userRepository.findOrThrow(userId, User.class.getSimpleName());
        Role roleToRemove = roleRepository.findOrThrow(roleId, Role.class.getSimpleName());

        // Check if user has the role
        if (!existingUser.getRoles().contains(roleToRemove)) {
            throw new UserNotAssignedRoleException("User is not assigned to this Role");
        }

        existingUser.removeRole(roleToRemove);

        return userMapper.toResponseDto(existingUser);
    }
}
