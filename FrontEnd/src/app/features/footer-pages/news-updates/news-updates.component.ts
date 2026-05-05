import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-news-updates',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news-updates.component.html',
  styleUrls: ['./news-updates.component.css']
})
export class NewsUpdatesComponent {
  newsUpdates = [
    {
      id: 1,
      title: 'EquiMatrix Launches Advanced Tax Calculation Engine',
      date: '2026-04-25',
      category: 'Product Update',
      summary: 'New AI-powered tax calculation engine provides real-time, multi-jurisdiction tax estimates for equity transactions.',
      content: 'Our latest release introduces an advanced tax calculation engine that leverages machine learning to provide accurate, real-time tax estimates across multiple jurisdictions. This enhancement significantly reduces the time required for tax planning and ensures compliance with the latest tax regulations.',
      tags: ['Tax', 'AI', 'Compliance'],
      readTime: '3 min read'
    },
    {
      id: 2,
      title: 'Market Volatility: Impact on Equity Compensation',
      date: '2026-04-20',
      category: 'Market Insights',
      summary: 'Analysis of recent market fluctuations and their effects on stock-based compensation values.',
      content: 'Recent market volatility has impacted equity compensation values across the industry. Our analysis shows that companies with diversified vesting schedules have better retained talent during market downturns. Key insights include strategies for managing equity compensation during uncertain market conditions.',
      tags: ['Market', 'Volatility', 'Compensation'],
      readTime: '5 min read'
    },
    {
      id: 3,
      title: 'New SEC Regulations for Equity Reporting',
      date: '2026-04-15',
      category: 'Regulatory Update',
      summary: 'Updated SEC requirements for equity compensation disclosure and reporting.',
      content: 'The SEC has introduced new requirements for equity compensation disclosure. Companies must now provide more detailed reporting on equity grants, vesting schedules, and exercise activities. EquiMatrix has updated its compliance features to ensure full adherence to these new regulations.',
      tags: ['SEC', 'Compliance', 'Reporting'],
      readTime: '4 min read'
    },
    {
      id: 4,
      title: 'Employee Engagement Survey Results',
      date: '2026-04-10',
      category: 'Company News',
      summary: 'Latest survey shows 94% employee satisfaction with EquiMatrix equity management platform.',
      content: 'Our annual employee engagement survey reveals that 94% of users are satisfied with the EquiMatrix platform. Key highlights include improved transparency in equity tracking, faster exercise processing, and better communication of vesting milestones.',
      tags: ['Survey', 'Engagement', 'Satisfaction'],
      readTime: '2 min read'
    },
    {
      id: 5,
      title: 'Q1 2026 Market Performance Report',
      date: '2026-04-05',
      category: 'Market Report',
      summary: 'Comprehensive analysis of equity market performance and trends in Q1 2026.',
      content: 'Q1 2026 saw mixed performance across equity markets with technology stocks showing resilience. Our report analyzes sector-specific trends, IPO activity, and the impact of interest rate changes on equity valuations. Key findings include increased M&A activity in the tech sector.',
      tags: ['Q1', 'Market', 'Performance'],
      readTime: '6 min read'
    },
    {
      id: 6,
      title: 'Enhanced Security Features Released',
      date: '2026-03-28',
      category: 'Security Update',
      summary: 'New security enhancements including biometric authentication and advanced encryption.',
      content: 'EquiMatrix has implemented advanced security features including biometric authentication, end-to-end encryption, and real-time threat monitoring. These enhancements ensure the highest level of data protection for sensitive equity information.',
      tags: ['Security', 'Encryption', 'Authentication'],
      readTime: '3 min read'
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}