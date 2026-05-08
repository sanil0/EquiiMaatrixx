import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ContactService } from '../../../core/services/contact.service';

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
  errorMessage = '';

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
    }
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private contactService: ContactService
  ) {
    // Auto-fill email if authenticated
    const userEmail = this.auth.getUserEmail();
    if (userEmail) {
      this.form.email = userEmail;
    }
  }

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
    if (this.isFormValid()) {
      this.submitting = true;
      this.errorMessage = '';

      this.contactService.submitContact({
        name: this.form.name,
        email: this.form.email,
        category: this.form.category,
        subject: this.form.subject,
        message: this.form.message
      }).subscribe({
        next: (response) => {
          this.submitting = false;
          if (response.success) {
            this.submitted = true;
            window.scrollTo(0, 0);
            // Reset form after 5 seconds
            setTimeout(() => {
              this.resetForm();
            }, 5000);
          } else {
            this.errorMessage = response.message || 'An error occurred. Please try again.';
          }
        },
        error: (error) => {
          this.submitting = false;
          console.error('Error submitting contact:', error);
          this.errorMessage = error.error?.message || 'Failed to submit contact request. Please try again.';
        }
      });
    }
  }

  resetForm(): void {
    this.form = {
      name: '',
      email: this.auth.getUserEmail() || '',
      subject: '',
      category: 'general',
      message: ''
    };
    this.submitted = false;
    this.errorMessage = '';
  }

  isFormValid(): boolean {
    return !!(this.form.name && this.form.subject && this.form.message);
  }
}
