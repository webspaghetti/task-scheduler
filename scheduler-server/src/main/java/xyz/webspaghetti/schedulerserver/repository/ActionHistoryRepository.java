package xyz.webspaghetti.schedulerserver.repository;

import xyz.webspaghetti.schedulerserver.entity.ActionHistory;

import java.util.List;

public interface ActionHistoryRepository extends BaseRepository<ActionHistory, Integer> {

    List<ActionHistory> findAllByOrderByTimestampDesc();
}
