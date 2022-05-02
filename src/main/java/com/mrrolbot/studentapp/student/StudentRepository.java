package com.mrrolbot.studentapp.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository
        extends JpaRepository<Student, Long> {
    @Query(value = "" +
            "SELECT CASE WHEN COUNT(e) > 0 THEN " +
            "TRUE ELSE FALSE END " +
            "FROM Student e " +
            "WHERE e.email = ?1"
    )
    Boolean selectExistsEmail(String email);
}
