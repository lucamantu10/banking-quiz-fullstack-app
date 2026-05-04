package com.example.demo.repository;

import com.example.demo.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query(value = "SELECT * FROM questions ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Question findRandomQuestion();

}