import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface TaxInfo {
  title: string;
  awardType: string;
  grantTax: string;
  exerciseTax: string;
  saleTax: string;
  forms: string[];
}

@Component({
  selector: 'app-tax-information',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tax-information.component.html',
  styleUrls: ['./tax-information.component.css']
})
export class TaxInformationComponent {
  expandedId: number | null = null;

  awardTypes: TaxInfo[] = [
    {
      title: 'Stock Options - NSOs (Non-Qualified Stock Options)',
      awardType: 'NSO',
      grantTax: 'No tax at grant',
      exerciseTax: 'Taxable income = (Fair Market Value - Exercise Price) × Number of Shares',
      saleTax: 'Capital gains tax on difference between sale price and FMV at exercise',
      forms: ['Form W-2', 'Form 8949 (Sale of Securities)']
    },
    {
      title: 'Stock Options - ISOs (Incentive Stock Options)',
      awardType: 'ISO',
      grantTax: 'No tax at grant',
      exerciseTax: 'No regular income tax (potential AMT)',
      saleTax: 'Long-term capital gains if held 2+ years from grant, 1+ year from exercise',
      forms: ['Form 3921', 'Form 8949 (if applicable)']
    },
    {
      title: 'Restricted Stock Units (RSUs)',
      awardType: 'RSU',
      grantTax: 'No tax at grant (unless 83(b) election made)',
      exerciseTax: 'Ordinary income tax at vesting = FMV at vesting × Number of Shares',
      saleTax: 'Capital gains tax on difference between sale price and FMV at vesting',
      forms: ['Form W-2', 'Form 3921', 'Form 8949']
    },
    {
      title: 'Restricted Stock Awards (RSAs)',
      awardType: 'RSA',
      grantTax: 'Ordinary income tax if no 83(b) election (= FMV × Shares)',
      exerciseTax: 'N/A - dividends taxed as ordinary income during restriction period',
      saleTax: 'Capital gains tax on difference between sale price and FMV (or grant price if 83(b) filed)',
      forms: ['Form W-2', 'Form 8949', '83(b) election (if applicable)']
    },
    {
      title: 'Performance Stock Units (PSUs)',
      awardType: 'PSU',
      grantTax: 'No tax at grant',
      exerciseTax: 'Ordinary income tax at vesting = FMV at vesting × Shares Earned',
      saleTax: 'Capital gains tax on difference between sale price and FMV at vesting',
      forms: ['Form W-2', 'Form 8949']
    }
  ];

  taxResources = [
    {
      category: 'IRS Forms',
      items: [
        { name: 'Form W-2', description: 'Wage and Tax Statement - reports income and taxes withheld' },
        { name: 'Form 3921', description: 'Exercise of an Incentive Stock Option Under Section 422(b)' },
        { name: 'Form 3922', description: 'Transfer of Stock Acquired Through an Employee Stock Purchase Plan (ESPP)' },
        { name: 'Form 8949', description: 'Sales of Securities or Other Assets' }
      ]
    }
  ];

  taxConcepts = [
    {
      title: 'Ordinary Income vs. Capital Gains',
      explanation: 'Ordinary income (like wages) is taxed at your regular tax bracket. Long-term capital gains receive preferential tax treatment if held for 1+ year (depending on award type). Short-term capital gains are taxed as ordinary income.'
    },
    {
      title: 'Tax Withholding',
      explanation: 'When you exercise or vest, your employer typically withholds taxes through payroll. You can choose different withholding methods (cashless exercise, net share settlement, etc.). Verify your withholding preferences with your HR department.'
    },
    {
      title: 'Alternative Minimum Tax (AMT)',
      explanation: 'ISOs can trigger AMT if the spread (FMV - Exercise Price) is large. AMT may result in higher taxes in the year of exercise, but you can claim a credit in later years. Track your ISO exercises carefully if subject to AMT.'
    },
    {
      title: 'Wash Sale Rule',
      explanation: 'You cannot claim a loss on stock if you buy substantially identical stock within 30 days before or after the sale. Be careful when selling securities at a loss and purchasing similar stock.'
    },
    {
      title: '83(b) Election',
      explanation: 'For RSAs and other restricted property, you can file an 83(b) election to start your holding period immediately. This accelerates ordinary income recognition but may provide capital gains benefits later. Consult a tax professional.'
    },
    {
      title: 'Section 409A',
      explanation: 'Deferred equity awards must comply with Section 409A to avoid penalties and immediate taxation. Most standard equity awards comply, but custom arrangements may have implications. Contact your company if you have non-standard awards.'
    }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  backToDashboard(): void {
    const role = this.auth.getUserRole();

    if (role === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'Employee') {
      this.router.navigate(['/employee']);
    } else {
      this.router.navigate(['/']);
    }
  }

  goToContactSupport(): void {
    this.router.navigate(['/contact-support']);
  }

  toggleAwardType(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }
}
