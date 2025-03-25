import { Component, Input } from '@angular/core';

interface Column {
  key: string;
  label: string;
}

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() columns: Column[] = [];
  @Input() rows: any[] = [];
}
