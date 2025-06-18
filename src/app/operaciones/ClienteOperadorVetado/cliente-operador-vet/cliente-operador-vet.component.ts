import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { ApiOperacionesService } from 'src/app/DataAccess/api-operaciones.service';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { ModalCrudCteOpevComponent } from '../modal-crud-cte-opev/modal-crud-cte-opev.component';

@Component({
  selector: 'app-cliente-operador-vet',
  templateUrl: './cliente-operador-vet.component.html',
  styleUrls: ['./cliente-operador-vet.component.css']
})
export class ClienteOperadorVetComponent {
  alertMessage = '';
  alertType = '';
  showAlert = false;

  datosOriginales: any[] = [];
  isLoading: boolean = false;
  idCompania: number = Number(localStorage.getItem('CompaniaSelect') || 0);


  columnConfigs: { [key: string]: ColumnConfig } = {
    // id:                   { displayName: '#', type: 'number', showFilter: true, visible: false },
    idCliente:            { displayName: 'ID Cliente', type: 'number', showFilter: true, visible: false },
    cliente:              { displayName: 'Cliente', type: 'default', showFilter: true, visible: false },
    relIdYCliente:        { displayName: 'Cliente', type: 'default', showFilter: true, visible: true },
    idPersonal:           { displayName: 'ID Operador', type: 'number', showFilter: true, visible: false },
    personales:           { displayName: 'Operador', type: 'default', showFilter: true, visible: false },
    relIdYPersonal:       { displayName: 'Operador', type: 'default', showFilter: true, visible: true },
    activo:               { displayName: 'Activo', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', showFilter: true, visible: true },
    fechaCreacion:        { displayName: 'Creado', type: 'date', format: 'dd/MM/yyyy hh:mm a', showFilter: true, visible: false },
    usuarioCreadoPor:     { displayName: 'Creado Por', type: 'default', showFilter: true, visible: false },
    fechaModificacion:    { displayName: 'Modificado', type: 'date', format: 'dd/MM/yyyy hh:mm a', showFilter: true, visible: true },
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
    },
    {
      name: 'delete',
      title: 'Eliminar',
      icon: 'delete',
      tooltip: 'Eliminar',
      callback: (item) => this.onDeleteClick(item)
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
    this.apiOperacionesService.getCteOperadorVetado(this.idCompania).subscribe(
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
      TITULO_MODAL: 'Registrar Operador Vetados',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(ModalCrudCteOpevComponent, {
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
      TITULO_MODAL: 'Editar Operadores Vetados',  // titulo para el modal
      TIPO_MODAL: 'EDIT',
      DATA: item
    };

    const dialogRef = this.dialog.open(ModalCrudCteOpevComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto específico para edición
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  // Funciones de Eliminar
  onDeleteClick(item: any): void {
    console.log('Item:', item);

    // Variables que se enviarán al servicio para eliminar (id,idCliente,idPersonal,activo,creadorPor,modificadoPor,creado,modificado )
    const itemToDelete = {
      id: item.id,
      idCliente: item.idCliente,
      idPersonal: item.idPersonal,
      activo: false,
      creadoPor: item.creadoPor,
      modificadoPor: item.modificadoPor,
      creado: item.creado,
      modificado: new Date()
    };

    // Convertirlo a una lista por cada personal que exista.
    var lista = [];
    lista.push(itemToDelete);


    this.apiOperacionesService.deleteCteOperadorVetado(lista).subscribe(
      () => {
        console.log('Clientes Vetados eliminados !');
        // Recargar la tabla
        this.retriveData();
      },
      error => {
        console.log(error);
        // this.triggerAlert('Error al eliminar Proveedor de diesel', 'danger');
      }
    );
  }

  // Funciones de Detalle
  onDetailClick(item: any): void {
    console.log('Item:', item);

    const dataForModal = {
      TITULO_MODAL: 'Detalle de Operador vetado',  // titulo para el modal
      TIPO_MODAL: 'DETAIL',
      DATA: item
    };

    const dialogRef = this.dialog.open(ModalCrudCteOpevComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto específico para detalle
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }
}
