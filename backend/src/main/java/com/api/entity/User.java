package com.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Data
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idUser", unique=true, nullable = false)
    private Integer Id;
    private String name;
    private String email;
    private String password;
    private String role;

    @OneToMany(mappedBy = "createUser", fetch = FetchType.LAZY)
    private List<Task> createdTasks;

    @OneToMany(mappedBy = "assignedUser", fetch = FetchType.LAZY)
    private List<Task> assignedTasks;




    @Transient
    private Collection<? extends GrantedAuthority> authorities;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
