import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { concatMap, forkJoin, from, map, of, tap, timer } from 'rxjs';
import { ApiOperacionesService } from 'src/app/DataAccess/api-operaciones.service';
import { ApiServicioClienteService } from 'src/app/DataAccess/api-servicio-cliente.service';
import { ClienteAlternoEDI, ClientePrincipalEDI } from 'src/app/models/Edi/ClienteAlternoEdi.interface';
import { Clientes } from 'src/app/models/Serv. Cliente/Clientes';
import { AlertService } from 'src/app/Services/alert.service';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { DisplayColumnConfigDF } from 'src/app/shared-module/Interfaces/DisplayColumnConfigDF';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';

@Component({
  selector: 'app-modal-crud-clientes-alternos-edi',
  templateUrl: './modal-crud-clientes-alternos-edi.component.html',
  styleUrls: ['./modal-crud-clientes-alternos-edi.component.css']
})
export class ModalCrudClientesAlternosEdiComponent implements OnInit {

  TITULO_MODAL: string = 'Clientes Alternos EDI';
  formGroup: FormGroup;
  clientePrincipalSelected = new Clientes();
  clientesAlternosSelected: Clientes[] = [new Clientes()];

  dataToSave: ClienteAlternoEDI[] = [];

  dataToDelete: any[] = [];
  
  columnConfigsCliente: { [key: string]: ColumnConfig } = {
    idCliente: {
      displayName: 'ID Cliente',
      type: 'default',
      showFilter: true,
      visible: false,
    },
    noCliente: {
      displayName: 'No. cliente',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    nombre: {
      displayName: 'Nombre',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    tipoCliente: {
      displayName: 'Tipo cliente',
      type: 'default',
      showFilter: true,
      visible: true,
    },
  };
  displayColumnConfCliente: DisplayColumnConfigDF = {
    identificador: 'idCliente',
    separadorColumnas: ' - ',
    columnas: ['nombre','dirCalle','noCliente'],
  };
  tableConfigs: TableConfig = {
    pageSizeOptions: [5],
    headerColumFontSize: 5,
  };

  //#region Variables de full table
  columnConfigs: { [key: string]: ColumnConfig } = {
    clienteAlterno: { displayName: 'Cliente alterno', type: 'default', showFilter: true, visible: true },
    creadoPor: { displayName: 'Creado por', type: 'default', showFilter: true, visible: false },
    fechaCreacion: { displayName: 'Creado', type: 'date', format: 'dd/MM/yyyy', showFilter: true, visible: false },
    activo: { displayName: 'Modificado', type: 'date', format: 'dd/MM/yyyy', showFilter: false, visible: false },
    idClientePadre: { displayName: 'Modificado', type: 'date', format: 'dd/MM/yyyy', showFilter: false, visible: false },
  };
  
  fullTableConfigs: TableConfig = {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 12,
  };

  tableActions: TableAction[] = [
    {
      name: 'delete',
      title: 'Eliminar',
      icon: 'delete',
      tooltip: 'Eliminar',
      callback: (item) => this.onDelete(item)
    }
  ];
  //#endregion
  isLoading: boolean = false;
  isLoadingTable: boolean = false;
  dataTable: any[] = [];

  constructor(
    private _matDialogRef: MatDialogRef<ModalCrudClientesAlternosEdiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public apiServicioCliente: ApiServicioClienteService,
    private _alertService: AlertService
  ) {
    this.formGroup = this._formBuilder.group({
      idClientePrincipal: ['', Validators.required],
      idClientesAlternos: this._formBuilder.array([
        this._formBuilder.group({
          idClienteAlterno: ['', Validators.required],
        }),
      ]),
    });
  } 

  ngOnInit(): void {
    if(this.data.tipo === 'DETAIL' || this.data.tipo === 'EDIT'){
      console.log(this.data.row)
      this.clientePrincipalSelected = new Clientes({
        idCliente: this.data.row.id, 
        nombre: this.data.row.nombre, 
        dirCalle: this.data.row.direccion, 
        rfc: this.data.row.rfc, 
        noCliente: this.data.row.noCliente
      });
      if(this.data.tipo === 'EDIT'){
        this.formGroup.patchValue({idClientePrincipal : this.clientePrincipalSelected.idCliente});
      }
      this.isLoadingTable = true;
      this.clientesAlternosSelected = [];
      this.idClientesAlternosArray.clear();
      this.apiServicioCliente.getClientesAlternosEdi(this.data.row.idClientePrincipalEdi)
      .subscribe(data => {
        //clienteAlterno
        this.dataTable = data.map(item => ({ ...item, clienteAlterno: `${item.noCliente} - ${item.nombre} - ${item.domicilio}`, }));
        this.isLoadingTable = false;
      });
    }
    
  }

  onSubmit() {
    if((this.formGroup.valid) && this.isLoading === false){
      this.isLoading = true;

      if (this.data.tipo === 'EDIT') {
        const deleteObservables = this.dataToDelete.length > 0
          ? from(this.dataToDelete).pipe(
              concatMap((ClienteAlternoEdi) =>
                this.apiServicioCliente.deleteClientesAlternoEdi(ClienteAlternoEdi.idClienteAlternoEdi)
              )
            )
          : of(null);
      
        const saveObservables = this.clientesAlternosSelected.length > 0
          ? from(this.clientesAlternosSelected).pipe(
              map((cliente) => ({
                idClienteAlternoEdi: 0,
                idClientePrincipalEdi: this.data.row.idClientePrincipalEdi,
                id: cliente.idCliente.toString(),
                nombre: cliente.nombre,
                domicilio: cliente.dirCalle,
                rfc: cliente.rfc,
                noCliente: cliente.noCliente,
                idCompania: 0,
                creadoPor: '',
                fechaCreacion: '',
                modificadoPor: '',
                fechaModificacion: '',
                activo: true
              })),
              concatMap((data) => this.apiServicioCliente.postClienteAlternoEdi(data, false))
            )
          : of(null);

        forkJoin([deleteObservables, saveObservables]).subscribe({
          next: () => {
            if (this.dataToDelete.length > 0) {
              this._alertService.success('Se han eliminado los datos correctamente.');
            }
            if (this.clientesAlternosSelected.length > 0) {
              this._alertService.success('Se han guardado los datos correctamente.');
            }
          },
          complete: () => {
            this.cerrar(); // Cierra el modal cuando ambos procesos se completen
          }
        });
      }
      

      if(this.data.tipo === 'CREATE' && this.clientesAlternosSelected.length > 0){
        const principalToSave: ClientePrincipalEDI = {
          idClientePrincipalEdi: 0,
          id: this.clientePrincipalSelected.idCliente.toString(),
          nombre: this.clientePrincipalSelected.nombre,
          domicilio: this.clientePrincipalSelected.dirCalle,
          rfc: this.clientePrincipalSelected.rfc,
          noCliente: this.clientePrincipalSelected.noCliente,
          idCompania: 0,
          creadoPor: '',
          fechaCreacion: '',
          modificadoPor: '',
          fechaModificacion: '',
          activo: true
        };
        this.apiServicioCliente
          .postClientePrincipalEdi(principalToSave, false)
          .pipe(
            concatMap( (cpResponse:ClientePrincipalEDI) => {
              this.clientesAlternosSelected.forEach((cliente) =>{
                this.dataToSave.push({
                  idClienteAlternoEdi: 0,
                  idClientePrincipalEdi: cpResponse.idClientePrincipalEdi,
                  id: cliente.idCliente.toString(),
                  nombre: cliente.nombre,
                  domicilio: cliente.dirCalle,
                  rfc: cliente.rfc,
                  noCliente: cliente.noCliente,
                  idCompania: 0,
                  creadoPor: '',
                  fechaCreacion: '',
                  modificadoPor: '',
                  fechaModificacion: '',
                  activo: true
                });
              });

              return from(this.dataToSave)
            }),
            concatMap((data:ClienteAlternoEDI) => this.apiServicioCliente.postClienteAlternoEdi(data,true))
          )
          .subscribe({
            next: () => void 0,
            complete: () => {
              this.isLoading = false;
              this._alertService.success('Se han guardado los datos correctamente.');
              this.cerrar();
            }
          });
        return;
      }else if(this.clientesAlternosSelected.length == 0 && this.data.tipo === 'CREATE'){
        this._alertService.warning('El formulario no tiene ningun cliente alterno seleccionado.');
        return;
      }

    }else{
      console.log(this.formGroup.value)
      console.log(this.formGroup.valid)
      this._alertService.warning('Favor de verificar que el formulario este correctamente llenado.');
    }
  }

  cerrar() {
    this._matDialogRef.close();
  }

  get idClientesAlternosArray() {
    return this.formGroup.get('idClientesAlternos') as FormArray;
  }

  agregarClienteAlterno() {
    this.clientesAlternosSelected.push(new Clientes());
    this.idClientesAlternosArray.push(this._formBuilder.group({
      idClienteAlterno: ['', Validators.required],
    }));
  }

  removerClienteAlterno(index: number) {
    this.idClientesAlternosArray.removeAt(index);
    this.clientesAlternosSelected.splice(index, 1);
  }

  onSeleccionaClientePrincipal($event: any) {
    this.clientePrincipalSelected = $event;
    this.formGroup.patchValue({idClientePrincipal : $event.idCliente});
  } 

  onSeleccionaClienteAlterno($event: any, i: number) {
    if(this.clientePrincipalSelected.idCliente === $event.idCliente){
      this._alertService.warning('El cliente seleccionado es el cliente principal, favor de seleccionar otro cliente.');
      return;
    }
    if(this.clientesAlternosSelected.some((cliente) => cliente.idCliente === $event.idCliente)){
      this._alertService.warning('El cliente ya fue seleccionado, favor de seleccionar otro cliente.');
      return;
    }
    if(this.data.tipo === 'EDIT'){
      const rowTable = this.dataTable.find( clienteT => clienteT.id == $event.idCliente );
      if(rowTable && rowTable.activo){
        this._alertService.warning('El cliente ya fue seleccionado, favor de seleccionar otro cliente.');
        return;
      }
      const rowToDel = this.dataToDelete.find( clienteT => clienteT.id == $event.idCliente );
      if(rowToDel){
        this._alertService.warning('El cliente fue eliminado, para cancelar la operacion, cierre el modal.');
        return;
      }
    }
    this.clientesAlternosSelected[i] = $event;
    this.idClientesAlternosArray.at(i).patchValue({idClienteAlterno : $event.idCliente});
  }

  onDelete(row: any){
    this.dataToDelete.push(row);
    this.dataTable = this.dataTable.filter( obj => obj.idClienteAlternoEdi != row.idClienteAlternoEdi);
  }

}
