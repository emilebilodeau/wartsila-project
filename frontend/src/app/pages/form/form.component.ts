import { Component, OnInit } from '@angular/core';
import { Question } from '../../models/question.model';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TextqComponent } from '../../components/textq/textq.component';
import { NumberqComponent } from '../../components/numberq/numberq.component';
import { YesnoqComponent } from '../../components/yesnoq/yesnoq.component';

@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule,
    TextqComponent,
    NumberqComponent,
    YesnoqComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  // NOTE: hard coding for now, replace for API call later
  questions: Question[] = [
    // {
    //   id: '1',
    //   type: 'linear',
    //   question: 'how are you feeling today?',
    // },
    {
      id: '2',
      type: 'number',
      question: 'how many hours did you sleep?',
    },
    {
      id: '3',
      type: 'yesno',
      question: 'was your sleep disrupted/woke up during the night?',
    },
    {
      id: '4',
      type: 'text',
      question: 'journaling section',
    },
  ];
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const formGroup: { [key: string]: FormControl } = {};
    for (const q of this.questions) {
      if (q.type === 'text' || q.type === 'yesno') {
        formGroup[q.id] = this.fb.control('', Validators.required);
      } else if (q.type === 'linear' || q.type === 'number') {
        formGroup[q.id] = this.fb.control('', Validators.required);
      }
    }

    this.form = this.fb.group(formGroup);
  }

  // this function is necessary to provide question components
  // with the right inputs
  getControl(id: string): FormControl {
    return this.form.get(id) as FormControl;
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Submitted values:', this.form.value);
      alert(JSON.stringify(this.form.value));
    }
  }
}
