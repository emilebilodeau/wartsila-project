import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
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
    const survey = {
      title: this.surveyTitle.value,
      createdAt: new Date().toISOString(),
      questions: this.questions,
    };

    // For now, just log it
    console.log('Survey to send to backend:', survey);
  }
}

// NOTE: sample code for when backend is ready
// import { HttpClient } from '@angular/common/http';

// constructor(private fb: FormBuilder, private http: HttpClient) {}

// saveSurvey(): void {
//   const survey = {
//     title: 'Untitled Survey',
//     createdAt: new Date().toISOString(),
//     questions: this.questions
//   };

//   this.http.post('/api/surveys', survey).subscribe({
//     next: () => alert('Survey saved!'),
//     error: err => console.error('Error saving survey', err)
//   });
// }
