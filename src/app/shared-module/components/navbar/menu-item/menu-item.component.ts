// En tu archivo menu-item.component.ts
import { Component, Input } from '@angular/core';
import { Menu } from '../../../../security/models/Menu';
@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent {
  @Input() items: Menu[] = [];

  getChildMenu(item: any): string {

    // Aquí generamos un ID único para cada menú basado en alguna propiedad única
    return 'menu_' + item.idMenu;
  }
}
