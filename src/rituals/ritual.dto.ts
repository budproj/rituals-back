import { Typeform } from '@typeform/api-client';
import { FormItem } from '../services/typeform/form.dto';

export interface Form {
  id: FormItem['id'];
  title: FormItem['title'];
  link: string;
}

export interface Answer {
  fieldId: string;
  fieldType: string;
  question: string;
  properties?: Typeform.Field['properties'];
  type:
    | 'choice'
    | 'choices'
    | 'date'
    | 'email'
    | 'url'
    | 'file_url'
    | 'number'
    | 'boolean'
    | 'text'
    | 'payment';
  number?: number;
  text?: string;
  boolean?: boolean;
}

export interface Response {
  id: string;
  submitted: string;
  owner: string;
  answers: Answer[];
}
