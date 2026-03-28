package xyz.webspaghetti.schedulerserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface BaseRepository<T, ID> extends JpaRepository<T, ID> {

    default T findOrThrow(ID entityId, String entityType) {

        return findById(entityId).orElseThrow(() ->
                new RuntimeException(
                        "Could not find '" + entityType + "' with ID: " + entityId
                ));
    }
}
