package xyz.webspaghetti.schedulerserver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "teams")
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"tasks", "users"})
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "team",
               cascade = CascadeType.ALL,
               orphanRemoval = true)
    private List<Task> tasks;

    @ManyToMany(fetch = FetchType.LAZY,
                cascade = {CascadeType.DETACH, CascadeType.PERSIST,
                           CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(
            name = "user_team",
            joinColumns = @JoinColumn(name = "team_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users = new HashSet<>();


    public Team(String name) {
        this.name = name;
    }


    public void addUser(User user) {
        this.users.add(user);
        user.getTeams().add(this);
    }

    public void removeUser(User user) {
        this.users.remove(user);
        user.getTeams().remove(this);
    }
}
