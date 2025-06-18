import { Component, OnInit } from '@angular/core';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { ModalCrudCteMrcaComponent } from '../modal-crud-cte-mrca/modal-crud-cte-mrca.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiOperacionesService } from 'src/app/DataAccess/api-operaciones.service';

@Component({
  selector: 'app-cliente-marca-tractor',
  templateUrl: './cliente-marca-tractor.component.html',
  styleUrls: ['./cliente-marca-tractor.component.css']
})
export class ClienteMarcaTractorComponent implements OnInit {
  alertMessage = '';
  alertType = '';
  showAlert = false;

  datosOriginales: any[] = [];
  isLoading: boolean = false;
  idCompania: number = Number(localStorage.getItem('CompaniaSelect') || 0);


  columnConfigs: { [key: string]: ColumnConfig } = {
    id: { displayName: '#', type: 'number', showFilter: true, visible: false },
    idCliente: { displayName: 'ID Cliente', type: 'number', showFilter: true, visible: false },
    cliente: { displayName: 'Cliente', type: 'default', showFilter: true, visible: true },
    activo: { displayName: 'Activo', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', showFilter: true, visible: true },
    fechaCreacion: { displayName: 'Creado', type: 'date', format: 'dd/MM/yyyy hh:mm a', showFilter: true, visible: true },
    usuarioCreadoPor: { displayName: 'Creado Por', type: 'default', showFilter: true, visible: true },
    fechaModificacion: { displayName: 'Modificado', type: 'date', format: 'dd/MM/yyyy hh:mm a', showFilter: true, visible: true },
    usuarioModificadoPor: { displayName: 'Modificado Por', type: 'default', showFilter: true, visible: true }
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

  constructor(
    public apiOperacionesService: ApiOperacionesService,
    public dialog: MatDialog
  ) {

   }

  ngOnInit(): void {
    this.retriveData();
  }

  // Funciones de la clase
  retriveData() {
    this.GetInfo();
  }

  cambiarEstado(item:any){

    // Console del formulario
    console.log('Formulario:', item);

    console.log('Item:', item);
    // item.activo = !item.activo;
    // this.apiDataAccess.actualizarDatos(item).subscribe(
    //   () => {
    //     this.triggerAlert(`Proveedor de diesel ${ item.activo ? 'activado' : 'desactivado'} exitosamente!`, 'success');
    //   },
    //   error => {
    //     console.log(error);
    //     this.triggerAlert('Error al cambiar el estado de Proveedor de diesel', 'danger');
    //   }
    // );
  }

  GetInfo() {
    this.isLoading = true;
    console.log('idCompania:', this.idCompania);
    this.apiOperacionesService.getClienteMarcaTractor(this.idCompania).subscribe(
      (data: any) => {
        console.log('Data:', data);
        this.datosOriginales = data;
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        this.showAlert = true;
        this.alertType = 'error';
        this.alertMessage = 'Ocurrió un error al obtener la información';
      }
    );
  }

  // Funciones de Crear
  onCreateClick(): void {
    const dataForModal = {
      TITULO_MODAL: 'Registrar Visita',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(ModalCrudCteMrcaComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto específico para creación
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  // Funciones de Editar
  onEditClick(item: any): void {
    console.log('Item:', item);

    const dataForModal = {
      TITULO_MODAL: 'Editar Visita',  // titulo para el modal
      TIPO_MODAL: 'EDIT',
      DATA: item
    };

    const dialogRef = this.dialog.open(ModalCrudCteMrcaComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto específico para edición
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  // Funciones de Detalle
  onDetailClick(item: any): void {
    console.log('Item:', item);

    const dataForModal = {
      TITULO_MODAL: 'Detalle Visita',  // titulo para el modal
      TIPO_MODAL: 'DETAIL',
      DATA: item
    };

    const dialogRef = this.dialog.open(ModalCrudCteMrcaComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto específico para detalle
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

}
