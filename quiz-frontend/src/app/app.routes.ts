import { Routes } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { AdminComponent } from './admin/admin.component';
import { QuestionsComponent } from './questions/questions.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: QuizComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'questions', component: QuestionsComponent }
];
