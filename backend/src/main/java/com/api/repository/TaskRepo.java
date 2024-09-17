package com.api.repository;

import com.api.entity.From;
import com.api.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepo  extends JpaRepository<Task, Integer> {
    @Query("SELECT t FROM Task t " +
        "WHERE t.from = :status " +
        "AND ((t.isPublic = false AND t.assignedUser.email = :email) OR (t.isPublic = true AND t.assignedUser.email = :email)) " +
            "AND t.title LIKE CONCAT('%', :title, '%') " +
        "ORDER BY t.position DESC")
    List<Task> findByPrivateTask(From status, String email, String title);

    @Query("SELECT t FROM Task t WHERE t.from = :status AND t.isPublic = true AND t.title LIKE CONCAT('%', :title, '%') ORDER BY t.position DESC")
    List<Task> findByPublicTask(From status, String title);

    @Query("SELECT MAX(t.position) FROM Task t WHERE t.from = :status")
    Integer findMaxPositionByStatus(@Param("status") From status);

    List<Task> findByFrom(From from);

}
