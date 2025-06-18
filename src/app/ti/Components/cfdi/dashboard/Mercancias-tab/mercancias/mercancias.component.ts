import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartaPorteService } from '../../../../../Services/CartaPorteService';
import { Mercancia } from '../../../../../../models/ti/cfdi/mercancia';
import { Subject, takeUntil } from 'rxjs';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-mercancias',
  templateUrl: './mercancias.component.html',
  styleUrls: ['./mercancias.component.css']
})
export class MercanciasComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;

  columnFilters: { [key: string]: string } = {};

  mercanciasForm!: FormGroup;
  dataSourceMercancias = new MatTableDataSource<Mercancia>([]);
  displayedColumnsMercancias: string[] = [
    'id',
    'cantidad',
    'peso',
    'claveProdServ',
    'fraccionArancelaria',
    'pedimento',
    'descripcion',
    'claveUnidad',
    'claveUnidadPeso',
    'esMaterialPeligroso',
    'cveMaterialPeligroso',
    'valorMercancia',
    
    'tipoMateria',
    'editar',
  ];

  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private cartaPorteService: CartaPorteService, private fb: FormBuilder) {}

  applyFilter(column: string, value: string) {
    this.columnFilters[column] = value.trim().toLowerCase();
    this.dataSourceMercancias.filter = JSON.stringify(this.columnFilters);
  }
  
  ngOnInit() {
    this.dataSourceMercancias.filterPredicate = (data, filter) => {
      const parsed = JSON.parse(filter);
      return Object.keys(parsed).every(key => {
        const value = (data[key] || '').toString().toLowerCase();
        return value.includes(parsed[key].toLowerCase());
      });
    };

    // Crear el formulario de mercancías para manejar validaciones
    this.mercanciasForm = this.fb.group({
      mercancias: this.fb.array([]) // Un array de mercancías como FormGroup
    });

    this.cartaPorteService.cartaPorte$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cartaPorte => {
        if (cartaPorte.cartaPorteMercancia) {
          this.dataSourceMercancias.data = cartaPorte.cartaPorteMercancia.map(m => ({
            ...m, editable: false, errores: this.inicializarErrores()
          }));
        }
        this.validarMercancias();
      });
  }

  ngAfterViewInit() {
    this.dataSourceMercancias.paginator = this.paginator;
    this.dataSourceMercancias.sort = this.sort;
  }

  toggleEditMode(element: Mercancia) {
    element.editable = !element.editable;
  }

  guardarMercancia(mercancia: Mercancia) {
    this.validarRegistro(mercancia);

    if (this.tieneErrores(mercancia)) {
      return;
    }

    mercancia.editable = false;

    const mercanciasActualizadas = this.dataSourceMercancias.data.map(m =>
      m === mercancia ? mercancia : m
    );

    this.cartaPorteService.actualizarCartaPorte({ cartaPorteMercancia: mercanciasActualizadas });

    this.validarMercancias();
  }

  validarRegistro(mercancia: Mercancia) {
    mercancia.errores = {
      cantidad: !this.validarCantidad(mercancia.cantidad),
      peso: !this.validarPeso(mercancia.peso),
      claveProdServ: !this.validarClaveProdServ(mercancia.claveProdServ!),
      claveUnidad: !this.validarClaveUnidad(mercancia.claveUnidad!),
      esMaterialPeligroso: !this.validarMaterialPeligroso(mercancia.esMaterialPeligroso!),
    };
  }

  tieneErrores(mercancia: Mercancia): boolean {
    return Object.values(mercancia.errores).some(error => error);
  }

  validarMercancias() {
/* 
    console.log('this.dataSourceMercancias.data',this.dataSourceMercancias.data.length); */

    if(this.dataSourceMercancias.data.length == 0){
      const tieneErrores = true;
      const erroresLista = ["La guia no tiene mercancias en su complemento carta porte, revisar que el ccp(dummy) este completo y cargelo nuevamente en esta o una nueva guia."];
  
      this.cartaPorteService.actualizarValidacion('mercancias', tieneErrores);
  
      this.cartaPorteService.actualizarErrores('mercancias', erroresLista);
      return;
    }

    this.dataSourceMercancias.data.forEach(m => this.validarRegistro(m));

    const tieneErrores = this.dataSourceMercancias.data.some(m => this.tieneErrores(m));
    const erroresLista = this.obtenerErroresLista();
/* 
    console.log('erroresLista',erroresLista); */

    this.cartaPorteService.actualizarValidacion('mercancias',tieneErrores);

    this.cartaPorteService.actualizarErrores('mercancias', erroresLista);
  }

  inicializarErrores() {
    return {
      cantidad: false,
      peso: false,
      claveProdServ: false,
      claveUnidad: false
    };
  }

  // 🔥 **VALIDACIONES PERSONALIZADAS**
  validarCantidad(valor: any): boolean {
    return this.esDecimalPositivo(valor);
  }

  validarPeso(valor: any): boolean {
    return this.esDecimalPositivo(valor);
  }

  validarClaveProdServ(valor: string): boolean {
    return /^[0-9]{8}$/.test(valor);
  }

  validarClaveUnidad(valor: string): boolean {
    return /^[\w\W]{1,100}$/.test(valor);
  }

  validarMaterialPeligroso(valor: string): boolean {
   /*  console.log('esMatPeigroso',valor); */
    return /^(0|1|0,1)$/.test(valor);
  }

  esDecimalPositivo(valor: any): boolean {
    return /^([1-9]\d*|0)(\.\d+)?$/.test(valor) && parseFloat(valor) > 0;
  }

  obtenerErroresLista(): string[] {
    return this.dataSourceMercancias.data
      .map(m => Object.entries(m.errores)
        .filter(([_, esError]) => esError)
        .map(([campo]) => `IdProducto ${m.id}: Error en el campo "${campo}" del producto "${m.descripcion}"`))
      .flat();
  }

  actualizarDescripcionMateria(element: Mercancia) {
    const descripcionMap: { [key: string]: string } = {
      '01': 'Materia prima',
      '02': 'Materia procesada',
      '03': 'Materia terminada (producto terminado)',
      '04': 'Materia para la industria manufacturera',
      '05': 'Otra'
    };
  
    element.descripcionMateria = descripcionMap[element.tipoMateria!] || 'Desconocido';
    
    // 🔥 También validamos nuevamente para reflejar cambios
    this.validarMercancias();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
