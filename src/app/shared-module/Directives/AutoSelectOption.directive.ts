import { Directive, AfterViewInit, ElementRef } from '@angular/core';
import { MatSelect } from '@angular/material/select';

@Directive({
  selector: '[autoSelect]'
})
export class AutoSelectOptionDirective implements AfterViewInit {

  constructor(private matSelect: MatSelect) { }

  ngAfterViewInit() {

    // Nos suscribimos a los cambios en las opciones
    this.matSelect.options.changes.subscribe(() => {
       
      if (this.matSelect.options.length === 1) {
        // Si solo hay una opción, la seleccionamos
        this.matSelect.writeValue(this.matSelect.options.first.value);
        this.matSelect._onChange(this.matSelect.options.first.value);
      }
    });
  }
}
