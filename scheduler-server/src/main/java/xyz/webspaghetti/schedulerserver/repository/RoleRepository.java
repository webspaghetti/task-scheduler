package xyz.webspaghetti.schedulerserver.repository;

import org.springframework.stereotype.Repository;
import xyz.webspaghetti.schedulerserver.entity.Role;

@Repository
public interface RoleRepository extends BaseRepository<Role, Integer> {
}
