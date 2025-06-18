import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Personal } from 'src/app/models/RH/personal';
import { PersonalBanco } from 'src/app/models/RH/personalBanco';
import { ApiPersonalService } from 'src/app/DataAccess/HgTools/api-personal.service';
import { Banco } from 'src/app/models/RH/Banco';
import { StorageService } from 'src/app/Services/StorageService';
import { DisplayColumnConfigDF } from 'src/app/shared-module/Interfaces/DisplayColumnConfigDF';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { ApiServiceHandler } from 'src/app/DataAccess/apiServiceHandler';
import { NotificacionService } from 'src/app/shared-module/services/notificacion.service';
import { ApiRecursosHumanosService } from 'src/app/DataAccess/api-recursos-humanos.service';
import { forkJoin, Observable, catchError, of } from 'rxjs';
import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { ParametrosDropdownEmpleado, ParametrosDropdownPersonalBanco } from 'src/app/shared-module/configuracionDropdowns/parametrosGenerales.config';

@Component({
  selector: 'app-modal-crud-personalBanco',
  templateUrl: './modal-crud-personalBanco.component.html',
  styleUrls: ['./modal-crud-personalBanco.component.css']
})
export class ModalCrudPersonalBancoComponent {
  formulario: FormGroup = new FormGroup({});
  Personalbanco: PersonalBanco = new PersonalBanco();
  TITULO_MODAL: string = '';
  TIPO_MODAL: string = '';
  IS_EDITABLE: boolean = false;
  isLoading: boolean = false;
  showAlert = false;
  alertMessage = '';
  alertType = '';
  disabledPersonal: boolean = false;

  personal: Personal[] = [];
  personalSelected: Personal = new Personal();
  banco: Banco[] = [];

  // tiposMoneda: ElementoDetalle[] = [];
  // CAT_GRAL_TIPO_MONEDA = '64BA5C56-6CE1-43F1-9275-826D767C6ECE';

constructor(private fb: FormBuilder,
    public modal: MatDialogRef<ModalCrudPersonalBancoComponent>,
    private storageService: StorageService<PersonalBanco>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiHandler: ApiServiceHandler,
    private notificacionService: NotificacionService,
    private apiRh: ApiRecursosHumanosService,
  public apiPersonal: ApiPersonalService) {
  }

  columnPersonalConfigs: { [key: string]: ColumnConfig } = {
    idPersonal: { displayName: 'Id', type: 'default', showFilter: true, visible: true },
    nombreCompleto: { displayName: 'Personal', type: 'default', showFilter: true, visible: true }
  };
  displayColPersonal: DisplayColumnConfigDF = {
    identificador: 'idPersonal',
    separadorColumnas: ' - ',
    columnas: ['nombreCompleto']
  };
  parametros = ParametrosDropdownEmpleado;

  parametrosPersonal = ParametrosDropdownPersonalBanco;

  tableConfigs: TableConfig =
  {
    pageSizeOptions: [5],
    headerColumFontSize: 5,
    heightRow: 'auto'
  };

  seleccionaPersonal(personal: Personal): void {
    this.personalSelected = personal;
    this.formulario.get('idPersonal')?.setValue(personal.idPersonal);
  }

  ngOnInit() {
    this.getItemLocalStorage();
    this.initializeRequiredData();
  }

 getItemLocalStorage() {
    this.storageService.init('personalBancoActual');

    this.storageService.itemActual.subscribe(banco => {
      if (banco) {
        this.Personalbanco = banco;
        console.log('personal banco', banco);
      } else {
        console.log("No hay un elemento guardado en session");
      }
    });
  }

obtieneEmpleadoById(idPersonal: number): Observable<Personal | null>
{
  return this.apiHandler.getDatosAsync(() => this.apiPersonal.obtenerPersonalById(idPersonal), 'Personal') 
  .pipe(
    catchError(error => {
      console.error('Error al obtener el marca', error);
      return of(null);
    })
  );
}

  initializeRequiredData() {
    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Título por Defecto';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';

    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    this.Personalbanco = restOfData;
    
  
    if (this.TIPO_MODAL == 'CREATE') {
      this.IS_EDITABLE = true;
      this.Personalbanco = new PersonalBanco();
      this.disabledPersonal = true;
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.IS_EDITABLE = true;
      console.log('this.Personalbanco.idPersonal', this.Personalbanco.idPersonal);
      this.obtieneEmpleadoById(this.Personalbanco.idPersonal).subscribe(personal => {
        if (personal) {
          this.seleccionaPersonal(personal);
        }
        else
        {
          console.log('No se pudo obtener el empleado');
        }
      });
    } else {
      this.IS_EDITABLE = false;
    }
    this.isLoading = true;
    // this.apiHandler.getDatosAsync(() => this.apiGeneralService.obtenerRegistro(this.CAT_GRAL_TIPO_MONEDA,true), 'tipoMoneda')
    // .subscribe(tipoMoneda => {
    //   this.tiposMoneda = tipoMoneda;
    // });
    forkJoin({
      //personal: this.apiPersonal.obtenerPersonal(this.parametrosPersonal),
      banco: this.apiHandler.getDatosAsync(this.apiRh.obtenerBanco.bind(this.apiRh), 'banco')
      }).subscribe(({ banco }) => {
      this.isLoading = false;
      //this.personal = personal;
      this.banco = banco;
        //console.log('personal', personal);
        console.log('banco', banco);

        //this.personalSelected = this.personal.find(m => m.idPersonal === this.Personalbanco.idPersonal) ?? new personal();
       console.log('personalSelected', this.personalSelected);
       // this.personal = this.personal.filter(v => v.activo == true);
       //this.banco = this.banco.filter(v => v.activo == true);
    });

    this.formulario = this.fb.group({
      idPersonalBanco: [this.Personalbanco.idPersonalBanco],
      idPersonal: [this.Personalbanco.idPersonal],
      nombre: [this.Personalbanco.nombre],
      idBanco: [this.Personalbanco.idBanco],
      banco: [this.Personalbanco.banco],
      noCuenta: [this.Personalbanco.noCuenta, ],
      clave: [this.Personalbanco.clave],
      idCompania: [this.Personalbanco.idCompania],
      activo: [this.Personalbanco.activo],
      fechaCreacion: [this.Personalbanco.fechaCreacion],
      creadoPor: [this.Personalbanco.creadoPor],
      usuarioCreadoPor: [this.Personalbanco.usuarioCreadoPor],
      fechaModificacion: [this.Personalbanco.fechaModificacion],
      modificadoPor: [this.Personalbanco.modificadoPor],
      usuarioModificadoPor: [this.Personalbanco.usuarioModificadoPor]
    });
  }

  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;
    if (!isEditable) {
      this.storageService.itemActual.subscribe(itemStorage => {
        if (itemStorage) {
          this.formulario.reset({
            idPersonalBanco: itemStorage.idPersonalBanco,
            idPersonal: itemStorage.idPersonal,
            nombre: itemStorage.nombre, 
            idBanco: itemStorage.idBanco,
            banco: itemStorage.banco,
            noCuenta: itemStorage.noCuenta,
            clave: itemStorage.clave,
            idCompania: itemStorage.idCompania,
            activo: itemStorage.activo,
            fechaCreacion: itemStorage.fechaCreacion,
            creadoPor: itemStorage.creadoPor,
            usuarioCreadoPor: itemStorage.usuarioCreadoPor,
            fechaModificacion: itemStorage.fechaModificacion,
            modificadoPor: itemStorage.modificadoPor,
            usuarioModificadoPor: itemStorage.usuarioModificadoPor
          });
          
        } else {
          console.log("No hay un permisionario guardado en sesion.");
        }
      }   );
    }
  }

  onSubmit() {
    console.log('submit crear: ',  this.formulario.value);

    if (this.formulario.valid) {

      this.isLoading = true; // Muestra el indicador de carga

      const dataForm = this.formulario.value as PersonalBanco; //convertimos el formulario a el tipo de dato necesario

      if (this.TIPO_MODAL == 'EDIT' || this.TIPO_MODAL == 'DETAIL') {

        
        // Llama al método del servicio para actualizar 
        this.apiRh.actualizarPersonalBanco(dataForm).subscribe(
          (response) => {
              this.isLoading = false;
              this.notificacionService.showNotification('Banco actualizado exitosamente.', 'success');
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
          },
          (error) => {
            this.isLoading = false;
            this.notificacionService.showNotification('Error al actualizar. Por favor, intenta de nuevo más tarde.', 'error');
            console.error('Error al actualizar:', error);
          }
        );
      } else {
        console.log('submit crear: ', dataForm);
        // Llama al método del servicio para crear
       
        this.apiRh.enviarPersonalBanco(dataForm).subscribe(
          (response) => {
            if(!response.success){
              this.isLoading = false;
              this.notificacionService.showNotification(response.message, 'warning');
            }else{
              this.isLoading = false;
              this.notificacionService.showNotification('Registro creado exitosamente.', 'success');
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
              this.initializeRequiredData(); //resetea campos de formulario
            }
          },
          (error) => {
            console.log('ERROR CREAR', error.error.errors);
            this.isLoading = false;
            this.notificacionService.showNotification('Error al crear Concepto contable. Por favor, intenta de nuevo más tarde.', 'error');

          }
        );
      }
    } else {
      console.log('formulario no valido');
      this.notificacionService.showNotification('Formulario no valido', 'error');
    }
  }

  cerrarModal() {
    this.modal.close();
  }
}
