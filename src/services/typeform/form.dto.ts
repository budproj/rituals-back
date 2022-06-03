import { TypeformResponse } from './typeform.dto';

export interface FormItem {
  id: string;
  type: string;
  title: string;
  last_updated_at: string;
  created_at: string;
  settings: {
    is_public: boolean;
    is_trial: boolean;
  };
  self: {
    href: string;
  };
  theme: {
    href: string;
  };
  _links: {
    display: string;
  };
}

export interface FormResponse extends TypeformResponse {
  items: FormItem[];
}
