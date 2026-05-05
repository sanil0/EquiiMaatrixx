import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface FeedbackForm {
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
  rating: number;
}

@Component({
  selector: 'app-suggestions-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './suggestions-feedback.component.html',
  styleUrls: ['./suggestions-feedback.component.css']
})
export class SuggestionsFeedbackComponent {
  form: FeedbackForm = {
    name: '',
    email: '',
    type: 'suggestion',
    subject: '',
    message: '',
    rating: 5
  };

  submitted = false;
  submitting = false;

  feedbackTypes = [
    { value: 'suggestion', label: 'Feature Suggestion' },
    { value: 'improvement', label: 'Improvement' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feedback', label: 'General Feedback' },
    { value: 'other', label: 'Other' }
  ];

  benefits = [
    {
      icon: '💡',
      title: 'Help Improve EquiMatrix',
      description: 'Your suggestions and feedback directly shape the future development of our platform.'
    },
    {
      icon: '🎯',
      title: 'Make a Real Impact',
      description: 'We carefully review all feedback and prioritize features that benefit our users most.'
    },
    {
      icon: '✅',
      title: 'Quick Response',
      description: 'Our product team reviews submissions regularly and updates are often implemented within sprints.'
    }
  ];

  featuredIdeas = [
    {
      title: 'Advanced Portfolio Analytics',
      description: 'Users requested detailed analytics dashboards for tracking equity portfolio performance and diversification strategies.',
      status: 'In Development',
      votes: 342
    },
    {
      title: 'Mobile App Support',
      description: 'High demand for mobile access to view awards, vesting schedules, and market updates on the go.',
      status: 'Planned',
      votes: 287
    },
    {
      title: 'Automated Tax Planning',
      description: 'AI-powered recommendations for optimal exercise timing to minimize tax liability.',
      status: 'In Development',
      votes: 215
    },
    {
      title: 'Integration with Popular Brokers',
      description: 'Seamless integration with major brokerage platforms for easier trading and settlement.',
      status: 'Planned',
      votes: 198
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

  onSubmit(): void {
    if (this.form.name && this.form.email && this.form.subject && this.form.message) {
      this.submitting = true;
      
      // Simulate form submission
      setTimeout(() => {
        this.submitting = false;
        this.submitted = true;
        
        // Reset form after 3 seconds
        setTimeout(() => {
          this.resetForm();
        }, 3000);
      }, 1500);
    }
  }

  resetForm(): void {
    this.form = {
      name: '',
      email: '',
      type: 'suggestion',
      subject: '',
      message: '',
      rating: 5
    };
    this.submitted = false;
  }

  isFormValid(): boolean {
    return !!(this.form.name && this.form.email && this.form.subject && this.form.message);
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'In Development':
        return 'bg-blue-100 text-blue-800';
      case 'Planned':
        return 'bg-purple-100 text-purple-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  }
}
