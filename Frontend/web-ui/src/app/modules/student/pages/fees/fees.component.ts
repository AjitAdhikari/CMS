import { Component, OnInit } from '@angular/core';
import { FeeService } from 'src/app/services/fee.service';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.css']
})
export class FeesComponent implements OnInit {
  pendingDues: number = 0;
  lastPayment: { amount: number, date: string } | null = null;
  totalPaidYear: number = 0;
  pendingFees: any[] = [];
  isLoading: boolean = false;

  constructor(private feeService: FeeService) { }

  ngOnInit(): void {
    this.loadFeesData();
  }

  loadFeesData(): void {
    this.isLoading = true;
    // For the invoice-style view we populate mock invoice data here.
    // In a real app this should come from `FeeService` or an API.
    setTimeout(() => {
      this.pendingFees = [
        {
          invoiceNumber: '644984994',
          feeStatus: 'Partial Payment',
          totalAmount: 336698,
          amountPay: 74563,
          balancedAmount: 262135,
          invoiceDate: '2023-12-02 10:05:13'
        },
        {
          invoiceNumber: '745002171',
          feeStatus: 'Partial Payment',
          totalAmount: 336698,
          amountPay: 54756,
          balancedAmount: 281942,
          invoiceDate: '2023-12-02 10:05:40'
        }
      ];
      this.pendingDues = this.pendingFees.reduce((s, inv) => s + (inv.balancedAmount || 0), 0);
      this.isLoading = false;
    }, 300);

    this.lastPayment = { amount: 500.00, date: 'Oct 2025' };
    this.totalPaidYear = 3500.00;
  }

  viewInvoice(invoice: any): void {
    // Replace with real navigation to invoice detail
    console.log('View invoice', invoice);
    alert('View invoice: ' + invoice.invoiceNumber);
  }

  viewAllInvoices(event: Event): void {
    event.preventDefault();
    console.log('View all invoices');
    alert('Redirect to invoice list (placeholder)');
  }

  goTo(action: 'first' | 'prev' | 'next' | 'last', event: Event): void {
    event.preventDefault();
    console.log('Pagination action:', action);
    // placeholder for pagination logic
  }

  proceedToPayment(): void {
    alert('Payment system integration placeholder. This will redirect to payment gateway.');
  }
}
