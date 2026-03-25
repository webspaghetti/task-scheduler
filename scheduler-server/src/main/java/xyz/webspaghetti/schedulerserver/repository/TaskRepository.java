package xyz.webspaghetti.schedulerserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import xyz.webspaghetti.schedulerserver.entity.Task;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t JOIN t.users u WHERE u.id = :user_id AND t.team.id = :team_id")
    List<Task> findTasksInTeamByUser(@Param("user_id") long userId, @Param("team_id") long teamId);
}
