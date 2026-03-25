package xyz.webspaghetti.schedulerserver.dto;

import xyz.webspaghetti.schedulerserver.entity.Task;
import xyz.webspaghetti.schedulerserver.entity.User;
import xyz.webspaghetti.schedulerserver.mapper.TaskMapper;
import xyz.webspaghetti.schedulerserver.mapper.UserMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public final class DtoStaticHelper {

    private DtoStaticHelper(){}

    // Helper method to cast plain User into UserResponseDto
    public static List<UserResponseDto> userListToDtoList(Set<User> userSet, UserMapper userMapper) {

        List<UserResponseDto> userResponseDtoList = new ArrayList<>();

        for (User tempUser : userSet) {

            userResponseDtoList.add(userMapper.toResponseDto(tempUser));
        }

        return userResponseDtoList;
    }

    public static List<TaskResponseDto> taskSetToDtoList(List<Task> taskSet, TaskMapper taskMapper) {

        List<TaskResponseDto> taskResponseDtoList = new ArrayList<>();

        for (Task tempTask : taskSet) {

            taskResponseDtoList.add(taskMapper.toResponseDto(tempTask));
        }

        return taskResponseDtoList;
    }
}
