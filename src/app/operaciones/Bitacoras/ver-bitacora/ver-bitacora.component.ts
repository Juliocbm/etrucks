import { Component, OnInit } from '@angular/core';
import { Bitacora } from 'src/app/models/Serv. Cliente/Bitacora';
import { ServCliService } from '../../serv-cli.service';
import { Router } from '@angular/router';
import { Clientes } from 'src/app/models/Serv. Cliente/Clientes';
import { Flotas } from 'src/app/models/Serv. Cliente/Flotas';
import { ApiOperadoresApiService } from 'src/app/DataAccess/OperadorApp/api-operadores-api.service';
import { StorageService } from 'src/app/Services/StorageService';

@Component({
  selector: 'app-ver-bitacora',
  templateUrl: './ver-bitacora.component.html',
  styleUrls: ['./ver-bitacora.component.css'],
})
export class VerBitacoraComponent implements OnInit {
  bitacora: any;

  // Catalogos
   clientes: Clientes[] = [];
   flotas: Flotas[] = [];

  idCompania: number = parseInt(localStorage.getItem('CompaniaSelect') || '0');

  constructor(
    private service: ServCliService, // Cambiado de tramoService: TramoService
    private apiService: ApiOperadoresApiService,
    private storageService: StorageService<Bitacora>,
    private router: Router
  ) {
    this.bitacora = new Bitacora();
    this.idCompania = parseInt(localStorage.getItem('CompaniaSelect') || '0');

    // console.log("Bitacora en ver-bitacora: ", this.bitacora);
    console.log("idCompania en ver-bitacora: ", this.idCompania);
  }

  ngOnInit(): void {
    this.obtenerCatalogos();
    this.storageService.init('bitacoraActual');

    this.storageService.itemActual.subscribe(bitacora => {
      if (bitacora) {
        this.bitacora = bitacora;
        // Ordenar los registros de la bitacora por idBitacoraMov
        this.bitacora.bitacoraMov = this.bitacora.bitacoraMov.sort((a: any, b: any) => a.idBitacoraMov - b.idBitacoraMov);
        console.log("Bitacora en ver-bitacora: ", this.bitacora);
      } else {
        console.log("Al no haber un elemento en guardado en sesion, debemos redirigir a otra pantalla o mostrar mensaje.");
      }
    });
  }

  goToEditarRegistroGeneral() {
    this.service.changeRegistroBitacoraSource(this.bitacora);
    this.router.navigate(['/Bitacoras-Muleros/editar']);
  }

  regresar() {
    this.router.navigate(['/Bitacoras-Muleros']);
  }

  // Catalogos
  obtenerCatalogos(): void {
    this.apiService.obtenerCatalogosGeneralCliente(this.idCompania).subscribe(
      (data) => {
        this.clientes = data;
      }
    );

    this.apiService.obtenerCatalogosGeneralFlotas(this.idCompania).subscribe(
      (data) => {
        this.flotas = data;
      }
    );
  }

  // Consulta del cliente
  obtenerCliente(id: number): string {
    let cliente = this.clientes.find((x) => x.idCliente === id);
    return cliente?.nombre ?? id.toString() ;
  }

  // Consulta de la flota
  obtenerFlota(id: number): string {
    let flota = this.flotas.find((x) => x.idFlota === id);
    return flota?.nombre ?? id.toString() ;
  }


}
