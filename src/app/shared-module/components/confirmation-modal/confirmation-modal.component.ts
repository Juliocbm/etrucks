import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  public title: string = "Confirmación";
  public message: string = "¿Estás seguro?";
  public confirmText?: string = "";
  public declineText?: string = "";
  public buttons?: boolean = false;

  constructor(public modalRef: BsModalRef) {}

  confirm(): void {
    this.modalRef.hide();
    this.onConfirm();
  }

  decline(): void {
    this.modalRef.hide();
    this.onDecline();
  }

  onConfirm: () => void = () => {};
  onDecline: () => void = () => {};
}
