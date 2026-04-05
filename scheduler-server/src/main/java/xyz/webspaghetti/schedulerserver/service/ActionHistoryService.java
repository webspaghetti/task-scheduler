package xyz.webspaghetti.schedulerserver.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import xyz.webspaghetti.schedulerserver.dto.create.ActionHistoryCreateDto;
import xyz.webspaghetti.schedulerserver.dto.response.ActionHistoryResponseDto;
import xyz.webspaghetti.schedulerserver.entity.ActionHistory;
import xyz.webspaghetti.schedulerserver.mapper.ActionHistoryMapper;
import xyz.webspaghetti.schedulerserver.repository.ActionHistoryRepository;

@Service
@RequiredArgsConstructor
public class ActionHistoryService {

    private final ActionHistoryRepository actionHistoryRepository;
    private final ActionHistoryMapper historyMapper;

    @Transactional
    public void createHistory(ActionHistoryCreateDto actionHistoryCreateDto) {

        ActionHistory savedHistory = historyMapper.toEntity(actionHistoryCreateDto);

        return historyMapper.toResponseDto(actionHistoryRepository.save(savedHistory));
    }
}
