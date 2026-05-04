import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  newQuestion = {
    domain: 'General',
    difficulty: 'EASY',
    questionText: '',
    answers: [
      { answerText: '', isCorrect: false },
      { answerText: '', isCorrect: false },
      { answerText: '', isCorrect: false }
    ]
  };

  menuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('isAdmin') !== 'true') {
      this.router.navigate(['/login']);
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  async addQuestion() {
    await fetch('http://localhost:8080/questions/with-answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.newQuestion)
    });

    this.newQuestion = {
      domain: 'General',
      difficulty: 'EASY',
      questionText: '',
      answers: [
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false }
      ]
    };
  }

  logout() {
    localStorage.removeItem('isAdmin');
    this.router.navigate(['/']);
  }
}
