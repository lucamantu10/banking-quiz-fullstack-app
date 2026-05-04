import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  questions: any[] = [];
  menuOpen = false;
  editingQuestion: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('isAdmin') !== 'true') {
      this.router.navigate(['/login']);
    }
    this.loadQuestions();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  async loadQuestions() {
    const res = await fetch('http://localhost:8080/questions');
    const data = await res.json();

    this.questions = data.filter((q: any) =>
      q.questionText && q.answers && q.answers.length > 0
    );
  }

  async deleteQuestion(id: number) {
    await fetch(`http://localhost:8080/questions/${id}`, {
      method: 'DELETE'
    });

    this.loadQuestions();
  }

  startEdit(q: any) {
    this.editingQuestion = JSON.parse(JSON.stringify(q));
  }

  cancelEdit() {
    this.editingQuestion = null;
  }

  async saveEdit() {
    await fetch(`http://localhost:8080/questions/${this.editingQuestion.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.editingQuestion)
    });

    this.editingQuestion = null;
    this.loadQuestions();
  }

  logout() {
    localStorage.removeItem('isAdmin');
    this.router.navigate(['/']);
  }
}
