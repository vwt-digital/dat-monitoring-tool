import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EnvService } from '../env/env.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuildStatus } from './build-status';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  MOCKBUILDSTATUSES = [{"branch":"develop","git_source":"github","organization":"vwt-digital-config","project_id":"vwt-d-gew1-dat-deployment","repo_name":"dat-deployment-config","status":"failing","updated":"2019-10-01T06:05:36.579634+00:00"},{"branch":"develop","git_source":"github","organization":"vwt-digital-config","project_id":"vwt-d-gew1-dat-monitoring","repo_name":"dat-monitoring-api-config","status":"failing","updated":"2019-10-01T07:35:19.722275+00:00"},{"branch":"develop","git_source":"github","organization":"vwt-digital-config","project_id":"vwt-d-gew1-dat-monitoring","repo_name":"dat-monitoring-tool-config","status":"pending","updated":"2019-10-01T11:44:28.259543+00:00"},{"branch":"develop","git_source":"github","organization":"vwt-digital-config","project_id":"vwt-d-gew1-fin-expenses","repo_name":"fin-expenses-api-config","status":"passing","updated":"2019-10-01T07:03:43.085265+00:00"},{"branch":"develop","git_source":"github","organization":"vwt-digital-config","project_id":"vwt-d-gew1-ns-surveys","repo_name":"ns-surveysingest-config","status":"passing","updated":"2019-10-01T11:05:48.988606+00:00"},{"branch":"develop","git_source":"github","organization":"vwt-digital","project_id":"vwt-d-gew1-dat-monitoring","repo_name":"dat-monitoring-tool","status":"passing","updated":"2019-10-01T11:44:24.366693+00:00"},{"branch":"develop","git_source":"github","organization":"vwt-digital","project_id":"vwt-d-gew1-fin-expenses","repo_name":"fin-expenses-api","status":"passing","updated":"2019-10-01T06:57:16.432594+00:00"}];

  constructor(
    private httpClient: HttpClient,
    private env: EnvService,
    private modalService: NgbModal
  ) { }

  getBuildStatuses(branch = 'develop'): Observable<BuildStatus[]> {
    // return this.httpClient.get<BuildStatus>(`${this.env.apiUrl}/build-statuses/branch/${getBranch}`)
    //   .pipe(map((response: any) => response));
    return of(this.MOCKBUILDSTATUSES);
  }

  get getBranch() {
    return 'develop';
  }
}
