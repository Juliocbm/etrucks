export class Cliente {
    idCliente: string;
    noCliente: number;
    nombre: string; 
    activo: boolean | null;    
    creadoPor: string | null;
    modificadoPor: string | null;
    razonSocial: string; 
    rfc: string; 
    fechaCreacion: Date;
    fechaModificacion: Date | null;
    dirCalle: string | null;
    dirCodigoP: string | null;
    dirColonia: string | null;
    dirCorreo: string | null;
    dirEstado: string | null;
    dirLocalidad: string | null;
    dirMunicipio: string | null;
    dirNoExt: string | null;
    dirNoInt: string | null;
    dirReferencias: string | null;
    dirTelefono: string | null;
    logoPath: string | null;  
  
    constructor() {
      this.idCliente = '00000000-0000-0000-0000-000000000000';
      this.noCliente = 0;
      this.nombre = '';
      this.razonSocial = '';
      this.rfc = '';
      this.dirCalle = null;
      this.dirColonia = null;
      this.dirCodigoP = null;
      this.dirCorreo = null;
      this.dirEstado = null;
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.dirLocalidad = null;
      this.dirMunicipio = null;
      this.activo = false;
      this.fechaCreacion = new Date();
      this.fechaModificacion = null;
      this.dirNoExt = null;
      this.dirNoInt = null;
      this.dirReferencias = null;
      this.dirTelefono = null;
      this.logoPath = null;
    }
}