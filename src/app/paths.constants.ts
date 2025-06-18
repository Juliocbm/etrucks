interface IMenuBD {
    [key: string]: { 
      path: string; 
      menuName?: string; 
      idMenu?: number;
    };
  }

export const MENU_BD: IMenuBD = {
    // Administrador
    USUARIOS: { path: 'usuario', menuName: 'Usuarios', idMenu: 114 },
    ROLES: { path: 'rol', menuName: 'Roles', idMenu: 115 },
    ASIGNACION_ROLES: { path: 'configUsuarioRol', menuName: 'Asignar rol', idMenu: 116 },
    ASIGNACION_PERMISOS: { path: 'RolPermisos', menuName: 'Permisos de rol', idMenu: 117 },

    // Seguridad
    LOGIN: { path: 'login', menuName: 'Login', idMenu: 0 },
    ACCESS_DENIED: { path: 'access-denied', menuName: 'Access denied', idMenu: 0 },
    FORGOT_PASSWORD: { path: 'forgot-password', menuName: 'Forgot password', idMenu: 0 },
    FORGOT_PASSWORD_INSTRUCTION: { path: 'forgot-password-instruction', menuName: 'Forgot password instruction', idMenu: 0 },
    RESET_PASSWORD: { path: 'reset-password', menuName: 'Reset password', idMenu: 0 },

    // Catalogo Sat
    CP_MUNICIPIO: { path: 'catalogoCp', menuName: 'CP Municipio', idMenu: 123 },

    // Catalogo Operaciones
    BITACORA: { path: 'Bitacoras-Muleros', menuName: 'Bitacoras de Muleros', idMenu: 131 },
    DISP_OPERADORES: { path: 'disp-operador', menuName: 'Disponibilidad de operador', idMenu: 132 },
    MPRIORI_PEDIDOS: { path: 'm-prioridad-pedidos', menuName: 'Monitor de prioridad de pedidos', idMenu: 119 },
    VISITAS: { path: 'visitas', menuName: 'Visitas', idMenu: 133 },

    //SERVICIO A CLIENTES
    PEDIDOS_PRIORIDAD: { path: 'prioridad-pedidos', menuName: 'Prioridad de pedidos', idMenu: 119 },
    CLIENTES_ALTERNOS_EDI: { path: 'clientes-alternos-edi', menuName: 'Clientes alternos EDI', idMenu: 0 },

    // TI
    MTTO_EQUIPO_COMPUTO: { path: 'mtto-equipo-computo', menuName: 'Mtto equipo computo', idMenu: 157 },
    MONITOR_TIMBRADO: { path: 'monitorDetalles', menuName: 'MonitorDetalles', idMenu: 158 },
    MONITOR_TRASLADO_FACTURA_LIS: { path: 'erroresTrasladoLis', menuName: 'ErroresTrasladoLis', idMenu: 159 },

    // DESPACHO
    SEGUIMIENTO_GUIAS: { path: 'seguimiento-guias', menuName: 'Seguimiento de guias', idMenu: 130 },

    // CAT GENERAL
    ELEMENTO_DETALLE: { path: 'elemento-detalle', menuName: 'Elemento detalle', idMenu: 0 },

    // RH
    SUCURSAL: { path: 'sucursal', menuName: 'Sucursales', idMenu: 142 },
    PERSONAL: { path: 'personal', menuName: 'Personal', idMenu: 0 },
    BANCO: { path: 'banco', menuName: 'Banco', idMenu: 136 },
    TIPOCAJA: { path: 'tipoCaja', menuName: 'TipoCaja', idMenu: 138 },
    REPORTEMOPER: { path: 'rep-moper', menuName: 'Proceso Odessa', idMenu: 145 },
    PERSONAL_BANCO: { path: 'PersonalBancos', menuName: 'Personal banco', idMenu: 137 },
    PERSONAL_TRUCKS: { path: 'personalTrucks', menuName: 'Personal trucks', idMenu: 149 },

    DEPARTAMENTO: { path: 'departamento', menuName: 'Departamento', idMenu: 140 },
    CATEGORIA: { path: 'categoria', menuName: 'Categoria', idMenu: 139 },

    // Cobranza
    PEDIDO_COBRANZA: { path: 'rep-pedido-cobranza', menuName: 'Pedido cobranza', idMenu: 124 },

    // Sistemas
    EXCESO_VELOCIDAD: { path: 'exceso-velocidad', menuName: 'Exceso velocidad', idMenu: 153 },
    BLOQUEOSDB: { path: 'bloqueosdb', menuName: 'Bloqueosdb', idMenu: 156 },
    REP_ADEUDOS: { path: 'rep-adeudos', menuName: 'Rep adeudos', idMenu: 135 },
    SEGUIMINTO_VIAJE: { path: 'seguimiento-viaje', menuName: 'Reporte de seguimiento de viajes', idMenu: 154 },

    //SATELITE
    SUC_GEOCERCA: { path: 'Sucursal Geocerca', menuName: 'Sucursal geocerca', idMenu: 151 },
    TRAZABILIDAD_VIAJES: { menuName: 'Trazabilidad de viajes', path: 'trazabilidad-de-viajes', idMenu: 152 },

    //CONTROL DE EQUIPO
    DEMORAS_RMLQ: { path: 'demoras-remolques', menuName: 'Demoras Remolques', idMenu: 128 },

    // Operaciones
    CTE_MARCA_TRACKTOR: { path: 'cte-marca-tracktor', menuName: 'Cliente / Marca', idMenu: 120 },
    CTE_OPERADOR_VET: { path: 'cte-operador-vet', menuName: 'Cliente / Op. Vetado', idMenu: 121 },
    SEGURIDAD_OPERADOR_WEB_APP: { path:'accesoOpWebApp', menuName: 'Acceso aplicación operadores', idMenu: 129 },

    // Shared
    HOME: { path: 'home', menuName: 'Home', idMenu: 0 },
    ERROR: { path: 'error', menuName: 'Error', idMenu: 0 },
    NOT_FOUND: { path: 'not-found', menuName: 'Not found', idMenu: 0 },
    FORBIDDEN: { path: 'forbidden', menuName: 'Forbidden', idMenu: 0 },
    SERVER_ERROR: { path: 'server-error', menuName: 'Server error', idMenu: 0 },
    UNAUTHORIZED: { path: 'unauthorized', menuName: 'Unauthorized', idMenu: 0 },

    //RH
    MENU_COMEDOR: { path: 'menuComedor', menuName: 'Menu Comedor', idMenu: 141 },
    REGISTRO_CONSUMO: { path: 'registroConsumo', menuName: 'Consumo Comedor', idMenu: 146 },
    EMPLEADO: { path: 'empleados', menuName: 'empleados', idMenu: 143 },
    REP_INGRESO_OPERADORES: { path: 'repIngresoOp', menuName: 'Ingreso operadores', idMenu: 150 },
    REP_SALARIO_DIARIO: { path: 'rptSalarioDiario', menuName: 'Salario diario', idMenu: 148 },

    // EDI
    GEOCERCA_STOP: { path: 'geocerca-stop', menuName: 'Geocerca Stop', idMenu: 127 },
    EDI_TRACKER: { path: 'edi-tracker', menuName: 'Edi Tracker', idMenu: 0 },
    EDI_KPI: { path: 'edi-kpi', menuName: 'Edi KPI', idMenu: 0 },

    //TIPO CAMBIO
    TIPO_CAMBIO: { path: 'tipo-cambio', menuName: 'Tipo de cambio', idMenu: 126 },
}
