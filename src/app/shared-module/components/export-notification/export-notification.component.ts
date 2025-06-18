import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExportNotificationService, ExportStatus } from '../../services/export-notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-export-notification',
  templateUrl: './export-notification.component.html',
  styleUrls: ['./export-notification.component.css']
})
export class ExportNotificationComponent implements OnInit, OnDestroy {
  exportStatus: ExportStatus = {
    isExporting: false,
    activeJobs: [],
    showNotification: false
  };
  
  private subscription: Subscription | null = null;

  constructor(private exportNotificationService: ExportNotificationService) { }

  ngOnInit(): void {
    this.subscription = this.exportNotificationService.exportStatus$.subscribe(status => {
      this.exportStatus = status;
    });
  }

  hideNotification(): void {
    this.exportNotificationService.hideNotification();
  }

  trackByJobId(index: number, job: any): string {
    return job.id;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
} 