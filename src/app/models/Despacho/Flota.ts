
export class Flota {

    idFlota: number;
    idCompania: number;
    compania: string;
    nombre: string;
    descripcion: string;
    idCliente: string | null;
    cliente: string;
    noCliente: number;
    idSeguidorDia: number | null;
    seguidorDia: string;
    idSeguidorNoche: number | null;
    seguidorNoche: string;
    idTipoFlota: string;
    tipoFlota: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioCreadoPor: string | null;
    usuarioModificadoPor: string | null;
    flotaOperador: FlotaOperador[];
    flotaCliente: FlotaCliente[];
    flotaMarca: FlotaMarca[];
    flotaUnidad: FlotaUnidad[];
    // Excluir flotas y unidades que ya se encuentran asignados a una flota
    flotaClienteAsignado: FlotaCliente[] = [];
    flotaUnidadAsignado: FlotaUnidad[] = [];

    constructor(
        idCliente?: string,
        idTipoFlota?: string,
        creadoPor?: string,
        modificadoPor?: string
    ) {
        this.idFlota = 0;
        this.idCompania = 0;
        this.compania = "";
        this.nombre = '';
        this.descripcion = '';
        this.idCliente = idCliente || '00000000-0000-0000-0000-000000000000';
        this.cliente = '';
        this.noCliente = 0;
        this.idSeguidorDia = 0;
        this.seguidorDia = "";
        this.idSeguidorNoche = 0;
        this.seguidorNoche = "";
        this.idTipoFlota = idTipoFlota || '00000000-0000-0000-0000-000000000000';
        this.tipoFlota = '';
        this.activo = true;
        this.fechaCreacion = new Date();
        this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = new Date();
        this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
        this.usuarioCreadoPor = '';
        this.usuarioModificadoPor = '';
        this.flotaOperador = [];
        this.flotaCliente = [];
        this.flotaMarca = [];
        this.flotaUnidad = [];

        this.flotaClienteAsignado = [];
        this.flotaUnidadAsignado = [];
    }
}

export class FlotaOperador {
    asignar: boolean;
    idFlota: number;
    idOperador: number;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    rfc: string;

    constructor() {
        this.asignar = false;
        this.idFlota = 0;
        this.idOperador = 0;
        this.activo = false;
        this.fechaCreacion = new Date(),
            this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = null;
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
        this.idOperador = 0;
        this.nombre = '';
        this.apellidoPaterno = '';
        this.apellidoMaterno = '';
        this.rfc = '';
    }

}

export class FlotaCliente {
    idFlotaCliente: number;
    idFlota: number;
    flota: string;
    idCliente: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    constructor() {
        this.idFlotaCliente = 0;
        this.idFlota = 0;
        this.flota = '';
        this.idCliente = '';
        this.activo = false;
        this.fechaCreacion = new Date();
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
    }
}

export class FlotaMarca {
    idFlotaMarca: number;
    idFlota: number;
    idMarca: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    constructor() {
        this.idFlotaMarca = 0;
        this.idFlota = 0;
        this.idMarca = '';
        this.activo = false;
        this.fechaCreacion = new Date();
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
    }
}
export class FlotaUnidad {
    idFlotaUnidad: number;
    idFlota: number;
    flota: string;
    idUnidad: number;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    constructor() {
        this.idFlotaUnidad = 0;
        this.idFlota = 0;
        this.flota = '';
        this.idUnidad = 0;
        this.activo = false;
        this.fechaCreacion = new Date();
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';

        this.flota = ''; 
    }
}

export class FlotaClienteGrid {
    idFlotaCliente: number;
    idFlota: number;
    idCliente: string;
    nombre: string;
    rfc: string;
    seleccionado: boolean;
    constructor() {
        this.idFlotaCliente = 0;
        this.idFlota = 0;
        this.idCliente = '';
        this.nombre = '';
        this.rfc = '';
        this.seleccionado = false;
    }
}

export class FlotaMarcaGrid {
    idFlotaMarca: number;
    idFlota: number;
    idMarca: string;
    nombre: string;
    idTipoMarca: string;
    tipoMarca: string;
    seleccionado: boolean;
    constructor() {
        this.idFlotaMarca = 0;
        this.idFlota = 0;
        this.idMarca = '';
        this.nombre = '';
        this.idTipoMarca = '';
        this.tipoMarca = '';
        this.seleccionado = false;
    }
}

export class FlotaUnidadGrid {
    idFlotaCliente: number;
    idFlota: number;
    idUnidad: number;
    unidad: string;
    idOperador: number;
    operador: string;
    tipoOperador: string;
    idMarca: string;
    marca: string;
    seleccionado: boolean;
    constructor() {
        this.idFlotaCliente = 0;
        this.idFlota = 0;
        this.idUnidad = 0;
        this.unidad = '';
        this.idOperador = 0;
        this.operador = '';
        this.tipoOperador = '';
        this.idMarca = '';
        this.marca = '';
        this.seleccionado = false;
    }
}
