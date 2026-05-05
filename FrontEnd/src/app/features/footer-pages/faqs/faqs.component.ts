import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FAQsComponent {
  expandedId: number | null = null;

  faqs: FAQ[] = [
    {
      id: 1,
      category: 'Getting Started',
      question: 'What is EquiMatrix?',
      answer: 'EquiMatrix is a comprehensive equity management platform designed to simplify stock option management for companies and employees. It provides tools for award management, vesting schedule tracking, tax calculations, and employee self-service capabilities.'
    },
    {
      id: 2,
      category: 'Getting Started',
      question: 'How do I log in to EquiMatrix?',
      answer: 'You can log in using your email and password on the EquiMatrix login page. Select your user type (Admin or Employee) and enter your credentials. If you forget your password, use the "Forgot Password" option to reset it.'
    },
    {
      id: 3,
      category: 'Getting Started',
      question: 'What are the system requirements?',
      answer: 'EquiMatrix is a cloud-based platform accessible through any modern web browser (Chrome, Firefox, Safari, Edge). No software installation is required. You need an active internet connection and a valid EquiMatrix account.'
    },
    {
      id: 4,
      category: 'Awards & Grants',
      question: 'How do I view my stock awards?',
      answer: 'As an employee, log into your dashboard and navigate to the "Awards" section. You\'ll see all your current and historical awards with details including grant date, vesting schedule, and current value.'
    },
    {
      id: 5,
      category: 'Awards & Grants',
      question: 'What types of awards does EquiMatrix support?',
      answer: 'EquiMatrix supports various award types including Stock Options (NSOs and ISOs), Restricted Stock Units (RSUs), Restricted Stock Awards (RSAs), and Performance Stock Units (PSUs). Each type can be customized with specific vesting schedules and terms.'
    },
    {
      id: 6,
      category: 'Awards & Grants',
      question: 'Can I transfer my awards to another person?',
      answer: 'Award transfer policies depend on your company\'s equity plan rules. Contact your HR or Finance department for information about transfer eligibility and procedures. Certain awards may have restrictions on transferability.'
    },
    {
      id: 7,
      category: 'Vesting & Exercise',
      question: 'What is a vesting schedule?',
      answer: 'A vesting schedule defines when you gain the right to own or exercise your equity awards. Common schedules include cliff vesting (example: 1-year cliff with 4-year vesting) and graded vesting. Check your award details for your specific schedule.'
    },
    {
      id: 8,
      category: 'Vesting & Exercise',
      question: 'How do I exercise my stock options?',
      answer: 'To exercise options, log into your EquiMatrix dashboard, navigate to "My Awards," find the options you wish to exercise, and submit an exercise request. Your company will process the request and guide you through the purchase process.'
    },
    {
      id: 9,
      category: 'Vesting & Exercise',
      question: 'What happens to my vested awards if I leave the company?',
      answer: 'Upon departure, your vesting typically terminates, and you retain only the awards already vested. Depending on your plan, you may have a limited time to exercise vested options. Contact your HR department for post-termination exercise windows.'
    },
    {
      id: 10,
      category: 'Tax Information',
      question: 'How does EquiMatrix calculate taxes on my awards?',
      answer: 'EquiMatrix uses real-time market data and tax algorithms to calculate estimated taxes based on your location and award type. Tax implications vary for different award types (options vs. RSUs). This is an estimate; consult a tax professional for advice.'
    },
    {
      id: 11,
      category: 'Tax Information',
      question: 'What is tax withholding and how does it work?',
      answer: 'Tax withholding involves setting aside funds to cover estimated tax obligations when you exercise options or receive RSU vesting. EquiMatrix helps you understand withholding requirements and can facilitate withholding through your company\'s payroll.'
    },
    {
      id: 12,
      category: 'Tax Information',
      question: 'Do I need to file additional tax forms for my equity awards?',
      answer: 'Depending on your award type and jurisdiction, you may need to file forms such as Form 3921 (ISO information), Form 3922 (ESPP information), or report on your standard tax return. Consult a tax professional for your specific situation.'
    },
    {
      id: 13,
      category: 'Admin & Company',
      question: 'How do I manage employee awards as an administrator?',
      answer: 'As an admin, access the Admin Dashboard to manage awards, employees, and vesting schedules. You can create bulk awards, monitor vesting events, generate compliance reports, and track all equity transactions in your system.'
    },
    {
      id: 14,
      category: 'Admin & Company',
      question: 'Can EquiMatrix integrate with our HR or payroll systems?',
      answer: 'Yes, EquiMatrix offers integration capabilities with popular HR and payroll systems. Contact our support team to discuss integration options and setup for your specific systems.'
    },
    {
      id: 15,
      category: 'Admin & Company',
      question: 'How is equity data secured and backed up?',
      answer: 'EquiMatrix uses enterprise-grade security including end-to-end encryption, biometric authentication, and regular security audits. Data is automatically backed up and replicated across secure data centers to ensure continuity.'
    },
    {
      id: 16,
      category: 'Account & Support',
      question: 'How do I reset my password?',
      answer: 'On the login page, click "Forgot Password" and enter your email. You\'ll receive a password reset link. Follow the instructions in the email to create a new password. If you don\'t receive the email, check your spam folder.'
    },
    {
      id: 17,
      category: 'Account & Support',
      question: 'How do I contact customer support?',
      answer: 'You can reach our support team at support@equimatrix.com or through the "Contact Support" option in the Help section. For urgent issues, call our dedicated support hotline during business hours.'
    },
    {
      id: 18,
      category: 'Account & Support',
      question: 'What should I do if I notice an error in my award information?',
      answer: 'Report any discrepancies immediately to your HR department or company administrator. They can review and correct the information in EquiMatrix. For data security reasons, employees cannot directly edit their award details.'
    }
  ];

  categories = [...new Set(this.faqs.map(faq => faq.category))];
  selectedCategory: string | null = null;

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

  toggleFAQ(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  filterFAQs(): FAQ[] {
    return this.selectedCategory
      ? this.faqs.filter(faq => faq.category === this.selectedCategory)
      : this.faqs;
  }
}
