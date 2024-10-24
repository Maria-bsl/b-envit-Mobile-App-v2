import { EventDetailsResponse } from './EventDetailsResponse';

export class LoginResponse {
  status: number;
  message?: string;
  Mobile_Number: string;
  event_details: EventDetailsResponse[];
}
