import { ChangeDetectorRef, Component, Input, Output, EventEmitter} from '@angular/core';
import { Admin, TransactionDetails } from '../../../../services/admin/admin';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-modal',
  imports: [CommonModule],
  templateUrl: './transaction-modal.html',
  styleUrl: './transaction-modal.css',
})
export class TransactionModal {

  constructor(private cdr: ChangeDetectorRef) { }

  @Input() transactionDetails: TransactionDetails | null = null;
  @Output() closeModal = new EventEmitter<void>();
  isLoading: boolean = true;


  
}