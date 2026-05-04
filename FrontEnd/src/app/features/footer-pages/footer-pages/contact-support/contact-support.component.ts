import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact-support.component.html',
  styleUrls: ['./contact-support.component.css']
})
export class ContactSupportComponent {
  form: ContactForm = {
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  };

  submitted = false;
  submitting = false;

  categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'awards', label: 'Awards & Grants' },
    { value: 'vesting', label: 'Vesting & Exercise' },
    { value: 'tax', label: 'Tax Information' },
    { value: 'account', label: 'Account & Security' },
    { value: 'other', label: 'Other' }
  ];

  supportChannels = [
    {
      title: 'Email Support',
      description: 'Send us an email for detailed inquiries',
      contact: 'support@equimatrix.com',
      icon: '✉️'
    },
    {
      title: 'Phone Support',
      description: 'Call our dedicated support hotline',
      contact: '+1 (800) 555-0123',
      icon: '📞',
      availability: 'Mon-Fri, 9 AM - 6 PM EST'
    },
    // {
    //   title: 'Live Chat',
    //   description: 'Chat with our support team in real-time',
    //   contact: 'Available on dashboard',
    //   icon: '💬',
    //   availability: 'Mon-Fri, 10 AM - 5 PM EST'
    // }
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
      subject: '',
      category: 'general',
      message: ''
    };
    this.submitted = false;
  }

  isFormValid(): boolean {
    return !!(this.form.name && this.form.email && this.form.subject && this.form.message);
  }
}
