import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  Departamento,
  CompaniaDepartamento,
} from './../../../../models/RH/Departamento';
import { StorageService } from '../../../../Services/StorageService';
import { ApiRecursosHumanosService } from '../../../../DataAccess/api-recursos-humanos.service';
import { ApiSistemaGeneralService } from '../../../../DataAccess/api-sistema-general.service';
import { DisplayColumnConfigDF } from '../../../../shared-module/Interfaces/DisplayColumnConfigDF';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { ApiServiceHandler } from '../../../../DataAccess/apiServiceHandler';
import { NotificacionService } from '../../../../shared-module/services/notificacion.service';
import { ElementoDetalle } from '../../../../models/SistemaGeneral/ElementoDetalle';
import { ApiDespachoService } from '../../../../DataAccess/api-despacho.service';
import { Compania } from '../../../../models/Administrador/Compania';
import { forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { ApiAdministradorService } from '../../../../DataAccess/api-administrador.service';

@Component({
  selector: 'app-deparmento-crud-modal',
  templateUrl: './deparmento-crud-modal.component.html',
  styleUrls: ['./deparmento-crud-modal.component.css']
})
export class DeparmentoCrudModalComponent {

  formulario: FormGroup = new FormGroup({});
  departamento: Departamento = new Departamento();
  TITULO_MODAL: string = '';
  TIPO_MODAL: string = '';
  IS_EDITABLE: boolean = false;
  isLoading: boolean = false;
  showAlert = false;
  alertMessage = '';
  alertType = '';
  tipoCategoria: ElementoDetalle[] = [];
  companias: Compania[] = [];
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

  constructor(
    private fb: FormBuilder,
    public modal: MatDialogRef<DeparmentoCrudModalComponent>,
    private storageService: StorageService<Departamento>,
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

  cerrarModal() {
    this.modal.close();
  }

  ngOnInit() {
    this.getItemLocalStorage();
    this.initializeRequiredData();
  }

  getItemLocalStorage() {
    this.storageService.init('departamentoActual');

    this.storageService.itemActual.subscribe((departamento) => {
      if (departamento) {
        this.departamento = departamento;
      }
    });
  }

  initializeRequiredData() {
    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Título por Defecto';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';

    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    this.departamento = restOfData;

    if (this.TIPO_MODAL == 'CREATE') {
      this.IS_EDITABLE = true;
      this.departamento = new Departamento();
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.IS_EDITABLE = true;
    } else {
      this.IS_EDITABLE = false;
    }

    this.apiHandler
      .getDatosAsync(
        this.apiAdminAccess.obtenerCompanias.bind(this.apiAdminAccess),
        'compañias'
      )
      .subscribe((compañias) => {
        this.companias = compañias;
        this.iniCompania();
      });

    this.formulario = this.fb.group({
      idDepartamento: [this.departamento.idDepartamento],
      nombre: [this.departamento.nombre, [Validators.required]],
      clave: [this.departamento.clave, [Validators.required]],
      creadoPor: [this.departamento.creadoPor],
      activo: [this.departamento.activo],
      fechaCreacion: this.departamento.fechaCreacion,
      fechaModificacion: this.departamento.fechaModificacion,
      usuarioCreadoPor: [this.departamento.usuarioCreadoPor],
      usuarioModificadoPor: [this.departamento.usuarioModificadoPor],
      companiaDepartamento: [this.departamento.companiaDepartamento],
      companiasSelect: [this.departamento.companiasSelect],
      fechaCreacionForm: [
        formatDate(
          this.departamento.fechaCreacion,
          'yyyy-MM-dd hh:mm',
          'en-US'
        ),
      ],
      fechaModificacionForm: [
        formatDate(
          this.departamento.fechaModificacion,
          'yyyy-MM-dd hh:mm',
          'en-US'
        ),
      ],
    });
  }

  onSubmit() {
    this.validaCompania();

    if (this.formulario.valid) {
      this.isLoading = true; // Muestra el indicador de carga

      const dataForm = this.formulario.value as Departamento; //convertimos el formulario a el tipo de dato necesario

      if (this.TIPO_MODAL == 'EDIT' || this.TIPO_MODAL == 'DETAIL') {
        // Llama al método del servicio para actualizar
        this.ApiRHService.actualizarDepartamento(dataForm).subscribe(
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
                'Departamento actualizada exitosamente.',
                'success'
              );
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
            }
          },
          (error) => {
            this.isLoading = false;
            this.notificacionService.showNotification(
              'Error al actualizar Departamento. Por favor, intenta de nuevo más tarde.',
              'error'
            );
          }
        );
      } else {
        // Llama al método del servicio para crear

        this.ApiRHService.enviarDepartamento(dataForm).subscribe(
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
                'Departamento creada exitosamente.',
                'success'
              );
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
              this.initializeRequiredData(); //resetea campos de formulario
            }
          },
          (error) => {
            this.isLoading = false;
            this.notificacionService.showNotification(
              'Error al crear Departamento. Por favor, intenta de nuevo más tarde.',
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

  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;
    if (!isEditable) {
      this.storageService.itemActual.subscribe((itemStorage) => {
        if (itemStorage) {
          this.departamento = itemStorage;
          // Resetear los valores del formulario con itemStorage
          this.formulario.reset({
            idDepartamento: itemStorage.idDepartamento,
            nombre: itemStorage.nombre,
            clave: itemStorage.clave,
            activo: itemStorage.activo,
            creadoPor: itemStorage.creadoPor,
            modificadoPor: itemStorage.modificadoPor,
            fechaCreacion: itemStorage.fechaCreacion,
            fechaModificacion: itemStorage.fechaModificacion,
            companiasSelect: itemStorage.companiasSelect,
            usuarioCreadoPor: itemStorage.usuarioCreadoPor,
            usuarioModificadoPor: itemStorage.usuarioModificadoPor,
            fechaCreacionForm: [
              formatDate(
                itemStorage.fechaCreacion,
                'yyyy-MM-dd hh:mm',
                'en-US'
              ),
            ],
            fechaModificacionForm: [
              formatDate(
                itemStorage.fechaModificacion,
                'yyyy-MM-dd hh:mm',
                'en-US'
              ),
            ],
          });
          this.iniCompania();
          this.validaCompania();
        }
      });
    }
  }

  iniCompania() {
    let comp;
    if (this.TIPO_MODAL != 'CREATE') {
      this.departamento.companiasSelect = [];
      this.departamento.companiaDepartamento.forEach((c) => {
        comp = this.companias.find((s: any) => s.idCompania == c.idCompania);
        if (comp != null && c.activo) {
          c.activo = false;
          this.departamento.companiasSelect.push(comp);
        }
      });
    } else {
      comp = this.companias.find((s: any) => s.idCompania == this.idCompania);
      if (comp != null) this.departamento.companiasSelect.push(comp);
    }
    this.formulario.patchValue({
      companiasSelect: this.departamento.companiasSelect,
    });
  }

  validaCompania() {
    let companiasSelect = [...this.formulario.value.companiasSelect];
    let compDepto = [...this.departamento.companiaDepartamento];

    companiasSelect.forEach((c: any) => {
      const comp = compDepto.find((s: any) => s.idCompania == c.idCompania);
      if (comp == null) {
        let nuevoElemento: CompaniaDepartamento = {
          id: 0,
          idDepartamento: this.departamento.idDepartamento,
          idCompania: c.idCompania,
          activo: true,
          fechaCreacion: new Date(),
          creadoPor: this.idUsuario,
          fechaModificacion: new Date(),
          modificadoPor: this.idUsuario,
        };
        compDepto.push(nuevoElemento);
      } else {
        comp.activo = true;
      }
    });

    this.formulario.value.companiaDepartamento = compDepto;
  }

}
