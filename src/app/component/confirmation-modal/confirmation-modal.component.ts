import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  providers: [DatePipe],
  imports: [CommonModule]
})
export class ConfirmationModalComponent {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() confirmButtonLabel: string = 'Confirm';
  @Input() cancelButtonLabel: string = 'Cancel';
  @Input() details: any = {};

  @Output() confirmed = new EventEmitter<void>();

  constructor(public activeModal: NgbActiveModal, private datePipe: DatePipe) {}

  onConfirm(): void {
    this.confirmed.emit();
    this.activeModal.close('Confirmed');
  }

  onCancel(): void {
    this.activeModal.dismiss('Cancelled');
  }
}
