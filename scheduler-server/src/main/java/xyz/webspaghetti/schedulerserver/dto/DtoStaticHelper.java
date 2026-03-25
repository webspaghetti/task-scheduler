package xyz.webspaghetti.schedulerserver.dto;

import xyz.webspaghetti.schedulerserver.entity.Task;
import xyz.webspaghetti.schedulerserver.entity.User;
import xyz.webspaghetti.schedulerserver.mapper.TaskMapper;
import xyz.webspaghetti.schedulerserver.mapper.UserMapper;

import java.util.*;

public final class DtoStaticHelper {

    private DtoStaticHelper(){}

    // Helper method to cast plain User into UserResponseDto
    public static List<UserResponseDto> userCollectionToDtoList(Collection<User> userCollection, UserMapper userMapper) {

        List<UserResponseDto> userResponseDtoList = new ArrayList<>();

        for (User tempUser : userCollection) {

            userResponseDtoList.add(userMapper.toResponseDto(tempUser));
        }

        return userResponseDtoList;
    }

    public static List<TaskResponseDto> taskCollectionToDtoList(Collection<Task> taskCollection, TaskMapper taskMapper) {

        List<TaskResponseDto> taskResponseDtoList = new ArrayList<>();

        for (Task tempTask : taskCollection) {

            taskResponseDtoList.add(taskMapper.toResponseDto(tempTask));
        }

        return taskResponseDtoList;
    }
}
