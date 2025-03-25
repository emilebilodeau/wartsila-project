import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface Survey {
  id: number;
  title: string;
  created_at: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  surveys: Survey[] = [];
  selectedSurveyId: number | null = null;

  constructor(private http: HttpClient) {}

  // TODO: come back to this ngOnInit(). behaviour looks different...
  //... than in the form page component
  ngOnInit(): void {
    this.http.get<Survey[]>('http://localhost:8800/api/surveys').subscribe({
      next: (data) => {
        this.surveys = data;
        const stored = localStorage.getItem('selectedSurvey');
        // pre selects survey if previously selected
        if (stored) {
          const parsed = JSON.parse(stored);
          this.selectedSurveyId = parsed.id;
        }
      },
      error: (err) => console.error('Failed to fetch surveys', err),
    });
  }

  selectSurvey(survey: Survey) {
    this.selectedSurveyId = survey.id;
    localStorage.setItem('selectedSurvey', JSON.stringify(survey));
  }
}
