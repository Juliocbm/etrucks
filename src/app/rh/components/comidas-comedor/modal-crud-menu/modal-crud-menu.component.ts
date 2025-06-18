import {  Sucursal } from 'src/app/models/RH/sucursal';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario, UsuarioRol } from '../../../../models/Administrador/Usuario';
import { Rol } from '../../../../models/Administrador/Rol';
import { StorageService } from '../../../../Services/StorageService';
import { ApiComedorService } from 'src/app/DataAccess/Comedor/api-comedor.service';
import { DisplayColumnConfigDF } from '../../../../shared-module/Interfaces/DisplayColumnConfigDF';
import { ApiSistemaGeneralService } from '../../../../DataAccess/api-sistema-general.service';
import { ApiServiceHandler } from '../../../../DataAccess/apiServiceHandler';
import { NotificacionService } from '../../../../shared-module/services/notificacion.service';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { TableAction } from '../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from '../../../../shared-module/Interfaces/TableConfig';
import { validarDominioCorreoAsync, validarFormatoCorreoAsync } from '../../../../shared-module/validations/validates';
import { forkJoin, map, switchMap } from 'rxjs';
import { Menu } from 'src/app/models/Administrador/Menu';
import { MenuComedorModel } from 'src/app/models/RH/Comedor/Menu';

@Component({
  selector: 'app-modal-crud-menu',
  templateUrl: './modal-crud-menu.component.html',
  styleUrls: ['./modal-crud-menu.component.css']
})
export class ModalCrudMenuComponent {
  formulario: FormGroup = new FormGroup({});
  menuComedor: MenuComedorModel = new MenuComedorModel();
  TITULO_MODAL: string = '';
  TIPO_MODAL: string = '';
  IS_EDITABLE: boolean = false;
  isLoading: boolean = false;
  showAlert = false;
  alertMessage = '';
  alertType = '';
  isCreate: boolean = false;
  dropdownList: any[] = [];
  companias: any[] = [];
  idMenu: string = "";
  idCompania = 0;
  dropdownSettings = {};
  rolAsignado: Rol[] = [];
  rolListado: Rol[] = [];

  sucursalSelect: Sucursal | undefined = new Sucursal();
  sucursalSelected: Sucursal[] = [];
  public sucursal: any[] = [];
  nomSucursal: string = '';
  idSucursal: number = 0;
  idSisTrucks:number = 1;

  // tableConfigsRol: TableConfig =
  //   {
  //     pageSizeOptions: [3],
  //     headerColumFontSize: 5,
  //     heightRow: 'auto'
  //   };

  // columnConfigsRol: { [key: string]: ColumnConfig } = {
  //   id: { displayName: 'Id', type: 'default', visible: true, showFilter: false },
  //   nombre: { displayName: 'Nombre', type: 'default', visible: true, showFilter: true } ,
  //   sistema:{ displayName: 'Sistema', type: 'default', visible: true, showFilter: true } ,
  // };

  // tableActionsCatalogo: TableAction[] = [
  //   {
  //     name: 'Asignar',
  //     title: 'Asignar',
  //     icon: 'add',
  //     tooltip: 'Asignar',
  //     callback: (item) => this.asignarRol(item)
  //   }
  // ];

  // tableActionsAsignados: TableAction[] = [
  //   {
  //     name: 'Desasignar',
  //     title: 'Desasignar',
  //     icon: 'clear',
  //     tooltip: 'Desasignar',
  //     callback: (item) => this.desasignarRol(item)
  //   }
  // ];

  constructor(private fb: FormBuilder,
    public modal: MatDialogRef<ModalCrudMenuComponent>,
    private storageService: StorageService<MenuComedorModel>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiHandler: ApiServiceHandler,
    private notificacionService: NotificacionService,
    private apiComedor: ApiComedorService) {
    this.idMenu = localStorage.getItem('idMenu') ?? '';
    //this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;

  }


  cerrarModal() {
    this.modal.close();
  }

  ngOnInit() {

    this.getItemLocalStorage();
    this.initializeRequiredData();
  }

  getItemLocalStorage() {
    this.storageService.init('menuActual');
    
    this.storageService.itemActual.subscribe(menu => {
      if (menu) {
        this.menuComedor = menu;
        console.log('MENU',  this.menuComedor );
      } else {
        console.log("No hay un elemento guardado en session");
      }
    });
  }

  initializeRequiredData() {
    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Título por Defecto';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';

    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    this.menuComedor = restOfData;

    if (this.TIPO_MODAL == 'CREATE') {
      this.menuComedor = new MenuComedorModel();
      this.isCreate = true;
      this.IS_EDITABLE = true;
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.IS_EDITABLE = true;
    } else {
      this.IS_EDITABLE = false;
    }

     forkJoin([
      this.apiHandler.getDatosAsync(() => this.apiComedor.obtenerSucursales(1), 'sucursal')
     ]).subscribe(([sucursal ]) => {

       this.sucursal = sucursal.dataList;
     });

    //this.idSistema = 4;
    this.formulario = this.fb.group({
      idComida: [this.menuComedor.idComida],
      descripcion: [this.menuComedor.descripcion, [Validators.required]],
      precio: [this.menuComedor.precio, [Validators.required]],
      porcentajeSubsidio: [this.menuComedor.porcentajeSubsidio, [Validators.required]],
      idSucursal: [this.menuComedor.idSucursal, [Validators.required]],
      sucursal: [this.menuComedor.sucursal] ,
      creadoPor: [this.menuComedor.creadoPor],
      usuarioCreadoPor: [this.menuComedor.usuarioCreadoPor],
      modificadoPor: [this.menuComedor.modificadoPor],
      usuarioModificadoPor: [this.menuComedor.usuarioModificadoPor],
      fechaCreacion: [this.menuComedor.fechaCreacion],
      fechaModificacion: [this.menuComedor.fechaModificacion],
      activo: [this.menuComedor.activo],
    });
    
    
  }

  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;
    if (!isEditable) {
      this.storageService.itemActual.subscribe(itemStorage => {
        if (itemStorage) {

          // Resetear los valores del formulario con itemStorage
          this.formulario.reset({
            idComida: itemStorage.idComida,
            descripcion: itemStorage.descripcion,
            precio: itemStorage.precio,
            porcentajeSubsidio: itemStorage.porcentajeSubsidio,
            idSucursal: itemStorage.idSucursal,
            sucursal: itemStorage.sucursal,
            creadoPor: itemStorage.creadoPor,
            usuarioCreadoPor: itemStorage.usuarioCreadoPor,
            modificadoPor: itemStorage.modificadoPor,
            usuarioModificadoPor: itemStorage.usuarioModificadoPor,
            fechaCreacion: itemStorage.fechaCreacion,
            fechaModificacion: new Date(),
            activo: itemStorage.activo
          });
        } else {
          console.log("No hay un permisionario guardado en sesion.");
        }
      });
    }
  }


  async cambiarModuloSistema(event: any) {
    this.idSucursal = event.value;
    this.nomSucursal = event.source.triggerValue;
    this.sucursalSelect =this.sucursal.find(s => s.idSucursal ==  this.idSucursal);

    console.log('CHANGE SUCURSAL', this.idSucursal);
    
  }

  onSubmit() {
    const dataForm = this.formulario.value as MenuComedorModel;
      dataForm.idSucursal = this.idSucursal !== 0 ? this.idSucursal : dataForm.idSucursal;
    //console.log('formulario', this.formulario);
    if (this.formulario.valid) {

      this.isLoading = true; // Muestra el indicador de carga
      //this.validarRolCompania();
      if (this.TIPO_MODAL == 'EDIT') {
        console.log('submit editar: ', dataForm);
        // Llama al método del servicio para actualizar
        this.apiComedor.putMenu(dataForm).subscribe(
          (response) => {
            if (!response.success) {
              this.isLoading = false;
              this.notificacionService.showNotification(response.message, 'warning');
            } else {
              this.isLoading = false;
              this.notificacionService.showNotification('Platillo actualizado exitosamente.', 'success');
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
            }
          },
          (error) => {
            this.isLoading = false;
            this.notificacionService.showNotification('Error al actualizar Usuario. Por favor, intenta de nuevo más tarde.', 'error');
            console.error('Error al actualizar:', error);
          }
        );
      } else {
        console.log('submit crear: ', dataForm);
        // Llama al método del servicio para crear

        this.apiComedor.postMenu(dataForm).subscribe(
          (response) => {
            if (!response.success) {
              this.isLoading = false;
              this.notificacionService.showNotification(response.message, 'warning');
            } else {
              this.isLoading = false;
              this.notificacionService.showNotification('Platillo creado exitosamente.', 'success');
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
              // this.resetForm(); //resetea campos de formulario
            }
          },
          (error) => {
            console.log('ERROR CREAR', error.error.errors);
            this.isLoading = false;
            this.notificacionService.showNotification('Error al crear el platillo. Por favor, intenta de nuevo más tarde.', 'error');

          }
        );
      }
    } else {
      console.log('formulario no valido');
      this.notificacionService.showNotification('Formulario no valido', 'error');
    }
  }

  

}
