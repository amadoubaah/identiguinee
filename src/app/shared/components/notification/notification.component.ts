import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  notifications = signal<Notification[]>([]);

  constructor(private notificationService: NotificationService) {
    this.notificationService.notifications$.subscribe(notification => {
      this.addNotification(notification);
    });
  }

  private addNotification(notification: Notification): void {
    this.notifications.update(current => [...current, notification]);
  }

  removeNotification(id: string): void {
    this.notifications.update(current => current.filter(n => n.id !== id));
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  }

  getNotificationClass(type: string): string {
    return `notification-${type}`;
  }
}
