// Definición de tipo para un elemento del menú
export interface MenuItem {
  Id: number;
  IdPadre: number | null;
  Nombre: string;
  Url: string | null;
  catGeneral: boolean;
  children?: MenuItem[];  // Asegúrate de que 'children' sea opcional
  IdCompania: number;
}

export interface Compania{
  IdCompania: number;
  Nombre: string;
}