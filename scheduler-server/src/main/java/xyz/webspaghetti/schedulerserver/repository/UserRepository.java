package xyz.webspaghetti.schedulerserver.repository;

import xyz.webspaghetti.schedulerserver.entity.User;

import java.util.Optional;


public interface UserRepository extends BaseRepository<User, Integer> {


    Optional<User> findById(Integer id);
}
