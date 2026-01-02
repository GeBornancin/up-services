import { Component, output } from '@angular/core';

@Component({
  selector: 'app-error-popup',
  imports: [],
  templateUrl: './error-popup.html',
  styleUrl: './error-popup.css',
})
export class ErrorPopup {
  close = output<void>();

  closePopup() {
    this.close.emit();
  }
}
