//interface para inyectar configuracion al DropdownFullComponent reutilizable
export interface IDisplayColumnConfigDF {
  identificador?: string;
  separadorColumnas?: string;
  columnas?: string[];
  idMulti?: string;
}

export class DisplayColumnConfigDF implements IDisplayColumnConfigDF {
  identificador?: string;
  separadorColumnas?: string;
  columnas?: string[];
  idMulti?: string;

  constructor(init?: Partial<IDisplayColumnConfigDF>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export function getDisplayColumnConfig(
  identificador?: string,
  columnas?: string[],
  idMulti?: string
): DisplayColumnConfigDF {
  return new DisplayColumnConfigDF({
    identificador,
    separadorColumnas: ' - ',
    columnas,
    idMulti,
  });
}
