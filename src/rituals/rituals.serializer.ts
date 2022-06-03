import { Typeform } from '@typeform/api-client';
import { FormItem } from 'src/services/typeform/form.dto';

import { Form, Answer } from './ritual.dto';

export const listFormsSerializer = (
  forms: Typeform.API.Forms.List['items'],
): Form[] => {
  return forms.map(
    (form: FormItem): Form => ({
      id: form.id,
      title: form.title,
      link: form._links.display,
    }),
  );
};

export const listAnswerSerializer = (
  answers: Typeform.Response['answers'],
  fields: Typeform.Field[],
): Answer[] => {
  return fields.map((field): Answer => {
    const answerField = answers.find((answer) => answer.field.id === field.id);

    return {
      fieldId: field.id,
      fieldType: field.type,
      question: field.title,
      properties: field.properties,
      type: answerField?.type,
      number: answerField?.number,
      text: answerField?.text,
      boolean: answerField?.boolean,
    };
  });
};
