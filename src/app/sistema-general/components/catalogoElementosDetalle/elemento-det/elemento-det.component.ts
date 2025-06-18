import { ApiSistemaGeneralService } from '../../../../DataAccess/api-sistema-general.service';
import { ElementoDetalle } from '../../../../models/SistemaGeneral/ElementoDetalle';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { CatalogoGeneralService } from '../../../services/catalogo-general.service';
import { map } from 'rxjs/operators';
import { Component, Input } from '@angular/core';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';

@Component({
  selector: 'app-elemento-det',
  templateUrl: './elemento-det.component.html',
  styleUrls: ['./elemento-det.component.css'],
})
export class ElementoDetComponent {
 
  columnConfigs: { [key: string]: ColumnConfig } = {
    nombre: { displayName: 'Nombre', type: 'default', showFilter: true, visible: true  },
    clave: { displayName: 'Clave', type: 'default', showFilter: true, visible: true  },
    idElemento: { displayName: 'Id Elemento', type: 'default', showFilter: true, visible: true  },
    activo: { displayName: 'Ver Inactivos', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', showFilter: true, visible: true  },
    fechaModificacion: { displayName: 'Modificado', type: 'date', format: 'dd/MM/yyyy', showFilter: true, startDate: null, endDate: null, visible: true  }
  };

  tableActions: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver detalle',
      callback: (item) => this.goToVer(item)
    },
    {
      name: 'editar',
      title: 'Editar',
      icon: 'edit',
      tooltip: 'Editar',
      callback: (item) => this.goToEditar(item)
    }
  ];

  tableConfigs: TableConfig =
    {
      pageSizeOptions: [5, 15, 30],
      headerColumFontSize: 5
    };

  datos: ElementoDetalle[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: ElementoDetalle[] = [];
  registrosPadre: ElementoDetalle[] = [];
  todosLosRegistros: ElementoDetalle[] = [];
  idCatPadre: string = '';
  nomCatalogo: string = '';
  isLoading: boolean = false;

  constructor(
    private apiService: ApiSistemaGeneralService,
    private catGeneralService: CatalogoGeneralService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(map((params) => params.get('id')))
      .subscribe((id) => {
        if (id != null) {
          this.idCatPadre = id;
          this.retriveData();
          console.log('map id: ', this.idCatPadre);
        }
      });
  }

  retriveData() {
    this.isLoading = false;
    this.apiService.obtenerRegistro(this.idCatPadre).subscribe((data) => {
      console.log(this.nomCatalogo);
      this.datos = data;
      this.datosFiltrados = this.datos;
      this.todosLosRegistros = this.datos;
      console.log('datos fil id: ', this.datosFiltrados);
    });

    this.apiService.obtenerInfoPadre(this.idCatPadre).subscribe((data) => {
      if (data.length > 0) this.nomCatalogo = data[0].nombre;
      console.log('nomCatalogo', this.nomCatalogo)
    });

    this.isLoading = false;
  }

  filtrarDatos(term: string) {
    if (!term) {
      this.datosFiltrados = this.datos;
    } else {
      term = term.toLowerCase();
      this.datosFiltrados = this.datos.filter((d) => {
        return (
          d.nombre.toLowerCase().includes(term) ||
          d.nombre.toLowerCase().includes(term) ||
          d.clave.toLowerCase().includes(term)
        );
      });
    }
  }

  filtrarActivos(clave: boolean) {
    if (!clave) {
      this.datosFiltrados = this.datos;
    } else {
      this.datosFiltrados = this.datosFiltrados.filter((tramo) => {
        return tramo.activo;
      });
    }
  }

  filtrarPorFecha(event: { startDate: Date; endDate: Date }) {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    // Establecer la hora, minutos, segundos y milisegundos en 0
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999); // Establecerlo al final del día

    this.datosFiltrados = this.datos.filter((dato) => {
      const fechaCreacion = new Date(dato.fechaCreacion);
      fechaCreacion.setHours(0, 0, 0, 0); // Ignorar la parte de la hora
      return fechaCreacion >= startDate && fechaCreacion <= endDate;
    });
  }

  onDateRangeCleared() {
    this.datosFiltrados = this.datos;
  }

  goToVer(elemento: ElementoDetalle) {
    elemento.tituloPantalla = this.nomCatalogo;
    this.catGeneralService.changeRegistroGeneral(elemento);
    this.router.navigate(['/elemento-det/ver']);
  }

  goToEditar(elemento: ElementoDetalle) {
    elemento.tituloPantalla = this.nomCatalogo;
    this.catGeneralService.changeRegistroGeneral(elemento);
    this.router.navigate(['/elemento-det/editar']);
  }

  goToCrear() {
    console.log("Crear gen");
    const elemento = new ElementoDetalle();
    elemento.idCatGeneral = this.idCatPadre;
    elemento.tituloPantalla = this.nomCatalogo;
    this.catGeneralService.changeRegistroGeneral(elemento);
    this.router.navigate(['/elemento-det/crear']);
  }

  cambiarEstado(elemento: ElementoDetalle) {
    elemento.activo = !elemento.activo;
    this.apiService.actualizarDatos(elemento).subscribe(
      () => {
        elemento.activo = elemento.activo;
        this.triggerAlert(
          `Elemento ${
            elemento.activo ? 'activado' : 'desactivado'
          } exitosamente!`,
          'success'
        );
      },
      (error) => {
        console.log(error);
        this.triggerAlert('Error al cambiar el estado del elemento', 'danger');
      }
    );
  }

  // Esta función se llama para mostrar la alerta
  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.showAlert = true;
    this.alertType = type;

    // La alerta se ocultará después de 5 segundos
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}
