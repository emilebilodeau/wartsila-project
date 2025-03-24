import { Component, OnInit } from '@angular/core';
import { Question } from '../../models/question.model';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  // NOTE: hard coding for now
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
    // {
    //   id: '3',
    //   type: 'yesno',
    //   question: 'was your sleep disrupted/woke up during the night?',
    // },
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
      formGroup[q.id] = this.fb.control('', Validators.required);
    }

    this.form = this.fb.group(formGroup);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Submitted values:', this.form.value);
      alert(JSON.stringify(this.form.value));
    } else {
      console.log('form invalid');
    }
  }
}
