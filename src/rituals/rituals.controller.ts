import { Controller, Get, Query, Param } from '@nestjs/common';

import { TypeformService } from '../services/typeform/typeform.service';

import {
  listFormSerializer,
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

  @Get(':id')
  async getFormDetail(@Param('id') id: string): Promise<Partial<Form>> {
    const formDetail = await this.typeform.getFormDetails(id);
    const parsedDetail = listFormSerializer(formDetail);
    return parsedDetail;
  }

  @Get(':id/responses')
  async listResponses(
    @Param('id') id: string,
    @Query('company') company: string,
    @Query('since') since: string,
  ): Promise<Response[]> {
    if (!company) {
      return [];
    }

    const remoteResponsesPromise = this.typeform.listResponses(id, company, {
      since,
    });
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
        const [
          whatsYourNameQuestion,
          whatsYourEmailQuestion,
          ...otherQuestions
        ] = fields;
        const fieldsToConsider = [whatsYourNameQuestion, ...otherQuestions];

        const whatsYourNameAnswer = response.answers.find(
          (answer) => answer.field.id === whatsYourNameQuestion.id,
        );
        const ownerName = whatsYourNameAnswer.text;

        const whatsYourEmailAnswer = response.answers.find(
          (answer) => answer.field.id === whatsYourEmailQuestion.id,
        );
        const ownerEmail = whatsYourEmailAnswer
          ? whatsYourEmailAnswer.text
          : '';

        return {
          id: response.response_id,
          submitted: response.submitted_at,
          owner: ownerName,
          ownerEmail,
          answers: listAnswerSerializer(response.answers, fieldsToConsider),
        };
      });

    return responses;
  }

  @Get(':id/analytics')
  async getAnalytics(
    @Param('id') id: string,
    @Query('company') company: string,
    @Query('since') since: string,
  ): Promise<any[]> {
    if (!company) {
      return [];
    }

    const remoteResponsesPromise = this.typeform.listResponses(id, company, {
      since,
    });
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
