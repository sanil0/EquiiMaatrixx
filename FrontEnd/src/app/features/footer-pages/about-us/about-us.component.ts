import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  companyDetails = {
    name: 'EquiMatrix',
    description: 'A comprehensive equity management platform designed to simplify stock option management for companies and employees.',
    mission: 'To empower organizations and their employees with transparent, efficient equity management solutions.',
    vision: 'To become the leading platform for equity administration and employee financial wellness.',
    founded: '2024',
    headquarters: 'Global'
  };

  features = [
    {
      title: 'Award Management',
      description: 'Streamlined creation and management of stock awards and equity incentives.'
    },
    {
      title: 'Vesting Schedules',
      description: 'Automated tracking and calculation of vesting schedules.'
    },
    {
      title: 'Tax Calculations',
      description: 'Accurate tax estimation and detailed tax information for equity-related events.'
    },
    {
      title: 'Employee Self-Service',
      description: 'Intuitive dashboard for employees to view their awards and make exercise requests.'
    },
    {
      title: 'Admin Controls',
      description: 'Comprehensive administrative tools for managing company-wide equity programs.'
    },
    {
      title: 'Audit & Compliance',
      description: 'Complete audit logs and compliance tracking for regulatory requirements.'
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
