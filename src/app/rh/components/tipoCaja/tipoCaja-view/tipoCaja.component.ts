import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiRecursosHumanosService } from 'src/app/DataAccess/api-recursos-humanos.service';
import { TipoCaja } from 'src/app/models/RH/TipoCaja';
import { StorageService } from 'src/app/Services/StorageService';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { ModalCrudTipoCajaComponent } from '../modal-crud-tipoCaja/modal-crud-tipoCaja.component';

@Component({
  selector: 'app-tipoCaja',
  templateUrl: './tipoCaja.component.html',
  styleUrls: ['./tipoCaja.component.css']
})
export class TipoCajaComponent implements OnInit {

  // ======================= CONFIGURACION DE COMPONENTE TABLA =======================
  columnConfigs: { [key: string]: ColumnConfig } = {
    idTipoCaja: { displayName: 'ID', type: 'default', showFilter: true, visible: true, widthColumn:'10%' },
    clave: { displayName: 'Clave', type: 'default', showFilter: true, visible: true, widthColumn:'10%'  },
    nombre: { displayName: 'Nombre', type: 'default', showFilter: true, visible: true, widthColumn:'50%'  },
    activo: { displayName: 'Estatus', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', showFilter: true, visible: true, widthColumn:'5%'  },
    fechaModificacion: { displayName: 'Fecha Modificado', type: 'date', format: 'dd/MM/yyyy hh:mm', showFilter: true, startDate: null, endDate: null, visible: true, widthColumn:'10%'  },
    usuarioModificadoPor: { displayName: 'Modificado Por', type: 'default', showFilter: true, visible: true, widthColumn:'10%'  }
  };
  tableActions: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver detalle',
      callback: (item) => this.onDetailClick(item)
    },
    {
      name: 'edit',
      title: 'Editar',
      icon: 'mode_edit',
      tooltip: 'Editar',
      callback: (item) => this.onEditClick(item)
    }
  ];
  tableConfigs: TableConfig =
  {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 5,
    createCallback: () => this.onCreateClick()
  };

  // ======================= CONFIGURACION INICIAL DE VARIABLES =======================
  datos: TipoCaja[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: TipoCaja[] = [];
  isLoading: boolean = false;

  constructor( private apiRecHumanosService: ApiRecursosHumanosService,
    private storageService: StorageService<TipoCaja>,
    public dialog: MatDialog) { }

    ngOnInit(): void {
      this.storageService.init('tipoCajaActual');
      this.retriveData();
    }
  
    retriveData(): void {
      this.isLoading = true;
      this.apiRecHumanosService.obtenerTipoCaja().subscribe(
        (response) => {
          console.log('Datos obtenidos', response);
          this.datos = response;
          this.datosFiltrados = this.datos;
          this.isLoading = false;
        },
        (error) => {
          this.triggerAlert('Ha ocurrido un error al obtener los datos', 'danger');
          console.error('Ha ocurrido un error al obtener los datos', error);
          this.isLoading = false;
        }
      );
    }

    cambiarEstado(tipoCaja: TipoCaja) {
      const nuevoEstado = !tipoCaja.activo;
  
      this.apiRecHumanosService.actualizarTipoCaja({ ...tipoCaja, activo: nuevoEstado }).subscribe(
        () => {
          tipoCaja.activo = nuevoEstado;
          this.triggerAlert(`Tipo de caja ${nuevoEstado ? 'activada' : 'desactivada'} exitosamente!`, 'success');
        },
        error => {
          console.log(error);
          this.triggerAlert('Error al cambiar el estado del tipo de caja', 'danger');
        }
      );
    }
  
    onDetailClick(rowData: any) {
      this.storageService.changeItem(rowData);
  
      const dataForModal = {
        ...rowData, //item seleccionado en la tabla
        TITULO_MODAL: 'Tipo caja de ahorro ',  // titulo para el modal
        TIPO_MODAL: 'DETAIL'
      };
  
      const dialogRef = this.dialog.open(ModalCrudTipoCajaComponent, {
        width: '800px',
        data: dataForModal // Pasa el objeto extendido
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.retriveData();
      });
    }
  
    onEditClick(rowData: any) {
      this.storageService.changeItem(rowData);
  
      const dataForModal = {
        ...rowData, //item seleccionado en la tabla
        TITULO_MODAL: 'Tipo caja de ahorro',  // titulo para el modal
        TIPO_MODAL: 'EDIT'
      };
  
      const dialogRef = this.dialog.open(ModalCrudTipoCajaComponent, {
        width: '800px',
        data: dataForModal // Pasa el objeto extendido
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.retriveData();
      });
    }
  
    onCreateClick() {
      const dataForModal = {
        TITULO_MODAL: 'Tipo caja de ahorro',  // titulo para el modal
        TIPO_MODAL: 'CREATE'
      };
  
      const dialogRef = this.dialog.open(ModalCrudTipoCajaComponent, {
        width: '800px',
        data: dataForModal // Pasa el objeto específico para creación
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.retriveData();
      });
    }

    // Esta función se llama para mostrar la alerta
  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.showAlert = true;
    this.alertType = type;

    // La alerta se ocultará después de 5 segundos
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}
