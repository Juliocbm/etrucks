import { MENU_BD } from './paths.constants';

export const Routes = {
  //HOME
  // home: () => `/${MENU_BD.HOME.path}`,
  // error: () => `/${MENU_BD.ERROR.path}`,
  // notFound: () => `/${MENU_BD.NOT_FOUND.path}`,
  // forbidden: () => `/${MENU_BD.FORBIDDEN.path}`,
  // serverError: () => `/${MENU_BD.SERVER_ERROR.path}`,

  //CATALOGO SAT
  cpMunicipio: {
    base: () => `/${MENU_BD['CP_MUNICIPIO'].path}`,
    detail: (id: string) => `/${MENU_BD['CP_MUNICIPIO'].path}/detail/${id}`,
    create: () => `/${MENU_BD['CP_MUNICIPIO'].path}/create`,
    edit: (id: string) => `/${MENU_BD['CP_MUNICIPIO'].path}/edit/${id}`,
  },

  //TI
  mttoEquipoComputo: {
    base: () => `/${MENU_BD['MTTO_EQUIPO_COMPUTO'].path}`,
    detail: (id: string) => `/${MENU_BD['MTTO_EQUIPO_COMPUTO'].path}/detail/${id}`,
    create: () => `/${MENU_BD['MTTO_EQUIPO_COMPUTO'].path}/create`,
    edit: (id: string) => `/${MENU_BD['MTTO_EQUIPO_COMPUTO'].path}/edit/${id}`,
  },
  monitorTimbrado: {
    base: () => `/${MENU_BD['MONITOR_TIMBRADO'].path}`,
    detail: (id: string) => `/${MENU_BD['MONITOR_TIMBRADO'].path}/detail/${id}`,
    create: () => `/${MENU_BD['MONITOR_TIMBRADO'].path}/create`,
    edit: (id: string) => `/${MENU_BD['MONITOR_TIMBRADO'].path}/edit/${id}`,
  },
  monitorTrasladoLis: {
    base: () => `/${MENU_BD['MONITOR_TRASLADO_FACTURA_LIS'].path}`,
    detail: (id: string) => `/${MENU_BD['MONITOR_TRASLADO_FACTURA_LIS'].path}/detail/${id}`,
    create: () => `/${MENU_BD['MONITOR_TRASLADO_FACTURA_LIS'].path}/create`,
    edit: (id: string) => `/${MENU_BD['MONITOR_TRASLADO_FACTURA_LIS'].path}/edit/${id}`,
  },

  //CATALOGOS GENERALES
  elementoDetalle: {
    base: () => `/${MENU_BD['ELEMENTO_DETALLE'].path}`,
    detail: (id: string) => `/${MENU_BD['ELEMENTO_DETALLE'].path}/detail/${id}`,
    create: () => `/${MENU_BD['ELEMENTO_DETALLE'].path}/create`,
    edit: (id: string) => `/${MENU_BD['ELEMENTO_DETALLE'].path}/edit/${id}`,
  },

  //SISTEMAS
  excesoVelocidad: {
    base: () => `/${MENU_BD['EXCESO_VELOCIDAD'].path}`,
    detail: (id: string) => `/${MENU_BD['EXCESO_VELOCIDAD'].path}/detail/${id}`,
    create: () => `/${MENU_BD['EXCESO_VELOCIDAD'].path}/create`,
    edit: (id: string) => `/${MENU_BD['EXCESO_VELOCIDAD'].path}/edit/${id}`,
  },

  seguimientoViaje: {
    base: () => `/${MENU_BD['SEGUIMINTO_VIAJE'].path}`,
  },

  bloqueosdb: {
    base: () => `/${MENU_BD['BLOQUEOSDB'].path}`,
    detail: (id: string) => `/${MENU_BD['BLOQUEOSDB'].path}/detail/${id}`,
    create: () => `/${MENU_BD['BLOQUEOSDB'].path}/create`,
    edit: (id: string) => `/${MENU_BD['BLOQUEOSDB'].path}/edit/${id}`,
  },

  repAdeudos: {
    base: () => `/${MENU_BD['REP_ADEUDOS'].path}`,
    detail: (id: string) => `/${MENU_BD['REP_ADEUDOS'].path}/detail/${id}`,
    create: () => `/${MENU_BD['REP_ADEUDOS'].path}/create`,
    edit: (id: string) => `/${MENU_BD['REP_ADEUDOS'].path}/edit/${id}`,
  },

  sucursales: {
    base: () => `/${MENU_BD['SUCURSAL'].path}`,
    detail: (id: string) => `/${MENU_BD['SUCURSAL'].path}/detail/${id}`,
    create: () => `/${MENU_BD['SUCURSAL'].path}/create`,
    edit: (id: string) => `/${MENU_BD['SUCURSAL'].path}/edit/${id}`,
  },

  pedidoCobranza: {
    base: () => `/${MENU_BD['PEDIDO_COBRANZA'].path}`,
    detail: (id: string) => `/${MENU_BD['PEDIDO_COBRANZA'].path}/detail/${id}`,
    create: () => `/${MENU_BD['PEDIDO_COBRANZA'].path}/create`,
    edit: (id: string) => `/${MENU_BD['PEDIDO_COBRANZA'].path}/edit/${id}`,
  },


  // PERSONAL
  personal: {
    base: () => `/${MENU_BD['PERSONAL'].path}`,
    detail: (id: string) => `/${MENU_BD['PERSONAL'].path}/detail/${id}`,
    create: () => `/${MENU_BD['PERSONAL'].path}/create`,
    edit: (id: string) => `/${MENU_BD['PERSONAL'].path}/edit/${id}`,
    gafete: (id: string) => `/${MENU_BD['PERSONAL'].path}/gafete/${id}`,
  },

  // BANCO
  banco: {
    base: () => `/${MENU_BD['BANCO'].path}`
  },
  // CATEGORIA
  categoria: {
    base: () => `/${MENU_BD['CATEGORIA'].path}`
  },
      // DEPARTAMENTO
  departamento: {
    base: () => `/${MENU_BD['DEPARTAMENTO'].path}`
  },

  // PERSONAL BANCO
  personalBanco: {
    base: () => `/${MENU_BD['PERSONAL_BANCO'].path}`
  },

  //SEGURIDAD
  seguridad: {
    login: () => `/${MENU_BD['LOGIN'].path}`,
    accessDenied: () => `/${MENU_BD['ACCESS_DENIED'].path}`,
    forgotPassword: () => `/${MENU_BD['FORGOT_PASSWORD'].path}`,
    forgotPasswordInstruction: () =>
      `/${MENU_BD['FORGOT_PASSWORD_INSTRUCTION'].path}`,
    resetPassword: () => `/${MENU_BD['RESET_PASSWORD'].path}`,
  },

  // Operaciones
  bitacora: {
    base: () => `/${MENU_BD['BITACORA'].path}`,
    detail: (id: string) => `/${MENU_BD['BITACORA'].path}/detail/${id}`,
    create: () => `/${MENU_BD['BITACORA'].path}/create`,
    edit: (id: string) => `/${MENU_BD['BITACORA'].path}/edit/${id}`,
  },

  dispOperadores: {
    base: () => `/${MENU_BD['DISP_OPERADORES'].path}`,
    detail: (id: string) => `/${MENU_BD['DISP_OPERADORES'].path}/detail/${id}`,
    create: () => `/${MENU_BD['DISP_OPERADORES'].path}/create`,
    edit: (id: string) => `/${MENU_BD['DISP_OPERADORES'].path}/edit/${id}`,
  },

  mPrioridadPedidos: {
    base: () => `/${MENU_BD['MPRIORI_PEDIDOS'].path}`,
    // detail: (id: string) => `/${MENU_BD['MPRIORI_PEDIDOS'].path}/detail/${id}`,
    // create: () => `/${MENU_BD['MPRIORI_PEDIDOS'].path}/create`,
    // edit: (id: string) => `/${MENU_BD['MPRIORI_PEDIDOS'].path}/edit/${id}`,
  },

  cteMarcaTracktor: {
    base: () => `/${MENU_BD['CTE_MARCA_TRACKTOR'].path}`,
    detail: (id: string) => `/${MENU_BD['CTE_MARCA_TRACKTOR'].path}/detail/${id}`,
    create: () => `/${MENU_BD['CTE_MARCA_TRACKTOR'].path}/create`,
    edit: (id: string) => `/${MENU_BD['CTE_MARCA_TRACKTOR'].path}/edit/${id}`,
  },

  cteOperadorVet: {
    base: () => `/${MENU_BD['CTE_OPERADOR_VET'].path}`,
    detail: (id: string) => `/${MENU_BD['CTE_OPERADOR_VET'].path}/detail/${id}`,
    create: () => `/${MENU_BD['CTE_OPERADOR_VET'].path}/create`,
    edit: (id: string) => `/${MENU_BD['CTE_OPERADOR_VET'].path}/edit/${id}`
  },

  // RH: TIPO CAJA DE AHORRO
  tipoCaja: {
    base: () => `/${MENU_BD['TIPOCAJA'].path}`,
    detail: (id: string) => `/${MENU_BD['TIPOCAJA'].path}/detail/${id}`,
    create: () => `/${MENU_BD['TIPOCAJA'].path}/create`,
    edit: (id: string) => `/${MENU_BD['TIPOCAJA'].path}/edit/${id}`,
    gafete: (id: string) => `/${MENU_BD['TIPOCAJA'].path}/gafete/${id}`,
  },

  // RH: REPORTE MOPER
  reporteMoper: {
    base: () => `/${MENU_BD['REPORTEMOPER'].path}`,
    detail: (id: string) => `/${MENU_BD['REPORTEMOPER'].path}/detail/${id}`,
    create: () => `/${MENU_BD['REPORTEMOPER'].path}/create`,
    edit: (id: string) => `/${MENU_BD['REPORTEMOPER'].path}/edit/${id}`,
  },

  // RH: REGISTRO CONSUMO
  registroConsumo: {
    base: () => `/${MENU_BD['REGISTRO_CONSUMO'].path}`,
    detail: (id: string) => `/${MENU_BD['REGISTRO_CONSUMO'].path}/detail/${id}`,
    create: () => `/${MENU_BD['REGISTRO_CONSUMO'].path}/create`,
    edit: (id: string) => `/${MENU_BD['REGISTRO_CONSUMO'].path}/edit/${id}`,
  },

  // EDI
  geocercaStop: {
    base: () => `/${MENU_BD['GEOCERCA_STOP'].path}`,
    detail: (id: string) => `/${MENU_BD['GEOCERCA_STOP'].path}/detail/${id}`,
    create: () => `/${MENU_BD['GEOCERCA_STOP'].path}/create`,
    edit: (id: string) => `/${MENU_BD['GEOCERCA_STOP'].path}/edit/${id}`,
  },

  
  ediTracker: {
    base: () => `/${MENU_BD['EDI_TRACKER'].path}`,
    detail: (id: string) => `/${MENU_BD['EDI_TRACKER'].path}/detail/${id}`,
    create: () => `/${MENU_BD['EDI_TRACKER'].path}/create`,
    edit: (id: string) => `/${MENU_BD['EDI_TRACKER'].path}/edit/${id}`,
  },

  ediKpi: {
    base: () => `/${MENU_BD['EDI_KPI'].path}`,
    detail: (id: string) => `/${MENU_BD['EDI_KPI'].path}/detail/${id}`,
    create: () => `/${MENU_BD['EDI_KPI'].path}/create`,
    edit: (id: string) => `/${MENU_BD['EDI_KPI'].path}/edit/${id}`,
  },



  //ADMINISTRADOR
  usuarios: {
    base: () => `/${MENU_BD['USUARIOS'].path}`,
    detail: (id: string) => `/${MENU_BD['USUARIOS'].path}/detail/${id}`,
    create: () => `/${MENU_BD['USUARIOS'].path}/create`,
    edit: (id: string) => `/${MENU_BD['USUARIOS'].path}/edit/${id}`,
  },
  asignacionRoles: {
    base: () => `/${MENU_BD['ASIGNACION_ROLES'].path}`,
    edit: (id: string) => `/${MENU_BD['ASIGNACION_ROLES'].path}/edit/${id}`,
  },
  asignacionPermisos: {
    base: () => `/${MENU_BD['ASIGNACION_PERMISOS'].path}`,
  },
  roles: {
    base: () => `/${MENU_BD['ROLES'].path}`,
    detail: (id: string) => `/${MENU_BD['ROLES'].path}/detail/${id}`,
    create: () => `/${MENU_BD['ROLES'].path}/create`,
    edit: (id: string) => `/${MENU_BD['ROLES'].path}/edit/${id}`,
  },
  //MENU COMEDOR
  menuComedor: {
    base: () => `/${MENU_BD['MENU_COMEDOR'].path}`,
    detail: (id: string) => `/${MENU_BD['MENU_COMEDOR'].path}/detail/${id}`,
    create: () => `/${MENU_BD['MENU_COMEDOR'].path}/create`,
    edit: (id: string) => `/${MENU_BD['MENU_COMEDOR'].path}/edit/${id}`,
  },
  empleados: {
    base: () => `/${MENU_BD['EMPLEADO'].path}`,
    detail: (id: string) => `/${MENU_BD['EMPLEADO'].path}/detail/${id}`,
    create: () => `/${MENU_BD['EMPLEADO'].path}/create`,
    edit: (id: string) => `/${MENU_BD['EMPLEADO'].path}/edit/${id}`,
  },
};
