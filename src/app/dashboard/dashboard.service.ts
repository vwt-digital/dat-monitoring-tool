import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../components/modal/modal.component';

import { EnvService } from '../env/env.service';
import { AuthService } from '../auth/auth.service';

import { BuildStatus } from './build-status';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private MOCKSTATUSES = [{"branch":"develop","git_source":"github","organization":"vwt-digital-config","project_id":"vwt-d-gew1-cz-changepoint","repo_name":"cz-changepoint-config","status":"failing","updated":"2019-10-04T13:24:29.415845+00:00"},{"branch":"develop","git_source":"github","organization":"vwt-digital-config","project_id":"vwt-d-gew1-cz-connect","repo_name":"cz-connect-config","status":"passing","failing":"2019-10-04T13:24:42.965354+00:00"},{"branch":"develop","git_source":"github","organization":"vwt-digital-config","project_id":"vwt-d-gew1-cz-dashboard","repo_name":"operational-data-hub-config","status":"pending","updated":"2019-10-04T16:21:40.800320+00:00"},{"branch":"develop","git_source":"github","organization":"vwt-digital-config","project_id":"vwt-d-gew1-cz-dashboard","repo_name":"cz-dashboard","status":"pending","updated":"2019-10-04T16:16:44.064849+00:00"},{"branch":"develop","git_source":"github","organization":"vwt-digital-config","project_id":"vwt-d-gew1-cz-inforln","repo_name":"cz-inforln-config","status":"pending","updated":"2019-10-04T13:25:45.429781+00:00"},{"branch":"develop","git_source":"github","organization":"vwt-digital-config","project_id":"vwt-d-gew1-dat-deployment","repo_name":"dat-deployment-config","status":"passing","updated":"2019-10-04T14:26:01.794143+00:00"},{"branch":"develop","git_source":"github","organization":"vwt-digital-config","project_id":"vwt-d-gew1-dat-monitoring","repo_name":"dat-monitoring-api-config","status":"passing","updated":"2019-10-04T14:24:55.232230+00:00"}];

  public buildStatuses$: BehaviorSubject<BuildStatus[]> = new BehaviorSubject([]);
  public refreshTime = 30000; // Time in milliseconds
  public interval: any;

  public hasError = false;

  constructor(
    private httpClient: HttpClient,
    private env: EnvService,
    private authService: AuthService,
    private modalService: NgbModal
  ) { }

  async updateData() {
    // await this.httpClient.get(`${this.env.apiUrl}/build-statuses/branch/${this.getBranch}`).subscribe(
    //   (data: BuildStatus[]) => this.buildStatuses$.next(data),
    //   error => {
    //     clearInterval(this.interval);
    //     if (error.status === 401) {
    //       this.setModalMessage('Uh uh!', `You made an unauthorized request.`, false);
    //
    //       setTimeout(() =>{
    //         this.authService.removeApiKey();
    //       }, 4000)
    //     }
    //     console.log(error);
    //   }
    // );
    this.buildStatuses$.next(this.MOCKSTATUSES);
  }

  get getBranch() {
    return this.env.environment;
  }

  setModalMessage(title: string, content: string, backdrop: boolean = true) {
    const modalRef = this.modalService.open(ModalComponent, { backdrop: (backdrop ? backdrop : 'static') });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = content;
    modalRef.componentInstance.backdrop = backdrop;
  }
}
