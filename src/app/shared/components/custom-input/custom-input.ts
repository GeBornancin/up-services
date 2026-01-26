import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.css',
  standalone: true,
})
export class CustomInput {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() errorMessage: string = 'Teste';

  @Input() control!: FormControl;

  @Output() inputChange = new EventEmitter<Event>();

  onInput(event: Event) {
    this.inputChange.emit(event);
  }
}
