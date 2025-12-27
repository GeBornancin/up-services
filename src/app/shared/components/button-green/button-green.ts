import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-green',
  standalone: true, // Garanta que é standalone
  imports: [CommonModule],
  templateUrl: './button-green.html',
  styleUrl: './button-green.css', // Se houver
})
export class ButtonGreen {
  // Recebe o texto que vai escrito no botão
  @Input() text: string = 'Enviar';

  // Recebe o estado de desabilitado (true/false)
  @Input() disabled: boolean = false;

  // Opcional: Para permitir que ele seja 'button' ou 'submit'
  @Input() type: 'button' | 'submit' = 'submit';
}
