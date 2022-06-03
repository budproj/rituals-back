import { TypeformResponse } from './typeform.dto';

export interface AnswerField {
  id: string;
  ref: string;
  type: string;
}

export interface Answer {
  field: AnswerField;
  type: string;
  text: string;
}

export interface AnswerResponseItemMetaData {
  user_agent: string;
  platform: string;
  referer: string;
  network_id: string;
  browser: string;
}

export interface AnswerResponseItemHiddenFields {
  utm_source: string;
}

export interface AnswerResponseItemCalculatedFields {
  score: number;
}

export interface AnswerResponseItem {
  landing_id: string;
  token: string;
  response_id: string;
  landed_at: string;
  submitted_at: string;
  metadata: AnswerResponseItemMetaData;
  hidden?: AnswerResponseItemHiddenFields;
  calculated: AnswerResponseItemCalculatedFields;
  answers: Answer[];
}

export interface AnswerResponse extends TypeformResponse {
  items: AnswerResponseItem[];
}
