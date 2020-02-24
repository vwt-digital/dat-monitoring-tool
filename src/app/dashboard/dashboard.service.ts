import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, forkJoin } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../components/modal/modal.component';

import { EnvService } from '../env/env.service';
import { AuthService } from '../auth/auth.service';

import { BuildTriggerStatus, BuildOtherStatus } from './build-status';
import { ErrorReport } from './error-report';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public buildTriggerStatuses$: BehaviorSubject<BuildTriggerStatus[]> = new BehaviorSubject([]);
  public buildOtherStatuses$: BehaviorSubject<BuildOtherStatus[]> = new BehaviorSubject([]);
  public errorReporting$: BehaviorSubject<ErrorReport[]> = new BehaviorSubject([]);

  public refreshTime = 300000; // Time in milliseconds
  public lastUpdate: Date;
  public interval: any;

  public hasError = false;

  constructor(
    private httpClient: HttpClient,
    private env: EnvService,
    private authService: AuthService,
    private modalService: NgbModal
  ) { }

  updateData() {
    forkJoin([
      this.getBuildStatusesTrigger(),
      this.getBuildStatusesOther(),
      this.getErrorReporting()
    ]).subscribe(
        responseList => {
          this.buildTriggerStatuses$.next(responseList[0]);
          this.buildOtherStatuses$.next(responseList[1]);
          this.errorReporting$.next(responseList[2]);

          this.lastUpdate = new Date();
        }, error => {
          if (error.status === 401) {
            clearInterval(this.interval);
            this.setModalMessage('Uh uh!', `You made an unauthorized request.`, false);

            setTimeout(() => {
              this.authService.removeApiKey();
            }, 4000 );
          }

          this.lastUpdate = new Date();
          console.log(error);
        });
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


  getBuildStatusesTrigger() {
    return this.httpClient.get<BuildTriggerStatus[]>(`${this.env.apiUrl}/build-statuses-triggers`);
  }

  getBuildStatusesOther() {
    return this.httpClient.get<BuildOtherStatus[]>(
      `${this.env.apiUrl}/build-statuses-others/failing`,
      { params: {
        days: '2'
      } }
    );
  }

  getErrorReporting() {
    return this.httpClient.get<ErrorReport[]>(
      `${this.env.apiUrl}/error-reports/counts`,
      { params: {
        days: '7',
        max_rows: '5'
      } }
    );
  }
}
