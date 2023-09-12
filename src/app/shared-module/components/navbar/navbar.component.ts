import { Component, OnInit } from '@angular/core';
import { GeneralParametersService } from '../../services/general-parameters.service';
import { AuthService } from '../../../security/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit  {
  public username: string | null = null;
  public menuItems: any[] = [];

  constructor(
    private generalParametersService: GeneralParametersService, 
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.username = this.authService.usuario;
    this.menuItems = this.authService.menuItems;

    this.authService.usernameChanged.subscribe(
      (newUsername: string | null) => {
        this.username = newUsername;
      }
    );

    this.authService.menuItemsChanged.subscribe(
      (newMenuItems: any[]) => {
        this.menuItems = newMenuItems;
      }
    );
  }

  onCompanyChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.generalParametersService.selectCompany(selectElement.value);
  }

  hasSubItems(parentId: number): boolean {
    return this.menuItems.some(item => item.IdPadre === parentId);
  }
}
