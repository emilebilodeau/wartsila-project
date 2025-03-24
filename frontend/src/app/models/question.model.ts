export interface Question {
  id: string;
  type: 'linear' | 'yesno' | 'text' | 'number';
  question: string;
  min?: number; // for linear scale question
  max?: number; // for linear scale question
}
