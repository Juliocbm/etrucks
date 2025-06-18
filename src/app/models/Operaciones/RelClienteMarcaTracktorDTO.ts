import { Marca } from './../Mantenimiento/patio';


export class RelClienteMarcaTracktor {
  id: number;
  idCliente: number;
  idMarcaTracktor: number;
  activo?: boolean;
  creado: Date;
  creadoPor?: string;
  modificado?: Date;
  modificadoPor?: string;

  constructor(
    id: number = 0,
    idCliente: number = 0,
    idMarcaTracktor: number = 0,
    activo: boolean = true,
    creado: Date = new Date(),
    creadoPor: string = '',
    modificado: Date = new Date(),
    modificadoPor: string = ''
  ) {
    this.id = id;
    this.idCliente = idCliente;
    this.idMarcaTracktor = idMarcaTracktor;
    this.activo = activo;
    this.creado = creado;
    this.creadoPor = creadoPor;
    this.modificado = modificado;
    this.modificadoPor = modificadoPor;
  }
}


// export class RelClienteMarcaTracktorDTO {
//   id: number;
//   idCliente: number;
//   nameCliente: string;
//   idMarcaTracktor: number;
//   nameMarcaTracktor: string;
//   activo?: boolean;
//   creado: Date;
//   nameCreadoPor?: string;
//   creadoPor?: string;
//   modificado?: Date;
//   nameModificadoPor?: string;
//   modificadoPor?: string;

//   constructor(
//     id: number = 0,
//     idCliente: number = 0,
//     nameCliente: string = '',
//     idMarcaTracktor: number = 0,
//     nameMarcaTracktor: string = '',
//     activo: boolean = true,
//     creado: Date = new Date(),
//     nameCreadoPor: string = '',
//     creadoPor: string = '',
//     modificado: Date = new Date(),
//     nameModificadoPor: string = '',
//     modificadoPor: string = ''
//   ) {
//     this.id = id;
//     this.idCliente = idCliente;
//     this.nameCliente = nameCliente;
//     this.idMarcaTracktor = idMarcaTracktor;
//     this.nameMarcaTracktor = nameMarcaTracktor;
//     this.activo = activo;
//     this.creado = creado;
//     this.nameCreadoPor = nameCreadoPor;
//     this.creadoPor = creadoPor;
//     this.modificado = modificado;
//     this.nameModificadoPor = nameModificadoPor;
//     this.modificadoPor = modificadoPor;
//   }
// }


export class Cliente {
  id: number;
  nombre: string;
  activo: boolean;
  creado: Date;
  creadoPor: string;
  modificado: Date;
  modificadoPor: string;

  constructor(
    id: number = 0,
    nombre: string = '',
    activo: boolean = true,
    creado: Date = new Date(),
    creadoPor: string = '',
    modificado: Date = new Date(),
    modificadoPor: string = ''
  ) {
    this.id = id;
    this.nombre = nombre;
    this.activo = activo;
    this.creado = creado;
    this.creadoPor = creadoPor;
    this.modificado = modificado;
    this.modificadoPor = modificadoPor;
  }
}

export class RelClienteMarcaTracktorDTO {
  id: number;
  idCliente: number;
  nameCliente: string;
  activo?: boolean;
  creado: Date;
  creadoPor?: string;
  nameCreadoPor?: string;
  modificado?: Date;
  modificadoPor?: string;
  nameModificadoPor?: string;
  marcas: MarcaUnidadesModel[];

  constructor(
    id: number = 0,
    idCliente: number = 0,
    nameCliente: string = '',
    activo: boolean = true,
    creado: Date = new Date(),
    creadoPor: string = '',
    nameCreadoPor: string = '',
    modificado: Date = new Date(),
    modificadoPor: string = '',
    nameModificadoPor: string = '',
    marcas: MarcaUnidadesModel[] = []
  ) {
    this.id = id;
    this.idCliente = idCliente;
    this.nameCliente = nameCliente;
    this.activo = activo;
    this.creado = creado;
    this.creadoPor = creadoPor;
    this.nameCreadoPor = nameCreadoPor;
    this.modificado = modificado;
    this.modificadoPor = modificadoPor;
    this.nameModificadoPor = nameModificadoPor;
    this.marcas = marcas;
  }
}

export class MarcaUnidadesModel {
  id_marca_unidad: number;
  nombre: string;
  tipo_unidad: string;

  constructor(id_marca_unidad: number = 0, nombre: string = '', tipo_unidad: string = '') {
    this.id_marca_unidad = id_marca_unidad;
    this.nombre = nombre;
    this.tipo_unidad = tipo_unidad;
  }
}


export class MarcaTracktor {
  id_marca_unidad: number;
  nombre: string;
  tipo_unidad: string;

  constructor(
    id_marca_unidad: number = 0,
    nombre: string = '',
    tipo_unidad: string = ''
  ) {
    this.id_marca_unidad = id_marca_unidad;
    this.nombre = nombre;
    this.tipo_unidad = tipo_unidad;
  }
}
