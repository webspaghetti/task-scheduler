package xyz.webspaghetti.schedulerserver.service;

import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.entity.User;
import xyz.webspaghetti.schedulerserver.mapper.UserSecurityMapper;
import xyz.webspaghetti.schedulerserver.repository.UserRepository;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserSecurityMapper userSecurityMapper;


    public CustomUserDetailService(UserRepository userRepository, UserSecurityMapper userSecurityMapper) {
        this.userRepository = userRepository;
        this.userSecurityMapper = userSecurityMapper;
    }


    @Override
    public @NonNull UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {

        // Fetch the User
        User userEntity = userRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException(
                        "User not found: " + username
                ));

        // MapStruct handles conversion
        return userSecurityMapper.toCustomUserDetails(userEntity);
    }
}
