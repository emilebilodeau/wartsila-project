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
    if (!this.form.valid) return;

    const survey = JSON.parse(localStorage.getItem('selectedSurvey') || '{}');

    if (!survey?.id) {
      alert('No survey selected.');
      return;
    }

    // Convert form data to array of { question_id, answer }
    const answers = Object.entries(this.form.value).map(([id, answer]) => ({
      question_id: Number(id), // convert key back to number
      answer,
    }));

    const payload = {
      survey_id: survey.id,
      answers,
    };

    // NOTE: for testing, can delete later
    console.log('submitted', payload);

    this.http.post('http://localhost:8800/api/responses', payload).subscribe({
      next: (res) => {
        console.log('Survey submitted successfully', res);
        alert('Thanks for submitting your answers!');
        this.form.reset();
      },
      error: (err) => {
        console.error('Error submitting survey:', err);
        alert('Failed to submit your survey. Please try again.');
      },
    });
  }
}
