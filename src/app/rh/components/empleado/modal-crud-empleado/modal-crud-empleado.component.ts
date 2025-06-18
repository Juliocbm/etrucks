import { Sucursal } from 'src/app/models/RH/sucursal';
import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { StorageService } from '../../../../Services/StorageService';
import { ApiPersonalService } from 'src/app/DataAccess/HgTools/api-personal.service';
import { DisplayColumnConfigDF } from '../../../../shared-module/Interfaces/DisplayColumnConfigDF';
import { ApiSistemaGeneralService } from '../../../../DataAccess/api-sistema-general.service';
import { ApiAdministradorService } from 'src/app/DataAccess/api-administrador.service';
import { ApiRhService } from 'src/app/DataAccess/api-rh.service';
import { ApiServiceHandler } from '../../../../DataAccess/apiServiceHandler';
import { NotificacionService } from '../../../../shared-module/services/notificacion.service';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { TableAction } from '../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from '../../../../shared-module/Interfaces/TableConfig';
import { validarDominioCorreoAsync, validarFormatoCorreoAsync, validarDominioCorreoPersonalAsync, patterRfc, patterCURP, patterCP, patterNumber } from '../../../../shared-module/validations/validates';
import { forkJoin, map, retry, switchMap } from 'rxjs';
import { PersonalModel, FamiliaModel, PersonalEstatus, PersonalBaja, OperadorLicencia, PersonalSalud } from 'src/app/models/RH/Empleado/empleado';
import { ApiComedorService } from 'src/app/DataAccess/Comedor/api-comedor.service';
import { ApiCatGenDetService } from 'src/app/DataAccess/HgTools/api.catGeneralDet.service';
import { MatStepper } from '@angular/material/stepper';
import { formatDate } from '@angular/common';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { PersonalGafeteComponent } from '../personal-gafete/personal-gafete.component';
import { ElementoDetalle } from 'src/app/models/SistemaGeneral/ElementoDetalle';
import { ApiDespachoService } from 'src/app/DataAccess/api-despacho.service';
import { ModalImagenPreviewComponent } from '../../../../shared-module/components/modal-imagen-preview/modal-imagen-preview.component';
import { ModalImagenEditorComponent } from '../../../../shared-module/components/modal-imagen-editor/modal-imagen-editor.component';

/**
 * Componente para el modal de CRUD de Empleado
 */
@Component({
  selector: 'app-modal-crud-empleado',
  templateUrl: './modal-crud-empleado.component.html',
  styleUrls: ['./modal-crud-empleado.component.css']
})
export class ModalCrudEmpleadoComponent {
  @ViewChild('stepper') private myStepper!: MatStepper;
  @ViewChild('fileInput') fileInput!: ElementRef;
  foto: string = '';
  isLoading: boolean = true;
  onImageClick() {
    this.fileInput.nativeElement.click();
  }

  private readonly ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  private readonly MAX_FILE_SIZE = 200 * 1024; // 200KB en bytes

  onFileSelected(event: Event) {
    console.log('Estas en la seleccion de imagen');

    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar tipo de archivo
      if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        this.notificacionService.showNotification(
          'Por favor, seleccione un archivo de imagen válido (JPG, JPEG, PNG o WEBP)',
          'warning'
        );
        return;
      }

      // Validar tamaño
      if (file.size > this.MAX_FILE_SIZE) {
        this.notificacionService.showNotification(
          'El archivo debe tener un tamaño menor a 200KB',
          'warning'
        );
        return;
      }

      // Validar dimensiones mínimas
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width < 200 || img.height < 200) {
          this.notificacionService.showNotification(
            'La imagen debe tener al menos 200x200 píxeles',
            'warning'
          );
          URL.revokeObjectURL(img.src);
          return;
        }
        URL.revokeObjectURL(img.src);
        
        // Abrir el modal de edición de imagen
        const dialogRef = this.dialog.open(ModalImagenEditorComponent, {
          width: '800px',
          height: '600px',
          panelClass: 'editor-dialog',
          disableClose: true,
          data: { imageFile: file }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('El dialogo se ha cerrado, su resultado es:', result);

          if (result) {
            // Procesar la imagen recortada
            const base64Image = result;
            // Extraer solo la parte base64 sin el prefijo
            const base64 = base64Image.split(',')[1];
            
            // Convertir a hexadecimal con formato 0x y mayúsculas
            const raw = atob(base64);
            let hex = '0x';
            for (let i = 0; i < raw.length; i++) {
              const charCode = raw.charCodeAt(i).toString(16).toUpperCase();
              hex += charCode.length === 1 ? '0' + charCode : charCode;
            }
            
            // Actualizar los valores
            this.foto = hex; // Actualizar el valor en la propiedad
            this.personal.foto = this.foto; // Actualizar el valor en el modelo
            this.formulario.get('foto')?.setValue(this.foto); // Actualizar el valor en el formulario
            this.imagenUrl = this.convertHexToBase64(hex); // Actualizar la imagen

            // Mostrar notificación de éxito
            this.notificacionService.showNotification(
              'La imagen se ha actualizado correctamente',
              'success'
            );
          }
        });
      };
    }
  }

  convertHexToBase64(hex: string): string {
    if (!hex) return '';
    
    try {
      // Remover el prefijo '0x' si existe
      const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
      
      // Convertir hex a bytes
      const hexPairs = cleanHex.match(/[\dA-F]{2}/gi) || [];
      const bytes = hexPairs.map(pair => parseInt(pair, 16));
      
      // Convertir bytes a base64
      const byteArray = new Uint8Array(bytes);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error al convertir hex a base64:', error);
      this.notificacionService.showNotification(
        'Error al procesar la imagen',
        'error'
      );
      return '';
    }
  }

  showFullImage() {
    if (!this.imagenUrl) {
      this.notificacionService.showNotification(
        'No hay imagen cargada',
        'warning'
      );
      return;
    }

    const dialogRef = this.dialog.open(ModalImagenPreviewComponent, {
      width: '800px',
      height: '600px',
      panelClass: 'editor-dialog',
      disableClose: false,
      data: { imageUrl: this.imagenUrl }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si se editó la imagen en el preview
        const base64 = result.split(',')[1];
        
        // Convertir a hexadecimal con formato 0x y mayúsculas
        const raw = atob(base64);
        let hex = '0x';
        for (let i = 0; i < raw.length; i++) {
          const charCode = raw.charCodeAt(i).toString(16).toUpperCase();
          hex += charCode.length === 1 ? '0' + charCode : charCode;
        }
        
        // Actualizar los valores
        this.foto = hex;
        this.personal.foto = this.foto;
        this.formulario.get('foto')?.setValue(this.foto);
        this.imagenUrl = this.convertHexToBase64(hex);

        this.notificacionService.showNotification(
          'La imagen se ha actualizado correctamente',
          'success'
        );
      }
    });
  }

  formulario: FormGroup = new FormGroup({});
  personal: PersonalModel = new PersonalModel();
  TITULO_MODAL: string = '';
  TIPO_MODAL: string = '';
  IS_EDITABLE: boolean = false;
  IS_BAJA: boolean = false;
  IS_OPERADOR: boolean = false;

  activeStepIndex = 0;
  estadosPasos = [false, false, false];
  isLinear = false;

  idUsuario: string = "";
  showAlert = false;
  alertMessage = '';
  alertType = '';
  isCreate: boolean = false;
  dropdownList: any[] = [];
  companias: any[] = [];
  idMenu: string = "";
  idCompania = 0;
  dropdownSettings = {};

  sucursalSelect: Sucursal | undefined = new Sucursal();
  sucursalSelected: Sucursal[] = [];
  public sucursal: Sucursal[] = [];
  public estado: any[] = [];
  idEstado: number = 0;
  public municipio: any[] = [];
  public generos: any[] = [];
  public generosSelected: any[] = [];
  public generoSelect: any = [];
  public estadoCivil: any[] = [];
  idEstadoCivil: number = 0;
  public estadoCivilSelect: any = [];
  public nivelEscolar: any[] = [];
  public nivelEscolarSelect: any = [];
  public tipoContrato: any[] = [];
  public tipoContratoSelect: any = [];
  public categoria: any[] = [];
  public categoriaSelect: any = [];
  public departamento: any[] = [];
  public departamentoSelect: any = [];
  public estatusPersonal: any[] = [];
  public causaBaja: any[] = [];
  public categoriaLicencia: any[] = [];
  public tipoLicencia: any[] = [];
  public grupoSanguineo: any[] = [];
  public factorRh: any[] = [];
  idtipoLicencia = 0;
  public idTipoLicencia: string = '00000000-0000-0000-0000-000000000000';
  //idEstatusPersonal: string = '';
  //estatusActual = '';
  //causaBajaActual = '';
  estatusPersonalSelect: PersonalEstatus = new PersonalEstatus();
  causaBajaSelect: PersonalBaja = new PersonalBaja();

  nuevoEstatus: PersonalBaja = new PersonalBaja();
  personalSalud: PersonalSalud = new PersonalSalud();
  causaBajaActual = '';

  parentesco: any[] = [];
  parentescoSelect: any[] = [];
  causaAlta: any[] = [];
  tipoNomina: any[] = [];
  imagenUrl: SafeResourceUrl = '';

  esCasado: boolean = false;

  conceptosFacturables: FamiliaModel[] = [];
  familiaSelect: FamiliaModel[] = [];
  personalLicenciaSelect: OperadorLicencia[] = [];
  personalLicenciaSelected: OperadorLicencia  = new OperadorLicencia();
  vencimientoAptoMedico: Date = new Date();
  nomSucursal: string = '';
  idSucursal: number = 0;
  idSisTrucks:number = 1;

  maxDate: Date;
  minDate: Date;

  tipoLicenciaSelected: any[] = [];//ElementoDetalle | undefined = new ElementoDetalle();

  constructor(private fb: FormBuilder,
    public modal: MatDialogRef<ModalCrudEmpleadoComponent>,
    private storageService: StorageService<PersonalModel>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiHandler: ApiServiceHandler,
    private notificacionService: NotificacionService,
    private apiPersonal: ApiPersonalService,
    private apiRhService:ApiRhService,
    private apiComedor: ApiComedorService,
    private apiCatGenDet: ApiCatGenDetService,
    private apiAdminAccess: ApiAdministradorService,
    private apiDespacho: ApiDespachoService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,) {
    //this.idMenu = localStorage.getItem('idMenu') ?? '';
    this.idtipoLicencia = Number(localStorage.getItem('tipoLicenciaSelect')) ?? 0;
    const currentDate = new Date();
    this.maxDate = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    this.minDate = new Date(
      currentDate.getFullYear() - 120,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';

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

  columnConfigs: { [key: string]: ColumnConfig } = {
    idParentesco: { displayName: 'Parentesco', type: 'select', visible: true,editable: true, showFilter: false },
    nombre:{ displayName: 'Nombre', type: 'default', showFilter: false, editable: true, visible: true  },
    apellidoPaterno: { displayName: 'Apellido Paterno' , type: 'default',editable: true, showFilter: false, visible: true  },
    apellidoMaterno: { displayName: 'Apellido Materno' , type: 'default',editable: true, showFilter: false, visible: true  },
    telefono: { displayName: 'Telefono' , type: 'default',editable: true, showFilter: false, visible: true  }
  };

  columnConfigsLicencia: { [key: string]: ColumnConfig } = {
    idTipoLicencia: { displayName: 'Tipo Licencia', type: 'select', visible: true,editable: true, showFilter: false },
    folioLicencia:{ displayName: 'Folio Licencia', type: 'default', showFilter: false, editable: true, visible: true  },
    fechaVenceLicencia: { displayName: 'Vencimiento' , type: 'date', format:'dd/MM/yyyy',editable: false, showFilter: false, visible: true  }
  };

  tableActions: TableAction[] = [
    {
      name: 'eliminar',
      title: 'Eliminar',
      icon: 'clear',
      tooltip: 'Eliminar',
      callback: (item) => this.quitarConcepto(item)
    }

  ];

  tableActionsLicencia: TableAction[] = [
    {
      name: 'eliminar',
      title: 'Eliminar',
      icon: 'clear',
      tooltip: 'Eliminar',
      callback: (item) => this.quitarLicencia(item)
    }

  ];

  tableConfigs: TableConfig =
    {
      pageSizeOptions: [3],
      headerColumFontSize: 5,
      heightRow: 'auto'
    };

    quitarConcepto(data: any): void {
      const index = this.familiaSelect.indexOf(data);

      if (index > -1) {
        this.familiaSelect[index].activo = false;

        // let dataForm = this.formulario.value as PersonalModel;
        // dataForm.familiares = this.familiaSelect;
        this.personal.familiares = this.familiaSelect;

        this.familiaSelect = this.familiaSelect.filter((item: FamiliaModel) => item.activo == true);
        //console.log('1===================', this.familiaSelect);
        //console.log('2===================', this.personal.familiares);
        // this.familiaSelect.splice(index, 1);
        // this.familiaSelect = [...this.familiaSelect];
      }

      // this.conceptosFacturables = [...this.conceptosFacturables, data];
      // this.conceptosFacturables = [...this.conceptosFacturables];

      // if (this.conceptosFacturables.length > 0) {
      //   //this.agregaCF = false;
      //   this.formulario.get('idConceptoFacturable')?.setValue(this.conceptosFacturables[0]);
      // }
    }

    quitarLicencia(data: any): void {
      const index = this.personalLicenciaSelect.indexOf(data);
      if (index > -1)
      {
        //console.log('========antes del if=======', this.personalLicenciaSelect[index].id);
        this.personalLicenciaSelect[index].activo = false;
        if(this.personalLicenciaSelect[index].id != 0)
        {
          //console.log('========entro=======', this.personalLicenciaSelect[index].id);
        //this.personalLicenciaSelect = [...this.personalLicenciaSelect];
        let dataForm = this.formulario.value as PersonalModel;
        dataForm.operadorLicencias = this.personalLicenciaSelect;
        }


        this.personalLicenciaSelect = this.personalLicenciaSelect.filter((item: OperadorLicencia) => item.activo == true);
      }

    }

    agregarRegistro() {
      //console.log('agregarRegistro', this.familiaSelect);
      let familia = new FamiliaModel();
      familia.idPersonal = this.personal.idPersonal;
      familia.nombre = '';
      familia.apellidoPaterno = '';
      familia.apellidoMaterno = '';
      familia.telefono = '';
      familia.activo = true;
      familia.fechaNacimiento = new Date();
      familia.creadoPor = this.idUsuario;
      familia.modificadoPor = this.idUsuario;
      this.familiaSelect = [...this.familiaSelect, familia];
      this.personal.personalFamiliars.push(familia);
      //console.log('agregar familiar', this.personal.personalFamiliars)
    }

  agregarLicencia() {
    //console.log('agregarRegistro', this.familiaSelect);
    let licencia: OperadorLicencia = new OperadorLicencia();
    licencia.id = 0;
    licencia.idOperador = 0;
    licencia.idPersonal = this.personal.idPersonal;
    licencia.idTipoLicencia = this.personalLicenciaSelected.idTipoLicencia;//'2b25666c-ca35-47ad-9ad0-d87f6670b257';
    licencia.folioLicencia = this.personalLicenciaSelected.folioLicencia;
    licencia.fechaVenceLicencia = this.personalLicenciaSelected.fechaVenceLicencia;
    licencia.activo = true;
    licencia.fechaCreacion = new Date();
    licencia.creadoPor = this.idUsuario;
    licencia.fechaModificacion = new Date();
    licencia.modificadoPor = this.idUsuario;
    this.personalLicenciaSelect = [...this.personalLicenciaSelect, licencia];
    //this.personal.operadorLicencias.push(licencia);

    // let dataForm = this.formulario.value as PersonalModel;
    //     dataForm.operadorLicencias = this.personalLicenciaSelect;
    this.personal.operadorLicencias.push(licencia)
    const dataForm = this.formulario.value as PersonalModel;
    dataForm.operadorLicencias = [...(dataForm.operadorLicencias || []), licencia];
    this.formulario.patchValue({ operadorLicencias: dataForm.operadorLicencias });

    //console.log('funcion agregar licencias del operador => ', this.personal.operadorLicencias);
    this.idTipoLicencia = '';
    this.personalLicenciaSelected = new OperadorLicencia();
  }

  cerrarModal() {
    this.modal.close();
  }

  previousStep(){
    this.myStepper.previous();
  }

  nextStep(){
    this.myStepper.next();
  }

  ngOnInit() {

    this.getItemLocalStorage();
    this.initializeRequiredData();
  }

  getItemLocalStorage() {
    this.storageService.init('empleadoActual');

    this.storageService.itemActual.subscribe(person => {
      if (person) {
        this.personal = person;
        console.log('empleado',  this.personal );
      } else {
        //console.log("No hay un elemento guardado en session");
      }
    });
  }

  initializeRequiredData() {
  //this.isLoading = true;s
  //console.log('loading', this.isLoading);
    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Título por Defecto';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';

    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    this.personal = restOfData;

    if (this.TIPO_MODAL == 'CREATE') {
      this.personal = new PersonalModel();
      this.isCreate = true;
      this.IS_EDITABLE = true;
      this.isLinear = true;
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.IS_EDITABLE = true;
      this.isLinear = false;
    } else {
      this.IS_EDITABLE = false;
    }

    forkJoin([
      this.apiHandler.getDatosAsync(this.apiPersonal.obtenerCategorias.bind(this.apiPersonal), 'categoria'),
      this.apiHandler.getDatosAsync(this.apiAdminAccess.obtenerCompanias.bind(this.apiAdminAccess), 'compania'),
      this.apiHandler.getDatosAsync(this.apiPersonal.obtenerDepartamentos.bind(this.apiPersonal), 'departamento'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerEstados(), 'estado'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDetETrucks('0D2CECE8-B238-4DCF-A767-3D2C80CEB4DC'), 'tipoNomina'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDet('096BC7A4-AC0A-4F71-9CD8-9FEDB65EB731'), 'causaAlta'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDet('4D74E41F-762E-49DB-9E4A-8600357CFAB9'), 'sexo'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDet('5AA34BFD-0F00-41BD-AF63-46D4999B326C'), 'estadoCivil'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDet('2A46E80E-FDF8-468F-B659-527E8D0D8817'), 'nivelEscolar'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDet('A32F60F1-335B-4800-B097-937DD2E20555'), 'tipoContrato'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDet('4DE4A4A3-6E9E-402A-A536-B7FAF328726E'), 'parentesco'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDet('B22223C9-3DF6-4695-B44C-5D50C9D5D40E'), 'estatusPersonal'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDet('FAFF4008-7BA7-48F3-9C45-E3ABA9B2BBDE'), 'causaBaja'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDet('262239D9-E619-4B43-BBBE-981739CF922B'), 'categoriaLicencia'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDetETrucks('BA41CDAC-1478-4976-B9D0-07112D5431BB'), 'tipoLicencia'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDet('3F8C97A4-FA8B-49CE-A4EE-C7BC08C93F5F'), 'grupoSanguineo'),
      this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDet('E9D740AB-B4CE-4667-9A81-73830F217CF5'), 'factorRh'),
      this.apiHandler.getDatosAsync(() => this.apiDespacho.obtenerLicenciaOperador(this.personal.idPersonal), 'licenciasOperador'),
    ]).subscribe(([categoria, compania, departamento , estado, tipoNomina, causaAlta, sexo, estadoCivil, nivelEscolar, tipoContrato, parentesco, estatusPersonal, causaBaja, categoriaLicencia, tipoLicencia, grupoSanguineo, factorRh, licenciasOperador ]) => {
      this.categoria = categoria;
      // console.log('categoria', categoria);
      this.companias = compania;
      this.departamento = departamento;
      // console.log('departamento', departamento);
      this.generos = sexo;
      this.generosSelected = this.generos
      this.estadoCivil = estadoCivil;
      this.nivelEscolar = nivelEscolar;
      this.tipoContrato = tipoContrato;
      this.estado = estado;
      this.tipoNomina = tipoNomina;
      console.log('tipoNomina', tipoNomina);
      this.estatusPersonal = estatusPersonal
      this.causaBaja = causaBaja;
      this.categoriaLicencia = categoriaLicencia;
      this.tipoLicencia = tipoLicencia.map((p: any) => ({
        nombre: p.nombre,
        id: p.idCatGenDetalle
      }));
    this.tipoLicenciaSelected = [... this.tipoLicencia]
      //console.log('tipos de licencia /////====>', this.tipoLicencia);
      // .map((item: any) => ({
      //   nombre: item.nombre,
      //   idTipoLicencia: item.idCatGenDetalle
      // }));//.sort((a: { item_text: string }, b: { item_text: string }) => a.item_text.localeCompare(b.item_text));

      //this.sucursal = sucursal;
      //this.municipio = municipio;
      this.parentesco = parentesco.map((p: any) => ({
        nombre: p.nombre,
        id: p.idCatGenDetalle
      }));

      //console.log('obj inicial licencias => ',this.personalLicenciaSelected);

      this.parentescoSelect = [...this.parentesco];
      this.familiaSelect = [...this.personal.personalFamiliars];
      this.personalLicenciaSelect = licenciasOperador ?? new OperadorLicencia();
      //console.log('licencias', licenciasOperador);
      this.formulario.patchValue({operadorLicencias: this.personalLicenciaSelect});
      //this.personal.fechaAptoMedico = this.personalLicenciaSelect[0].vencimientoAptoMedico;
      if(this.personalLicenciaSelect.length > 0)
      {
        this.formulario.patchValue({fechaAptoMedico: this.personalLicenciaSelect[0].vencimientoAptoMedico});
      }

      this.foto = this.personal.foto;
      this.causaAlta = causaAlta;
      this.grupoSanguineo = grupoSanguineo;
      this.factorRh = factorRh;
      this.estatusPersonalSelect = this.personal.personalEstatus.find(s => s.activo === true) || new PersonalEstatus();
      this.causaBajaSelect = this.personal.personalBajas.find(s => s.activo === true) || new PersonalBaja();

      if(this.estatusPersonalSelect.idEstatus === '3722a7bf-7dd2-4128-8114-d11483d04ccb'){
        this.IS_BAJA = true;
      }
      //this.estatusActual = this.estatusPersonalSelect.estatus;
      //this.causaBajaActual = this.causaBajaSelect.estatus;
      this.nuevoEstatus = this.causaBajaSelect;
      //this.personalSalud = this.personal.personalSalud;
      this.causaBajaActual = this.causaBajaSelect.estatus || '';
      this.formulario.patchValue({idEstatusPersonal: this.estatusPersonalSelect.idEstatus});
      this.formulario.patchValue({estatusActual: this.estatusPersonalSelect.estatus || ''});

      this.formulario.patchValue({idCausaBajaPersonal: this.causaBajaSelect.idEstatus});
      this.formulario.patchValue({causaBajaActual: this.causaBajaSelect.estatus || ''});
      this.formulario.patchValue({observacionBaja: this.causaBajaSelect.observacion || ''});
      // console.log('categoriaLicencia', categoriaLicencia);
      // console.log('tipoLicencia', tipoLicencia);
      //this.initPersonalLicencia();
      if (this.TIPO_MODAL == 'EDIT') {
        this.tipoEmpleadoSelect();
      }
      this.personalSalud = this.personal.personalSalud[0] || new PersonalSalud();

      console.log('referncia lis => ', this.personal.idLisRef);

      this.isLoading = false;
    });
    this.formulario = this.fb.group({
      idPersonal: [this.personal.idPersonal],
      nombreCompleto: [this.personal.nombreCompleto],
      nombre: [this.personal.nombre, [Validators.required]],
      apellidoPaterno: [this.personal.apellidoPaterno, [Validators.required]],
      apellidoMaterno: [this.personal.apellidoMaterno, [Validators.required]],
      idSucursal: [this.personal.idSucursal, [Validators.required]],
      sucursal: [this.personal.sucursal],
      idCompania: [this.personal.idCompania],
      compania: [this.personal.compania],
      idDepartamento: [this.personal.idDepartamento, [Validators.required]],
      departamento: [this.personal.departamento],
      idCategoria: [this.personal.idCategoria, [Validators.required]],
      categoria: [this.personal.categoria],
      emailPersonal: [this.personal.emailPersonal, {
        asyncValidators: [validarDominioCorreoPersonalAsync(), validarFormatoCorreoAsync()],
        updateOn: 'change'
      }],
      email: [this.personal.email, {

        asyncValidators: [validarDominioCorreoAsync(), validarFormatoCorreoAsync()],
        updateOn: 'change'
      }],
      noNomina: [this.personal.noNomina,[Validators.required, Validators.min(1)]],
      rfc: [this.personal.rfc, {
        validators: [Validators.pattern(patterRfc),Validators.required],
        updateOn: 'change'
      }],
      curp: [this.personal.curp,
        {
          validators: [Validators.pattern(patterCURP),Validators.required],
          updateOn: 'change'
        }
      ],
      nss: [this.personal.nss, [ Validators.minLength(11),Validators.maxLength(11)]],
      colonia: [this.personal.colonia],
      calle: [this.personal.calle],
      noExterior: [this.personal.noExterior],
      codigoPostal: [this.personal.codigoPostal, {
        validators: [Validators.pattern(patterCP),Validators.required],
        updateOn: 'change'
      }],
      idMunicipio: [this.personal.idMunicipio],
      municipio: [this.personal.municipio],
      idEstado: [this.personal.idEstado],
      estado: [this.personal.estado],
      telefonoEmergencia: [this.personal.telefonoEmergencia, [Validators.minLength(10), Validators.maxLength(10)]],
      fechaNacimiento: [this.personal.fechaNacimiento],
      idLugarNacimiento: [this.personal.idLugarNacimiento],
      lugarNacimiento: [this.personal.lugarNacimiento],
      idGenero: [this.personal.idGenero],
      genero: [this.personal.genero],
      idEstadoCivil: [this.personal.idEstadoCivil, [Validators.required]],
      estadoCivil: [this.personal.estadoCivil],
      cantHijos: [this.personal.cantHijos],
      idNivelEscolar: [this.personal.idNivelEscolar],
      nivelEscolar: [this.personal.nivelEscolar],
      profesion: [this.personal.profesion],
      fechaIngreso: [this.personal.fechaIngreso],
      idTipoContrato: [this.personal.idTipoContrato],
      tipoContrato: [this.personal.tipoContrato],
      idCausaAlta: [this.personal.idCausaAlta],
      causaAlta: [this.personal.causaAlta],
      idUsuario: [this.personal.idUsuario],
      foto: [this.personal.foto],
      codigoBarras: [this.personal.codigoBarras],
      idPersonalRef: [this.personal.idPersonalRef],
      idLisRef: [this.personal.idLisRef],
      activo: [this.personal.activo],
      fechaCreacion:[this.personal.fechaCreacion],
      creadoPor: [this.personal.creadoPor],
      usuarioCreadoPor: [this.personal.usuarioCreadoPor],
      fechaModificacion:[this.personal.fechaModificacion],
      modificadoPor: [this.personal.modificadoPor],
      usuarioModificadoPor: [this.personal.usuarioModificadoPor],
      personalFamiliars: [this.personal.personalFamiliars],
      replicaRegistro: true,//[this.personal.replicaRegistro],
      idTipoNomina: [this.personal.idTipoNomina],
      tipoNomina: [this.personal.tipoNomina],
      personalEstatus: [this.personal.personalEstatus],
      personalBajas: this.fb.array(this.personal.personalBajas.map(baja => this.fb.group({ id: [baja.id], idPersonal: [baja.idPersonal], idEstatus: [baja.idEstatus], estatus: [baja.estatus], observacion: [baja.observacion], activo: [baja.activo], fechaCreacion: [baja.fechaCreacion], creadoPor: [baja.creadoPor], fechaModificacion: [baja.fechaModificacion], modificadoPor: [baja.modificadoPor] }))),

      idEstatusPersonal: [this.personal.idEstatusPersonal],
      estatusActual: [this.personal.estatusActual],

      idCausaBajaPersonal: [this.personal.idCausaBajaPersonal],
      causaBajaActual: [this.personal.causaBajaActual],
      observacionBaja: [this.personal.observacionBaja],
      //idTipoLicencia: [this.personal.idTipoLicencia],
      idCategoriaLicencia: [this.personal.idCategoriaLicencia],
      folioLicencia: [this.personal.folioLicencia],
      fechaVenceLicencia: [this.personal.fechaVenceLicencia],
      fechaAptoMedico: [this.personal.fechaAptoMedico],
      operadorLicencias: [this.personal.operadorLicencias],

      tipoLicenciaSelect: [this.personal.tipoLicenciaSelect],

      personalSalud: [this.personal.personalSalud]
    });

    //this.imagenUrl = this.convertirBase64ToSafeUrl(this.personal.foto);
    if(this.personal.idEstado != null && this.personal.idEstado != 0){
      this.obtenerMunicipios(this.personal.idEstado);
      //console.log('municipio de estado', this.municipio);
    }
    if(this.personal.idCompania != null && this.personal.idCompania != 0){
      this.obtenerSucursales(this.personal.idCompania);
      //console.log('sucursal de compania', this.sucursal);
    }

    const hexString = this.personal.foto;
    this.imagenUrl = this.convertHexToBase64(hexString);
    //console.log('imagenUrl', this.imagenUrl);
  }
  
  tipoEmpleadoSelect() {
      let categoriaEmpleado = this.personal.idCategoria;
      // console.log('categoriaEmpleado funcion => ', categoriaEmpleado);
      let tipoEmpleado = this.categoria.find((c: any) => c.idCategoria === categoriaEmpleado);
      // console.log('tipoEmpleado filtro por categoria', tipoEmpleado);
      // console.log('BCCD06B0-E289-4687-BE25-C6CB07165B81  id tipo empeado ====>', tipoEmpleado.idTipoCategoria);
      if(tipoEmpleado.idTipoCategoria === 'bccd06b0-e289-4687-be25-c6cb07165b81' || tipoEmpleado.idTipoCategoria === 'cee2e3b1-1581-4d2b-8cd6-d0ce01ca5b39')//se compara con id de operador
      {
        this.IS_OPERADOR = true;
        // console.log('IS_OPERADOR', this.IS_OPERADOR);
        //this.formulario.patchValue({idCategoriaLicencia: null});
      }
      else{
        this.IS_OPERADOR = false;
      }
  }
// Enviar This.Personal al component personal-gafete
verGafete() {
  console.log('Ver Gafete de', this.personal);

  // Limpiamos el storage y guardamos el item seleccionado
  this.storageService.changeItem(this.personal);

  this.onImprimirGafeteClick(this.personal);
}

onImprimirGafeteClick(rowData: any) {
  //console.log('onImprimirGafeteClick', rowData);
  this.storageService.changeItem(rowData);

  const dataForModal = {
    ...rowData, //item seleccionado en la tabla
    TITULO_MODAL: 'Imprimir Gafete',  // titulo para el modal
    TIPO_MODAL: 'DETAIL'
  };

  const dialogRef = this.dialog.open(PersonalGafeteComponent, {
    width: '1200px',
    height: '600px',
    data: dataForModal // Pasa el objeto extendido
  });

  dialogRef.afterClosed().subscribe(result => {
    // console.log('The dialog was closed');
    // console.log('result', result);
    this.retriveData();
  });
}

cambiarEstatusPersonal(event: any) {
  this.formulario.patchValue({idEstatusPersonal: event.value});
  //this.personal.idEstatusPersonal = event.value;
//console.log('CHANGE ESTATUS PERSONAL - event value', event.value);
  if(event.value !== '3722a7bf-7dd2-4128-8114-d11483d04ccb')
    {
      this.formulario.value.personalBajas.forEach((element: any) => {
        element.activo = false;
      });
      this.IS_BAJA = false;
      this.formulario.patchValue({activo: true});
      // console.log('causa baja', this.formulario.value.personalBajas)
      // console.log('CHANGE ESTATUS PERSONAL - IS_BAJA false', this.IS_BAJA);
    }
    else if (event.value == '3722a7bf-7dd2-4128-8114-d11483d04ccb')
    {
      this.IS_BAJA = true;
      this.formulario.patchValue({activo: false});
      //console.log('CHANGE ESTATUS PERSONAL - IS_BAJA true', this.IS_BAJA);
    }

  this.formulario.value.personalEstatus.forEach((element: any) => {
    element.activo = false;
  });
  const nuevoEstatus: PersonalEstatus = {
    id: 0,
    idPersonal: 0,
    idEstatus: event.value,
    estatus: '',
    activo: true,
    fechaCreacion: new Date(),
    creadoPor: this.idUsuario,
    fechaModificacion: new Date(),
    modificadoPor: this.idUsuario
  }
  this.formulario.value.personalEstatus.push(nuevoEstatus);
  //console.log('CHANGE ESTATUS PERSONAL', this.formulario.value.personalEstatus);
}

cambiarCausaBaja(event: any) {
  this.formulario.patchValue({idCausaBajaPersonal: event.value});
  //this.personal.idEstatusPersonal = event.value;
  this.formulario.value.personalBajas.forEach((element: any) => {
    element.activo = false;
  });
  const observacionValue = this.formulario.get('observacionBaja')?.value;
   this.nuevoEstatus = {
    id: 0,
    idPersonal: 0,
    idEstatus: event.value,
    estatus: '',
    observacion: '',
    activo: true,
    fechaCreacion: new Date(),
    creadoPor: this.idUsuario,
    fechaModificacion: new Date(),
    modificadoPor: this.idUsuario
  }
  this.formulario.value.personalBajas.push(this.nuevoEstatus);
  //console.log('CHANGE CAUSA BAJA PERSONAL', this.formulario.value.personalBajas);
}

cambiarTipoLicencia(event: any){
  this.personalLicenciaSelected.idTipoLicencia = event.value;
  //console.log('valor objeto tipo licencia', this.personalLicenciaSelected)
  //console.log('CHANGE TIPO LICENCIA =============>', event.value)
}

retriveData() {
  this.modal.close();
}

  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;
    if (!isEditable) {
      this.storageService.itemActual.subscribe(itemStorage => {
        if (itemStorage) {

          //this.generosSelected = this.generos.find(generos => generos.idCompania === itemStorage.idGenero);
          // Resetear los valores del formulario con itemStorage

            this.formulario.reset({
              idPersonal: itemStorage.idPersonal,
              nombreCompleto: itemStorage.nombreCompleto,
              nombre: itemStorage.nombre,
              apellidoPaterno: itemStorage.apellidoPaterno,
              apellidoMaterno: itemStorage.apellidoMaterno,
              idSucursal: itemStorage.idSucursal,
              sucursal: itemStorage.sucursal,
              idCompania: itemStorage.idCompania,
              compania: itemStorage.compania,
              idDepartamento: itemStorage.idDepartamento,
              departamento: itemStorage.departamento,
              idCategoria: itemStorage.idCategoria,
              categoria: itemStorage.categoria,
              emailPersonal: itemStorage.emailPersonal,
              email: itemStorage.email,
              noNomina: itemStorage.noNomina,
              rfc: itemStorage.rfc,
              curp: itemStorage.curp,
              nss: itemStorage.nss,
              colonia: itemStorage.colonia,
              calle: itemStorage.calle,
              noExterior: itemStorage.noExterior,
              codigoPostal: itemStorage.codigoPostal,
              idMunicipio: itemStorage.idMunicipio,
              municipio: itemStorage.municipio,
              idEstado: itemStorage.idEstado,
              estado: itemStorage.estado,
              telefonoEmergencia: itemStorage.telefonoEmergencia,
              fechaNacimiento: itemStorage.fechaNacimiento,
              idLugarNacimiento: itemStorage.idLugarNacimiento,
              lugarNacimiento: itemStorage.lugarNacimiento,
              idGenero: itemStorage.idGenero,
              genero: itemStorage.genero,
              idEstadoCivil: itemStorage.idEstadoCivil,
              estadoCivil: itemStorage.estadoCivil,
              cantHijos: itemStorage.cantHijos,
              idNivelEscolar: itemStorage.idNivelEscolar,
              nivelEscolar: itemStorage.nivelEscolar,
              profesion: itemStorage.profesion,
              fechaIngreso: itemStorage.fechaIngreso,
              idTipoContrato: itemStorage.idTipoContrato,
              tipoContrato: itemStorage.tipoContrato,
              idCausaAlta: itemStorage.idCausaAlta,
              causaAlta: itemStorage.causaAlta,
              idUsuario: itemStorage.idUsuario,
              foto: itemStorage.foto,
              codigoBarras: itemStorage.codigoBarras,
              idPersonalRef: itemStorage.idPersonalRef,
              idLisRef: itemStorage.idLisRef,
              activo: itemStorage.activo,
              fechaCreacion: itemStorage.fechaCreacion,
              creadoPor: itemStorage.creadoPor,
              usuarioCreadoPor: itemStorage.usuarioCreadoPor,
              fechaModificacion: new Date(),
              modificadoPor: itemStorage.modificadoPor,
              usuarioModificadoPor: itemStorage.usuarioModificadoPor,
              personalFamiliars: itemStorage.personalFamiliars,
              replicaRegistro: itemStorage.replicaRegistro,
              idTipoNomina: itemStorage.idTipoNomina,
              tipoNomina: itemStorage.tipoNomina,
              personalEstatus: itemStorage.personalEstatus,
              personalBajas: itemStorage.personalBajas,

              estatusActual: itemStorage.estatusActual,
              idEstatusPersonal: itemStorage.idEstatusPersonal,

              idCausaBajaPersonal: itemStorage.idCausaBajaPersonal,
              causaBajaActual: itemStorage.causaBajaActual,
              observacionBaja: itemStorage.observacionBaja,

              tipoLicenciaSelect: itemStorage.tipoLicenciaSelect,
              operadorLicencias: itemStorage.operadorLicencias,
              idCategoriaLicencia: itemStorage.idCategoriaLicencia,
              folioLicencia: itemStorage.folioLicencia,
              //idTipoLicencia: itemStorage.idTipoLicencia,
              fechaVenceLicencia: itemStorage.fechaVenceLicencia,
              fechaAptoMedico: itemStorage.fechaAptoMedico,

              personalSalud: itemStorage.personalSalud,

            });
        } else {
          //console.log("No hay un elemento guardado en sesion.");
        }
      });
    }
  }

async cambiarCategoriaEmpleado(event: any) {
    this.personal.idCategoria = event.value;
    //console.log('CHANGE CATEGORIA EMPLEADO', this.personal.idCategoria);
    //this.tipoEmpleadoSelect();
    this.tipoEmpleadoSelect();
  }
  async cambiarModuloSistema(event: any) {
    // this.idSucursal = event.value;
    // this.nomSucursal = event.source.triggerValue;
    // this.sucursalSelect = this.sucursal.find(s => s.idSucursal == this.idSucursal);

    //console.log('CHANGE SUCURSAL', this.idSucursal);

  }
  async cambiarEstadoCivil(event: any) {
    //this.idEstadoCivil = event.value;
    //this.estadoCivilSelect = this.estadoCivil.find(s => s.idCatGenDet == this.idEstadoCivil);
    //console.log('CHANGE ESTADO CIVIL', this.idEstadoCivil);
    if (this.formulario.get('idEstadoCivil')?.value === '4a5bdfec-6506-4a53-b2ad-e9fbd2045aa8') {
      this.parentescoSelect = this.parentescoSelect.filter(item => item.id !== '90042c07-d15d-4c07-835a-0851ca12f97e' && item.id !== 'e2f6ad31-7b5f-4ef4-a7db-c157a818ae81');
      //console.log('parentescoSelect', this.parentescoSelect);
      this.esCasado = true;
    }
    else
    {
      this.parentescoSelect = [...this.parentesco];
    }
    this.familiaSelect = [...this.familiaSelect];
  }

  cambiarCantidadHijos(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const nuevoValor = inputElement.value;
    const cantidadHijos = parseInt(nuevoValor, 10);
    //console.log('Cantidad de Hijos Cambiada:', nuevoValor);
    // Aquí puedes agregar la lógica que necesites
    this.familiaSelect = this.familiaSelect.filter(item => item.idParentesco !== '90042c07-d15d-4c07-835a-0851ca12f97e');
    for (let i = 0; i < cantidadHijos; i++) {

      let familia = new FamiliaModel();
      familia.idParentesco = '90042c07-d15d-4c07-835a-0851ca12f97e';
      familia.idPersonal = this.personal.idPersonal;
      familia.nombre = '';
      familia.apellidoPaterno = '';
      familia.apellidoMaterno = '';
      familia.telefono = '';
      familia.activo = true;
      familia.fechaNacimiento = new Date();
      this.familiaSelect = [...this.familiaSelect, familia];
  }
  // this.parentescoSelect = this.parentescoSelect.filter(item => item.id !== '90042c07-d15d-4c07-835a-0851ca12f97e');
  //     console.log('parentescoSelect', this.parentescoSelect);
}

  cambiarCompania(event: any) {
    this.idCompania = event.value;
    //console.log('CHANGE COMPANIA', this.idCompania);
    this.obtenerSucursales(this.idCompania);
  }
  obtenerSucursales(idCompania: number) {
    this.apiRhService.obtenerSucursales().subscribe(
      (response) => {
        if (response.length > 0) {
          //this.isLoading = false;
          //this.notificacionService.showNotification(response.message, 'warning');
          this.sucursal =  response;
          // console.log('response true', response);
          // console.log('sucursal true', this.sucursal);
        } else {
          this.sucursal = [...this.sucursal, response];
          // console.log('sucursal false', response);
        }
      },
      (error) => {
        this.isLoading = false;
        this.notificacionService.showNotification('Error al obtener las sucursales. Por favor, intenta de nuevo más tarde.', 'error');
        //console.error('Error al obtener municipios:', error);
      }
    );
  }
  async cambiarEstado(event: any) {
    this.idEstado = event.value;
    //console.log('CHANGE ESTADO', this.idEstado);

    this.obtenerMunicipios(this.idEstado);
  }

  obtenerMunicipios(idEstado: number)
  {
    this.apiCatGenDet.obtenerMunicipios(idEstado).subscribe(
      (response) => {
        if (response.length > 0) {
          //this.isLoading = false;
          //this.notificacionService.showNotification(response.message, 'warning');
          this.municipio =  response;
          // console.log('response true', response);
          // console.log('municipio true', this.municipio);
        } else {
          this.municipio = [...this.municipio, response];
          //console.log('municipio false', response);
        }
      },
      (error) => {
        this.isLoading = false;
        this.notificacionService.showNotification('Error al obtener municipios. Por favor, intenta de nuevo más tarde.', 'error');
        //console.error('Error al obtener municipios:', error);
      }
    );
  }
  cambiarObsBaja(event: any) {
   const personalBajas = this.formulario.get('personalBajas') as FormArray;
    const registroActivo = personalBajas.controls.find(control => control.get('activo')?.value === true);
    //console.log('registro actico', registroActivo);
    const observacionValue = this.formulario.get('observacionBaja')?.value;
    //console.log('cambio observacion', observacionValue);
    if (registroActivo)
      {
       // console.log('adentro de cambio observacion', observacionValue);
         registroActivo.get('observacion')?.setValue(observacionValue);
        }
    //console.log('observacionValue', observacionValue);
  }

  initPersonalLicencia(): void {
    if (this.TIPO_MODAL != 'CREATE') {

      this.personal.tipoLicenciaSelect = [];
      this.personal.operadorLicencias.forEach(c => {
        //console.log('ENTRO AL FOREACH');
        const comp = this.tipoLicencia.find((s: any) => s.item_id == c.idTipoLicencia);

        if (comp != null && c.activo) {
          //console.log('ENTRO AL IF');
          c.activo = true;
          this.personal.tipoLicenciaSelect.push(comp);
        }
      });

    } else {
      const comp = this.tipoLicencia.find((s: any) => s.item_id == this.idtipoLicencia);
      if (comp != null) {
        this.personal.tipoLicenciaSelect.push(comp);
      }
    }
    this.formulario.patchValue({ tipoLicenciaSelect: this.personal.tipoLicenciaSelect });
    //console.log('tipoLicenciaSelect ======>>>', this.personal.tipoLicenciaSelect);
  }


  // formatTipoLicenciaSelect(dataForm: PersonalModel) {
  //   console.log('dataForm - formartotipo licencia =>', dataForm.personalLicencias);

  //   if (dataForm.personalLicencias) {
  //     dataForm.tipoLicenciaSelect.forEach(c => {
  //       const det = dataForm.personalLicencias.find(cs => cs.idTipoLicencia == c.item_id);

  //       if (det != null) {
  //         det.activo = true;
  //         det.fechaModificacion = new Date();
  //         det.modificadoPor = this.idUsuario;
  //       } else {
  //         const nuevoElemento: PersonalLicencia = {
  //           id: 0,
  //           idPersonal: 0,
  //           idTipoLicencia: c.item_id,
  //           tipoLicencia: '',
  //           activo: true,
  //           fechaCreacion: new Date(),
  //           creadoPor: this.idUsuario,
  //           fechaModificacion: new Date(),
  //           modificadoPor: this.idUsuario
  //         };
  //         dataForm.personalLicencias.push(nuevoElemento);
  //       }
  //     });
  //   } else {
  //     console.error("personalLicencia is null.");
  //   }

  //   return dataForm;
  // }


  onSubmit() {

    let dataForm = this.formulario.value as PersonalModel;
      dataForm.idSucursal = this.idSucursal !== 0 ? this.idSucursal : dataForm.idSucursal;
      dataForm.foto = this.foto;
      dataForm.familiares = this.familiaSelect;
      this.formulario.patchValue({familiares: this.personal.personalFamiliars});
      //dataForm.operadorLicencias = this.personalLicenciaSelect;
      //console.log('======================== >> LICENCIA << ==============================', this.personalLicenciaSelect)
      //dataForm.operadorLicencias = this.personalLicenciaSelect;
      //dataForm.personalFamiliars = this.familiaSelect;
      if (!this.personalSalud.fechaCreacion) {
        this.personalSalud.fechaCreacion = new Date();
      }
      this.personalSalud.fechaModificacion = new Date();
      dataForm.personalSalud[0] = this.personalSalud;

    console.log('formulario', this.formulario);
    const count = this.familiaSelect.filter(item => item.idParentesco === '' || item.idParentesco === '00000000-0000-0000-0000-000000000000').length;
    const countHijos = this.familiaSelect.filter(item => item.idParentesco === '90042c07-d15d-4c07-835a-0851ca12f97e').length;
    //console.log('Count:', count);
    if (count > 0) {
      this.notificacionService.showNotification('Favor de seleccionar un parentesco.', 'warning');
      return
    }
    // if (countHijos > dataForm.cantHijos) {
    //   this.notificacionService.showNotification('La cantindad de hijos no es correcta.', 'warning');
    //   return;
    // }
    //console.log('dataForm', dataForm.foto);
    if (this.formulario.valid) {
      //this.formulario.value.idtipoLicencia = this.tipoLicenciaSelected?.idCatGenDetalle;

      //dataForm = this.formatTipoLicenciaSelect(dataForm);
      console.log('dataForm', dataForm);
      this.isLoading = true; // Muestra el indicador de carga
      //this.validarRolCompania();
      if (this.TIPO_MODAL == 'EDIT') {
        //console.log('submit editar: ', dataForm);
        // Llama al método del servicio para actualizar
        this.apiPersonal.putPersonal(dataForm).subscribe(
          (response) => {
            if (!response.success) {
              this.isLoading = false;
              this.notificacionService.showNotification(response.message, 'warning');
            } else {
              this.isLoading = false;
              this.notificacionService.showNotification('Empleado actualizado exitosamente.', 'success');
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
              this.cerrarModal();
            }
          },
          (error) => {
            this.isLoading = false;
            this.notificacionService.showNotification('Error al actualizar Usuario. Por favor, intenta de nuevo más tarde.', 'error');
            //console.error('Error al actualizar:', error);
          }
        );
      } else {
        //console.log('submit crear: ', dataForm);
        // Llama al método del servicio para crear

        this.apiPersonal.postPersonal(dataForm).subscribe(
          (response) => {
            if (!response.success) {
              this.isLoading = false;
              this.notificacionService.showNotification(response.message, 'warning');
            } else {
              this.isLoading = false;
              this.notificacionService.showNotification('Empelado registrado exitosamente.', 'success');
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
              // this.resetForm(); //resetea campos de formulario
              this.cerrarModal();
            }
          },
          (error) => {
            //console.log('ERROR CREAR', error.error.errors);
            this.isLoading = false;
            this.notificacionService.showNotification('Error al registrar el empleado. Por favor, intenta de nuevo más tarde.', 'error');

          }
        );
      }
    } else {
      //console.log('formulario no valido');
      this.notificacionService.showNotification('Algunos campos estan incompletos o no son correctos, favor de revisar', 'warning');
    }
  }

}
