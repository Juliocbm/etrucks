export class Clientes {
  idCliente: number | string;
  nombre: string;
  rfc: string;
  dirCalle: string;
  noCliente: number;
  idClienteAlternoEdi: number;

  constructor(data: Partial<Clientes> = {}) {
    this.idCliente = data.idCliente ?? 0;
    this.nombre = data.nombre ?? '';
    this.rfc = data.rfc ?? '';
    this.dirCalle = data.dirCalle ?? '';
    this.noCliente = data.noCliente ?? 0;
    this.idClienteAlternoEdi = data.idClienteAlternoEdi ?? 0;
  }
}
