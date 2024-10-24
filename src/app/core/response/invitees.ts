export interface InviteeDetail {
  id: number;
  visitor_name: string;
  card_state: string;
  no_of_persons: number;
  scan_status: string;
  scanned_by: string;
}

export interface CheckedInInviteesResponse {
  number_of_verified_invitees: number;
  verified_invitees: InviteeDetail[];
}
