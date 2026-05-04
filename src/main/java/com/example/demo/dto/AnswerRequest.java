package com.example.demo.dto;

import lombok.Data;

@Data
public class AnswerRequest {
    private Long questionId;
    private String answerText;
}