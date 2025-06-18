import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ApiAdministradorService } from 'src/app/DataAccess/api-administrador.service';
import { ApiRhService } from 'src/app/DataAccess/api-rh.service';
import { ApiSistemaGeneralService } from 'src/app/DataAccess/api-sistema-general.service';
import { ApiServiceHandler } from 'src/app/DataAccess/apiServiceHandler';
import { Sucursal, CompaniaSucursal, SucursalDetalle, SucursalGeocerca } from 'src/app/models/RH/sucursal';
import { ElementoDetalle } from 'src/app/models/SistemaGeneral/ElementoDetalle';
import { StorageService } from 'src/app/Services/StorageService';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { DisplayColumnConfigDF } from 'src/app/shared-module/Interfaces/DisplayColumnConfigDF';
import { NotificacionService } from 'src/app/shared-module/services/notificacion.service';
import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { Geocerca } from 'src/app/models/Mantenimiento/patio';
import { ApiMantenimientoService } from 'src/app/DataAccess/api-mantenimiento.service';
import { ParametrosDropdownEmpleado, ParametrosDropdownSucursales } from 'src/app/shared-module/configuracionDropdowns/parametrosGenerales.config';

@Component({
  selector: 'app-modal-crud-sucursal',
  templateUrl: './modal-crud-sucursal.component.html',
  styleUrls: ['./modal-crud-sucursal.component.css']
})
export class ModalCrudSucursalComponent implements OnInit {

  formulario: FormGroup = new FormGroup({});
  sucursal: Sucursal = new Sucursal();
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
  geocercas: any[] = [];
  idUsuario: string = "";
  idCompania = 0;
  idTipoSucursal = 0;
  dropdownSettings = {};
  geocercaSelected: Geocerca = new Geocerca();

  TIPO_SUCURSAL: string = '5A985BD3-D133-4A8F-B29E-EB646AD5C218';
  tipoSucursales: ElementoDetalle[] = [];
  tipoSucursalSelected: ElementoDetalle | undefined = new ElementoDetalle();

  constructor(private fb: FormBuilder,
    public modal: MatDialogRef<ModalCrudSucursalComponent>,
    private storageService: StorageService<Sucursal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiHandler: ApiServiceHandler,
    private notificacionService: NotificacionService,
    private apiRhService: ApiRhService,
    private apiAdminAccess: ApiAdministradorService,
    private apiSistemaGeneralService: ApiSistemaGeneralService,
    public apiMantenimiento: ApiMantenimientoService) {
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
    this.idTipoSucursal = Number(localStorage.getItem('TipoSucursalSelect')) ?? 0;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

      
  }

  columnPersonalConfigs: { [key: string]: ColumnConfig } = {
    idSitio: { displayName: 'Id', type: 'default', showFilter: true, visible: true },
    nombre: { displayName: 'Geocerca', type: 'default', showFilter: true, visible: true }
  };
  displayColPersonal: DisplayColumnConfigDF = {
    identificador: 'idSitio',
    separadorColumnas: ' - ',
    columnas: ['nombre']
  };
  parametros=ParametrosDropdownSucursales;

  parametrosPersonal = ParametrosDropdownEmpleado;

  tableConfigs: TableConfig =
  {
    pageSizeOptions: [5],
    headerColumFontSize: 5,
    heightRow: 'auto'
  };

   seleccionaGeocerca(geocerca: Geocerca): void {
    console.log('geocerca =========>', geocerca);
      this.geocercaSelected = geocerca;
      this.formulario.get('nombreGeocerca')?.setValue(geocerca.nombre);
    }

  cerrarModal() {
    this.modal.close();
  }

  ngOnInit() {

    this.getItemLocalStorage();
    this.initializeRequiredData();
  }

  getItemLocalStorage() {
    this.storageService.init('sucursalActual');
    this.storageService.itemActual.subscribe(sucursal => {
      if (sucursal) {
        this.sucursal = sucursal;
        console.log('sucursal', this.sucursal);
      } else {
        console.log("No hay un elemento guardado en session");
      }
    });
  }

  initializeRequiredData() {
    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Título por Defecto';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';
    this.isLoading = true;

    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    this.sucursal = restOfData;

    if (this.TIPO_MODAL == 'CREATE') {
      this.sucursal = new Sucursal();
      this.isCreate = true;
      this.IS_EDITABLE = true;
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.IS_EDITABLE = true;
    } else {
      this.IS_EDITABLE = false;
    }

    forkJoin([
      this.apiHandler.getDatosAsync(() => this.apiSistemaGeneralService.obtenerRegistroV2(this.TIPO_SUCURSAL), 'tipoSucursales'), // Traer tipos de sucursal
      this.apiHandler.getDatosAsync(this.apiAdminAccess.obtenerCompanias.bind(this.apiAdminAccess), 'companias'),
      //this.apiHandler.getDatosAsync(this.apiMantenimiento.obtenerGeocercasPatios.bind(this.apiMantenimiento), 'geocercas')
    ]).subscribe(([tipoSucursales, companias]) => {
      this.tipoSucursales = tipoSucursales
      .map((item: any) => ({
        item_id: item.idCatGenDetalle,
        item_text: item.nombre
      }))
      .sort((a: { item_text: string }, b: { item_text: string }) => a.item_text.localeCompare(b.item_text));

      //console.log('tipoSucursales', tipoSucursales);
      this.companias = companias.map((item: any) => ({
        item_id: item.idCompania,
        item_text: item.nombreCorto
      })).sort((a: { item_text: string }, b: { item_text: string }) => a.item_text.localeCompare(b.item_text));

      
      // this.geocercas = geocercas.map((item: any) => ({
      //   item_id: item.nameGeo,
      //   item_text: item.nameGeo
      // }));//.sort((a: { item_text: string }, b: { item_text: string }) => a.item_text.localeCompare(b.item_text));
      // console.log('geocercas', this.geocercas);
      //this.tipoSucursalSelected = this.tipoSucursales.find(s => s.idCatGenDetalle === this.sucursal.sucursalDetalle) || new ElementoDetalle();

      this.initCompaniaSucursal();
      this.initTipoSucursal();
      //this.initGeocercaSucursal();
      this.isLoading = false;
    });
    this.formulario = this.fb.group({
      idSucursal: [this.sucursal.idSucursal],
      nombre: [this.sucursal.nombre, [Validators.required]],
      idCompania: [this.sucursal.idCompania, [Validators.required]],
      compania: [this.sucursal.compania],
      clave: [this.sucursal.clave, [Validators.required]],
      idSucursalRef: [this.sucursal.idSucursalRef],
      activo: [this.sucursal.activo],
      creadoPor: [this.sucursal.creadoPor],
      usuarioCreadoPor: [this.sucursal.usuarioCreadoPor],
      modificadoPor: [this.sucursal.modificadoPor],
      usuarioModificadoPor: [this.sucursal.usuarioModificadoPor],
      fechaCreacion: [this.sucursal.fechaCreacion],
      fechaModificacion: [this.sucursal.fechaModificacion],
      sucursalDetalle: [this.sucursal.sucursalDetalle],
      tipoSucursalSelect: [this.sucursal.tipoSucursalSelect],
      companiaSucursal: [this.sucursal.companiaSucursal],
      companiasSelect: [this.sucursal.companiasSelect],
      // sucursalGeocerca: [this.sucursal.sucursalGeocerca],
      // geocercasSelect: [this.sucursal.geocercasSelect],
    });
  }

  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;
    if (!isEditable) {
      this.storageService.itemActual.subscribe(itemStorage => {
        if (itemStorage) {

          //this.tipoSucursalSelected = this.tipoSucursales.find(s => s.idCatGenDetalle === this.sucursal.idTipoSucursal);
          // Resetear los valores del formulario con itemStorage
          this.formulario.reset({
            idSucursal: itemStorage.idSucursal,
            nombre: itemStorage.nombre,
            idCompania: itemStorage.idCompania,
            compania: itemStorage.compania,
            clave: itemStorage.clave,
            idSucursalRef: itemStorage.idSucursalRef,
            activo: itemStorage.activo,
            creadoPor: itemStorage.creadoPor,
            usuarioCreadoPor: itemStorage.usuarioCreadoPor,
            modificadoPor: itemStorage.modificadoPor,
            usuarioModificadoPor: itemStorage.usuarioModificadoPor,
            fechaCreacion: itemStorage.fechaCreacion,
            fechaModificacion: itemStorage.fechaModificacion,
            sucursalDetalle: itemStorage.sucursalDetalle,
            tipoSucursalSelect: itemStorage.tipoSucursalSelect,
            companiaSucursal: itemStorage.companiaSucursal,
            companiasSelect: itemStorage.companiasSelect,
            // sucursalGeocerca: itemStorage.sucursalGeocerca,
            // geocercasSelect: itemStorage.geocercasSelect,
          });

        } else {
          console.log("No hay un permisionario guardado en sesion.");
        }
      });
    }
  }

  onSubmit() {

    this.formulario.value.idTipoSucursal = this.tipoSucursalSelected!.idCatGenDetalle;
    if (this.formulario.valid) {

      this.isLoading = true; // Muestra el indicador de carga
      this.formulario.value.idTipoSucursal = this.tipoSucursalSelected?.idCatGenDetalle;
      // const dataForm = this.formulario.value as Sucursal;
      let dataForm = this.formatCompaniaSelect(this.formulario.value);
      //dataForm = this.formatGeocercasSelect(this.formulario.value);

      console.log('onSubmit ==>  dataForm', dataForm);
      if (this.TIPO_MODAL == 'EDIT') {
        console.log('submit editar: ', dataForm);
        // Llama al método del servicio para actualizar
        this.apiRhService.actualizaSucursal(dataForm.idSucursal, dataForm).subscribe(
          (response) => {
            // if (!response.success) {
            //   this.isLoading = false;
            //   this.notificacionService.showNotification(response.message, 'warning');
            // } else {
            //   this.isLoading = false;
            //   this.notificacionService.showNotification('Sucursal actualizada exitosamente.', 'success');
            //   this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
            // }
            this.isLoading = false;
            this.notificacionService.showNotification('Sucursal actualizada exitosamente.', 'success');
            this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
          },
          (error) => {
            this.isLoading = false;
            if (error.status == 422) {
              this.notificacionService.showNotification(error.error, 'warning');
            } else {
              this.notificacionService.showNotification('Error al actualizar la Sucursal. Por favor, intenta de nuevo más tarde.', 'error');
            }
            console.error('Error al actualizar:', error);
          }
        );
      } else {
         console.log('submit crear: ', dataForm);
        // // Llama al método del servicio para crear

        this.apiRhService.enviarSucursal(dataForm).subscribe(
          (response) => {
            // if (!response.success) {
            //   this.isLoading = false;
            //   this.notificacionService.showNotification(response.message, 'warning');
            // } else {
            //   this.isLoading = false;
            //   this.notificacionService.showNotification('Sucursal creada exitosamente.', 'success');
            //   this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
            // }
            this.isLoading = false;
            this.notificacionService.showNotification('Sucursal creada exitosamente.', 'success');
            this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
          },
          (error) => {
            this.isLoading = false;
            if (error.status == 422) {
              this.notificacionService.showNotification(error.error, 'warning');
            } else {
              this.notificacionService.showNotification('Error al crear la Sucursal. Por favor, intenta de nuevo más tarde.', 'error');
            }
            console.log('ERROR CREAR', error.error.errors);
          }
        );
      }
    } else {
      console.log('formulario no valido');
      this.notificacionService.showNotification('Formulario no valido', 'error');
    }
  }

  initCompaniaSucursal(): void {

    if (this.TIPO_MODAL != 'CREATE') {
      console.log('compania sucursal from', this.sucursal.companiaSucursal)
      this.sucursal.companiasSelect = [];
      this.sucursal.companiaSucursal.forEach(c => {
        const comp = this.companias.find((s: any) => s.item_id == c.idCompania);
        console.log('ENTROOOO!! compania sucursal', comp);
        if (comp != null && c.activo) {
          c.activo = false;
          this.sucursal.companiasSelect.push(comp);
        }
      });

    } else {
      const comp = this.companias.find((s: any) => s.item_id == this.idCompania);
      if (comp != null) {
        this.sucursal.companiasSelect.push(comp);
      }
    }
    this.formulario.patchValue({ companiasSelect: this.sucursal.companiasSelect });
  }

  formatCompaniaSelect(dataForm: Sucursal) {
    console.log('dataForm', dataForm.companiaSucursal);
    dataForm.companiasSelect.forEach(c => {

      const compania = dataForm.companiaSucursal.find(cs => cs.idCompania == c.item_id);
      if (compania != null) {
        compania.activo = true;
        compania.fechaModificacion = new Date();
        compania.modificadoPor = this.idUsuario;
      } else {
        const nuevoElemento: CompaniaSucursal = {
          id: 0,
          idSucursal: 0,
          idCompania: c.item_id,
          activo: true,
          fechaCreacion: new Date(),
          creadoPor: this.idUsuario,
          fechaModificacion: new Date(),
          modificadoPor: this.idUsuario
        };
        dataForm.companiaSucursal.push(nuevoElemento);
      }

    });

    dataForm.tipoSucursalSelect.forEach(c => {

      const det = dataForm.sucursalDetalle.find(cs => cs.idTipoSucursal == c.item_id);
      if (det != null) {
        det.activo = true;
        det.fechaModificacion = new Date();
        det.modificadoPor = this.idUsuario;
      } else {
        const nuevoElemento: SucursalDetalle = {
          idSucursalDetalle: 0,
          idSucursal: 0,
          idTipoSucursal: c.item_id,
          activo: true,
          fechaCreacion: new Date(),
          creadoPor: this.idUsuario,
          fechaModificacion: new Date(),
          modificadoPor: this.idUsuario
        };
        dataForm.sucursalDetalle.push(nuevoElemento);
      }

    });

    return dataForm;
  }

  initTipoSucursal(): void {

    if (this.TIPO_MODAL != 'CREATE') {

      this.sucursal.tipoSucursalSelect = [];
      this.sucursal.sucursalDetalle.forEach(c => {
        const comp = this.tipoSucursales.find((s: any) => s.item_id == c.idTipoSucursal);

        if (comp != null && c.activo) {
          c.activo = false;
          this.sucursal.tipoSucursalSelect.push(comp);
        }
      });

    } else {
      const comp = this.tipoSucursales.find((s: any) => s.item_id == this.idTipoSucursal);
      if (comp != null) {
        this.sucursal.tipoSucursalSelect.push(comp);
      }
    }
    this.formulario.patchValue({ tipoSucursalSelect: this.sucursal.tipoSucursalSelect });
  }

  formatTipoSucursalSelect(dataForm: Sucursal) {

    dataForm.tipoSucursalSelect.forEach(c => {

      const det = dataForm.sucursalDetalle.find(cs => cs.idTipoSucursal == c.item_id);
      if (det != null) {
        det.activo = true;
        det.fechaModificacion = new Date();
        det.modificadoPor = this.idUsuario;
      } else {
        const nuevoElemento: SucursalDetalle = {
          idSucursalDetalle: 0,
          idSucursal: 0,
          idTipoSucursal: c.item_id,
          activo: true,
          fechaCreacion: new Date(),
          creadoPor: this.idUsuario,
          fechaModificacion: new Date(),
          modificadoPor: this.idUsuario
        };
        dataForm.sucursalDetalle.push(nuevoElemento);
      }

    });

    return dataForm;
  }
  // initGeocercaSucursal(): void {

  //   if (this.TIPO_MODAL != 'CREATE') {
  //     console.log('compania sucursal from', this.sucursal.sucursalGeocerca)
  //     this.sucursal.geocercasSelect = [];
  //     this.sucursal.sucursalGeocerca.forEach(c => {
  //       const comp = this.geocercas.find((s: any) => s.item_id == c.nombreGeocerca);
        
  //       if (comp != null && c.activo) {
  //         console.log('ENTROOOO!! geocerca sucursal ************', comp);
  //         c.activo = false;
  //         this.sucursal.geocercasSelect.push(comp);
  //       }
  //     });

  //   } else {
  //     console.log('holaaaaaaaaa');
  //     const comp = this.geocercas.find((s: any) => s.item_id == this.idCompania);
  //     if (comp != null) {
  //       this.sucursal.geocercasSelect.push(comp);
  //     }
  //   }
  //   this.formulario.patchValue({ geocercasSelect: this.sucursal.geocercasSelect });
  // }

  // formatGeocercasSelect(dataForm: Sucursal) {

  //   dataForm.geocercasSelect.forEach(c => {

  //     const det = dataForm.sucursalGeocerca.find(cs => cs.nombreGeocerca == c.item_id);
  //     if (det != null) {
  //       det.activo = true;
  //       det.creado = new Date();
  //       det.modificadoPor = this.idUsuario;
  //     } else {
  //       const nuevoElemento: SucursalGeocerca = {
  //         idSucursalGeocerca: 0,
  //         idSucursal: 0,
  //         idTipoSucursal: null,
  //         nombreGeocerca: c.item_id,
  //         idCompania: this.sucursal.idCompania,
  //         activo: true,
  //         creado: new Date(),
  //         creadoPor: this.idUsuario,
  //         modificado: new Date(),
  //         modificadoPor: this.idUsuario
  //       };
  //       dataForm.sucursalGeocerca.push(nuevoElemento);
  //     }

  //   });

  //   return dataForm;
  // }
}
