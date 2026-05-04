import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  questions: any[] = [];
  question: any = null;

  score = 0;
  answered = false;

  selectedAnswer = '';
  correctAnswer = '';

  currentQuestionIndex = 0;
  finished = false;

  menuOpen = false;
  isAdmin = false;

  ngOnInit() {
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    this.loadQuestions();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  async loadQuestions() {
    const res = await fetch('http://localhost:8080/questions');
    const data = await res.json();

    this.questions = this.shuffleArray(data.filter((q: any) => q.questionText && q.answers.length > 0));
    this.loadQuestion();
  }

  loadQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.finished = true;
      return;
    }

    this.question = this.questions[this.currentQuestionIndex];
    this.question.answers = this.shuffleArray([...this.question.answers]);
    this.correctAnswer = this.question.answers.find((a: any) => a.isCorrect).answerText;
    this.selectedAnswer = '';
    this.answered = false;
  }

  checkAnswer(answerText: string) {
    if (this.answered) return;

    this.selectedAnswer = answerText;
    this.answered = true;

    if (answerText === this.correctAnswer) {
      this.score++;
    }
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.loadQuestion();
  }

  resetQuiz() {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.finished = false;
    this.questions = this.shuffleArray(this.questions);
    this.loadQuestion();
  }

  shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }
}
