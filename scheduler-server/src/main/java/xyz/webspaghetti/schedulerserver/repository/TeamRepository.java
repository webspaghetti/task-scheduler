package xyz.webspaghetti.schedulerserver.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import xyz.webspaghetti.schedulerserver.entity.Team;

import java.util.List;

public interface TeamRepository extends BaseRepository<Team, Integer> {

    @Query("SELECT t FROM Team t JOIN t.users u WHERE u.id = :user_id")
    List<Team> findAllByUserId(@Param("user_id") Integer userId);
}
