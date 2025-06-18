import { Component, OnInit, EventEmitter, Input  } from '@angular/core';
import { BsModalRef} from 'ngx-bootstrap/modal';
import { ColumnConfig } from '../../Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';

@Component({
selector: 'app-catalogo-modal',
templateUrl: './catalogo-modal.component.html',
styleUrls: ['./catalogo-modal.component.css']
})

export class CatalogoModalComponent implements OnInit {

  @Input() data: any;

  showAlert = false;
  alertMessage = '';
  alertType = '';

public title: string = "CATALOGO MODAL";
public message: string = "Buscar clientes";
public seleccionarCliente: string = "Seleccionar";
datos: [] = [];
datosFiltrados: [] = [];


tableConfigs: TableConfig = 
{
  pageSizeOptions: [5, 15, 30],
  headerColumFontSize: 5    
};

 // Puedes usar un Subject o EventEmitter para enviar información al servicio
 enviarInformacion = new EventEmitter<any>();

    constructor(public bsModalRef: BsModalRef) {}

    ngOnInit(): void {}

    goToEnviar(data: any): void {
        this.bsModalRef.hide();
        this.enviarInformacion.emit(data);
    }
}