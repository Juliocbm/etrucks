import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CartaPorteService } from '../../../../../Services/CartaPorteService';
import { RegimenAduanero } from '../../../../../../models/ti/cfdi/regimenAduanero';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-internacional',
  templateUrl: './internacional.component.html',
  styleUrls: ['./internacional.component.css']
})
export class InternacionalComponent implements OnInit, OnDestroy {
  internacionalForm!: FormGroup;
  dataSourceRegimenesAduaneros = new MatTableDataSource<RegimenAduanero>([]);
  displayedColumnsRegimenesAduaneros: string[] = ['id', 'regimenAduanero', 'fechaInsert', 'editar'];
  isButtonSaveRegAduaneroDisabled = true;
  private destroy$ = new Subject<void>();

  catTransporte = [
    { key: "Autotransporte", value: 1 },
    { key: "Transporte Marítimo", value: 2 },
    { key: "Transporte Aéreo	", value: 3 },
    { key: "Transporte Ferroviario	", value: 4 },
  ];

  catTransporteOptions = this.catTransporte;

  catEntradaSalida = [
    { key: "Entrada", value: "Entrada" },
    { key: "Salida", value: "Salida" },
  ];

  catEntradaSalidaOptions = this.catEntradaSalida;

  catTransporteInternacional = [
    { key: "No", value: "No" },
    { key: "Sí", value: "Sí" }
  ];

  catTransporteInternacionalOptions = this.catTransporteInternacional;

 datosRegimenesAdu:number =0; 


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private cartaPorteService: CartaPorteService) {}

  ngAfterViewInit() {
    this.dataSourceRegimenesAduaneros.paginator = this.paginator;
  }

  ngOnInit() {
    this.inicializarFormulario();
    this.suscribirseACartaPorte();
    this.escucharCambiosFormulario();
  }

  inicializarFormulario() {
    this.internacionalForm = new FormGroup({
      esTransporteInternacional: new FormControl('', [Validators.required, Validators.pattern(/^(Sí|No)$/)]),
      entSalMercancia: new FormControl(''),
      viaEntradaSalida: new FormControl(''),
      pedimento: new FormControl('', [Validators.maxLength(15)]),
      rfcImpo: new FormControl('', [Validators.pattern(/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/)])
    });
  }

  suscribirseACartaPorte() {
    this.cartaPorteService.cartaPorte$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cartaPorte => {
        this.internacionalForm.patchValue({ ...cartaPorte }, { emitEvent: false });

        if (cartaPorte.cartaPorteRegimenesAduaneros) {
          this.datosRegimenesAdu = cartaPorte.cartaPorteRegimenesAduaneros.length;

          this.dataSourceRegimenesAduaneros.data = cartaPorte.cartaPorteRegimenesAduaneros.map(r => ({
            ...r, editable: false, errores: {}
          }));
        }

        this.actualizarFormulario();
        this.validarFormulario(); // 🔥 Ahora se actualiza validación general aquí
      });
  }

  escucharCambiosFormulario() {
    this.internacionalForm.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.validarFormulario());

    this.internacionalForm.get('esTransporteInternacional')?.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.actualizarFormulario());
  }

  actualizarFormulario() {
    const esTransporteInternacional = this.internacionalForm.get('esTransporteInternacional')?.value === 'Sí';
    this.actualizarEstadoCampo('entSalMercancia', esTransporteInternacional, [Validators.required, Validators.pattern(/^(Entrada|Salida)$/)]);
    this.actualizarEstadoCampo('viaEntradaSalida', esTransporteInternacional, [Validators.required, Validators.pattern(/^[1-4]$/)]);
    this.isButtonSaveRegAduaneroDisabled = !esTransporteInternacional;
  }

  actualizarEstadoCampo(campo: string, habilitar: boolean, validaciones: any[]) {
    const control = this.internacionalForm.get(campo);
    if (control) {
      habilitar ? control.enable({ emitEvent: false }) : control.disable({ emitEvent: false });
      control.setValidators(habilitar ? validaciones : []);
      control.updateValueAndValidity({ emitEvent: false });
    }
  }

  /* validarFormulario() {
    console.log('🔍 Ejecutando validación general...');
  
    this.cartaPorteService.actualizarValidacion3('internacional', this.internacionalForm, this.obtenerErroresLista());
  } */

    validarFormulario() {
      console.log('🔍 Ejecutando validación general...');
    
      const formValues = this.internacionalForm.getRawValue();
      const cartaPorteActual = this.cartaPorteService.obtenerCartaPorteActual();
    
      if (this.hayCambiosEnFormulario(formValues, cartaPorteActual)) {
        console.log('📦 Actualizando CartaPorte con datos del formulario');
        this.cartaPorteService.actualizarCartaPorte(formValues);
      }
    
      this.cartaPorteService.actualizarValidacion3(
        'internacional',
        this.internacionalForm,
        this.obtenerErroresLista()
      );
    }
    
    
    private hayCambiosEnFormulario(formValues: any, cartaPorte: any): boolean {
      return (
        formValues.esTransporteInternacional !== cartaPorte.esTransporteInternacional ||
        formValues.entSalMercancia !== cartaPorte.entSalMercancia ||
        formValues.viaEntradaSalida !== cartaPorte.viaEntradaSalida ||
        formValues.pedimento !== cartaPorte.pedimento ||
        formValues.rfcImpo !== cartaPorte.rfcImpo
      );
    }
    

  obtenerErroresLista(): string[] {
    return this.dataSourceRegimenesAduaneros.data
      .map(regimen => {
        this.validarRegimen(regimen);
        return Object.entries(regimen.errores)
          .filter(([_, esError]) => esError)
          .map(([campo]) => `ID ${regimen.id}: Error en "${campo}" del régimen "${regimen.regimenAduanero}"`);
      })
      .flat();
  }

  validarRegimen(regimen: RegimenAduanero) {
    regimen.errores = {};

    if (this.internacionalForm.get('esTransporteInternacional')?.value === 'No') return;

    if (!regimen.regimenAduanero || regimen.regimenAduanero.trim().length < 3) {
      regimen.errores.regimenAduanero = 'Debe tener al menos 3 caracteres.';
    } else {
      const validRegimenes = ["IMD", "EXD", "ITR", "ITE", "ETR", "ETE", "DFI", "RFE", "RFS", "TRA"];
      if (!validRegimenes.includes(regimen.regimenAduanero)) {
        regimen.errores.regimenAduanero = 'Debe ser una de las claves válidas.';
      }
    }
  }
  
  guardarCambiosRegimen(element: RegimenAduanero) {
    console.log('regimenAduanero',element);
    element.editable = false;
    this.cartaPorteService.actualizarCartaPorte({ cartaPorteRegimenesAduaneros: this.dataSourceRegimenesAduaneros.data });

    this.validarFormulario();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleEditMode(element: RegimenAduanero) {
    element.editable = !element.editable;
  }
}
