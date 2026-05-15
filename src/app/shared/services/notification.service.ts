import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  show(notification: Omit<Notification, 'id'>): void {
    const id = this.generateId();
    const fullNotification: Notification = {
      id,
      duration: 4000,
      ...notification
    };

    this.notificationSubject.next(fullNotification);

    // Auto-remove after duration
    if (fullNotification.duration) {
      setTimeout(() => {
        this.remove(id);
      }, fullNotification.duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show({ type: 'success', message, duration });
  }

  error(message: string, duration?: number): void {
    this.show({ type: 'error', message, duration: 6000 });
  }

  warning(message: string, duration?: number): void {
    this.show({ type: 'warning', message, duration });
  }

  info(message: string, duration?: number): void {
    this.show({ type: 'info', message, duration });
  }

  remove(id: string): void {
    // This would typically remove from a list, but for simplicity we just emit a removal event
    // In a full implementation, you'd maintain a list of active notifications
  }

  private generateId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
