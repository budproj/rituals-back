import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface CusdisWebhook {
  type: string;
  data: {
    by_nickname: string;
    by_email: string;
    content: string;
    page_id: string;
    page_title: string | null;
    project_title: string;
    approve_link: string;
  };
}

interface ApproveCommentResponse {
  message: string;
}

@Injectable()
export class CusdisService {
  baseAPIUrl: string;

  constructor() {
    this.baseAPIUrl = 'https://cusdis.com/api/open';
  }

  async approveComment(hookData: CusdisWebhook['data']): Promise<any> {
    const token = hookData.approve_link.match(/token=([^&]*)/)[1];
    const route = `${this.baseAPIUrl}/approve?token=${token}`;

    const { data } = await axios.post<ApproveCommentResponse>(route);
    return data.message === 'success';
  }
}
