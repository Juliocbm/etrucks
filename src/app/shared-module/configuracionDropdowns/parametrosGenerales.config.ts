import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';

const idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
const idUsuario: string = localStorage.getItem('usuario') || '';

export const ParametrosDropdownComidaMenu = new ParametrosGenerales({
  ordenarPor: 'Nombre',
  activos: true,
  filtrosIniciales: {
    idMenu: 'comidaMenu',
  },
});

export const ParametrosDropdownEmpleado = new ParametrosGenerales({
  ordenarPor: 'Nombre',
  activos: true,
});

export const ParametrosDropdownSucursales = new ParametrosGenerales({
  ordenarPor: 'Nombre',
  activos: true,
});

export const ParametrosDropdownConsumo = new ParametrosGenerales({
  ordenarPor: 'IdConsumo',
  activos: true,
  idCompania: idCompania,
  tamanoPagina: 100,
});

export const ParametrosDropdownPersonalBanco = new ParametrosGenerales({
  ordenarPor: 'Nombre',
  activos: true,
});

export const ParametrosDropdownOperadorUsuario = new ParametrosGenerales({
  ordenarPor: 'ClaveValida,Nombre',
  activos: true,
  tamanoPagina: 100,
  idCompania: idCompania,
});

export const ParametrosDropdownVisita = new ParametrosGenerales({
  ordenarPor: 'IdVisita',
  activos: true,
  tamanoPagina: 100,
  idCompania: idCompania,
  filtrosIniciales: {
    creadoPor: idUsuario,
  },
});

export const ParametrosDropdownSucursalesVisitas = new ParametrosGenerales({
  ordenarPor: 'Nombre',
  activos: true,
  idCompania: idCompania,
});

export const ParametrosDropdownProveedores = new ParametrosGenerales({
  ordenarPor: 'num_proveedor',
  activos: true,
  idCompania: idCompania,
});

export const ParametrosDropdownTipoDocumento = new ParametrosGenerales({
  ordenarPor: 'codigo',
  activos: true,
  idCompania: idCompania,
});

export const ParametrosDropdownEstatusSolicitud = new ParametrosGenerales({
  ordenarPor: 'Nombre',
  activos: true,
  idCompania: idCompania,
});

export const ParametrosDropdownClientes = new ParametrosGenerales({
  ordenarPor: 'Nombre',
  activos: true,
  idCompania: idCompania,
  tamanoPagina: 20,
});

export const ParametrosDropdownOperadores = new ParametrosGenerales({
  ordenarPor: 'Nombre',
  activos: true,
  idCompania: idCompania,
  tamanoPagina: 20,
});

export const ParametrosDropdownConexionDetalle = new ParametrosGenerales({
  ordenarPor: 'Descripcion',
  activos: true,
  idCompania: idCompania,
});

export const ParametrosDropdownTipoParada = new ParametrosGenerales({
  ordenarPor: 'Descripcion',
  activos: true,
  idCompania: idCompania,
});

export const ParametrosDropdownEvento = new ParametrosGenerales({
  ordenarPor: 'Descripcion',
  activos: true,
  idCompania: idCompania,
});

export const ParametrosDropdownEdiClienteParada = new ParametrosGenerales({
  ordenarPor: 'Descripcion',
  activos: true,
  idCompania: idCompania,
});

export const ParametrosDropdownGeocerca = new ParametrosGenerales({
  ordenarPor: 'Descripcion',
  activos: true,
  idCompania: idCompania,
  tamanoPagina: 20,
});

export const ParametrosDropdownMarcas = new ParametrosGenerales({
  ordenarPor: 'id_marca_tractor',
  activos: true,
  idCompania: idCompania,
  tamanoPagina: 100,
});

export const ParametrosDropdownClientesCTEMarca = new ParametrosGenerales({
  ordenarPor: 'Nombre',
  activos: true,
  idCompania: idCompania,
  tamanoPagina: 5,
});

export const ParametrosDropdownPersonal = new ParametrosGenerales({
  ordenarPor: 'Nombre',
  activos: true,
});

export const ParametrosDropdownEdiClienteParadasGeocerca =
  new ParametrosGenerales({
    ordenarPor: 'idEdiClienteParadasGeocerca',
    activos: true,
    tamanoPagina: 100,
    idCompania: idCompania,
  });

export const ParametrosDropdownGeocercaStop =
  new ParametrosGenerales({
    ordenarPor: 'descripcion',
    activos: true,
    tamanoPagina: 100,
    idCompania: idCompania,
  });

  export const ParametrosPersonalTrucksTabla = new ParametrosGenerales({
    ordenarPor: 'Nombre',
    //activos: true,
    //tamanoPagina: 50,
    idCompania: idCompania,
  });
  
  export const ParametrosMenu = new ParametrosGenerales({
    ordenarPor: 'Nombre',
    descending: true,
  });