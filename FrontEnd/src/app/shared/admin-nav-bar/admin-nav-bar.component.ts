import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService, Notification } from '../../core/services/notification.service';
import { NotificationCountService } from '../../core/services/notification-count.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-nav-bar.component.html',
  styleUrls: ['./admin-nav-bar.component.css']
})
export class AdminNavBarComponent implements OnInit, OnDestroy {
  @Output() menuItemClick = new EventEmitter<void>();
  unreadNotificationCount = 0;

  private notificationRefreshSub?: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private notificationCountService: NotificationCountService
  ) {}

  ngOnInit() {
    this.loadUnreadNotifications();
    this.notificationRefreshSub = this.notificationCountService.refresh$.subscribe(() => {
      this.loadUnreadNotifications();
    });
  }

  ngOnDestroy() {
    this.notificationRefreshSub?.unsubscribe();
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