package com.example.demo.service;

import com.example.demo.model.Answer;
import com.example.demo.model.Question;
import com.example.demo.repository.AnswerRepository;
import com.example.demo.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }

    public Question saveQuestionWithAnswers(Question question) {

        if (question.getAnswers() != null) {
            for (Answer a : question.getAnswers()) {
                a.setQuestion(question);
            }
        }

        return questionRepository.save(question);
    }

    public boolean validateAnswer(Long questionId, String answerText) {

        List<Answer> answers = answerRepository.findAll();

        for (Answer a : answers) {
            if (a.getQuestion().getId().equals(questionId)
                    && a.getAnswerText().equalsIgnoreCase(answerText)) {
                return a.getIsCorrect();
            }
        }

        return false;
    }

    public Question getRandomQuestion() {
        return questionRepository.findRandomQuestion();
    }

    public Question updateQuestion(Long id, Question updated) {
        Question q = questionRepository.findById(id).orElseThrow();

        q.setQuestionText(updated.getQuestionText());
        q.setAnswers(updated.getAnswers());

        return questionRepository.save(q);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}