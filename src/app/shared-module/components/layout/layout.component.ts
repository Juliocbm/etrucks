import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  @Input() titulo: string = '';
  breadcrumbs: string[] = [];
 
  constructor(
    private location: Location,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.breadcrumbs = this.router.url.split('/').filter(breadcrumb => breadcrumb !== '');
    });
  }
  
  goBack() {
    this.location.back();
  }
}
