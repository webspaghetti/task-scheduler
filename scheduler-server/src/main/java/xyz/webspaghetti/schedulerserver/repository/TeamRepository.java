package xyz.webspaghetti.schedulerserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.webspaghetti.schedulerserver.entity.Team;

public interface TeamRepository extends JpaRepository<Team, Long> {
}
