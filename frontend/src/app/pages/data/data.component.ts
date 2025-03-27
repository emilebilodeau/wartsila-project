import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableComponent } from '../../components/table/table.component';
import { SurveyStateService } from '../../state/survey-state.service';
import { ActivatedRoute } from '@angular/router';
import { Survey } from '../../models/survey.model';

@Component({
  selector: 'app-data',
  imports: [TableComponent],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss',
})

// NOTE: this still works without "implements OnInit"; look into why
export class DataComponent {
  // TODO: include a different render if there is no answers
  columns: { key: string; label: string }[] = [];
  rows: any[] = [];

  constructor(
    private http: HttpClient,
    // to retrieve survey id in answer mode and re-set survey state
    private surveyState: SurveyStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const survey_id = parseInt(
      this.route.snapshot.paramMap.get('surveyId') || ''
    );
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

    this.http
      .get<any[]>(`http://localhost:8800/api/surveys/${survey_id}/responses`)
      .subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.columns = Object.keys(data[0])
              .filter((key) => key !== 'response_id') // optional
              .map((key) => ({ key, label: this.capitalize(key) }));

            this.rows = data;
          }
        },
        error: (err) => {
          console.error('Failed to load survey responses:', err);
        },
      });
  }

  capitalize(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
