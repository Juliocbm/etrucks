interface IPermiso {
    [key: string]: { 
      idPermiso: number;
    };
  }
  
  export const PERMISOS: IPermiso = {
      VER:{idPermiso:1},
      CREAR:{idPermiso:2},
      EDITAR:{idPermiso:3},
      ELIMINAR:{idPermiso:4},
      IMPRIMIR:{idPermiso:5},
      DESCARGAR:{idPermiso:6}
    };
    