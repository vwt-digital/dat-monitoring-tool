import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, forkJoin, Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../components/modal/modal.component';

import { EnvService } from '../env/env.service';
import { AuthService } from '../auth/auth.service';

import { BuildTriggerStatus } from './build-status';
import { ErrorReportCount } from './error-report';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public buildTriggerStatuses$: BehaviorSubject<BuildTriggerStatus[]> = new BehaviorSubject([]);
  public errorReporting$: BehaviorSubject<ErrorReportCount[]> = new BehaviorSubject([]);

  public refreshTime = 300000; // Time in milliseconds
  public lastUpdate: Date;
  public interval: number;

  public hasError = false;

  constructor(
    private httpClient: HttpClient,
    private env: EnvService,
    private authService: AuthService,
    private modalService: NgbModal
  ) { }

  updateData(): void {
    forkJoin([
      this.getBuildStatusesTrigger(),
      this.getErrorReporting()
    ]).subscribe(
        responseList => {
          this.buildTriggerStatuses$.next(responseList[0].filter(
            (value) => {
              return !(value.repo_name === 'backup' && value.status !== 'failing');
            }));
          this.errorReporting$.next(responseList[1]);

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

  get getBranch(): string {
    return this.env.environment;
  }

  setModalMessage(title: string, content: string, backdrop = true): void {
    const modalRef = this.modalService.open(ModalComponent, { backdrop: (backdrop ? backdrop : 'static') });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = content;
    modalRef.componentInstance.backdrop = backdrop;
  }


  getBuildStatusesTrigger(): Observable<BuildTriggerStatus[]> {
    return this.httpClient.get<BuildTriggerStatus[]>(`${this.env.apiUrl}/build-statuses-triggers`);
  }

  getErrorReporting(): Observable<ErrorReportCount[]> {
    return this.httpClient.get<ErrorReportCount[]>(
      `${this.env.apiUrl}/error-reports/counts`,
      { params: {
        days: '7',
        max_rows: '5' // eslint-disable-line @typescript-eslint/camelcase
        } }
    );
  }
}
