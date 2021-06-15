/* tslint:disable:variable-name */
export class IAMAnomaly {
  created_at: string;
  id: string;
  member: string;
  project_id: string;
  role: string;
  updated_at: string;
}

/* tslint:disable:variable-name */
export class IAMAnomaliesResponse {
  next_cursor: string;
  page_size:	number;
  results: IAMAnomaly[];
  status: string;
}
