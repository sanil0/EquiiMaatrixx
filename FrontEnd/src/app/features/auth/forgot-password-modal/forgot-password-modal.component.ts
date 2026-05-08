import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordService } from '../../../core/services/forgot-password.service';

@Component({
  selector: 'app-forgot-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.css']
})
export class ForgotPasswordModalComponent {
  isOpen = false;
  currentStep: 'email' | 'otp' | 'password' = 'email';

  // Step 1: Email
  email = '';

  // Step 2: OTP
  otp = '';

  // Step 3: Password Reset
  newPassword = '';
  confirmPassword = '';
  verificationToken = '';

  // UI States
  loading = false;
  error = '';
  success = '';
  isPasswordVisible = false;
  isConfirmPasswordVisible = false;

  constructor(private forgotPasswordService: ForgotPasswordService) { }

  // Open modal
  open() {
    this.isOpen = true;
    this.resetForm();
  }

  // Close modal
  close() {
    this.isOpen = false;
    this.resetForm();
  }

  // Reset form
  resetForm() {
    this.currentStep = 'email';
    this.email = '';
    this.otp = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.verificationToken = '';
    this.error = '';
    this.success = '';
    this.loading = false;
  }

  // Send OTP to email
  sendOtp() {
    this.error = '';
    this.success = '';

    if (!this.email || !this.isValidEmail(this.email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    this.loading = true;
    this.forgotPasswordService.sendOtp(this.email).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Send OTP Response:', response);
        if (response.success) {
          this.success = response.message;
          setTimeout(() => {
            this.currentStep = 'otp';
            this.success = '';
          }, 1500);
        } else {
          this.error = response.message || 'Failed to send OTP. Please try again.';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Send OTP Error:', error);
        if (error.status === 404) {
          this.error = 'Email not found or not registered.';
        } else {
          this.error = error.error?.message || error.message || 'Failed to send OTP. Please try again.';
        }
      }
    });
  }

  // Verify OTP
  verifyOtp() {
    this.error = '';
    this.success = '';

    if (!this.otp || this.otp.length !== 6) {
      this.error = 'OTP must be 6 digits';
      return;
    }

    this.loading = true;
    this.forgotPasswordService.verifyOtp(this.email, this.otp).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.verificationToken = response.verificationToken;
          this.success = response.message;
          setTimeout(() => {
            this.currentStep = 'password';
            this.success = '';
          }, 1500);
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Invalid OTP. Please try again.';
      }
    });
  }

  // Reset password
  resetPassword() {
    this.error = '';
    this.success = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.newPassword.length < 8) {
      this.error = 'Password must be at least 8 characters long';
      return;
    }

    this.loading = true;
    const request = {
      email: this.email,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
      verificationToken: this.verificationToken
    };

    this.forgotPasswordService.resetPassword(request).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.success = response.message;
          setTimeout(() => {
            this.close();
          }, 2000);
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Failed to reset password. Please try again.';
      }
    });
  }

  // Go back to previous step
  goBack() {
    if (this.currentStep === 'otp') {
      this.currentStep = 'email';
      this.otp = '';
    } else if (this.currentStep === 'password') {
      this.currentStep = 'otp';
      this.newPassword = '';
      this.confirmPassword = '';
      this.verificationToken = '';
    }
    this.error = '';
    this.success = '';
  }

  // Helper: Validate email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }
}
