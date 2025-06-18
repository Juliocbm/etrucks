import { Component } from '@angular/core';
import { PersonalBanco } from 'src/app/models/RH/personalBanco';
import { ApiRecursosHumanosService } from 'src/app/DataAccess/api-recursos-humanos.service';
import { Router } from '@angular/router';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
// import { ModalCrudBancoComponent } from '../modal-crud-banco/modal-crud-banco.component';
import { ModalCrudPersonalBancoComponent } from '../modal-crud-personalBanco/modal-crud-personalBanco.component';
import { StorageService } from 'src/app/Services/StorageService';
import { Routes } from 'src/app/app-routes.constants';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-personalBanco-view',
  templateUrl: './personalBanco-view.component.html',
  styleUrls: ['./personalBanco-view.component.css']
})
export class PersonalBancoViewComponent {

  columnConfigs: { [key: string]: ColumnConfig } = {
    idPersonal: { displayName:'Id', type: 'default', showFilter: true, visible: true  }, 
    nombre: { displayName: 'Nombre', type: 'default', showFilter: true, visible: true },
    banco: { displayName: 'Razon social', type: 'default', showFilter: true, visible: true  },
    activo: { displayName: 'Estatus', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', showFilter: true, visible: true },
    fechaModificacion: { displayName: 'Modificado', type: 'date', format: 'dd/MM/yyyy', showFilter: true, startDate: null, endDate: null, visible: true  },
    usuarioModificadoPor: { displayName:'Modificado por', type: 'default', showFilter: true, visible: true  }
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
  
  isLoading: boolean = false;
  datos: PersonalBanco[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: PersonalBanco[] = [];

  constructor(
    private apiRecursosHumanos: ApiRecursosHumanosService,
    private storageService: StorageService<PersonalBanco>,
    private router: Router,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.storageService.init('personalBancoActual'); 
   this.retriveData();
  }

 
  onDetailClick(rowData: any) {
    this.storageService.changeItem(rowData);
    
    const dataForModal = {
      ...rowData, //item seleccionado en la tabla    
      TITULO_MODAL: 'Asignacion Banco',  // titulo para el modal
      TIPO_MODAL: 'DETAIL'
    };

    const dialogRef = this.dialog.open(ModalCrudPersonalBancoComponent, {
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
      TITULO_MODAL: 'Editar Asignacion',  // titulo para el modal
      TIPO_MODAL: 'EDIT'
    };

    const dialogRef = this.dialog.open(ModalCrudPersonalBancoComponent, {
      width: '800px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  onCreateClick() {
    const dataForModal = {
      TITULO_MODAL: 'Asignacion Banco',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(ModalCrudPersonalBancoComponent, {
      width: '800px',
      data: dataForModal // Pasa el objeto específico para creación
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

 

  retriveData(){
    this.isLoading = true;
    this.apiRecursosHumanos.obtenerPersonalBanco().subscribe(
      response => {
        this.datos = response;
        this.datosFiltrados = this.datos;
        this.isLoading = false;
      },
      error => {
        console.error('Ha ocurrido un error al obtener los datos', error);
        this.isLoading = false;
      }
    );
  }

  filtrarActivos(clave: boolean) {
    if (!clave) {
      this.datosFiltrados = this.datos;
    } else {

      this.datosFiltrados = this.datosFiltrados.filter(plaza => {
        return plaza.activo;
      });
    }
  }



}
