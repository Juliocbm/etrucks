// Definición de tipo para un elemento del menú
export interface MenuItem {
    Id: number;
    IdPadre: number | null;
    Nombre: string;
    Url: string | null;
    // ...otros campos
  }