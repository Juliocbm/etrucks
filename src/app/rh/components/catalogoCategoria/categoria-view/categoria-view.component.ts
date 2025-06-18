import { Component } from '@angular/core';
import { Categoria } from './../../../../models/RH/Categoria';
import { ApiRecursosHumanosService } from '../../../../DataAccess/api-recursos-humanos.service';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { TableAction } from '../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from '../../../../shared-module/Interfaces/TableConfig';
import { StorageService } from '../../../../Services/StorageService';
import { Routes } from '../../../../app-routes.constants';
import { MatDialog } from '@angular/material/dialog';
import { finalize, tap } from 'rxjs';
import { ModalCrudCategoriaComponent } from '../modal-crud-categoria/modal-crud-categoria.component';

@Component({
  selector: 'app-categoria-view',
  templateUrl: './categoria-view.component.html',
  styleUrls: ['./categoria-view.component.css']
})
export class CategoriaViewComponent {
  columnConfigs: { [key: string]: ColumnConfig } = {
    idCategoria: { displayName:'Id', type: 'default', showFilter: true, visible: true  }, 
    nombre: { displayName: 'Nombre', type: 'default', showFilter: true, visible: true },
    nomTipoCategoria: { displayName: 'Tipo departamento', type: 'default', showFilter: true, visible: true  },
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
  datos: Categoria[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: Categoria[] = [];

  constructor(
    private apiRecursosHumanos: ApiRecursosHumanosService,
    private storageService: StorageService<Categoria>,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.storageService.init('categoriaActual'); 
   this.retriveData();
  }

 
  onDetailClick(rowData: any) {
    this.storageService.changeItem(rowData);
    
    const dataForModal = {
      ...rowData, //item seleccionado en la tabla    
      TITULO_MODAL: 'Categoria',  // titulo para el modal
      TIPO_MODAL: 'DETAIL'
    };

    const dialogRef = this.dialog.open(ModalCrudCategoriaComponent, {
      width: '800px',
      height:'450px',
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
      TITULO_MODAL: 'Categoria',  // titulo para el modal
      TIPO_MODAL: 'EDIT'
    };

    const dialogRef = this.dialog.open(ModalCrudCategoriaComponent, {
      width: '800px',
      height:'450px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  onCreateClick() {
    const dataForModal = {
      TITULO_MODAL: 'Categoria',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(ModalCrudCategoriaComponent, {
      width: '800px',
      height:'450px',
      data: dataForModal // Pasa el objeto específico para creación
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  retriveData(){
    this.isLoading = true;
    this.apiRecursosHumanos.obtenerCategorias().subscribe(
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
