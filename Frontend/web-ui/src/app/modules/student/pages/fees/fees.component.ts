import { Component, OnInit } from '@angular/core';
import { FeeService, PendingFee } from 'src/app/services/fee.service';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.css']
})
export class FeesComponent implements OnInit {
  pendingDues: number = 0;
  lastPayment: { amount: number, date: string } | null = null;
  totalPaidYear: number = 0;
  pendingFees: PendingFee[] = [];
  isLoading: boolean = false;

  constructor(private feeService: FeeService) { }

  ngOnInit(): void {
    this.loadFeesData();
  }

  loadFeesData(): void {
    this.isLoading = true;

    this.feeService.getMockPendingFees().subscribe(
      fees => {
        this.pendingFees = fees;
        this.pendingDues = this.feeService.calculatePendingDues(fees);
        this.isLoading = false;
      },
      error => {
        console.error('Error loading fees:', error);
        this.isLoading = false;
      }
    );

    this.lastPayment = { amount: 500.00, date: 'Oct 2025' };
    this.totalPaidYear = 3500.00;
  }

  proceedToPayment(): void {
    alert('Payment system integration placeholder. This will redirect to payment gateway.');
  }
}
