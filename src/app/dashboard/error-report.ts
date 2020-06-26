/* tslint:disable:variable-name */
export class ErrorReport {
  id: string;
  labels: any;
  log_name: string;
  project_id: string;
  receive_timestamp: string;
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
  receive_timestamp: string;
  resource: any;
  trace: string;
}
