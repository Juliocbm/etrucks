import { Component } from '@angular/core';
import { Banco } from '../../../../models/RH/Banco';
import { ApiRecursosHumanosService } from '../../../../DataAccess/api-recursos-humanos.service';
import { Router } from '@angular/router';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { TableAction } from '../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from '../../../../shared-module/Interfaces/TableConfig';
import { ModalCrudBancoComponent } from '../modal-crud-banco/modal-crud-banco.component';
import { StorageService } from '../../../../Services/StorageService';
import { Routes } from '../../../../app-routes.constants';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-banco-view',
  templateUrl: './banco-view.component.html',
  styleUrls: ['./banco-view.component.css']
})
export class BancoViewComponent {

  columnConfigs: { [key: string]: ColumnConfig } = {
    idBanco: { displayName:'Id', type: 'default', showFilter: true, visible: true  }, 
    nombre: { displayName: 'Nombre', type: 'default', showFilter: true, visible: true },
    razonSocial: { displayName: 'Razon social', type: 'default', showFilter: true, visible: true  },
    compania: { displayName: 'Compañia', type: 'default', showFilter: true, visible: true },
    tipoMoneda: { displayName: 'Tipo de moneda', type: 'default', showFilter: true, visible: true  },
    activo: { displayName: 'Estatus', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', showFilter: false, visible: true  },
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
  datos: Banco[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: Banco[] = [];

  constructor(
    private apiRecursosHumanos: ApiRecursosHumanosService,
    private storageService: StorageService<Banco>,
    private router: Router,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.storageService.init('bancoActual'); 
   this.retriveData();
  }

 
  onDetailClick(rowData: any) {
    this.storageService.changeItem(rowData);
    
    const dataForModal = {
      ...rowData, //item seleccionado en la tabla    
      TITULO_MODAL: 'Banco',  // titulo para el modal
      TIPO_MODAL: 'DETAIL'
    };

    const dialogRef = this.dialog.open(ModalCrudBancoComponent, {
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
      TITULO_MODAL: 'Banco',  // titulo para el modal
      TIPO_MODAL: 'EDIT'
    };

    const dialogRef = this.dialog.open(ModalCrudBancoComponent, {
      width: '800px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  onCreateClick() {
    const dataForModal = {
      TITULO_MODAL: 'Banco',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(ModalCrudBancoComponent, {
      width: '800px',
      data: dataForModal // Pasa el objeto específico para creación
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

 

  retriveData(){
    this.isLoading = true;
    this.apiRecursosHumanos.obtenerBanco().subscribe(
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

}
