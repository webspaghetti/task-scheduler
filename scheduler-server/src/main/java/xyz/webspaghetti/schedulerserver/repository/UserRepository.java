package xyz.webspaghetti.schedulerserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.webspaghetti.schedulerserver.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findById(Integer id);
}
