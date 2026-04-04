package xyz.webspaghetti.schedulerserver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tasks")
@NoArgsConstructor
@Getter
@Setter
@ToString(onlyExplicitlyIncluded = true)
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @ToString.Include
    private Integer id;

    @Column(name = "name", length = 100, nullable = false)
    @ToString.Include
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    @ToString.Include
    private String description;

    @ManyToOne(fetch = FetchType.LAZY,
               cascade = {CascadeType.DETACH, CascadeType.PERSIST,
                          CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(name = "status", length = 20)
    @ToString.Include
    private String status;

    @Column(name = "created_at", updatable = false)
    @ToString.Include
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    @ToString.Include
    private LocalDateTime completedAt;

    @ManyToMany(fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.PERSIST,
                    CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(
            name = "user_task",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users = new HashSet<>();


    public Task(String name, String description, Team team) {
        this.name = name;
        this.description = description;
        this.team = team;
    }


    // Pre persist for default values
    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "TODO";
        }
    }


    @ToString.Include(name = "team")
    private Integer teamIdForToString() {
        return team == null ? null : team.getId();
    }


    public void addUser(User user) {
        this.users.add(user);
        user.getTasks().add(this);
    }

    public void removeUser(User user) {
        this.users.remove(user);
        user.getTasks().remove(this);
    }
}
