import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-data',
  imports: [TableComponent],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss',
})
export class DataComponent {
  // TODO: include a different render if there is no answers
  columns: { key: string; label: string }[] = [];
  rows: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const survey = JSON.parse(localStorage.getItem('selectedSurvey') || '{}');
    if (!survey?.id) return;

    this.http
      .get<any[]>(`http://localhost:8800/api/surveys/${survey.id}/responses`)
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
