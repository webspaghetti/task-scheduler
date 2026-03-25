package xyz.webspaghetti.schedulerserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.webspaghetti.schedulerserver.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
