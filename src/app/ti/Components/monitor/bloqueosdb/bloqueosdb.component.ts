import { Component, EventEmitter, Input, Output, ViewChild, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiAcumaticaService } from 'src/app/DataAccess/api-acumatica.service';
import { Bloqueos } from 'src/app/models/ti/bloquesdbModel';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-bloqueosdb',
  templateUrl: './bloqueosdb.component.html',
  styleUrls: ['./bloqueosdb.component.css']
})
export class BloqueosdbComponent {

  bloqueosDb : Bloqueos = new Bloqueos;
  // Define las columnas que se mostrarán en la tabla, asegurándose de que coincidan exactamente con los nombres de propiedades del modelo
  columns: string[] = ['rootBlockerSPID', 'status', 'login', 'hostName', 'dbName', 'command', 'cpuTime', 'diskIO', 'lastBatch', 'applicationName', 'duracionBloqueo', 'accionRecomendada', 'cantidadBloqueos', 'spiDsBloqueados']

  columnConfigs: {[key: string]: ColumnConfig } = {
    rootBlockerSPID: { displayName: 'ID Bloqueador', type: 'default', showFilter: true, visible: true},
    status: { displayName: 'Estado', type: 'default', showFilter: true, visible: true},
    login: { displayName: 'Usuario BD', type: 'default', showFilter: true, visible: false},
    hostName: { displayName: 'Usuario PC', type: 'default', showFilter: true, visible: true},
    dbName: { displayName: 'Base de Datos', type: 'default', showFilter: true, visible: true},
    command: { displayName: 'Comando', type: 'default', showFilter: true, visible: true},
    cpuTime: { displayName: 'CPU Time', type: 'default', showFilter: true, visible: false},
    diskIO: { displayName: 'Disk IO', type: 'default', showFilter: true, visible: false},
    lastBatch: { displayName: 'Last Batch', type: 'default', showFilter: true, visible: true},
    applicationName: { displayName: 'Programa', type: 'default', showFilter: true, visible: true},
    duracionBloqueo: { displayName: 'Duración', type: 'default', showFilter: true, visible: true},
    accionRecomendada: { 
      displayName: 'Acción Recomendada', 
      type: 'default', 
      showFilter: false, 
      visible: true,
      // customRender: (item: Bloqueos) => {
      //   const style = this.getRecommendationStyle(item.accionRecomendada || '');
      //   return `<div class="${style.cssClass}"><mat-icon>${style.icon}</mat-icon> ${style.message}</div>`;
      // }
    },
    cantidadBloqueos: { displayName: 'Cantidad Bloqueos', type: 'default', showFilter: true, visible: true},
    spiDsBloqueados: { displayName: 'IDs Bloqueados', type: 'default', showFilter: true, visible: false},
  };

  tableActions: TableAction[] = [
    {
      name: 'kill',
      title: 'Kill',
      icon: 'close',
      tooltip: 'Eliminar',
      callback: (item) => this.setBloqueosDb(item)
    }
  ];

  tableConfigs: TableConfig = {
    pageSizeOptions: [10, 25, 50, 100],
    headerColumFontSize: 5,
    heightRow: '48px' // Altura estándar para filas
  };
  
  // Configuración adicional para la tabla que no está en TableConfig
  tableAdditionalConfig = {
    showFirstLastButtons: true,
    stickyHeader: true,
    stickyFooter: true
  };

  // Variables para el estado de la UI
  activeFilter: string = 'all';
  lastUpdate: Date = new Date();
  selection = new SelectionModel<Bloqueos>(true, []);
  
  // Propiedades calculadas
  get criticalLocksCount(): number {
    return this.datos.filter(d => d.accionRecomendada?.includes('KILL') || d.accionRecomendada?.includes('Exceso de tiempo')).length;
  }

  get longRunningSessionsCount(): number {
    return this.getLongRunningSessions().length;
  }
  
  // Referencia al diálogo de confirmación
  @ViewChild('confirmKillDialog') confirmKillDialog!: TemplateRef<any>;

  datos: Bloqueos[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: Bloqueos[] = [];
  idCompania = 0;
  isLoading: boolean = false;
  rowSeleccionada: Bloqueos | null = null;

  constructor(private apiAcumatica: ApiAcumaticaService, private _snackBar: MatSnackBar, private dialog: MatDialog ) { }
  
  /**
   * Determina la clase CSS y mensaje basado en la acción recomendada
   * @param accionRecomendada Acción recomendada para el bloqueo
   * @returns Objeto con recomendación y clase CSS para aplicar
   */
  getRecommendationStyle(accionRecomendada: string): { recommended: boolean; cssClass: string; message: string; icon: string } {
    // Si la acción recomendada contiene 'KILL', se considera crítico
    if (accionRecomendada?.includes('KILL')) {
      return { 
        recommended: true, 
        cssClass: 'kill-recommended', 
        message: accionRecomendada,
        icon: 'error'
      };
    } else if (accionRecomendada?.includes('No crítico')) {
      return { 
        recommended: false, 
        cssClass: 'kill-not-recommended', 
        message: 'Bloqueo no crítico, puede permanecer sin problemas',
        icon: 'info'
      };
    } else {
      return { 
        recommended: false, 
        cssClass: 'kill-not-recommended', 
        message: accionRecomendada || 'No hay acción recomendada',
        icon: 'help_outline'
      };
    }
  }


  async ngOnInit(): Promise<void> {
    this.refreshData();
  }

  async refreshData(): Promise<void> {
    this.isLoading = true;
    this.datos = []; // Limpiar los datos actuales antes de la nueva carga
    
    try {
      const response = await this.apiAcumatica.getBloqueosDb().toPromise();
      console.log('Respuesta de la API:', response);
      
      this.datos = Array.isArray(response) ? response : [];
      this.applyFilter(this.activeFilter);
    
    // Si hay filas críticas, seleccionar la primera automáticamente
    if (this.criticalLocksCount > 0) {
      const firstCritical = this.datos.find(d => d.accionRecomendada?.includes('KILL'));
      if (firstCritical) {
        this.rowSeleccionada = firstCritical;
      }
    }
      this.lastUpdate = new Date();
      
      // Mostrar notificación solo si hay datos
      if (this.datos.length > 0) {
        this._snackBar.open(`${this.datos.length} bloqueos encontrados`, 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      } else {
        this._snackBar.open('No se encontraron bloqueos activos', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-info']
        });
      }
    } catch (error) {
      console.error('Error al obtener bloqueos:', error);
      this.showAlert = true;
      this._snackBar.open('Error al cargar los datos de bloqueos', 'Cerrar', {
        duration: 5000,
        panelClass: ['snackbar-error']
      });
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Muestra un diálogo de confirmación antes de finalizar una sesión
   * @param item Sesión que se desea finalizar
   */
  async confirmKillSession(item: Bloqueos): Promise<void> {
    const dialogRef = this.dialog.open(this.confirmKillDialog, {
      width: '500px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.setBloqueosDb(item);
      }
    });
  }

  /**
   * Finaliza una sesión en la base de datos
   * @param data Datos de la sesión a finalizar
   */
  async setBloqueosDb(data: Bloqueos): Promise<void> {
    this.isLoading = true;
    
    try {
      const result = await this.apiAcumatica.setBloqueosDb(data.rootBlockerSPID, data.hostName).toPromise();
      
      this._snackBar.open(`Sesión ${data.rootBlockerSPID} finalizada correctamente`, 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
      
      // Actualizar los datos después de un breve retraso para dar tiempo al servidor
      setTimeout(() => this.refreshData(), 1000);
    } catch (error) {
      console.error('Error al finalizar sesión:', error);
      this._snackBar.open(`Error al finalizar la sesión ${data.rootBlockerSPID}`, 'Cerrar', {
        duration: 5000,
        panelClass: ['snackbar-error']
      });
    } finally {
      this.isLoading = false;
    }
  }


  /**
   * Aplica un filtro a los datos mostrados
   * @param filterType Tipo de filtro a aplicar
   */
  applyFilter(filterType: string): void {
    this.activeFilter = filterType;
    
    switch (filterType) {
      case 'all':
        this.datosFiltrados = [...this.datos];
        break;
      case 'critical':
        this.datosFiltrados = this.datos.filter(d => d.accionRecomendada?.includes('KILL'));
        break;
      case 'long':
        this.datosFiltrados = this.getLongRunningSessions();
        break;
      case 'db':
        // Agrupar por base de datos
        this.datosFiltrados = [...this.datos];
        // Aquí podrías implementar lógica para agrupar por base de datos
        break;
      default:
        this.datosFiltrados = [...this.datos];
    }
  }

  /**
   * Obtiene las sesiones que han estado ejecutándose por mucho tiempo
   */
  getLongRunningSessions(): Bloqueos[] {
    return this.datos.filter(session => {
      // Asumiendo que duracionBloqueo está en formato 'HH:mm:ss'
      if (!session.duracionBloqueo) return false;
      
      const [hours, minutes] = session.duracionBloqueo.split(':').map(Number);
      // Considerar como larga duración si es mayor a 5 minutos
      return (hours > 0) || (minutes > 5);
    });
  }

  /**
   * Obtiene la lista de bases de datos únicas
   */
  getUniqueDatabases(): string[] {
    const dbs = new Set<string>();
    this.datos.forEach(item => {
      if (item.dbName) dbs.add(item.dbName.trim());
    });
    return Array.from(dbs);
  }

  /**
   * Determina la clase CSS para una fila basada en su estado
   * @param item Elemento de la fila
   * @returns Clase CSS a aplicar
   */
  // Aplicar estilos a las filas mediante enviarItem y estilo en CSS
  enviarItem(item: Bloqueos): void {
    // Seleccionar la fila actual y aplicar estilos según su estado
    this.rowSeleccionada = item;
    
    // Emitir evento para notificar la selección de un elemento
    // Se puede usar si se necesita comunicar con componentes padre
    // this.enviarItemEvent.emit(item);
  };



}
