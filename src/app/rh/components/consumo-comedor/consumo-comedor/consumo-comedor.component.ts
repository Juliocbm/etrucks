import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiComedorService } from 'src/app/DataAccess/Comedor/api-comedor.service';
import { VwConsumoModel } from 'src/app/models/RH/Comedor/consumo';
import { StorageService } from 'src/app/Services/StorageService';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { ModalCrudConsumoComedorComponent } from '../modal-crud-consumo-comedor/modal-crud-consumo-comedor.component';
import { ConfirmationModalComponent } from 'src/app/shared-module/components/confirmation-modal/confirmation-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ParametrosDropdownConsumo } from 'src/app/shared-module/configuracionDropdowns/parametrosGenerales.config';
import { ConfiguracionParametros } from 'src/app/models/SistemaGeneral/ParametrosGenerales';

@Component({
  selector: 'app-consumo-comedor',
  templateUrl: './consumo-comedor.component.html',
  styleUrls: ['./consumo-comedor.component.css']
})
export class ConsumoComedorComponent implements OnInit {

  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: VwConsumoModel[] = [];
  datos: VwConsumoModel[] = [];
  isLoading: boolean = false;
  idCompania: number = Number(localStorage.getItem('CompaniaSelect')) ?? 1;


  // Get Column Configs VwConsumoModel
  columnConfigs: { [key: string]: ColumnConfig } = {
    idConsumo: { displayName: 'ID', type: 'number', showFilter: true, visible: true },
    idSucursal: { displayName: 'Sucursal', type: 'default', showFilter: true, visible: false },
    nombreSucursal: { displayName: 'Nombre Sucursal', type: 'default', showFilter: true, visible: true },
    idMenu: { displayName: 'Menu', type: 'default', showFilter: true, visible: false },
    comidaMenu: { displayName: 'Comida Menu', type: 'default', showFilter: true, visible: true },
    idPersonal: { displayName: 'Personal', type: 'default', showFilter: true, visible: true },
    nombrePersonal: { displayName: 'Nombre Personal', type: 'default', showFilter: true, visible: true },
    precio: { displayName: 'Precio', type: 'number', showFilter: true, visible: true },
    porcentajeSubsidio: { displayName: 'Subsidio', type: 'number', showFilter: true, visible: true },
    fechaIngreso: { displayName: 'Fecha Ingreso', type: 'date', format: 'dd/MM/yyyy', showFilter: true, startDate: null, endDate: null, visible: true },
    idEstatus: { displayName: 'Estatus', type: 'default', showFilter: true, visible: true },
    estatusConsumo: { displayName: 'Estatus Consumo', type: 'default', showFilter: true, visible: true },
    activo: { displayName: 'Activo', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', showFilter: true, visible: true },
    fechaCreacion: { displayName: 'Creado', type: 'date', format: 'dd/MM/yyyy', showFilter: true, startDate: null, endDate: null, visible: true },
    creadoPor: { displayName: 'Creado Por', type: 'default', showFilter: true, visible: false },
    usuarioCreadoPor: { displayName: 'Usuario Creado', type: 'default', showFilter: true, visible: true },
    fechaModificacion: { displayName: 'Modificación', type: 'date', format: 'dd/MM/yyyy', showFilter: true, startDate: null, endDate: null, visible: false },
    modificadoPor: { displayName: 'Modificado Por', type: 'default', showFilter: true, visible: false },
    usuarioModificadoPor: { displayName: 'Usuario Modificado', type: 'default', showFilter: true, visible: false },
    idCopania: { displayName: 'Compañia', type: 'number', showFilter: true, visible: false },
    esManual: { displayName: 'Manual', type: 'boolean', trueValue: 'Manual', falseValue: 'No Manual', showFilter: true, visible: false }
  };


  parametrosConsumo = ParametrosDropdownConsumo;
  
  tableActions: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver detalle',
      callback: (item) => this.onDetailClick(item)
    },
    {
      name: 'delete',
      title: 'Eliminar',
      icon: 'delete',
      tooltip: 'Eliminar Consumo',
      callback: (item) => this.onDeleteClick(item)
    }
  ];
  tableConfigs: TableConfig =
  {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 5,
    createCallback: () => this.onCreateClick()
  };

  modalRef?: BsModalRef;
  constructor(
    private apiComedorService: ApiComedorService,
    private modalService: BsModalService,
    private storageService: StorageService<VwConsumoModel>,
    public dialog: MatDialog,
    private configParams:ConfiguracionParametros
  ) {
    this.storageService.init('consumoActual');
    this.idCompania = parseInt(localStorage.getItem('CompaniaSelect') || '0');
  }

  ngOnInit(): void {
    this.retriveData();
  }

  retriveData(): void {
    this.isLoading = true;
    
    const parametros = this.configParams.configurar(this.parametrosConsumo);

    this.apiComedorService.GetComedorConsumo(parametros).subscribe(
      (response: any) => {
        console.log('response', response);
        this.datos = response.items;
        this.datosFiltrados = this.datos;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.alertMessage = 'Ocurrio un error al obtener los datos';
        this.showAlert = true;
      }
    );
  }



  onCreateClick() {
    const dataForModal = {
      TITULO_MODAL: 'REGISTRO CONSUMO',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(ModalCrudConsumoComedorComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto específico para creación
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  onDetailClick(rowData: any) {
    this.storageService.changeItem(rowData);

    const dataForModal = {
      ...rowData, //item seleccionado en la tabla
      TITULO_MODAL: 'DETALLE CONSUMO',  // titulo para el modal
      TIPO_MODAL: 'DETAIL'
    };

    const dialogRef = this.dialog.open(ModalCrudConsumoComedorComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  onDeleteClick(rowData: any) {
    const initialState = {
      title: 'Confirmación',
      message: `Estás a punto de eliminar el consumo. ¿Deseas continuar?`,
      confirmText: 'Sí',
      declineText: 'No',
      buttons: true,
      onConfirm: () => {
        this.apiComedorService.deleteComedorConsumo(rowData.idConsumo).subscribe(
          (response: any) => {
            this.retriveData();
            this.modalRef?.hide();
          },
          error => {
            console.log(error);
            this.alertMessage = 'Error al eliminar el consumo';
            this.showAlert = true;
            this.modalRef?.hide();
          }
        );
      },
      onDecline: () => this.modalRef?.hide(),
    };

    this.modalRef = this.modalService.show(ConfirmationModalComponent, {
      initialState,
      class: 'modal-dialog-centered',
    });
  }


}
