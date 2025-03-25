import { Component, OnInit } from '@angular/core';
import { Question } from '../../models/question.model';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TextqComponent } from '../../components/textq/textq.component';
import { NumberqComponent } from '../../components/numberq/numberq.component';
import { YesnoqComponent } from '../../components/yesnoq/yesnoq.component';
import { LinearqComponent } from '../../components/linearq/linearq.component';

@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule,
    TextqComponent,
    NumberqComponent,
    YesnoqComponent,
    LinearqComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  questions: Question[] = [];
  form!: FormGroup;
  surveyTitle: string = '';
  loading: boolean = true;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    const survey = JSON.parse(localStorage.getItem('selectedSurvey') || '{}');

    if (!survey?.id) {
      alert('No survey selected.');
      return;
    }

    this.surveyTitle = survey.title;

    this.http
      .get<Question[]>(
        `http://localhost:8800/api/surveys/${survey.id}/questions`
      )
      .subscribe({
        next: (questions) => {
          this.questions = questions;
          this.buildForm(questions);
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load questions:', err);
          alert('Error loading survey questions.');
        },
      });
  }

  buildForm(questions: Question[]): void {
    const formGroup: { [key: string]: FormControl } = {};

    for (const q of questions) {
      // NOTE: might not need this default value
      const defaultValue = q.type === 'linear' || q.type === 'number' ? 0 : '';
      // NOTE: be careful with ids: in the backend they're int, but right now
      // the implementation requires them to be string
      formGroup[String(q.id)] = this.fb.control(
        defaultValue,
        Validators.required
      );
    }

    this.form = this.fb.group(formGroup);
  }

  // NOTE: be careful with ids: in the backend they're int, but right now
  // the implementation requires them to be string
  getControl(id: string): FormControl {
    return this.form.get(String(id)) as FormControl;
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Submitted values:', this.form.value);
      alert(JSON.stringify(this.form.value));
    }
  }
}
