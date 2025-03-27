import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TextqComponent } from '../../components/textq/textq.component';
import { NumberqComponent } from '../../components/numberq/numberq.component';
import { LinearqComponent } from '../../components/linearq/linearq.component';
import { YesnoqComponent } from '../../components/yesnoq/yesnoq.component';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-create-form',
  imports: [
    ReactiveFormsModule,
    TextqComponent,
    NumberqComponent,
    LinearqComponent,
    YesnoqComponent,
  ],
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.scss',
})
export class CreateFormComponent {
  questionTypes = ['text', 'number', 'yesno', 'linear'];
  selectedType: string = 'text';

  // list of created questions
  questions: Question[] = [];
  questionCounter = 1;

  // form used to create a new question
  questionForm: FormGroup;

  // dummy control since we do not need to capture real answers...
  // ... during survey creation
  previewControl = new FormControl();

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      type: ['text', Validators.required],
      min: [1],
      max: [10],
    });
  }

  surveyTitle = new FormControl('', Validators.required);

  addQuestion(): void {
    const { question, type, min, max } = this.questionForm.value;

    const id = 'q' + this.questionCounter++;

    const newQuestion: Question = {
      id,
      question,
      type,
      ...(type === 'linear' ? { min, max } : {}),
    };

    this.questions.push(newQuestion);
    this.questionForm.reset({ type: 'text', min: 1, max: 10 });
  }

  removeQuestion(id: string): void {
    this.questions = this.questions.filter((q) => q.id !== id);
  }

  saveSurvey(): void {
    const payload = {
      title: this.surveyTitle.value,
      questions: this.questions,
    };

    this.http.post('http://localhost:8800/api/surveys', payload).subscribe({
      next: (res) => {
        console.log('Survey created:', res);
        alert('Survey created!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Failed to create survey', err);
        alert('Failed to create survey.');
      },
    });
  }
}
