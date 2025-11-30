import { Component, OnInit } from '@angular/core';

interface Student {
  id: number;
  name: string;
  class?: string;
  // optional role to allow filtering out non-students (e.g. 'Faculty', 'Admin')
  role?: string;
  feeDue: number;
}

interface Payment {
  id: number;
  studentId: number;
  amount: number;
  date: string; // ISO date
  method: string;
  note?: string;
  semester?: number;
}

interface FeeItem {
  id: number;
  studentId: number;
  semester: number;
  type: string;
  amount: number;
  dueDate?: string; // human readable or 'Immediate'
  status: 'Pending' | 'Paid' | 'Overdue';
}

@Component({
  selector: 'app-fee-monitoring',
  templateUrl: './fee-monitoring.component.html',
  styleUrls: ['./fee-monitoring.component.css']
})
export class FeeMonitoringComponent implements OnInit {

  students: Student[] = [];
  payments: Payment[] = [];
  fees: FeeItem[] = [];

  selectedStudentId?: number;
  selectedSemester = 1;
  semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  newPayment: Partial<Payment> = { amount: 0, method: 'Cash', date: new Date().toISOString().slice(0, 10), semester: 1 };
  private nextPaymentId = 1;

  ngOnInit(): void {
    // sample data
    this.students = [
      { id: 1, name: 'Sara Powell', feeDue: 1200, role: 'Student' },
      { id: 2, name: 'David Lee', feeDue: 1500, role: 'Faculty' },
      { id: 3, name: 'Mark Chan', feeDue: 1800, role: 'Student' }
    ];

    this.payments = [
      { id: this.nextPaymentId++, studentId: 1, amount: 400, date: '2025-11-01', method: 'Cash', note: 'First installment', semester: 1 },
      { id: this.nextPaymentId++, studentId: 1, amount: 200, date: '2025-11-15', method: 'Card', semester: 1 },
      { id: this.nextPaymentId++, studentId: 2, amount: 500, date: '2025-10-20', method: 'Online', semester: 2 }
    ];

    // sample fee items per student+semester
    this.fees = [
      { id: 1, studentId: 1, semester: 1, type: "Tuition Fee - Spring '26", amount: 1000, dueDate: 'Jan 15, 2026', status: 'Pending' },
      { id: 2, studentId: 1, semester: 1, type: 'Library Fine', amount: 50, dueDate: 'Immediate', status: 'Overdue' },
      { id: 3, studentId: 2, semester: 2, type: "Tuition Fee - Fall '25", amount: 1500, dueDate: 'Dec 01, 2025', status: 'Paid' }
    ];
  }

  // Only show entries that are students (case-insensitive match)
  get studentsOnly(): Student[] {
    return this.students.filter(s => (s.role || '').toLowerCase() === 'student');
  }

  selectStudent(id?: number): void {
    this.selectedStudentId = id;
    // reset new payment defaults and default semester
    this.selectedSemester = 1;
    this.newPayment = { amount: 0, method: 'Cash', date: new Date().toISOString().slice(0, 10), semester: this.selectedSemester };
  }

  get selectedStudent(): Student | undefined {
    return this.students.find(s => s.id === this.selectedStudentId);
  }

  get paymentsForSelected(): Payment[] {
    if (!this.selectedStudentId) return [];
    return this.payments.filter(p => p.studentId === this.selectedStudentId).sort((a, b) => a.date.localeCompare(b.date));
  }

  // payments filtered by selected semester (if needed)
  paymentsForSelectedSemester(): Payment[] {
    if (!this.selectedStudentId) return [];
    return this.paymentsForSelected.filter(p => (p.semester || this.selectedSemester) === this.selectedSemester);
  }

  get pendingFeesForSelectedSemester(): FeeItem[] {
    if (!this.selectedStudentId) return [];
    return this.fees.filter(f => f.studentId === this.selectedStudentId && f.semester === this.selectedSemester);
  }

  sumPendingFees(): number {
    return this.pendingFeesForSelectedSemester.reduce((s, f) => s + f.amount, 0);
  }

  lastPayment(): Payment | undefined {
    const all = this.paymentsForSelected;
    if (!all || all.length === 0) return undefined;
    return all[all.length - 1];
  }

  totalPaid(): number {
    return this.paymentsForSelected.reduce((sum, p) => sum + p.amount, 0);
  }

  balance(): number {
    const s = this.selectedStudent;
    if (!s) return 0;
    return Math.max(0, s.feeDue - this.totalPaid());
  }

  addPayment(): void {
    if (!this.selectedStudentId) return;
    const amt = Number(this.newPayment.amount || 0);
    if (!amt || amt <= 0) {
      alert('Enter a valid payment amount');
      return;
    }
    const p: Payment = {
      id: this.nextPaymentId++,
      studentId: this.selectedStudentId,
      amount: amt,
      date: this.newPayment.date || new Date().toISOString().slice(0, 10),
      method: this.newPayment.method || 'Cash',
      note: this.newPayment.note,
      semester: this.newPayment.semester || this.selectedSemester
    };
    this.payments.unshift(p);
    // reset amount
    this.newPayment.amount = 0;
  }
  generateCsvReportForSelected(): void {
    if (!this.selectedStudentId) { alert('Select a student first'); return; }
    const student = this.selectedStudent!;
    const rows: string[] = [];
    // Minimal report: Semester, Fee Due and Fee Clear (no class or extra fields)
    rows.push(['Student Name', student.name].join(','));
    rows.push('');
    rows.push(['Semester', 'Fee Due', 'Fee Clear'].join(','));
    const paidThisSemester = this.paymentsForSelectedSemester().reduce((s, p) => s + p.amount, 0);
    const pendingThisSemester = this.pendingFeesForSelectedSemester.reduce((s, f) => s + f.amount, 0);
    const feeClear = paidThisSemester >= pendingThisSemester ? 'Yes' : 'No';
    rows.push([String(this.selectedSemester), student.feeDue.toString(), feeClear].map(v => this.escapeCsv(v)).join(','));

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const name = student.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `${name}_fee_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private escapeCsv(value: any): string {
    if (value == null) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

}
