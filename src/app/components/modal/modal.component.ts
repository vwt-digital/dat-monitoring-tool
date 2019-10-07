import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() title = 'Sorry!';
  @Input() content = 'Er is een fout opgetreden';
  @Input() backdrop = true;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.backdrop) {
      setTimeout(() => {
        this.closeOnError(this.activeModal);
      }, 6000);
    }
  }

  closeOnError(activeModal: any) {
    activeModal.close('Close clicked');
    this.router.navigate(['login']);
  }
}
