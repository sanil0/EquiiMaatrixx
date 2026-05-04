import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-key-features',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './key-features.component.html',
  styleUrls: ['./key-features.component.css']
})
export class KeyFeaturesComponent {
  features = [
    {
      title: 'Award Management',
      description: 'Streamlined creation and management of stock awards and equity incentives.',
      icon: '🏆',
      details: [
        'Create and manage multiple award types',
        'Bulk award processing',
        'Award lifecycle tracking',
        'Integration with HR systems'
      ]
    },
    {
      title: 'Vesting Schedules',
      description: 'Automated tracking and calculation of vesting schedules.',
      icon: '📅',
      details: [
        'Flexible vesting schedule configurations',
        'Automatic cliff and graded vesting',
        'Vesting milestone notifications',
        'Historical vesting data'
      ]
    },
    {
      title: 'Tax Calculations',
      description: 'Accurate tax estimation and detailed tax information for equity-related events.',
      icon: '💰',
      details: [
        'Real-time tax calculations',
        'Multi-jurisdiction tax support',
        'Tax withholding automation',
        'Detailed tax reporting'
      ]
    },
    {
      title: 'Employee Self-Service',
      description: 'Intuitive dashboard for employees to view their awards and make exercise requests.',
      icon: '👤',
      details: [
        'Personal equity dashboard',
        'Exercise request workflow',
        'Document management',
        'Real-time portfolio tracking'
      ]
    },
    {
      title: 'Admin Controls',
      description: 'Comprehensive administrative tools for managing company-wide equity programs.',
      icon: '⚙️',
      details: [
        'Role-based access control',
        'Bulk operations',
        'Advanced reporting',
        'System configuration'
      ]
    },
    {
      title: 'Audit & Compliance',
      description: 'Complete audit logs and compliance tracking for regulatory requirements.',
      icon: '🔒',
      details: [
        'Comprehensive audit trails',
        'Regulatory compliance reporting',
        'Data security and encryption',
        'GDPR and SOX compliance'
      ]
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
}