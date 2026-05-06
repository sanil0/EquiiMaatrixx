import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { FormsModule } from '@angular/forms';
import { NgClass, CommonModule } from '@angular/common';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgClass, CommonModule, ForgotPasswordModalComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  @ViewChild(ForgotPasswordModalComponent) forgotPasswordModal!: ForgotPasswordModalComponent;

  email: string = '';
  password: string = '';
  selectedRole: string = 'Employee';  // Important: capital E
  warningMessage: string | null = null;

  constructor(private auth: AuthService, private router: Router, private toastService: ToastService) {}

  ngOnInit(): void {
    const message = localStorage.getItem('sessionExpiredMessage');
    if (message) {
      this.warningMessage = message;
      localStorage.removeItem('sessionExpiredMessage');
    }
  }

  onLogin() {
    this.auth.login(this.email, this.password, this.selectedRole)
      .subscribe({
        next: (res: LoginResponse) => {
          // Validate that the returned role matches the selected role
          if (res.role !== this.selectedRole) {
            this.toastService.warning(`You do not have ${this.selectedRole} privileges. Please select the correct role.`);
            return;
          }

          this.auth.saveToken(res.token);

          if (this.selectedRole === 'Admin') {
            this.router.navigate(['/admin'], { replaceUrl: true });
          } else if (this.selectedRole === 'Employee') {
            this.router.navigate(['/employee'], { replaceUrl: true });
          }
        },
        error: () => {
          this.toastService.error("Invalid Credentials");
        }
      });
  }

  openForgotPasswordModal() {
    this.forgotPasswordModal.open();
  }
}