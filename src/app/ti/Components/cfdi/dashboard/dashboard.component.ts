import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CartaPorteService } from '../../../Services/CartaPorteService';
import { CartaPorte } from 'src/app/models/ti/cfdi/cartaPorte';
import { ErrorDetailModalComponent } from '../error-detail-modal/error-detail-modal.component';
import { ApiCfdiService } from '../../../../DataAccess/api-cfdi.service';
import { NotificacionService } from '../../../../shared-module/services/notificacion.service';
import { finalize, retry } from 'rxjs';
import { MatTabGroup } from '@angular/material/tabs';
import { ModalErrorsValidationsComponent } from './modal-errors-validations/modal-errors-validations/modal-errors-validations.component';
import { ArchivoCFDi } from '../../../../models/ti/cfdi/ArchivoCfdi';
import { ErrorTimbrado } from '../../../../models/ti/cfdi/error';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  consultaForm!: FormGroup;
  cartaPorte: CartaPorte | null = null;
  cartaPorteRespaldo: CartaPorte | null = null;
  isLoading: boolean = false;

  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  // Bandera para mostrar el ícono de error en cada tab
  tabsConErrores: { [key: string]: boolean } = {};
  erroresTabs: { [key: string]: string[] } = {};

  // Lista de formularios (debes inyectarlos desde los componentes hijos)
  forms: { [key: string]: FormGroup } = {};

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private apiCfdi: ApiCfdiService,
    private notificacionService: NotificacionService,
    private cartaPorteService: CartaPorteService
  ) { }


  ngOnInit() {
    // Inicializar formulario correctamente
    this.consultaForm = this.formBuilder.group({
      numGuia: new FormControl('', [Validators.required]),
    });

    // Suscribirse al servicio para obtener la carta porte
    this.cartaPorteService.cartaPorte$.subscribe(data => {
      this.cartaPorte = data ?? null;
    });

    this.cartaPorteService.validaciones$.subscribe(validaciones => {
      this.tabsConErrores = validaciones;
    });

    this.cartaPorteService.errores$.subscribe(errores => {
      this.erroresTabs = errores;
    });
  }

  // Mostrar detalles de error
  openErrorDetails(data: any) {
    this.dialog.open(ErrorDetailModalComponent, {
      width: '50%',
      data: data
    });
  }

  mostrarErrores(tab: string) {
    const errores = this.erroresTabs[tab];
    if (errores && errores.length > 0) {
      this.dialog.open(ModalErrorsValidationsComponent, {
        width: '50%',
        data: { errores }
      });
    }
  }

  limpiarCartaPorte(cartaPorte: CartaPorte): any {
    const { erroresTimbradoGenerals, ...cartaPorteLimpia } = cartaPorte;
    return {
      ...cartaPorteLimpia,
      cartaPorteMercancia: cartaPorte.cartaPorteMercancia.map(m => {
        const { editable, tieneErrores, errores, ...mercanciaLimpia } = m;
        return mercanciaLimpia;
      }),
      cartaPorteDetalles: cartaPorte.cartaPorteDetalles.map(d => {
        const { editable, tieneErrores, errores, ...detalleLimpio } = d;
        return detalleLimpio;
      })
    };
  }

  // Guardar datos
  guardarCartaPorte() {

    if (Object.values(this.tabsConErrores).some(hasError => hasError)) {
      this.notificacionService.showNotification("Hay errores en algunos campos, corrígelos antes de guardar.", 'error');
      return;
    }

    console.log('nueva', JSON.stringify(this.limpiarCartaPorte(this.cartaPorte!)));
    console.log('original', JSON.stringify(this.limpiarCartaPorte(this.cartaPorteRespaldo!)));
    if (
      JSON.stringify(this.limpiarCartaPorte(this.cartaPorte!)) ===
      JSON.stringify(this.limpiarCartaPorte(this.cartaPorteRespaldo!))
    ) {
      this.notificacionService.showNotification(`No hay cambios por actualizar`, 'error');
      return;
    } 

    console.log('GUIA', this.limpiarCartaPorte(this.cartaPorte!));

    this.apiCfdi.putCartaPorte(this.limpiarCartaPorte(this.cartaPorte!)).subscribe(
      (response) => {
        this.notificacionService.showNotification("Datos guardados exitosamente!", 'success');
        this.isLoading = false;
      },
      (error) => {
        this.notificacionService.showNotification("Fallo al guardar!", 'error');
        this.isLoading = false;
      }
    );
  }

  // Timbrar remisión
  timbrarRemision() {
    this.isLoading = true;

    const numGuiaControl = this.consultaForm.get('numGuia');
    const numGuia = numGuiaControl?.value?.trim(); // Eliminar espacios en blanco

    if (!numGuia) {
      this.notificacionService.showNotification("Debes especificar la remisión a timbrar.", 'warning');
      this.isLoading = false;
      return;
    }

    this.cartaPorte!.estatusTimbrado = 1;

    this.apiCfdi.postTimbrarAsync(numGuia).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.notificacionService.showNotification("Timbrado exitoso!", 'success');
          this.cartaPorte!.estatusTimbrado = 3;

          const archivos: ArchivoCFDi = new ArchivoCFDi(
            0,
            0,
            '',
            '',
            null,
            null,
            new Date()
          );

          if (response.xmlByteArray != null) {
            archivos.xml = this.apiCfdi.base64ToBlob(response.xmlByteArray, 'application/xml');
          }
          if (response.pdfByteArray != null) {
            archivos.pdf = this.apiCfdi.base64ToBlob(response.pdfByteArray, 'application/pdf');
          }

          this.cartaPorte!.archivoCFDi = archivos;

          const erroresNuevos: ErrorTimbrado[] = response.errores.map((error: string) => new ErrorTimbrado(
            0, // id
            0, // noGuia
            '', // numGuia
            '', // compania
            error, // error
            0, // idOperadorLis
            '', // idUnidadLis
            '', // idRemolqueLis
            new Date() // fechaInsert
          ));

          console.log("response:", response);

          this.cartaPorte!.erroresTimbradoGenerals = erroresNuevos;

        } else {
          this.notificacionService.showNotification("Fallo al timbrar!", 'error');
          this.cartaPorte!.estatusTimbrado = 2;
         
          const erroresNuevos: ErrorTimbrado[] = response.errores.map((error: string) => new ErrorTimbrado(
            0, // id
            0, // noGuia
            '', // numGuia
            '', // compania
            error, // error
            0, // idOperadorLis
            '', // idUnidadLis
            '', // idRemolqueLis
            new Date() // fechaInsert
          ));

          console.log("erroresNuevos:", erroresNuevos);
          console.log("response.errores:", response.errores);

          this.cartaPorte!.erroresTimbradoGenerals = erroresNuevos;

          console.log("respuesta timbrado:", response);
        }
      },
      (error) => {
        this.isLoading = false;
        this.notificacionService.showNotification("Fallo en el servicio!", 'error');
        this.cartaPorte!.estatusTimbrado = 2;
      }
    );
  }

  onSubmitConsulta() {
    this.isLoading = true;

    this.cartaPorteService.resetCartaPorte();

    const numGuiaControl = this.consultaForm.get('numGuia');
    const numGuia = numGuiaControl?.value?.trim(); // Eliminar espacios en blanco

    if (!numGuia) {
      this.notificacionService.showNotification("Debes especificar la remisión a consultar.", 'warning');
      this.isLoading = false;
      return;
    }

    this.apiCfdi.getCartaPorte(numGuia)
      .pipe(
        retry(3),
        finalize(() => this.isLoading = false) // Se asegura de resetear `isLoading`
      )
      .subscribe({
        next: (response) => {
          if (!response) {
            this.notificacionService.showNotification("No se encontró información para la remisión proporcionada.", 'warning');
            return;
          }

          this.notificacionService.showNotification("Consulta exitosa!", 'success');
          this.cartaPorte = response;
          this.cartaPorteRespaldo = response;
          this.cartaPorteService.actualizarCartaPorte(response);
          console.log('Carta Porte obtenida:', this.cartaPorte);
        },
        error: (error) => {
          console.error('Error al consultar la Carta Porte:', error);
          const mensajeError = error?.error?.message || "Ocurrió un error al consultar la remisión.";
          this.notificacionService.showNotification(mensajeError, 'error');
        }
      });
  }

  // Descargar archivo
  downloadFile(blob: Blob | null | undefined, name: string) {
    if (!blob) {
      console.error('No hay archivo disponible para descargar.');
      return;
    }
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Factura_'+name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
