import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CartaPorteService } from '../../../../../Services/CartaPorteService';
import { Sustitucion } from '../../../../../../models/ti/cfdi/sustitucion';

@Component({
  selector: 'app-docRelacionados',
  templateUrl: './docRelacionados.component.html',
  styleUrls: ['./docRelacionados.component.css']
})
export class DocRelacionadosComponent implements OnInit {
  dataSourceSustituciones = new MatTableDataSource<Sustitucion>([]);
  displayedColumnsSustituciones: string[] = ['noGuia', 'compania', 'motivoRelacion', 'numGuia', 'uuid'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private cartaPorteService: CartaPorteService) {}

  ngOnInit() {
    this.cartaPorteService.cartaPorte$.subscribe(cartaPorte => {
      if (cartaPorte.cartaPorteSustituciones) {
        this.dataSourceSustituciones.data = cartaPorte.cartaPorteSustituciones;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSourceSustituciones.paginator = this.paginator;
  }
}
