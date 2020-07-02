/* tslint:disable:variable-name */
export class SecurityNotification {
  category: string;
  created_at: string;
  exception_instructions: string;
  explanation: string;
  external_uri: string;
  id: string;
  project_id: string;
  recommendation: string;
  resource_name: string;
  severity: string;
  updated_at: string;
}

/* tslint:disable:variable-name */
export class SecurityNotificationResponse {
  next_cursor: string;
  page_size:	number;
  results: SecurityNotification[];
  status: string;
}
