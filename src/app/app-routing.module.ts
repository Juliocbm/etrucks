import { MonitorTimbradoComponent } from './ti/Components/monitor/monitor-timbrado/monitor-timbrado.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './security/guards/auth.guard'
import { PermissionsGuard } from './security/guards/PermissionsGuard'

//loggin
import { LoginComponent } from './security/components/login/login.component';
import { AccessDeniedComponent } from './security/components/access-denied/access-denied.component';
import { ForgotPasswordComponent } from './security/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './security/components/reset-password/reset-password.component';

//Home
import { HomeComponent } from './home/home.component';

//Catalogo SAT / cp
import { CpMunicipioView } from './catalogo-sat/Components/cp-municipio/view-cpMunicipio/cpMunicipio-view.component';
import { CpMunicipioVer } from './catalogo-sat/Components/cp-municipio/ver-cpMunicipio/cpMunicipio-ver.component';
import { CpMunicipioCrear } from './catalogo-sat/Components/cp-municipio/crear-cpMunicipio/cpMunicipio-crear.component';
import { CpMunicipioEditar } from './catalogo-sat/Components/cp-municipio/editar-cpMunicipio/cpMunicipio-editar.component';

//TI / Mtto Equipo CP
import { MttoEquipoComputoView } from './ti/Components/reportes/mttoEquipoComputo/mttoEquipoComputo-view.component';
import { mttoEquipoComputo } from './models/ti/mttoEquipoComputo';

//CAT GENERAL
import { ElementoDetCrearComponent } from './sistema-general/components/catalogoElementosDetalle/elemento-det-crear/elemento-det-crear.component';
import { ElementoDetComponent } from './sistema-general/components/catalogoElementosDetalle/elemento-det/elemento-det.component';
import { ElementoDetEditarComponent } from './sistema-general/components/catalogoElementosDetalle/elemento-det-editar/elemento-det-editar.component';
import { ElementoDetVerComponent } from './sistema-general/components/catalogoElementosDetalle/elemento-det-ver/elemento-det-ver.component';

//SISTEMAS
import { ExcesoVelocidadComponent } from './Satelite/components/exceso-velocidad/exceso-velocidad.component';
import { BloqueosdbComponent } from './ti/Components/monitor/bloqueosdb/bloqueosdb.component';
import { ReporteSeguimientoViajeComponent } from './Satelite/components/reporteViajes/reporte-seguimiento-viaje/reporte-seguimiento-viaje.component';

//SATELITE
import { SucursalGeocercaViewComponent } from './Satelite/components/sucursal-geocerca/sucursal-geocerca-view/sucursal-geocerca-view.component';
import { ModalCrudSucursalGeocercaComponent } from './Satelite/components/sucursal-geocerca/modal-crud-sucursal-geocerca/modal-crud-sucursal-geocerca.component';

//CONTROL DE EQUIPO
import { demorasRemolquesView } from './operaciones/DemorasRemolques/demorasRemolques-view.component';

//RH
import { RepAdeudosComponent } from './rh/components/rep-adeudos/rep-adeudos.component';
import { CatalogoMenuComponent } from './rh/components/comidas-comedor/catalogo-menu/catalogo-menu.component';
import { CatalogoEmpleadoComponent } from './rh/components/empleado/catalogo-empleado/catalogo-empleado.component';
import { RepConsumosComponent } from './rh/components/rep-consumos/rep-consumos-view.component';
import { RepIngresoOperadoresComponent } from './rh/components/rep-ingreso-operadores/rep-ingreso-operadores.component';
import { RepSalarioDiarioComponent } from './rh/components/rep-salario-diario/rep-salario-diario.component';

import { PersonalTrucksViewComponent } from './rh/components/Personal-trucks/personalTrucks-view/personalTrucks-view.component';

// Administrador
import { RolPermisosComponent } from './administrador/Components/rolPermisos/rol-permisos/rol-permisos.component';


import { CatalogoRolComponent } from './administrador/Components/catalogoRol/catalogo-rol/catalogo-rol.component';
import { CatalogoUsuarioComponent } from './administrador/Components/catalogoUsuarios/catalogo-usuario/catalogo-usuario.component';
import { ConfigUsuarioRolComponent } from './administrador/Components/configUsuarioRol/config-usuario-rol/config-usuario-rol.component';

import { ModalCrudRolComponent } from './administrador/Components/catalogoRol/modal-crud-rol/modal-crud-rol.component';
import { ModalCrudUsuarioComponent } from './administrador/Components/catalogoUsuarios/modal-crud-usuario/modal-crud-usuario.component';
import { ModalConfigUsuarioRolComponent } from './administrador/Components/configUsuarioRol/modal-config-usuario-rol/modal-config-usuario-rol.component';
import { MENU_BD } from './paths.constants';
import { DashboardComponent } from './ti/Components/cfdi/dashboard/dashboard.component';

// Operaciones
import { BitacoraComponent } from './operaciones/Bitacoras/bitacora/bitacora.component';
import { CrearBitacoraComponent } from './operaciones/Bitacoras/crear-bitacora/crear-bitacora.component';
import { EditarBitacoraComponent } from './operaciones/Bitacoras/editar-bitacora/editar-bitacora.component';
import { VerBitacoraComponent } from './operaciones/Bitacoras/ver-bitacora/ver-bitacora.component';

//SERVICIO A CLIENTES
import { PedidosPrioridadComponent } from './servicio-cliente/Pedidos/pedidos-prioridad/pedidos-prioridad.component';
import { DispOperadorComponent } from './operaciones/Disp Operadores/disp-operador/disp-operador.component';

import { MPrioridadPedidosComponent } from './operaciones/monitorPrioriPedidos/m-prioridad-pedidos/m-prioridad-pedidos.component';



//Cobranza
import { DescargaDocumentosFiscalesComponent } from './cobranza/Componentes/descarga-documentos-fiscales/descarga-documentos-fiscales.component';
import { ListadoFacturasErrorComponent } from './ti/Components/lis/Listado-facturas-error/listado-facturas-error/listado-facturas-error.component';
import { SucursalViewComponent } from './rh/components/Sucursal/sucursal-view/sucursal-view.component';
import { ReportePedidosCobranzaComponent } from './cobranza/Componentes/reporte-pedidos-cobranza/reporte-pedidos-cobranza.component';
import { PersonalViewComponent } from './rh/components/Personal/personal-view/personal-view.component';
import { CrearPersonalComponent } from './rh/components/Personal/crear-personal/crear-personal.component';
import { EditarPersonalComponent } from './rh/components/Personal/editar-personal/editar-personal.component';
import { VerPersonalComponent } from './rh/components/Personal/ver-personal/ver-personal.component';
import { PersonalGafeteComponent } from './rh/components/empleado/personal-gafete/personal-gafete.component';
import { VisitasComponent } from './operaciones/Visitas/visitas/visitas.component';

//RH
import { BancoViewComponent } from './rh/components/Banco/banco-view/banco-view.component';
import { TipoCajaComponent } from './rh/components/tipoCaja/tipoCaja-view/tipoCaja.component';
import { RepMoperComponent } from './rh/components/rep-moper/rep-moper.component';
import { PersonalBancoViewComponent } from './rh/components/Banco/PersonalBanco/personalBanco-view/personalBanco-view.component';
import { CategoriaViewComponent } from './rh/components/catalogoCategoria/categoria-view/categoria-view.component';
import { DepatamentoViewComponent } from './rh/components/catalogoDepartamento/depatamento-view/depatamento-view.component';

// Asignacion Automatica
import { ClienteMarcaTractorComponent } from './operaciones/ClienteMarcaTractor/cliente-marca-tractor/cliente-marca-tractor.component';
import { ClienteOperadorVetComponent } from './operaciones/ClienteOperadorVetado/cliente-operador-vet/cliente-operador-vet.component';
import { ConsumoComedorComponent } from './rh/components/consumo-comedor/consumo-comedor/consumo-comedor.component';
import { RepCajaAhorroComponent } from './rh/components/rep-caja-ahorro/rep-caja-ahorro.component';
import { ViewClientesAlternosEdiComponent } from './servicio-cliente/catalogos/crud-clientes-alternos-edi/view-clientes-alternos-edi/view-clientes-alternos-edi.component';
import { GeocercaStopComponent } from './EDI/components/geocerca-stop-vw/geocerca-stop/geocerca-stop.component';

// Operaciones
import { SeguridadOpWebAppViewComponent } from './operaciones/seguridadOperadorWebApp/seguridad-op-web-app-view/seguridad-op-web-app-view.component';
import { TipoCambioComponent } from './cobranza/Componentes/tipo-cambio/tipo-cambio/tipo-cambio.component';
import { ReporteSeguimientoGuiaComponent } from './operaciones/reporte-seguimiento-guia/reporte-seguimiento-guia.component';
import { TrazabilidadViajesViewComponent } from './Satelite/components/trazabilidad/trazabilidad-viajes-view/trazabilidad-viajes-view.component';
import { EdiTrackerComponent } from './EDI/components/edi-tracker/edi-tracker.component';
import { ActualizacionEstatusDeGuiasComponent } from './cobranza/Componentes/actualizacion-estatus-de-guias/actualizacion-estatus-de-guias.component';


// EDI
import { DashboardEdiKpiComponent } from './EDI/components/KPI/dashboard-edi-kpi/dashboard-edi-kpi.component';
import { ListadoLiquidacionesComponent } from './ti/Components/cfdiLiquidacion/Listado-liquidaciones/listado-liquidaciones/listado-liquidaciones.component';

const routes: Routes = [
  //Loggin
  {path: 'login', component: LoginComponent},
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  //Home
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  // Cobranza
  { path: 'rep-pedido-cobranza', component: ReportePedidosCobranzaComponent },

   { path: 'liquidaciones', component: ListadoLiquidacionesComponent },
  
 //Catalogo SAT
 { path: MENU_BD['CP_MUNICIPIO'].path, component: CpMunicipioView, canActivate: [AuthGuard, PermissionsGuard], data: { idMenu: MENU_BD['CP_MUNICIPIO'].idMenu }},

  //Despacho
  { path: MENU_BD['SEGUIMIENTO_GUIAS'].path, component: ReporteSeguimientoGuiaComponent, canActivate: [AuthGuard, PermissionsGuard], data: { idMenu: MENU_BD['SEGUIMIENTO_GUIAS'].idMenu }},

  //TI
  { path: 'mttoEquipoComputo', component: MttoEquipoComputoView},
  { path: MENU_BD['MONITOR_TIMBRADO'].path, component: DashboardComponent, data: { idMenu: MENU_BD['MONITOR_TIMBRADO'].idMenu }},
  { path: MENU_BD['MONITOR_TRASLADO_FACTURA_LIS'].path, component: ListadoFacturasErrorComponent, data: { idMenu: MENU_BD['MONITOR_TRASLADO_FACTURA_LIS'].idMenu }},
  { path: 'bloqueosdb', component: BloqueosdbComponent},

  //CATALOGOS GENERALES
  { path: 'correoServCliente/:id', component: ElementoDetComponent , canActivate: [PermissionsGuard], data: { menuName: 'Correos Serv Cliente', idMenu: 158, requiredPermission: 'Crear'  }},

  { path: 'elemento-detalle/:id', component: ElementoDetComponent },
  { path: 'elemento-det/crear', component: ElementoDetCrearComponent },
  { path: 'elemento-det/editar', component: ElementoDetEditarComponent },
  { path: 'elemento-det/ver', component: ElementoDetVerComponent },

  //SISTEMAS
  { path: 'repoExcesoVelocidad', component: ExcesoVelocidadComponent },
  { path: 'seguimiento-viaje', component: ReporteSeguimientoViajeComponent },

  //SATELITE
  { path: 'sucursal-geocerca', component: SucursalGeocercaViewComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['SUC_GEOCERCA'].menuName, idMenu: MENU_BD['SUC_GEOCERCA'].idMenu  } },
  { path: MENU_BD['TRAZABILIDAD_VIAJES'].path, component: TrazabilidadViajesViewComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['TRAZABILIDAD_VIAJES'].menuName, idMenu: MENU_BD['TRAZABILIDAD_VIAJES'].idMenu  } },

  //CONTROL DE EQUIPO
  { path: 'demoras-remolques', component: demorasRemolquesView, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['DEMORAS_RMLQ'].menuName, idMenu: MENU_BD['DEMORAS_RMLQ'].idMenu  } },
  //RH
  { path: 'RepAdeudos', component: RepAdeudosComponent },
  { path: 'consumos', component: RepConsumosComponent },
  { path: 'caja-ahorro', component: RepCajaAhorroComponent },
  { path: MENU_BD['REP_INGRESO_OPERADORES'].path, component: RepIngresoOperadoresComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['REP_INGRESO_OPERADORES'].menuName, idMenu: MENU_BD['REP_INGRESO_OPERADORES'].idMenu  } },
  { path: MENU_BD['MENU_COMEDOR'].path, component: CatalogoMenuComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['MENU_COMEDOR'].menuName, idMenu: MENU_BD['MENU_COMEDOR'].idMenu  } },
  { path: MENU_BD['EMPLEADO'].path, component: CatalogoEmpleadoComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['EMPLEADO'].menuName, idMenu: MENU_BD['EMPLEADO'].idMenu } },  
  { path: MENU_BD['SUCURSAL'].path, component: SucursalViewComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['SUCURSAL'].menuName, idMenu: MENU_BD['SUCURSAL'].idMenu  } },
  { path: MENU_BD['PERSONAL_TRUCKS'].path, component: PersonalTrucksViewComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['PERSONAL_TRUCKS'].menuName, idMenu: MENU_BD['PERSONAL_TRUCKS'].idMenu  } },
  { path: MENU_BD['REP_SALARIO_DIARIO'].path, component: RepSalarioDiarioComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['REP_SALARIO_DIARIO'].menuName, idMenu: MENU_BD['REP_SALARIO_DIARIO'].idMenu  } },


  // Comedor Consumos
  { path: MENU_BD['REGISTRO_CONSUMO'].path , component: ConsumoComedorComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['REGISTRO_CONSUMO'].menuName, idMenu: MENU_BD['REGISTRO_CONSUMO'].idMenu } },
  { path: `${MENU_BD['REGISTRO_CONSUMO'].path}/create`, component: ConsumoComedorComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['REGISTRO_CONSUMO'].menuName, idMenu: MENU_BD['REGISTRO_CONSUMO'].idMenu, requiredPermission: 'Crear' } },
  { path: `${MENU_BD['REGISTRO_CONSUMO'].path}/edit`, component: ConsumoComedorComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['REGISTRO_CONSUMO'].menuName, idMenu: MENU_BD['REGISTRO_CONSUMO'].idMenu, requiredPermission: 'Editar' } },
  { path: `${MENU_BD['REGISTRO_CONSUMO'].path}/detail`, component: ConsumoComedorComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['REGISTRO_CONSUMO'].menuName, idMenu: MENU_BD['REGISTRO_CONSUMO'].idMenu  } },
  { path: `${MENU_BD['VISITAS'].path}/delete`, component: VisitasComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['VISITAS'].menuName, idMenu: MENU_BD['VISITAS'].idMenu, requiredPermission: 'Eliminar' } },



  { path: MENU_BD['PERSONAL'].path, component: PersonalViewComponent,
    // canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD.PERSONAL.path  }
  },
  { path: `${MENU_BD['PERSONAL'].path}/create`, component: CrearPersonalComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['PERSONAL'].path, idMenu: MENU_BD['PERSONAL'].idMenu, requiredPermission: 'Crear' } },
  { path: `${MENU_BD['PERSONAL'].path}/edit`, component: EditarPersonalComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['PERSONAL'].path, idMenu: MENU_BD['PERSONAL'].idMenu, requiredPermission: 'Editar' } },
  { path: `${MENU_BD['PERSONAL'].path}/detail`, component: VerPersonalComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['PERSONAL'].path, idMenu: MENU_BD['PERSONAL'].idMenu  } },
  { path: `${MENU_BD['PERSONAL'].path}/gafete`, component: PersonalGafeteComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['PERSONAL'].path, idMenu: MENU_BD['PERSONAL'].idMenu  }  },
  { path: MENU_BD['BANCO'].path, component: BancoViewComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['BANCO'].menuName, idMenu: MENU_BD['BANCO'].idMenu  } },
  { path: MENU_BD['CATEGORIA'].path, component: CategoriaViewComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['CATEGORIA'].menuName, idMenu: MENU_BD['CATEGORIA'].idMenu  } },
  { path: MENU_BD['DEPARTAMENTO'].path, component: DepatamentoViewComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['DEPARTAMENTO'].menuName, idMenu: MENU_BD['DEPARTAMENTO'].idMenu  } },

  // Moper
  { path: MENU_BD['REPORTEMOPER'].path, component: RepMoperComponent, canActivate: [AuthGuard], data: { menuName: MENU_BD['REPORTEMOPER'].path, idMenu: MENU_BD['REPORTEMOPER'].idMenu} },


  // { path: `${MENU_BD.PERSONAL_BANCO.path}/create`, component: CrearPersonalComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD.PERSONAL_BANCO.path , requiredPermission: 'Crear' } },
  // { path: `${MENU_BD.PERSONAL_BANCO.path}/edit`, component: EditarPersonalComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD.PERSONAL_BANCO.path , requiredPermission: 'Editar' } },
  // { path: `${MENU_BD.PERSONAL_BANCO.path}/detail`, component: VerPersonalComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD.PERSONAL_BANCO.path  } },

  { path: MENU_BD['PERSONAL_BANCO'].path, component: PersonalBancoViewComponent, canActivate: [AuthGuard],  data: { menuName: MENU_BD['PERSONAL_BANCO'].menuName, idMenu: MENU_BD['PERSONAL_BANCO'].idMenu  } },

  // Operaciones
  { path:  MENU_BD['BITACORA'].path, component: BitacoraComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['BITACORA'].menuName, idMenu: MENU_BD['BITACORA'].idMenu  } },
  { path: `${MENU_BD['BITACORA'].path}/create`, component: CrearBitacoraComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['BITACORA'].menuName, idMenu: MENU_BD['BITACORA'].idMenu, requiredPermission: 'Crear' } },
  { path: `${MENU_BD['BITACORA'].path}/edit`, component: EditarBitacoraComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['BITACORA'].menuName, idMenu: MENU_BD['BITACORA'].idMenu, requiredPermission: 'Editar' } },
  { path: `${MENU_BD['BITACORA'].path}/detail`, component: VerBitacoraComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['BITACORA'].menuName, idMenu: MENU_BD['BITACORA'].idMenu  } },
  
  // Operaciones > seguridadOperadorWebApp
  { path: `${MENU_BD['SEGURIDAD_OPERADOR_WEB_APP'].path}`, component: SeguridadOpWebAppViewComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['SEGURIDAD_OPERADOR_WEB_APP'].menuName, idMenu: MENU_BD['SEGURIDAD_OPERADOR_WEB_APP'].idMenu  } },

  // Cliente Marca Tracktor
  // { path: 'cte-marca-tracktor', component: ElementoDetComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: 'Cliente Marca Tracktor', requiredPermission: 'Crear'  } },
  { path: `${MENU_BD['CTE_MARCA_TRACKTOR'].path}`, component: ClienteMarcaTractorComponent, data: { menuName: 'Cliente Marca Tracktor', idMenu: MENU_BD['CTE_MARCA_TRACKTOR'].idMenu } },
  { path: `${MENU_BD['CTE_MARCA_TRACKTOR'].path}/create`, component: ClienteMarcaTractorComponent,canActivate: [AuthGuard, PermissionsGuard], data: { menuName: 'Cliente Marca Tracktor', idMenu: MENU_BD['CTE_MARCA_TRACKTOR'].idMenu, requiredPermission: 'Crear'  } },
  { path: `${MENU_BD['CTE_MARCA_TRACKTOR'].path}/edit`, component: ClienteMarcaTractorComponent,canActivate: [AuthGuard, PermissionsGuard], data: { menuName: 'Cliente Marca Tracktor', idMenu: MENU_BD['CTE_MARCA_TRACKTOR'].idMenu, requiredPermission: 'Editar'  } },
  { path: `${MENU_BD['CTE_MARCA_TRACKTOR'].path}/detail`, component: ClienteMarcaTractorComponent, data: { menuName: 'Cliente Marca Tracktor', idMenu: MENU_BD['CTE_MARCA_TRACKTOR'].idMenu  } },

  // CLiente Operador Vetado
  { path: `${MENU_BD['CTE_OPERADOR_VET'].path}`, component: ClienteOperadorVetComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: 'Cliente / Op. Vetado', idMenu: MENU_BD['CTE_OPERADOR_VET'].idMenu } },
  { path: `${MENU_BD['CTE_OPERADOR_VET'].path}/create`, component: ClienteOperadorVetComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: 'Cliente / Op. Vetado', idMenu: MENU_BD['CTE_OPERADOR_VET'].idMenu, requiredPermission: 'Crear' } },
  { path: `${MENU_BD['CTE_OPERADOR_VET'].path}/edit`, component: ClienteOperadorVetComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: 'Cliente / Op. Vetado', idMenu: MENU_BD['CTE_OPERADOR_VET'].idMenu, requiredPermission: 'Editar' } },
  { path: `${MENU_BD['CTE_OPERADOR_VET'].path}/detail`, component: ClienteOperadorVetComponent, data: { menuName: 'Cliente / Op. Vetado', idMenu: MENU_BD['CTE_OPERADOR_VET'].idMenu } },




  { path: MENU_BD['VISITAS'].path, component: VisitasComponent, data: { menuName: MENU_BD['VISITAS'].menuName, idMenu: MENU_BD['VISITAS'].idMenu  } },
  // { path: MENU_BD.VISITAS.path, component: VisitasComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD.VISITAS.menuName  } },
  { path: `${MENU_BD['VISITAS'].path}/create`, component: VisitasComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['VISITAS'].menuName, idMenu: MENU_BD['VISITAS'].idMenu, requiredPermission: 'Crear' } },
  { path: `${MENU_BD['VISITAS'].path}/edit`, component: VisitasComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['VISITAS'].menuName, idMenu: MENU_BD['VISITAS'].idMenu, requiredPermission: 'Editar' } },
  { path: `${MENU_BD['VISITAS'].path}/detail`, component: VisitasComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['VISITAS'].menuName, idMenu: MENU_BD['VISITAS'].idMenu  } },

  { path: MENU_BD['TIPOCAJA'].path, component: TipoCajaComponent, data: { idMenu: MENU_BD['TIPOCAJA'].idMenu } },

  // { path:  MENU_BD.DISP_OPERADORES.path, component: DispOperadorComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD.DISP_OPERADORES.menuName  } },
  { path: 'disp-operador', canActivate: [AuthGuard], component: DispOperadorComponent  },

  // { path:  MENU_BD.MPRIORI_PEDIDOS.path, component: MPrioridadPedidosComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD.MPRIORI_PEDIDOS.menuName  } },
  { path:  MENU_BD['MPRIORI_PEDIDOS'].path, component: MPrioridadPedidosComponent, canActivate: [AuthGuard], data: { menuName: MENU_BD['MPRIORI_PEDIDOS'].menuName, idMenu: MENU_BD['MPRIORI_PEDIDOS'].idMenu  } },


  //SERVICIO A CLIENTES
  { path:  MENU_BD['PEDIDOS_PRIORIDAD'].path, component: PedidosPrioridadComponent, canActivate: [AuthGuard], data: { idMenu: MENU_BD['PEDIDOS_PRIORIDAD'].idMenu }},

  { path:  MENU_BD['CLIENTES_ALTERNOS_EDI'].path, component: ViewClientesAlternosEdiComponent, canActivate: [AuthGuard], data: { idMenu: MENU_BD['CLIENTES_ALTERNOS_EDI'].idMenu }},


  // USUARIO
  { path: MENU_BD['USUARIOS'].path, component: CatalogoUsuarioComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['USUARIOS'].menuName, idMenu: MENU_BD['USUARIOS'].idMenu  } },
  // CONFIGURACION ROL
  { path: MENU_BD['ASIGNACION_ROLES'].path, component: ConfigUsuarioRolComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['ASIGNACION_ROLES'].menuName, idMenu: MENU_BD['ASIGNACION_ROLES'].idMenu } },
  { path: MENU_BD['ASIGNACION_PERMISOS'].path, component: RolPermisosComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['ASIGNACION_ROLES'].menuName, idMenu: MENU_BD['ASIGNACION_PERMISOS'].idMenu  } },
  // ROL
  { path: MENU_BD['ROLES'].path, component: CatalogoRolComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['ROLES'].menuName, idMenu: MENU_BD['ROLES'].idMenu  } },


  // EDI
  { path: MENU_BD['GEOCERCA_STOP'].path, component: GeocercaStopComponent, canActivate: [AuthGuard], data: { menuName: MENU_BD['GEOCERCA_STOP'].menuName, idMenu: MENU_BD['GEOCERCA_STOP'].idMenu } },
  { path: `${MENU_BD['GEOCERCA_STOP'].path}/create`, component: GeocercaStopComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['GEOCERCA_STOP'].menuName, idMenu: MENU_BD['GEOCERCA_STOP'].idMenu, requiredPermission: 'Crear' } },
  { path: `${MENU_BD['GEOCERCA_STOP'].path}/edit`, component: GeocercaStopComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['GEOCERCA_STOP'].menuName, idMenu: MENU_BD['GEOCERCA_STOP'].idMenu, requiredPermission: 'Editar' } },
  { path: `${MENU_BD['GEOCERCA_STOP'].path}/detail`, component: GeocercaStopComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD['GEOCERCA_STOP'].menuName, idMenu: MENU_BD['GEOCERCA_STOP'].idMenu } },
  
  // { path: MENU_BD.GEOCERCA_STOP.path, component: GeocercaStopComponent, canActivate: [AuthGuard, PermissionsGuard], data: { menuName: MENU_BD.GEOCERCA_STOP.menuName  } },
  // { path: `${MENU_BD.GEOCERCA_STOP.path}/create`, component: GeocercaStopComponent, data: { menuName: MENU_BD.GEOCERCA_STOP.menuName , requiredPermission: 'Crear' } },
  // { path: `${MENU_BD.GEOCERCA_STOP.path}/edit`, component: GeocercaStopComponent, data: { menuName: MENU_BD.GEOCERCA_STOP.menuName , requiredPermission: 'Editar' } },
  // { path: `${MENU_BD.GEOCERCA_STOP.path}/detail`, component: GeocercaStopComponent, data: { menuName: MENU_BD.GEOCERCA_STOP.menuName  } },

    { path: MENU_BD['EDI_TRACKER'].path, component: EdiTrackerComponent, canActivate: [AuthGuard], data: { menuName: MENU_BD['EDI_TRACKER'].menuName, idMenu: MENU_BD['EDI_TRACKER'].idMenu } },

    { path: MENU_BD['EDI_KPI'].path, component: DashboardEdiKpiComponent, canActivate: [AuthGuard], data: { menuName: MENU_BD['EDI_KPI'].menuName, idMenu: MENU_BD['EDI_KPI'].idMenu } },


  //RUTA INICIAL VACIA
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: '*', redirectTo: 'login' }
  { path: 'DescargaDocFiscales', component: DescargaDocumentosFiscalesComponent, canActivate: [AuthGuard]},
  { path: 'tipo-cambio', component: TipoCambioComponent, canActivate: [AuthGuard]},
  { path: 'actualizacion-estatus-guias', component: ActualizacionEstatusDeGuiasComponent, data: { menuName: 'Actualización estatus de guias' }, canActivate: [AuthGuard]},


  { path: MENU_BD['TIPO_CAMBIO'].path, component: GeocercaStopComponent, canActivate: [AuthGuard], data: { menuName: MENU_BD['TIPO_CAMBIO'].menuName, idMenu: MENU_BD['TIPO_CAMBIO'].idMenu } },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
