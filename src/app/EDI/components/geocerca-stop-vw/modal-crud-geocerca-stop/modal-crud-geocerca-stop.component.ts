import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapboxService } from 'src/app/shared-module/services/mapbox.service';
import { ApiEdiService } from 'src/app/DataAccess/Edi/api-edi.service';
import { ApiMantenimientoService } from 'src/app/DataAccess/api-mantenimiento.service';
import { NotificacionService } from 'src/app/shared-module/services/notificacion.service';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { DisplayColumnConfigDF } from 'src/app/shared-module/Interfaces/DisplayColumnConfigDF';
import { TimeService } from 'src/app/shared-module/services/time.service';
import { Geocercas } from 'src/app/models/Edi/VwEdiClienteParadasGeocercaDto';
import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import {
  ParametrosDropdownConexionDetalle,
  ParametrosDropdownEdiClienteParada,
  ParametrosDropdownEvento,
  ParametrosDropdownGeocerca,
  ParametrosDropdownTipoParada,
} from 'src/app/shared-module/configuracionDropdowns/parametrosGenerales.config';

@Component({
  selector: 'app-modal-crud-geocerca-stop',
  templateUrl: './modal-crud-geocerca-stop.component.html',
  styleUrls: ['./modal-crud-geocerca-stop.component.css'],
})
export class ModalCrudGeocercaStopComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  TITULO_MODAL = '';
  TIPO_MODAL = '';
  IS_EDITABLE = false;
  form!: FormGroup;
  title: string = 'MODAL CRUD GEOCERCA STOP';
  geocercas: Geocercas[] = [];
  loading = false;
  private mapInitialized = false;
  private idUsuario: string = localStorage.getItem('idUsuario') ?? '';

  // Selected values for dropdowns
  ediClienteParadaSelected: any = {};
  geocercasSelected: Geocercas[] = [];

  // Column configurations for dropdowns
  columnConfigsEdiClienteParadas: { [key: string]: ColumnConfig } = {
    idEdiClienteParadas: {
      displayName: 'ID',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    clienteParada: {
      displayName: 'CLIENTE PARADA',
      type: 'default',
      showFilter: true,
      visible: true,
    },
  };

  displayColumnConfigDFEdiClienteParadas: DisplayColumnConfigDF = {
    identificador: 'idEdiClienteParadas',
    separadorColumnas: ' - ',
    columnas: ['clienteParada'],
  };

  // Update column configurations for geocerca
  columnConfigsGeocerca: { [key: string]: ColumnConfig } = {
    idGeocerca: {
      displayName: 'ID',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    geocerca: {
      displayName: 'NOMBRE',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    puntos: {
      displayName: 'PUNTOS',
      type: 'default',
      showFilter: false,
      visible: false,
    },
  };

  displayColumnConfigDFGeocerca: DisplayColumnConfigDF = {
    identificador: 'idGeocerca',
    separadorColumnas: ' - ',
    columnas: ['geocerca'],
  };

  // Parameters for dropdowns
  parametrosConexionDetalle = ParametrosDropdownConexionDetalle;

  parametrosTipoParada = ParametrosDropdownTipoParada;

  parametrosEvento = ParametrosDropdownEvento;

  parametrosEdiClienteParada = ParametrosDropdownEdiClienteParada;

  // parametrosGeocerca: ParametrosGenerales = {
  //   ordenarPor: 'nameGeo',
  //   descending: false,
  //   noPagina: 1,
  //   tamanoPagina: 5,
  //   idCompania: Number(localStorage.getItem('CompaniaSelect')),
  //   activos: true,
  //   //filter: '',
  //   filtrosPorColumna: {},
  //   filtrosIniciales: {},
  //   multiIds: '',
  //   actionMulti: ''
  // };

  // Table configurations
  tableConfigsEdiClienteParadas = {
    showSearch: true,
    showHeader: true,
    showPaginator: true,
    isPaginationServer: true,
    pageSize: 5,
    pageSizeOptions: [5, 10, 20],
  };

  tableConfigsGeocerca = {
    showSearch: true,
    showHeader: true,
    showPaginator: true,
    isPaginationServer: true,
    pageSize: 5,
    pageSizeOptions: [5, 10, 20],
  };

  formulario: FormGroup = new FormGroup({});
  selectedGeocerca: any = {};
  parametrosGeocerca = ParametrosDropdownGeocerca;

  onSeleccionaGeocerca(geocerca: any) {
    this.selectedGeocerca = geocerca;
    this.formulario.patchValue({ idGeocerca: geocerca.idGeocerca });
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalCrudGeocercaStopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiEDI: ApiEdiService,
    public apiMantenimiento: ApiMantenimientoService,
    private notificacionService: NotificacionService,
    private mapboxService: MapboxService,
    private timeService: TimeService
  ) {
    this.TITULO_MODAL = data.title || 'MODAL CRUD GEOCERCA STOP';
    this.TIPO_MODAL = data.mode || 'create';
    this.IS_EDITABLE = data.mode !== 'view';
  }

  ngOnInit() {
    this.initForm();
    if (this.data.item) {
      this.setFormData();
    }
  }

  ngAfterViewInit() {
    if (this.data.type === 'ediClienteParadasGeocerca') {
      this.initializeMap();
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  private async initializeMap() {
    try {
      await this.mapboxService.initializeMap('map');
      this.mapInitialized = true;

      if (this.geocercasSelected && this.geocercasSelected.length > 0) {
        this.geocercasSelected.forEach((geocerca) => {
          this.drawGeocercaFromPoints(geocerca.points, geocerca.geocerca);
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private drawGeocercaFromPoints(points: string, name: string) {
    if (points && this.mapInitialized) {
      const pointsArray = JSON.parse(points);
      this.mapboxService.drawGeocerca([{ points: pointsArray, title: name }]);
    }
  }

  private initForm() {
    this.form = this.fb.group({
      idEdiClienteParadas: ['', [Validators.required]],
      geocercas: [[], [Validators.required]],
    });
  }

  private setFormData() {
    if (this.data.item) {
      this.ediClienteParadaSelected = {
        idEdiClienteParadas: this.data.item.idEdiClienteParadas,
        clienteParada: this.data.item.clienteParada,
      };

      if (this.data.item.geocercas && this.data.item.geocercas.length > 0) {
        this.geocercasSelected = this.data.item.geocercas;
      }

      this.form.patchValue({
        idEdiClienteParadas: this.data.item.idEdiClienteParadas,
        geocercas: this.data.item.geocercas || [],
      });
    }
  }

  onAddGeocerca(geocerca: Geocercas) {
    if (
      !this.geocercasSelected.some((g) => g.idGeocerca === geocerca.idGeocerca)
    ) {
      this.geocercasSelected.push(geocerca);
      this.form.get('geocercas')?.setValue(this.geocercasSelected);
    }
  }

  onDeleteGeocerca(geocerca: any) {
    this.geocercasSelected = this.geocercasSelected.filter(
      (g) => g.idGeocerca !== geocerca.idGeocerca
    );
    this.form.get('geocercas')?.setValue(this.geocercasSelected);
  }

  onSeleccionaEdiClienteParada(event: any) {
    this.ediClienteParadaSelected = event;
    this.form.get('idEdiClienteParadas')?.setValue(event.idEdiClienteParadas);
  }

  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  async onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      try {
        const formData = this.form.value;

        const payload = {
          idEdiClienteParadasGeocerca:
            this.data.item?.idEdiClienteParadasGeocerca || 0,
          idEdiClienteParadas: formData.idEdiClienteParadas,
          activo: true,
          creadoPor: this.idUsuario,
          modificadoPor: this.idUsuario,
          geocercas: formData.geocercas.map((g: Geocercas) => ({
            idGeocerca: g.idGeocerca,
            geocerca: g.geocerca,
            points: g.points,
          })),
        };

        const response = this.data.item
          ? await this.apiEDI
              .updateEdiClienteParadasGeocerca(1, payload)
              .toPromise()
          : await this.apiEDI
              .createEdiClienteParadasGeocerca(payload)
              .toPromise();

        if (response) {
          this.notificacionService.showNotification(
            'Operación realizada con éxito'
          );
          this.dialogRef.close(true);
        }
      } catch (error) {
        console.error('Error in onSubmit:', error);
        this.notificacionService.showNotification(
          'Error al procesar la operación'
        );
      } finally {
        this.loading = false;
      }
    }
  }
}
