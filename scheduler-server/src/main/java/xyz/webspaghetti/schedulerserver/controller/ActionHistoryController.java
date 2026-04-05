package xyz.webspaghetti.schedulerserver.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.webspaghetti.schedulerserver.dto.response.ActionHistoryResponseDto;
import xyz.webspaghetti.schedulerserver.service.ActionHistoryService;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class ActionHistoryController {

    private final ActionHistoryService actionHistoryService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<ActionHistoryResponseDto>> getHistory(){

        List<ActionHistoryResponseDto> fetchedHistory = actionHistoryService.getHistory();

        return ResponseEntity.ok(fetchedHistory);
    }
}
