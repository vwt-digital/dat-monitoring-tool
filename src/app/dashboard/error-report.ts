/* tslint:disable:variable-name */
export class ErrorReport {
  id: string;
  labels: any;
  log_name: string;
  project_id: string;
  received_at: string;
  resource: any;
  severity: string;
  text_payload: string;
  trace: string;
}

/* tslint:disable:variable-name */
export class ErrorReportCount {
  count: number;
  id: string;
  log_name: string;
  project_id: string;
  received_at: string;
  resource: any;
  trace: string;
}

/* tslint:disable:variable-name */
export class ErrorReportResponse {
  next_cursor: string;
  page_size:	number;
  results: ErrorReport[];
  status: string;
}
