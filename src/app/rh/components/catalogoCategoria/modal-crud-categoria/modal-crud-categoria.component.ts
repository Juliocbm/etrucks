import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria, CompaniaCategoria } from '../../../../models/RH/Categoria';
import { Compania } from '../../../../models/Administrador/Compania';
import { StorageService } from '../../../../Services/StorageService';
import { ApiRecursosHumanosService } from '../../../../DataAccess/api-recursos-humanos.service';
import { ApiAdministradorService } from '../../../../DataAccess/api-administrador.service';
import { ApiSistemaGeneralService } from '../../../../DataAccess/api-sistema-general.service';
import { ApiServiceHandler } from '../../../../DataAccess/apiServiceHandler';
import { NotificacionService } from '../../../../shared-module/services/notificacion.service';
import { ElementoDetalle } from '../../../../models/SistemaGeneral/ElementoDetalle';
import { ApiDespachoService } from '../../../../DataAccess/api-despacho.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-modal-crud-categoria',
  templateUrl: './modal-crud-categoria.component.html',
  styleUrls: ['./modal-crud-categoria.component.css']
})

export class ModalCrudCategoriaComponent {
  formulario: FormGroup = new FormGroup({});
  categoria: Categoria = new Categoria();
  TITULO_MODAL: string = '';
  TIPO_MODAL: string = '';
  IS_EDITABLE: boolean = false;
  isLoading: boolean = true;
  showAlert = false;
  alertMessage = '';
  alertType = '';
  tipoCategoria: ElementoDetalle[] = [];
  companias: any[] = [];
  idUsuario: string = '';
  idCompania = 0;
  dropdownSettings = {
    singleSelection: false,
    idField: 'idCompania',
    textField: 'nombreCorto',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: false,
  };

  private CAT_GRAL_TIPO_CATEGORIA = 'B92D26A6-19D0-45C1-8092-15B16172B081';

  constructor(
    private fb: FormBuilder,
    public modal: MatDialogRef<ModalCrudCategoriaComponent>,
    private storageService: StorageService<Categoria>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ApiRHService: ApiRecursosHumanosService,
    private apiHandler: ApiServiceHandler,
    private notificacionService: NotificacionService,
    private apiGeneralService: ApiSistemaGeneralService,
    private apiDespachoService: ApiDespachoService,
    private apiAdminAccess: ApiAdministradorService
  ) {
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
  }

  ngOnInit() {
    this.getItemLocalStorage();
    this.initializeRequiredData();
  }

  getItemLocalStorage() {
    this.storageService.init('categoriaActual');

    this.storageService.itemActual.subscribe((categoria) => {
      if (categoria) {
        this.categoria = categoria;
      }
    });
  }

  initializeRequiredData() {
    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Título por Defecto';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';

    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    this.categoria = restOfData;

    if (this.TIPO_MODAL == 'CREATE') {
      this.IS_EDITABLE = true;
      this.categoria = new Categoria();
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.IS_EDITABLE = true;
    } else {
      this.IS_EDITABLE = false;
    }

    forkJoin({
      tipoCategoria: this.apiHandler.getDatosAsync(
        () =>
          this.apiGeneralService.obtenerRegistroV2(this.CAT_GRAL_TIPO_CATEGORIA, true),
        'tipos de categoria'
      ),
      companias:   this.apiHandler.getDatosAsync(
        this.apiAdminAccess.obtenerCompanias.bind(this.apiAdminAccess),
        'companias'
      ),
    }).subscribe(({ tipoCategoria, companias }) => {
      this.tipoCategoria = tipoCategoria;
      this.companias = companias;
    
      this.iniCompania();

      this.isLoading = false;
    });

    this.formulario = this.fb.group({
      idCategoria: [this.categoria.idCategoria],
      nombre: [this.categoria.nombre, [Validators.required]],
      idTipoCategoria: [this.categoria.idTipoCategoria],
      creadoPor: [this.categoria.creadoPor],
      activo: [this.categoria.activo],
      usuarioCreadoPor: [this.categoria.usuarioCreadoPor],
      usuarioModificadoPor: [this.categoria.usuarioModificadoPor],
      fechaCreacion: [this.categoria.fechaCreacion],
      fechaModificacion: [this.categoria.fechaModificacion],
      companiaCategoria: [this.categoria.companiaCategoria],
      companiasSelect: [this.categoria.companiasSelect],
      nomTipoCategoria: [this.categoria.nomTipoCategoria],
    });
  }

  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;
    if (!isEditable) {
      this.storageService.itemActual.subscribe((itemStorage) => {
        if (itemStorage) {
          this.categoria = itemStorage;
          // Resetear los valores del formulario con itemStorage
          this.formulario.reset({
            idCategoria: itemStorage.idCategoria,
            nombre: itemStorage.nombre,
            idTipoCategoria: itemStorage.idTipoCategoria,
            activo: itemStorage.activo,
            creadoPor: itemStorage.creadoPor,
            modificadoPor: itemStorage.modificadoPor,
            fechaCreacion: itemStorage.fechaCreacion,
            fechaModificacion: itemStorage.fechaModificacion,
            companiasSelect: itemStorage.companiasSelect,
            usuarioCreadoPor: itemStorage.usuarioCreadoPor,
            usuarioModificadoPor: itemStorage.usuarioModificadoPor,
            nomTipoCategoria: itemStorage.nomTipoCategoria,
          });
          this.iniCompania();
          this.validaCompania();
        }
      });
    }
  }

  onSubmit() {
    this.validaCompania();

    if (this.formulario.valid) {
      this.isLoading = true; // Muestra el indicador de carga

      const dataForm = this.formulario.value as Categoria; //convertimos el formulario a el tipo de dato necesario

      if (this.TIPO_MODAL == 'EDIT' || this.TIPO_MODAL == 'DETAIL') {
        // Llama al método del servicio para actualizar
        this.ApiRHService.actualizarCategoria(dataForm).subscribe(
          (response) => {
            if (!response.success) {
              this.isLoading = false;
              this.notificacionService.showNotification(
                response.message,
                'warning'
              );
            } else {
              this.isLoading = false;
              this.notificacionService.showNotification(
                'Categoría actualizada exitosamente.',
                'success'
              );
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
            }
          },
          (error) => {
            this.isLoading = false;
            this.notificacionService.showNotification(
              'Error al actualizar Categoría. Por favor, intenta de nuevo más tarde.',
              'error'
            );
          }
        );
      } else {
        // Llama al método del servicio para crear

        this.ApiRHService.enviarCategoria(dataForm).subscribe(
          (response) => {
            if (!response.success) {
              this.isLoading = false;
              this.notificacionService.showNotification(
                response.message,
                'warning'
              );
            } else {
              this.isLoading = false;
              this.notificacionService.showNotification(
                'Categoría creada exitosamente.',
                'success'
              );
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
              this.initializeRequiredData(); //resetea campos de formulario
            }
          },
          (error) => {
            this.isLoading = false;
            this.notificacionService.showNotification(
              'Error al crear Categoría. Por favor, intenta de nuevo más tarde.',
              'error'
            );
          }
        );
      }
    } else {
      this.notificacionService.showNotification(
        'Formulario no valido',
        'error'
      );
    }
  }

  iniCompania() {
    let comp;
    if (this.TIPO_MODAL != 'CREATE') {
      this.categoria.companiasSelect = [];
      this.categoria.companiaCategoria.forEach((c) => {
        comp = this.companias.find((s: any) => s.idCompania == c.idCompania);
        if (comp != null && c.activo) {
          c.activo = false;
          this.categoria.companiasSelect.push(comp);
        }
      });
    } else {
      comp = this.companias.find((s: any) => s.idCompania == this.idCompania);
      if (comp != null) this.categoria.companiasSelect.push(comp);
    }
    this.formulario.patchValue({
      companiasSelect: this.categoria.companiasSelect,
    });
  }

  validaCompania() {
    let companiasSelect = [...this.formulario.value.companiasSelect];
    let compCategoria = [...this.categoria.companiaCategoria];

    companiasSelect.forEach((c: any) => {
      const comp = compCategoria.find((s: any) => s.idCompania == c.idCompania);
      if (comp == null) {
        let nuevoElemento: CompaniaCategoria = {
          id: 0,
          idCategoria: this.categoria.idCategoria,
          idCompania: c.idCompania,
          activo: true,
          fechaCreacion: new Date(),
          creadoPor: this.idUsuario,
          fechaModificacion: new Date(),
          modificadoPor: this.idUsuario,
        };

        compCategoria.push(nuevoElemento);
      } else {
        comp.activo = true;
      }
    });
    this.formulario.value.companiaCategoria = compCategoria;
  }

  cerrarModal() {
    this.modal.close();
  }

}
