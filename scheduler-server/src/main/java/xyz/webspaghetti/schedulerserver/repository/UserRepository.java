package xyz.webspaghetti.schedulerserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.webspaghetti.schedulerserver.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
