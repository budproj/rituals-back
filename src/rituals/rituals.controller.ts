import { Controller, Get, Query, Param } from '@nestjs/common';

import { TypeformService } from '../services/typeform/typeform.service';

import {
  listFormsSerializer,
  listAnswerSerializer,
} from './rituals.serializer';
import { Form, Response } from './ritual.dto';

@Controller('rituals')
export class RitualsController {
  constructor(private readonly typeform: TypeformService) {}

  @Get()
  async listForms(@Query('search') search: string): Promise<Form[]> {
    const apiCharacters = await this.typeform.listForms(search);
    const characters = listFormsSerializer(apiCharacters.items);
    return characters;
  }

  @Get(':id/responses')
  async listResponses(
    @Param('id') id: string,
    @Query('company') company: string,
  ): Promise<Response[]> {
    if (!company) {
      return [];
    }

    const remoteResponsesPromise = this.typeform.listResponses(id, company);
    const formDetailsPromise = this.typeform.getFormDetails(id);

    const [remoteResponses, formDetails] = await Promise.all([
      remoteResponsesPromise,
      formDetailsPromise,
    ]);

    const responses = remoteResponses.items
      .filter((response) => {
        const companyAnswer = response?.hidden?.utm_source;
        const isAnswerFromQueriedCompany = companyAnswer === company;
        return isAnswerFromQueriedCompany;
      })
      .map((response) => {
        const { fields } = formDetails;
        const [whatsYourNameQuestion] = fields;

        const whatsYourNameAnswer = response.answers.find(
          (answer) => answer.field.id === whatsYourNameQuestion.id,
        );
        const ownerName = whatsYourNameAnswer.text;

        return {
          id: response.response_id,
          submitted: response.submitted_at,
          owner: ownerName,
          answers: listAnswerSerializer(response.answers, fields),
        };
      });

    return responses;
  }

  @Get(':id/analytics')
  async getAnalytics(
    @Param('id') id: string,
    @Query('company') company: string,
  ): Promise<any[]> {
    if (!company) {
      return [];
    }

    const remoteResponsesPromise = this.typeform.listResponses(id, company);
    const formDetailsPromise = this.typeform.getFormDetails(id);

    const [remoteResponses, formDetails] = await Promise.all([
      remoteResponsesPromise,
      formDetailsPromise,
    ]);

    const responsesByFields = formDetails.fields.map((field) => {
      const answers = remoteResponses.items
        .reduce((allResponses, response) => {
          const answer = response.answers.find((answer) => {
            return answer.field.id === field.id;
          });
          return answer ? [...allResponses, answer] : allResponses;
        }, [])
        .map((answer) => answer[answer.type]);

      return {
        id: field.id,
        title: field.title,
        type: field.type,
        range: field?.properties?.steps,
        answers,
      };
    });

    return responsesByFields;
  }
}
