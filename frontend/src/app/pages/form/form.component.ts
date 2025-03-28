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
import { ActivatedRoute, Router } from '@angular/router';
import { Survey } from '../../models/survey.model';
import { SurveyStateService } from '../../state/survey-state.service';
import { take } from 'rxjs/operators';
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
  surveyTitle: string | null = '';
  surveyId: number | null = null;
  // for edit mode
  responseId: number | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private surveyState: SurveyStateService,
    // for edit mode, and to retrieve survey id in answer mode
    private route: ActivatedRoute
  ) {}

  // loads questions
  // in edit mode, also fills the form with the chosen record's data
  ngOnInit(): void {
    const survey_id = parseInt(
      this.route.snapshot.paramMap.get('surveyId') || ''
    );
    this.surveyId = survey_id;
    // this uses the surveyId to re-set the state if directly navigating...
    // ... to the page or on hard refresh
    if (
      !this.surveyState.getCurrentSurvey() ||
      this.surveyState.getCurrentSurvey()?.id !== survey_id
    ) {
      this.http
        .get<Survey>(`http://localhost:8800/api/surveys/${survey_id}`)
        .subscribe((survey) => this.surveyState.setSurvey(survey));
    }

    // not necessary to keep the subscription once title is set
    this.surveyState
      .getSurvey$()
      .pipe(take(1))
      .subscribe((survey) => {
        this.surveyTitle = survey?.title ?? null;
      });

    // for edit mode; gets the id of the record to fetch answers later
    this.responseId = parseInt(
      this.route.snapshot.paramMap.get('responseId') || ''
    );

    // Fetch questions
    this.http
      .get<Question[]>(
        `http://localhost:8800/api/surveys/${survey_id}/questions`
      )
      .subscribe({
        next: (questions) => {
          this.questions = questions;
          this.buildForm(questions);

          // If editing, load response
          if (this.responseId) {
            this.loadResponseAnswers(this.responseId);
          }
        },
        error: (err) => {
          console.error('Failed to load questions:', err);
          alert('Error loading survey questions.');
        },
      });
  }

  // essentially same as questionForm in create-form.component.ts, except we...
  //... don't know exactly what the form will look like ahead of time
  buildForm(questions: Question[]): void {
    const formGroup: { [key: string]: FormControl } = {};

    for (const q of questions) {
      // NOTE: be careful with ids: in the backend they're int, but right now
      // the implementation requires them to be string
      formGroup[String(q.id)] = this.fb.control('', Validators.required);
    }

    this.form = this.fb.group(formGroup);
  }

  // this is used to give the control to the question components as input
  // NOTE: be careful with ids: in the backend they're int, but right now
  // the implementation requires them to be string
  getControl(id: string): FormControl {
    return this.form.get(String(id)) as FormControl;
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    if (!this.surveyId) {
      alert('No survey selected.');
      return;
    }

    // Convert form data to array of { question_id, answer }
    const answers = Object.entries(this.form.value).map(([id, answer]) => ({
      question_id: Number(id), // convert key back to number
      answer,
    }));

    const payload = {
      survey_id: this.surveyId,
      answers,
    };

    // NOTE: for testing, can delete later
    console.log('submitted', payload);

    // if editing
    if (this.responseId) {
      this.http
        .put(`http://localhost:8800/api/responses/${this.responseId}`, {
          answers,
        })
        .subscribe({
          next: () => {
            alert('Response updated!');
            this.router.navigate([`/data/${this.surveyId}`]);
          },
          error: () => alert('Failed to update response.'),
        });
      // else creating
    } else {
      this.http.post('http://localhost:8800/api/responses', payload).subscribe({
        next: (res) => {
          console.log('Survey submitted successfully', res);
          alert('Thanks for submitting your answers!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error submitting survey:', err);
          alert('Failed to submit your survey. Please try again.');
        },
      });
    }
  }

  // loads answers for edit mode
  loadResponseAnswers(responseId: number): void {
    this.http
      .get<any[]>(`http://localhost:8800/api/responses/${responseId}/answers`)
      .subscribe({
        next: (answers) => {
          const patch: any = {};
          for (const a of answers) {
            // need to conver to correct type since all answers are stored as
            // strings in the DB
            const question_info = this.questions.find(
              (obj) => obj.id === a.question_id
            );
            let value: any = a.answer;
            const id = String(a.question_id);
            if (!question_info) continue;
            if (
              question_info.type === 'linear' ||
              question_info.type === 'number'
            ) {
              value = Number(value);
            } else if (question_info.type === 'yesno') {
              value = value === 'true' || value === '1';
            }

            patch[id] = value;
          }
          this.form.patchValue(patch);
        },
        error: () => alert('Failed to load response data.'),
      });
  }
}
