import { ApiPersonalService } from 'src/app/DataAccess/HgTools/api-personal.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PersonalModel } from 'src/app/models/RH/Empleado/empleado'; // Import del modelo adecuado
import { StorageService } from 'src/app/Services/StorageService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as JsBarcode from 'jsbarcode';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationModalComponent } from 'src/app/shared-module/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-personal-gafete',
  templateUrl: './personal-gafete.component.html',
  styleUrls: ['./personal-gafete.component.css']
})
export class PersonalGafeteComponent {
  @ViewChild('screenDesign', { static: false }) screenDesign!: ElementRef;
  personal!: PersonalModel; // Uso de PersonalModel
  base64Image: string = '';
  gafete: string = ''; // Código de barras
  loadingButton: boolean = false;
  idCompania: number = 1; // Default a 1 (HG)

  // Variables de la alertas
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = '';
  modalRef?: BsModalRef;

  

  public logos: { descripcion: string, url: string }[] = [
    {  descripcion: 'CTPAT', url: '../../../../../assets/icons/LOGOS/ctpat-logo-arriba.png' },
    {  descripcion: 'TransporteLimpio', url: '../../../../../assets/icons/LOGOS/transporte_limpio-1024x399.png' },
    {  descripcion: 'OEA', url: '../../../../../assets/icons/LOGOS/OEA-5.png' },
    {  descripcion: 'IQNET', url: '../../../../../assets/icons/LOGOS/IQNET.webp' },
    {  descripcion: 'ISO', url: '../../../../../assets/icons/LOGOS/ISO90012015.png' }
  ];

  getFechaConUnAnioMas(fecha: Date): Date {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setFullYear(nuevaFecha.getFullYear() + 4);
    return nuevaFecha;
  }

  public companyLogos: { [key: number]: { 
    url: string, 
    descripcion: string,
    direccion: string,
    avenida: string,
    telefono: string
  } } = {
    1: {
      url: '../../../../../assets/icons/Empresas/hgTransportaciones.svg',
      descripcion: 'HG TRANSPORTACIONES',
      direccion: 'AVE. JULIAN TREVIÑO ELIZONDO NO 500',
      avenida: 'COL. EL MILAGRO APODACA NL, CP. 66634',
      telefono: 'TEL: (81) 88654700'
    },
    2: {
      url: '../../../../../assets/icons/Empresas/chTransportaciones.svg',
      descripcion: 'AUTOEXPRESS EL CHARQUEÑO',
      direccion: 'CARRETERA MONTERREY-MONCLOVA KM 4.9',
      avenida: 'ESCOBEDO NL, CP. 66050',
      telefono: 'TEL: (81) 88654700'
    },
    3: {
      url: '../../../../../assets/icons/Empresas/rlTransportaciones.svg',
      descripcion: 'RL TRANSPORTACIONES',
      direccion: 'CARR. A HUINALA KM 1.5 S/N',
      avenida: 'MILAGRO APODACA NL, CP. 66634',
      telefono: 'TEL: (81) 88654700'
    },
    4: {
      url: '../../../../../assets/icons/Empresas/lindaTransportaciones.svg',
      descripcion: 'LINDA TRANSPORTACIONES',
      direccion: 'PRIV 5 DE SEPTIEMBRE #116',
      avenida: 'Col. VILLAS DE SAN C. APODACA NL,CP. 66644',
      telefono: 'TEL: (81) 12532277'
    },
    5: {
      url: '../../../../../assets/icons/Empresas/absolute.svg',
      descripcion: 'ABSOLUTE',
      direccion: 'AVE. JULIAN TREVIÑO ELIZONDO NO 500',
      avenida: 'COL. EL MILAGRO APODACA NL, CP. 66634',
      telefono: 'TEL: (81) 88654700'
    }
  };

  getCompanyLogo(): string {
    return this.companyLogos[this.idCompania]?.url || this.companyLogos[1].url;
  }

  getCompanyName(): string {
    return (this.companyLogos[this.idCompania]?.descripcion || this.companyLogos[1].descripcion) + ' S.A. DE C.V.';
  }

  getCompanyDireccion(): string {
    return this.companyLogos[this.idCompania]?.direccion || this.companyLogos[1].direccion;
  }

  getCompanyAvenida(): string {
    return this.companyLogos[this.idCompania]?.avenida || this.companyLogos[1].avenida;
  }

  getCompanyTelefono(): string {
    return this.companyLogos[this.idCompania]?.telefono || this.companyLogos[1].telefono;
  }

  constructor(
    private storageService: StorageService<PersonalModel>, // Referencia correcta al tipo PersonalModel
    public modal: MatDialogRef<PersonalGafeteComponent>,
    private modalService: BsModalService,
    private apiPersonalService: ApiPersonalService, // Referencia correcta al servicio
    private sanitizer: DomSanitizer
  ) {
    const storedCompania = localStorage.getItem('CompaniaSelect');
    this.idCompania = storedCompania ? Number(storedCompania) : 1;
  }

  ngOnInit() {
    this.storageService.init('empleadoActual'); // Inicializar con la clave del empleado (personalActual)


    this.storageService.itemActual.subscribe(personal => {
      if (personal) {
        this.personal = personal; // Asignación del modelo recibido
        const hexString = this.personal.foto;
        this.base64Image = this.convertHexToBase64(hexString); // Conversión de la foto
        this.gafete = this.personal.codigoBarras; // Asignar el código de barras


        // Cargar las imágenes a Base64 antes de mostrar
        for (const logo of this.logos) {
          this.convertToBase64Image(logo.url).then((base64) => {
            (this as any)[`${logo.descripcion}LogoBase64`] = base64;
          });
        }

      } else {
        console.log("No se encontró un empleado guardado en la sesión.");
      }
    });
  }

  cerrarModal() {
    this.modal.close();
  }


  convertHexToBase64(hex: string): string {
    if (!hex) return '';
    
    try {
      // Remover el prefijo '0x' si existe
      const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
      
      // Convertir hex a bytes
      const hexPairs = cleanHex.match(/[\dA-F]{2}/gi) || [];
      const bytes = hexPairs.map(pair => parseInt(pair, 16));
      
      // Convertir bytes a base64
      const byteArray = new Uint8Array(bytes);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error al convertir hex a base64:', error);
      this.showAlertMessage(
        'Error al procesar la imagen',
        'error'
      );
      return '';
    }
  }

  imprimirNuevoGafete() {
    console.log('Imprimiendo gafete...');

    const front = document.getElementById('front');
    const back = document.getElementById('back');

    if (front && back) {
      // Captura la parte frontal
      html2canvas(front, {
        useCORS: true,
        allowTaint: true,
        scale: 2
      }).then(frontCanvas => {

        // Captura la parte trasera
        html2canvas(back, {
          useCORS: true,
          allowTaint: true,
          scale: 2
        }).then(backCanvas => {

          // Medidas originales (una sola cara):
          const cardWidth = 52.6;    // mm
          const cardHeight = 43.98 * 2;  // mm

          // Alto total = 2 caras (107.96) + un margen extra de 10 mm
          const totalHeight = (cardHeight * 2) + 10; // ~117.96 mm

          // Convertimos a imagen
          const frontDataURL = frontCanvas.toDataURL('image/png');
          const backDataURL  = backCanvas.toDataURL('image/png');

          // Creamos PDF de [85.6 mm x 117.96 mm]
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [cardWidth, totalHeight]
          });

          // Insertamos la cara frontal en la parte superior
          pdf.addImage(frontDataURL, 'PNG', 0.5, -0.5, cardWidth, cardHeight);

          // Insertamos la cara trasera un poco más abajo para dejar margen
          pdf.addImage(backDataURL, 'PNG', 0.5, cardHeight + 5, cardWidth, cardHeight);

          // Guardamos
          pdf.save(`GP-NSS:${this.personal.nss}-IdPersonal:${this.personal.idPersonal}.pdf`);
          console.log('Gafete impreso correctamente.');
        });
      });
    }
  }

  // Método para convertir la imagen a Base64 si aún no lo has hecho
  convertToBase64Image(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';  // Importante para evitar problemas CORS
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));  // Convierte a Base64
      };
      img.onerror = reject;
    });
  }

  public generateBarcodeBase64(value: string) {
    // Extraer el valor de value que venga entre asteriscos, ejemplo: *1234567* valor: 1234567
    let barcodeValue = value;
    const matches = value.match(/\*(.*?)\*/);
    if (matches && matches[1]) {
      barcodeValue = matches[1];
    }

    JsBarcode('#barcode', barcodeValue, {
      format: 'code39', // default
      height: 35,
      width: 2,
      text: '*'+ barcodeValue +'*',
    });
  }

  private calcPx2MmFactor() {
    let e = document.createElement('div');
    e.style.position = 'absolute';
    e.style.width = '100mm';
    document.body.appendChild(e);
    let rect = e.getBoundingClientRect();
    document.body.removeChild(e);
    return rect.width / 100;
  }

  RegenerarGafete() {
    this.loadingButton = true;
    // Hacer la actualizacion a la api de la regeneracion del gafete con base el id del empleado y devuelve el mensaje recibido de la regeneracion del codigo de barras.
    this.apiPersonalService.regenerarCodigoBarras(this.personal.idPersonal)
    .subscribe({
      next: (data: any) => {
        console.log(data);
        // Recargar la pagina para mostrar el nuevo gafete
        window.location.reload();
      },
      error: (error) => {
        console.error('Error al regenerar gafete:', error);
        this.loadingButton = false;
      },
      complete: () => {
        this.loadingButton = false;
      }
    });
  }


  // Confirmacion de regeneracion de codigo de barras
  openConfirmationModal(): void {
    // Configurar mensaje del modal
    const initialState = {
      title: 'Regeneración de gafete',
      message: `Estás a punto de confirmar que el empleado ${this.personal.nombreCompleto } ha cambiado de gafete. ¿Deseas continuar?`,
      confirmText: 'Sí',
      declineText: 'No',
      buttons: true,
      onConfirm: () => this.RegenerarGafete(),
      onDecline: () => this.showAlertMessage('Operación de regeneración cancelada', 'danger'),
    };

    // Abrir el modal
    this.modalRef = this.modalService.show(ConfirmationModalComponent, {
      initialState,
      class: 'modal-dialog-centered',
    });
  }

  showAlertMessage(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}
