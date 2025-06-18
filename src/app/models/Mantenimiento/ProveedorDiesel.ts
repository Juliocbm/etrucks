import { ProveedorCostoCombustible } from "./ProveedorCostoCombustible";

export class ProveedorDiesel {
    idProveedorDiesel: number;
    nombre: string;
    razonSocial: string;
    rfc: string;
    idCompania: number;
    factorIva: number;
    precioUnitario: number;
    precioTotal: number;
    idRef: number;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioCreadoPor:string;
    usuarioModificadoPor:string;
    nomCompania:string;
    proveedorCostoCombustible: ProveedorCostoCombustible[];
  
    constructor() {
      this.idProveedorDiesel = 0;
      this.nombre = '';
      this.razonSocial = '';
      this.rfc = '';
      this.idCompania = 0;
      this.factorIva = 0;
      this.precioUnitario = 0;
      this.precioTotal = 0;
      this.idRef = 0;
      this.activo = true;
      this.fechaCreacion = new Date();
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
      this.nomCompania = '';
      this.proveedorCostoCombustible = [];
    }
  }