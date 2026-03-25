package xyz.webspaghetti.schedulerserver.service;

import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.dto.UserResponseDto;
import xyz.webspaghetti.schedulerserver.entity.User;
import xyz.webspaghetti.schedulerserver.mapper.UserMapper;
import xyz.webspaghetti.schedulerserver.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;


    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    // Helper method to cast plain User into UserResponseDto
    public List<UserResponseDto> entityListToDtoList(List<User> userList) {

        List<UserResponseDto> userResponseDtoList = new ArrayList<>();

        for (User tempUser : userList) {

            userResponseDtoList.add(userMapper.toResponseDto(tempUser));
        }

        return userResponseDtoList;
    }

}
