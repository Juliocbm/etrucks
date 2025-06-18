export interface Menu {
  idMenu: number;
  idPadre: number | null;
  menu: string;
  url: string | null;
  idCompania: number;
  children?: Menu[];  // Asegú
}

  export interface Permiso {
    idMenu: number;
    menu: string;
    idPermiso: number;
    permiso: string;
    idCompania: number
  }
  