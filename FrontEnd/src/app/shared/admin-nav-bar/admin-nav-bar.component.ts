import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService, Notification } from '../../core/services/notification.service';

@Component({
  selector: 'app-admin-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-nav-bar.component.html',
  styleUrls: ['./admin-nav-bar.component.css']
})
export class AdminNavBarComponent implements OnInit {
  @Output() menuItemClick = new EventEmitter<void>();
  unreadNotificationCount = 0;

  constructor(
    private auth: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadUnreadNotifications();
  }

  loadUnreadNotifications() {
    this.notificationService.getNotifications().subscribe({
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