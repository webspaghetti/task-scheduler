package xyz.webspaghetti.schedulerserver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "users")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @ManyToMany(fetch = FetchType.LAZY,
                cascade = {CascadeType.DETACH, CascadeType.PERSIST,
                           CascadeType.MERGE, CascadeType.REFRESH},
                mappedBy = "roles")
    private Set<User> users = new HashSet<>();


    public Role(String name) {
        this.name = name;
    }
}
