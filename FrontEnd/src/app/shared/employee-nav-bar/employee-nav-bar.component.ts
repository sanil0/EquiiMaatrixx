import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { EmployeeService, EmployeeProfile } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService, Notification } from '../../core/services/notification.service';

@Component({
  selector: 'app-employee-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './employee-nav-bar.component.html'
})
export class EmployeeNavBarComponent implements OnInit {
  @Output() menuItemClick = new EventEmitter<void>();

  employeeName = 'Loading...';
  unreadNotificationCount = 0;

  constructor(
    private employeeService: EmployeeService,
    private auth: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadEmployeeProfile();
    this.loadUnreadNotifications();
  }

  loadEmployeeProfile() {
    this.employeeService.getMyProfile().subscribe({
      next: (profile: EmployeeProfile) => {
        // Use the name from database
        this.employeeName = profile.empName || 'Employee';
      },
      error: (error) => {
        console.error('Failed to load employee profile from database:', error);
        // Fallback to JWT token name
        const tokenName = this.auth.getUserName();
        this.employeeName = tokenName || 'Employee';
      }
    });
  }

  loadUnreadNotifications() {
    this.notificationService.getMyNotifications().subscribe({
      next: (notifications: Notification[]) => {
        this.unreadNotificationCount = notifications.filter(n => !n.is_Read).length;
      },
      error: (error) => {
        console.error('Failed to load notifications:', error);
        this.unreadNotificationCount = 0;
      }
    });
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  onMenuItemClick() {
    this.menuItemClick.emit();
  }
}