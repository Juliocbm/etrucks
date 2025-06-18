import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../../Services/StorageService';
import { Personal } from 'src/app/models/RH/personal';

@Component({
  selector: 'app-ver-personal',
  templateUrl: './ver-personal.component.html',
  styleUrls: ['./ver-personal.component.css']
})
export class VerPersonalComponent {
  personal: Personal = new Personal();

  constructor(private storageService: StorageService<Personal>) {

  }

  ngOnInit() {
    this.storageService.init('personalActual');

    this.storageService.itemActual.subscribe(personal => {
      if (personal) {
        this.personal = personal;
      } else {
        console.log("Al no haber un elemento en guardado en sesion, debemos redirigir a otra pantalla o mostrar mensaje.");
      }
    });
  }
}
