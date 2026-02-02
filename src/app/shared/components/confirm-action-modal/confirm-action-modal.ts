import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonGreen } from '../button-green/button-green';
import { ButtonRed } from '../button-red/button-red';

@Component({
  selector: 'app-confirm-action-modal',
  imports: [ButtonGreen, ButtonRed],
  templateUrl: './confirm-action-modal.html',
  styleUrl: './confirm-action-modal.css',
})
export class ConfirmActionModal {
  @Input() message: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmAction = new EventEmitter<void>();
}

