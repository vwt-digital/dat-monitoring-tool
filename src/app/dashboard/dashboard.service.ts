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
    await this.httpClient.get(`${this.env.apiUrl}/build-statuses/branch/${this.getBranch}`).subscribe(
      (data: BuildStatus[]) => this.buildStatuses$.next(data),
      error => {
        clearInterval(this.interval);
        if (error.status === 401) {
          this.setModalMessage('Uh uh!', `You made an unauthorized request.`, false);

          setTimeout(() =>{
            this.authService.removeApiKey();
          }, 4000)
        }
        console.log(error);
      }
    );
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
