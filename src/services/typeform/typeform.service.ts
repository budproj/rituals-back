import { createClient, Typeform } from '@typeform/api-client';
import { Injectable } from '@nestjs/common';
import 'dotenv/config'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

@Injectable()
export class TypeformService {
  typeform: any;

  constructor() {
    const client = createClient({
      token: process.env.TYPEFORM_API_KEY,
    });

    this.typeform = client;
  }

  async listForms(search: string): Promise<Typeform.API.Forms.List> {
    const response = await this.typeform.forms.list({
      search,
    });

    return response;
  }

  async getFormDetails(formId: string): Promise<Typeform.Form> {
    const response = await this.typeform.forms.get({
      uid: formId,
    });

    return response;
  }

  async listResponses(
    formId: string,
    company?: string,
    query?: { [key: string]: string },
  ): Promise<Typeform.API.Responses.List> {
    const response = await this.typeform.responses.list({
      uid: formId,
      query: company,
      ...query,
    });

    return response;
  }
}
