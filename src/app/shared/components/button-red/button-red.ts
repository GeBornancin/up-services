import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-red',
  imports: [],
  templateUrl: './button-red.html',
  styleUrl: './button-red.css',
})
export class ButtonRed {
  // Recebe o texto que vai escrito no botão
  @Input() text: string = 'Enviar';

  // Recebe o estado de desabilitado (true/false)
  @Input() disabled: boolean = false;

  // Opcional: Para permitir que ele seja 'button' ou 'submit'
  @Input() type: 'button' | 'submit' = 'submit';

  // Emite evento quando o botão é clicado
  @Output() buttonClick = new EventEmitter<void>();
}
