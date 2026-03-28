package xyz.webspaghetti.schedulerserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import xyz.webspaghetti.schedulerserver.exception.EntityNotFoundException;

@NoRepositoryBean
public interface BaseRepository<T, ID> extends JpaRepository<T, ID> {

    default T findOrThrow(ID entityId, String entityType) {

        return findById(entityId).orElseThrow(() ->
                new EntityNotFoundException(
                        "Could not find '" + entityType + "' with ID: " + entityId
                ));
    }
}
