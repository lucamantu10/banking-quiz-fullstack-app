package com.example.demo.controller;

import com.example.demo.dto.AnswerRequest;
import com.example.demo.dto.AnswerResponse;
import com.example.demo.model.Question;
import com.example.demo.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @PostMapping
    public Question addQuestion(@RequestBody(required = false) Question question) {
        return questionService.saveQuestion(question);
    }

    @PostMapping("/with-answers")
    public Question addQuestionWithAnswers(@RequestBody Question question) {
        return questionService.saveQuestionWithAnswers(question);
    }

    @PostMapping("/validate")
    public AnswerResponse validateAnswer(@RequestBody AnswerRequest request) {

        boolean result = questionService.validateAnswer(
                request.getQuestionId(),
                request.getAnswerText()
        );

        return result
                ? new AnswerResponse(true, "Răspuns corect")
                : new AnswerResponse(false, "Răspuns greșit");
    }

    @GetMapping("/random")
    public Question getRandomQuestion() {
        return questionService.getRandomQuestion();
    }

    @PutMapping("/{id}")
    public Question updateQuestion(@PathVariable Long id, @RequestBody Question updated) {
        return questionService.updateQuestion(id, updated);
    }

    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
    }
}