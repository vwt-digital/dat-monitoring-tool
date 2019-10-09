import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';

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
    await this.getBuildStatusesTrigger();
    await this.getBuildStatusesOther();
    await this.getErrorReporting();
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


  async getBuildStatusesTrigger() {
    await this.httpClient.get(`${this.env.apiUrl}/build-statuses-triggers`).subscribe(
      (data: BuildTriggerStatus[]) => this.buildTriggerStatuses$.next(data),
      error => {
        clearInterval(this.interval);
        if (error.status === 401) {
          this.setModalMessage('Uh uh!', `You made an unauthorized request.`, false);

          setTimeout(() => {
            this.authService.removeApiKey();
          }, 4000 );
        }
        console.log(error);
      }
    );
  }

  async getBuildStatusesOther() {
    await this.httpClient.get(`${this.env.apiUrl}/build-statuses-other/failing`).subscribe(
      (data: BuildOtherStatus[]) => this.buildOtherStatuses$.next(data),
      error => {
        clearInterval(this.interval);
        if (error.status === 401) {
          this.setModalMessage('Uh uh!', `You made an unauthorized request.`, false);

          setTimeout(() => {
            this.authService.removeApiKey();
          }, 4000 );
        }
        console.log(error);
      }
    );
  }

  async getErrorReporting() {
    await this.httpClient.get(`${this.env.apiUrl}/error-reporting/count`).subscribe(
      (data: ErrorReport[]) => this.errorReporting$.next(data),
      error => {
        clearInterval(this.interval);
        if (error.status === 401) {
          this.setModalMessage('Uh uh!', `You made an unauthorized request.`, false);

          setTimeout(() => {
            this.authService.removeApiKey();
          }, 4000 );
        }
        console.log(error);
      }
    );
  }
}
