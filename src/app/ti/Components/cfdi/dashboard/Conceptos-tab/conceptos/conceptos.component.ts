import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CartaPorteService } from '../../../../../Services/CartaPorteService';
import { Concepto } from '../../../../../../models/ti/cfdi/concepto';

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.css']
})
export class ConceptosComponent implements OnInit {
  dataSourceConceptos = new MatTableDataSource<Concepto>([]);
  displayedColumnsConceptos: string[] = [
     'id', 
    'cantidad',
    'importe',
    'descripcion',
    'factorIva',
    'factorRetencion',
    'claveProdServ',
    'cpeNoIdentificador',
    'editar'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private cartaPorteService: CartaPorteService) {}

  ngOnInit() {
    this.cartaPorteService.cartaPorte$.subscribe(cartaPorte => {
      if (cartaPorte.cartaPorteDetalles) {
        this.dataSourceConceptos.data = cartaPorte.cartaPorteDetalles.map(concepto => ({
          ...concepto,
          editable: false,  
          errores: {}
        }));
      }
      this.validarConceptos();
    });
  }

  ngAfterViewInit() {
    this.dataSourceConceptos.paginator = this.paginator;
  }

  toggleEditMode(element: Concepto) {
    element.editable = !element.editable;
  }

  guardarCambiosConcepto(element: Concepto) {
    this.validarConcepto(element);

    if (Object.keys(element.errores).length > 0) {
      return; // No guardar si hay errores
    }

    element.editable = false;

    const conceptosActualizados = this.dataSourceConceptos.data.map(c =>
      c === element ? element : c
    );

    this.cartaPorteService.actualizarCartaPorte({ cartaPorteDetalles: conceptosActualizados });

    this.validarConceptos();
  }

  datosConceptos:number = 0;
  validarConceptos() {

/*     console.log('this.dataSourceConceptos.data',this.dataSourceConceptos.data.length); */

    if(this.dataSourceConceptos.data.length == 0){
      const tieneErrores = true;
      const erroresLista = ["La guia no tiene asociado ningun concepto de facturacion, revisar la guia o el convenio de la misma."];
  
      this.cartaPorteService.actualizarValidacion('conceptos', tieneErrores);
  
      this.cartaPorteService.actualizarErrores('conceptos', erroresLista);
      return;
    }

    this.datosConceptos = this.dataSourceConceptos.data.length;

    this.dataSourceConceptos.data.forEach(concepto => this.validarConcepto(concepto));

    const tieneErrores = this.dataSourceConceptos.data.some(c => Object.keys(c.errores).length > 0);
    const erroresLista = this.obtenerErroresLista();

    this.cartaPorteService.actualizarValidacion('conceptos', tieneErrores);

    this.cartaPorteService.actualizarErrores('conceptos', erroresLista);
  }

  obtenerErroresLista(): string[] {
    return this.dataSourceConceptos.data
      .map(m => Object.entries(m.errores)
        .filter(([_, esError]) => esError)
        .map(([campo]) => `IdConcepto ${m.id}: Error en campo "${campo}" del concepto "${m.descripcion}"`))
      .flat();
  }

  validarConcepto(concepto: Concepto) {
    concepto.errores = {};

    if (!concepto.cantidad || concepto.cantidad <= 0) {
      concepto.errores.cantidad = 'Debe ser mayor a 0.';
    }

    if (!concepto.importe || concepto.importe <= 0) {
      concepto.errores.importe = 'Debe ser mayor a 0.';
    }

    if (!concepto.claveProdServ || !/^[0-9]{8}$/.test(concepto.claveProdServ)) {
      concepto.errores.claveProdServ = 'Debe contener 8 números.';
    }

  }
}
