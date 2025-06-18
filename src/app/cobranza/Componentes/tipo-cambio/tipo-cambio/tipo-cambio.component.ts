import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize, map, tap } from 'rxjs/operators';
import { ModalTipoCambioComponent } from '../modal-tipo-cambio/modal-tipo-cambio.component';
import { FullTableV2Component } from '../../../../shared-module/components/full-tableV2/full-table.component';
import { TableAction } from '../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from '../../../../shared-module/Interfaces/TableConfig';
import { ModalService } from '../../../../Services/Modal.service';
import { AlertService } from '../../../../Services/alerts.service';
import { TipoCambio } from '../../../Models/TipoCambio/TipoCambio';
import { ApiDespachoService } from '../../../../DataAccess/api-despacho.service';
import { ApiCfdiService } from '../../../../DataAccess/api-cfdi.service';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { fieldsFormTipoCambio, ParametrosTipoCambio } from '../configCrudTipoCambio';

@Component({
  selector: 'app-tipo-cambio',
  templateUrl: './tipo-cambio.component.html',
  styleUrls: ['./tipo-cambio.component.css']
})

export class TipoCambioComponent {
  @ViewChild(FullTableV2Component) tableComponent!: FullTableV2Component;

  NOMBRE_MENU = 'Tipo de cambio';
  parametrosTipoCambio = ParametrosTipoCambio;
  
  columnConfigs: { [key: string]: ColumnConfig } = {
    //idGeofence: { displayName: 'Id', type: 'default', showFilter: true, visible: true },
    id: { displayName: 'Id', type: 'default', showFilter: true, visible: true },
    fecha: { displayName: 'Fecha aplicación', type: 'date', format: 'dd/MM/yyyy', showFilter: true, visible: true },
    valor: { displayName: 'Valor ($)', type: 'default', showFilter: true, visible: true },
    fechaCreacion: { displayName: 'Creado', type: 'date', format: 'dd/MM/yyyy', showFilter: true, visible: true },
    usuarioCreadoPor: { displayName: 'Creado por', type: 'default', showFilter: true, visible: true },    
    fechaModificacion: { displayName: 'Modificado', type: 'date', format: 'dd/MM/yyyy', showFilter: true, visible: true },
    usuarioModificadoPor: { displayName: 'Modificado por', type: 'default', showFilter: true, visible: true },
    
  };

  tableActions: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver',
      callback: (item) => this.openModal(item, 'DETAIL')
    },
    {
      name: 'edit',
      title: 'Editar',
      icon: 'edit',
      tooltip: 'Editar',
      callback: (item) => this.openModal(item, 'EDIT'),
      showCondition: (item) => {
        const itemDate = new Date(item.fecha).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        const today = new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        return item.activo && itemDate === today;
      }
    },
    {
      name: 'eliminar',
      title: 'Eliminar',
      icon: 'delete',
      tooltip: 'Eliminar',
      callback: (item) => this.onEliminarClick(item),
      showCondition: (item) => {
        const itemDate = new Date(item.fecha).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        const today = new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        return item.activo && itemDate === today;
      }
    }
  ];

  tableConfigs: TableConfig = {
    pageSizeOptions: [5, 10, 20],
    createCallback: () => this.openModal(null, 'CREATE'),
  };

  constructor(
    private dialog: MatDialog,
    private modalService: ModalService,
    private alertService: AlertService,
    public apiCfdi: ApiCfdiService,
  ) { }

  openModal(item: TipoCambio | null, tipo: 'CREATE' | 'EDIT' | 'DETAIL') {
    this.modalService.openModal(
      ModalTipoCambioComponent,
      item,
      tipo,
      () => this.tableComponent.loadData(),
      'TipoCambio',
      '1000px'
    );
  }

  onEliminarClick(item: TipoCambio) {
    const formattedDate = new Date(item.fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const hoy = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    console.log('hoy', hoy);
    console.log('item.fecha',formattedDate);
    if (formattedDate !== hoy) {
      this.alertService.warning('Solo se puede eliminar el tipo de cambio del día actual.');
      return;
    } 

    this.alertService
      .question(`¿Eliminar el tipo de cambio del ${formattedDate}?`)
      .pipe(
        map(confirm => {
          if (confirm) {
            this.apiCfdi.eliminarTipoCambio(item)
              .pipe(finalize(() => this.tableComponent.loadData()))
              .subscribe();
          }
        })
      ).subscribe();
  }
}
