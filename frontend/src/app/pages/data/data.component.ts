import { Component } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-data',
  imports: [TableComponent],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss',
})
export class DataComponent {
  // NOTE: hard coded for now, will replace with API call
  columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'score', label: 'Score' },
  ];

  rows = [
    { name: 'Alice', age: 25, score: 92 },
    { name: 'Bob', age: 30, score: 85 },
    { name: 'Charlie', age: 22, score: 77 },
  ];
}
