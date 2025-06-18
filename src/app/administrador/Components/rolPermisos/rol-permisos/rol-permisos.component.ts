import { Component } from '@angular/core';
import { Rol } from './../../../../models/Administrador/Rol';
import { Menu,Modulo, RolModulos } from './../../../../models/Administrador/Menu';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiAdministradorService } from '../../../../DataAccess/api-administrador.service';
import { TableAction } from './../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from './../../../../shared-module/Interfaces/TableConfig';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';

@Component({
  selector: 'app-rol-permisos',
  templateUrl: './rol-permisos.component.html',
  styleUrls: ['./rol-permisos.component.css']
})
export class RolPermisosComponent {
  rolForm: FormGroup = new FormGroup({});
  rol: Rol = new Rol();
  // modulos:Modulo[] = [];
  menuSelect:Menu[] =[];
  modulosFilter:Modulo[] = [];
  pantallas: Menu[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  idCompania: number = 0;
  idUsuario:string = "";
  modSelect:Modulo = new Modulo();
  rolModulos:RolModulos = new RolModulos();
  datosFiltrados: RolModulos[] = [];
  datos: RolModulos[] = [];
  rolFilter: RolModulos = new RolModulos();
  check:boolean = false;
  registros: any[] =[]; // Tu arreglo de datos
  registrosPorPagina: number = 10; // Número de registros por página
  paginaActual: number = 1; // Página actual
  idSisTrucks:number = 1;

  constructor(  private fb: FormBuilder, private apiAdminAccess:ApiAdministradorService){  

    this.idCompania = Number(localStorage.getItem('CompaniaSelect'))??0;
    this.idUsuario = localStorage.getItem('idUsuario')??'';
    this.rolForm = this.fb.group({
      nombre: [this.rol.nombre,[Validators.required]],
    });
  }

  tableConfigsPantallas: TableConfig =
  {
    pageSizeOptions: [5],
    headerColumFontSize: 5,
    heightRow: 'auto'
  };

  columnConfigsRol: { [key: string]: ColumnConfig } = {
    nombre: { displayName: 'Nombre de pantalla', type: 'default', visible: true, showFilter: true },
    asignar: { displayName: 'Asignar', type: 'boolean',editable: true, visible: true, showFilter: true },
    todos:{ displayName: 'Todos los permisos', type: 'boolean',editable: true, visible: true, showFilter: true, event:true, functionEvent: (event) => this.todosPermisos(event)  },
    crear: { displayName: 'Crear', type: 'boolean', editable: true,visible: true, showFilter: true },
    editar: { displayName: 'Editar', type: 'boolean', editable: true,visible: true, showFilter: true },
    eliminar: { displayName: 'Eliminar', type: 'boolean', editable: true,visible: true, showFilter: true },
    imprimir: { displayName: 'Imprimir', type: 'boolean', editable: true,visible: true, showFilter: true }
  };

  ngOnInit() {    
    this.apiAdminAccess.obtenerRol().subscribe(
      response => {
        this.datos = response;
        this.datos = this.datos.filter((s:any) => s.idSistema != this.idSisTrucks);
        this.datosFiltrados = this.datos;
        this.rolFilter = this.datos[0];
        this.cargarPermisos();
      },
      error => {
        console.error('Ha ocurrido un error al obtener los datos', error);        
      }
    );
  }

  cargarPermisos(){
    this.apiAdminAccess.obtenerMenuPorRol(4,this.rolFilter.id).subscribe((data) => {
      // this.modulos = data;
      this.modulosFilter = data;

      if(this.modulosFilter != null){
        this.modSelect = this.modulosFilter[0];
        this.cargarPantallas();
      }
    });
  }

  cargarPantallas(){
    this.check = false;
    this.pantallas = this.modSelect.menus;
    this.pantallas = [...this.pantallas];
  }
  
  onSubmit(){  
   
   /*  this.rolFilter.modulos = this.modulosFilter;
    console.log(this.rolFilter);
      this.apiAdminAccess.putRol(this.rolFilter).subscribe(data => {
        if(!data.success){
          this.triggerAlert( data.message,'warning' );
        }else{
        
          this.triggerAlert("Rol actualizado exitosamente!", "success");
        }
        }, error => {
          console.log(error);
          this.triggerAlert(error.error,"danger");
        });    */
  }

  asignarModulo(event:any){   
      this.modSelect.menus.forEach(p => {
        
        if(event.target.checked){

          p.asignar = true;
          p.todos = true;
          p.crear = true;
          p.editar = true;
          p.eliminar =true;
          p.imprimir =true;

        } else{
          p.asignar = false;
          p.todos = false;
          p.crear = false;
          p.editar = false;
          p.eliminar =false;
          p.imprimir =false;        
      } });  
  }

  todosPermisos(reg:any){ 
    
    if(reg.todos){
      reg.crear = true;
      reg.editar = true;
      reg.eliminar = true;
      reg.imprimir = true;  
    }else{
      reg.crear = false;
      reg.editar = false;
      reg.eliminar = false;
      reg.imprimir = false;  
    }   
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
