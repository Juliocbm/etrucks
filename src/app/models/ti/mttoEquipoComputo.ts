export class mttoEquipoComputo {
    id_activo: number;
    num_activo: string | null;
    Activo: string | null;
    estatus: string | null; // Puedes utilizar un tipo enum si es apropiado
    fecha_adquisicion: string | null;
    fecha_asignacion: string | null;
    fecha_ult_preventivo: string | null;
    siguienteMtto: string | null;
    semaforo: string;
    estatusMtto: string;
    clasificacionActivo: string;
  
    constructor(
    ) {
      this.id_activo = 0;
      this.num_activo ='';
      this.Activo = '';
      this.estatus = '';
      this.fecha_adquisicion = '';
      this.fecha_asignacion = '';
      this.fecha_ult_preventivo = '';
      this.siguienteMtto = '';
      this.semaforo = '';
      this.estatusMtto = '';
      this.clasificacionActivo = '';
    }
  }