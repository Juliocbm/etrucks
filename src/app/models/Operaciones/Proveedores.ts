export class Proveedor {
  id_proveedor: number;
  num_proveedor: string | null;
  nombre_proveedor: string | null;
  fecha_ingreso: Date;

  constructor(
      id_proveedor: number = 0,
      num_proveedor: string | null = null,
      nombre_proveedor: string | null = null,
      fecha_ingreso: Date = new Date()
  ) {
      this.id_proveedor = id_proveedor;
      this.num_proveedor = num_proveedor;
      this.nombre_proveedor = nombre_proveedor;
      this.fecha_ingreso = fecha_ingreso;
  }
}
