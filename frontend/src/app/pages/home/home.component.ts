import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { SurveyStateService } from '../../state/survey-state.service';
import { Survey } from '../../models/survey.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  surveys: Survey[] = [];
  selectedSurveyId: number | null = null;

  constructor(
    private http: HttpClient,
    private surveyState: SurveyStateService
  ) {}

  ngOnInit(): void {
    this.http.get<Survey[]>('http://localhost:8800/api/surveys').subscribe({
      next: (data) => {
        this.surveys = data;
        const stored = this.surveyState.getCurrentSurveyId();
        // pre selects survey if previously selected
        if (stored) {
          this.selectedSurveyId = stored;
        }
      },
      error: (err) => console.error('Failed to fetch surveys', err),
    });
  }

  selectSurvey(survey: Survey) {
    // deselects
    if (this.selectedSurveyId === survey.id) {
      this.selectedSurveyId = null;
      this.surveyState.setSurvey(null);
      // selects
    } else {
      this.selectedSurveyId = survey.id;
      this.surveyState.setSurvey(survey);
    }
  }

  deleteSurvey(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this survey?');

    if (!confirmed) return;

    this.http.delete(`http://localhost:8800/api/surveys/${id}`).subscribe({
      next: () => {
        this.surveys = this.surveys.filter((s) => s.id !== id);

        // if the deleted survey was selected, clear it
        if (this.selectedSurveyId === id) {
          this.selectedSurveyId = null;
          this.surveyState.setSurvey(null);
        }

        alert('Survey deleted.');
      },
      error: (err) => {
        console.error('Failed to delete survey', err);
        alert('Failed to delete survey.');
      },
    });
  }
}
