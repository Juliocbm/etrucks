export interface AptoMedico {
    idAptoMedico: number;
    idPersonal: number;
    nombre: string;
    emitidoPor: string;
    fechaEmision: Date;
    fechaVencimiento: Date;
    observaciones: string;
    idCompania: number;
    compania: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
  }
  
  export class AptoMedico implements AptoMedico {
    constructor(
    ) {
      this.idAptoMedico = 0;
      this.idPersonal = 0;
      this.nombre = '';
      this.emitidoPor = '';
      this.fechaEmision = new Date();
      this.fechaVencimiento = new Date();
      this.observaciones = '';
      this.idCompania = 0;
      this.compania = '';
      this.activo = false;
      this.fechaCreacion = new Date();
      this.creadoPor = '';
      this.usuarioCreadoPor = '';
      this.fechaModificacion = new Date();
      this.modificadoPor = '';
      this.usuarioModificadoPor = '';
    }
  }
  

  export class Companias  {   
    item_id: number;
    item_text: string;
    constructor(){
        this.item_id = 0;
        this.item_text = '';
        
    }
  }