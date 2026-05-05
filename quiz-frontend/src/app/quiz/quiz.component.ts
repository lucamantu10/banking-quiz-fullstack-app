import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  allQuestions: any[] = [];
  questions: any[] = [];
  question: any = null;

  score = 0;
  answered = false;

  selectedAnswer = '';
  correctAnswer = '';

  currentQuestionIndex = 0;
  finished = false;
  quizStarted = false;

  menuOpen = false;
  isAdmin = false;

  selectedDifficulty = 'ALL';
  selectedQuestionCount = 10;

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

    this.allQuestions = data.filter((q: any) =>
      q.questionText &&
      q.answers &&
      q.answers.length > 0 &&
      q.difficulty
    );

    this.adjustQuestionCount();
  }

  startQuiz() {
    this.adjustQuestionCount();

    let filteredQuestions = this.allQuestions;

    if (this.selectedDifficulty !== 'ALL') {
      filteredQuestions = this.allQuestions.filter((q: any) =>
        q.difficulty === this.selectedDifficulty
      );
    }

    this.questions = this.shuffleArray(filteredQuestions).slice(0, this.selectedQuestionCount);

    this.score = 0;
    this.currentQuestionIndex = 0;
    this.finished = false;
    this.quizStarted = true;

    this.loadQuestion();
  }

  loadQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.finished = true;
      this.question = null;
      return;
    }

    this.question = this.questions[this.currentQuestionIndex];
    this.question.answers = this.shuffleArray([...this.question.answers]);

    const correct = this.question.answers.find((a: any) => a.isCorrect);
    this.correctAnswer = correct ? correct.answerText : '';

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
    this.quizStarted = false;
    this.finished = false;
    this.question = null;
    this.questions = [];
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.selectedAnswer = '';
    this.correctAnswer = '';
    this.answered = false;
  }

  restartSameSettings() {
    this.finished = false;
    this.quizStarted = true;
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.selectedAnswer = '';
    this.correctAnswer = '';
    this.answered = false;
    this.startQuiz();
  }

  getFinalPercentage() {
    if (this.questions.length === 0) return 0;
    return Math.round((this.score / this.questions.length) * 100);
  }

  getDifficultyCount(difficulty: string) {
    if (difficulty === 'ALL') {
      return this.allQuestions.length;
    }

    return this.allQuestions.filter((q: any) => q.difficulty === difficulty).length;
  }

  getMaxQuestions() {
    return this.getDifficultyCount(this.selectedDifficulty);
  }

  adjustQuestionCount() {
    const maxQuestions = this.getMaxQuestions();

    if (maxQuestions === 0) {
      this.selectedQuestionCount = 0;
      return;
    }

    if (!this.selectedQuestionCount || this.selectedQuestionCount < 1) {
      this.selectedQuestionCount = 1;
    }

    if (this.selectedQuestionCount > maxQuestions) {
      this.selectedQuestionCount = maxQuestions;
    }
  }

  changeDifficulty(difficulty: string) {
    this.selectedDifficulty = difficulty;
    this.adjustQuestionCount();
  }

  shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }
}
