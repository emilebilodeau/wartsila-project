import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface Column {
  key: string;
  label: string;
}

@Component({
  selector: 'app-table',
  imports: [RouterLink],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() columns: Column[] = [];
  @Input() rows: any[] = [];

  constructor(private http: HttpClient) {}

  deleteResponse(responseId: number): void {
    const confirmed = confirm('Are you sure you want to delete this response?');
    if (!confirmed) return;

    this.http
      .delete(`http://localhost:8800/api/responses/${responseId}`)
      .subscribe({
        next: () => {
          this.rows = this.rows.filter((row) => row.response_id !== responseId);
          alert('Response deleted.');
        },
        error: (err) => {
          console.error('Failed to delete response:', err);
          alert('Could not delete response.');
        },
      });
  }
}
