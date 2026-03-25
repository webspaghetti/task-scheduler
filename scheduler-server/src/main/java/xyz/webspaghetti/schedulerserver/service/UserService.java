package xyz.webspaghetti.schedulerserver.service;

import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.mapper.UserMapper;
import xyz.webspaghetti.schedulerserver.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;


    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

}
