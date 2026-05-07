import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ToastContainerComponent } from './shared/toast-container/toast-container.component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'FrontEnd';

  private idleTimerId: ReturnType<typeof setTimeout> | null = null;
  private readonly idleTimeout = 5 * 60 * 1000; // 5 minutes for testing, change to 15 * 60 * 1000 later
  private readonly idleEvents = ['click', 'keydown', 'touchstart'];
  private sessionExpired = false;
  private routerSubscription: Subscription | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.startIdleTracking();
    this.setupScrollToTop();
  }

  ngOnDestroy(): void {
    this.stopIdleTracking();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private setupScrollToTop(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  }

  private startIdleTracking(): void {
    this.resetIdleTimer();
    this.idleEvents.forEach((eventName) =>
      window.addEventListener(eventName, this.activityHandler)
    );
  }

  private stopIdleTracking(): void {
    if (this.idleTimerId !== null) {
      clearTimeout(this.idleTimerId);
      this.idleTimerId = null;
    }
    this.idleEvents.forEach((eventName) => {
      window.removeEventListener(eventName, this.activityHandler);
    });
  }

  private activityHandler = (): void => {
    if (this.sessionExpired) {
      this.navigateToLoginOnExpiration();
      return;
    }
    // Always reset timer if authenticated
    if (this.auth.isAuthenticated()) {
      this.resetIdleTimer();
    }
  };

  private resetIdleTimer(): void {
    if (this.idleTimerId !== null) {
      clearTimeout(this.idleTimerId);
    }
    if (!this.auth.isAuthenticated()) {
      this.idleTimerId = null;
      return;
    }
    this.idleTimerId = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.idleTimeout);
  }

  private handleSessionTimeout(): void {
    if (!this.auth.isAuthenticated()) {
      this.stopIdleTracking();
      return;
    }

    localStorage.setItem('sessionExpiredMessage', 'Your session has expired due to inactivity. Please log in again.');
    this.auth.logout();
    this.sessionExpired = true;
    this.idleTimerId = null;
  }

  private navigateToLoginOnExpiration(): void {
    this.stopIdleTracking();
    this.router.navigate(['']);
  }
}
