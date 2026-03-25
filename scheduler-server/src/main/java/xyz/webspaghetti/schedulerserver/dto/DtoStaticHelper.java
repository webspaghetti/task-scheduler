package xyz.webspaghetti.schedulerserver.dto;

import xyz.webspaghetti.schedulerserver.entity.User;
import xyz.webspaghetti.schedulerserver.mapper.UserMapper;

import java.util.ArrayList;
import java.util.List;

public final class DtoStaticHelper {

    private DtoStaticHelper(){}

    // Helper method to cast plain User into UserResponseDto
    public static List<UserResponseDto> userListToDtoList(List<User> userList, UserMapper userMapper) {

        List<UserResponseDto> userResponseDtoList = new ArrayList<>();

        for (User tempUser : userList) {

            userResponseDtoList.add(userMapper.toResponseDto(tempUser));
        }

        return userResponseDtoList;
    }
}
