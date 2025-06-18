import { AptoMedico } from "../AptoMedico";

export class PersonalModel {
    idPersonal: number;
    nombreCompleto: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    idSucursal: number;
    sucursal: string;
    idCompania: number;
    compania: string;
    idDepartamento: number;
    departamento: string;
    idCategoria: number;
    categoria: string;
    emailPersonal: string;
    email: string;
    noNomina: string;
    idTipoNomina: number;
    tipoNomina: string;
    rfc: string;
    curp: string;
    nss: string;
    colonia: string;
    calle: string;
    noExterior: string;
    codigoPostal: string;
    idMunicipio: number;
    municipio: string;
    idEstado: number;
    estado: string;
    telefonoEmergencia: string;
    fechaNacimiento: Date ;
    idLugarNacimiento: number;
    lugarNacimiento: string;
    idGenero: string;
    genero: string;
    idEstadoCivil: string;
    estadoCivil: string;
    cantHijos: number;
    idNivelEscolar: string;
    nivelEscolar: string;
    profesion: string;
    fechaIngreso: Date;
    idTipoContrato: string;
    tipoContrato: string;
    idCausaAlta: number;
    causaAlta: string;
    idUsuario: string;
    foto: string;
    codigoBarras: string;
    idPersonalRef: number;
    idLisRef: number;
    replicaRegistro: boolean;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    familiares: FamiliaModel[];
    personalFamiliars: FamiliaModel[];

    personalBajas: PersonalBaja[];
    personalEstatus: PersonalEstatus[];
    
    idEstatusPersonal: string = '';
    estatusActual: string = '';

    idCausaBajaPersonal: string = '';
    causaBajaActual: string = '';
    observacionBaja: string = '';

    idCategoriaLicencia:string = '';
    folioLicencia: string = '';
    fechaVenceLicencia: Date;
    fechaAptoMedico: Date;
    operadorLicencias: OperadorLicencia[];
    tipoLicenciaSelect: any[];

    personalSalud: PersonalSalud[];
   // idTipoLicencia: string;

    constructor() {
        this.idPersonal = 0;
        this.nombreCompleto = '';
        this.nombre = '';
        this.apellidoPaterno = '';
        this.apellidoMaterno = '';
        this.idSucursal = 0;
        this.sucursal = '';
        this.idCompania = 0;
        this.compania = '';
        this.idDepartamento = 0;
        this.departamento = '';
        this.idCategoria = 0;
        this.categoria = '';
        this.emailPersonal = '';
        this.email = '';
        this.noNomina = '';
        this.idTipoNomina = 0;  
        this.tipoNomina = '';
        this.rfc = '';
        this.curp = '';
        this.nss = '';
        this.colonia = '';
        this.calle = '';
        this.noExterior = '';
        this.codigoPostal = '';
        this.idMunicipio = 0;
        this.municipio = '';
        this.idEstado = 0;
        this.estado = '';
        this.telefonoEmergencia = '';
        this.fechaNacimiento = new Date(currentDate.getFullYear() - 18,
        currentDate.getMonth(),
        currentDate.getDate() + 1);
        this.idLugarNacimiento = 0;
        this.lugarNacimiento = '';
        this.idGenero = '';
        this.genero = '';
        this.idEstadoCivil = '';
        this.estadoCivil = '';
        this.cantHijos = 0;
        this.idNivelEscolar = '';
        this.nivelEscolar = '';
        this.profesion = '';
        this.fechaIngreso = new Date();
        this.idTipoContrato = '';
        this.tipoContrato = '';
        this.idCausaAlta = 0;
        this.causaAlta = '';
        this.idUsuario = '00000000-0000-0000-0000-000000000000';
        this.foto = '';
        this.codigoBarras = '';
        this.idPersonalRef = 0;
        this.idLisRef = 0;
        this.replicaRegistro = true;
        this.activo = false;
        this.fechaCreacion = new Date();
        this.creadoPor = '';
        this.usuarioCreadoPor = '';
        this.fechaModificacion = new Date();
        this.modificadoPor = '';
        this.usuarioModificadoPor = '';
        this.familiares = [];
        this.personalFamiliars = [];
        this.personalBajas = [];
        this.personalEstatus = [];

        this.idEstatusPersonal = '';
        this.estatusActual = '';
        this.observacionBaja = '';

        this.idCategoriaLicencia = '00000000-0000-0000-0000-000000000000';
        this.folioLicencia = '';
        this.fechaVenceLicencia = new Date();
        this.fechaAptoMedico = new Date();
        this.operadorLicencias = [];

        this.tipoLicenciaSelect = [];

        this.personalSalud = [];

        //this.idTipoLicencia = '00000000-0000-0000-0000-000000000000';
    }
}

const currentDate = new Date();
export class FamiliaModel {
    id: number;
    idPersonal: number;
    idParentesco: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: Date;
    telefono: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;

    constructor() {
        this.id = 0;
        this.idPersonal = 0;
        this.idParentesco = '00000000-0000-0000-0000-000000000000';
        this.nombre = '';
        this.apellidoPaterno = '';
        this.apellidoMaterno = '';
        this.fechaNacimiento = new Date();
        this.telefono = '';
        this.activo = true;
        this.fechaCreacion = new Date();
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
    }
}


export class PersonalEstatus {
    id: number;
    idPersonal: number | null;
    idEstatus: string | null;
    estatus: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;

    constructor() {
        this.id = 0;
        this.idPersonal = null;
        this.idEstatus = '00000000-0000-0000-0000-000000000000';
        this.estatus = '';
        this.activo = true;
        this.fechaCreacion = new Date();
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
    }
}

export class PersonalBaja {
    id: number;
    idPersonal: number | null;
    idEstatus: string | null;
    estatus: string;
    observacion: string | null;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;

    constructor() {
        this.id = 0;
        this.idPersonal = null;
        this.idEstatus = '00000000-0000-0000-0000-000000000000';
        this.estatus = '';
        this.observacion = null;
        this.activo = true;
        this.fechaCreacion = new Date();
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
    }
}
export class OperadorLicencia {
    id: number;
    idOperador: number;
    idPersonal: number;
    vencimientoAptoMedico: Date;
    idTipoLicencia: string ; // Asumiendo que usas cadenas para GUIDs en Angular
    tipoLicencia: string;
    folioLicencia: string = '';
    fechaVenceLicencia: Date;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;

    constructor() {
        this.id = 0;
        this.idOperador = 0;
        this.idPersonal = 0;
        this.vencimientoAptoMedico = new Date();
        this.idTipoLicencia = '00000000-0000-0000-0000-000000000000'; // Valor GUID por defecto
        this.tipoLicencia = '';
        this.folioLicencia = '';
        this.fechaVenceLicencia = new Date();
        this.activo = true;
        this.fechaCreacion = new Date();
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
    }
}

export class PersonalSalud {
    id: number;
    idPersonal: number | null;
    estadoSalud: boolean | null;
    descripcionEnfermedad: string | null;
    alergia: boolean | null;
    hipertension: boolean | null;
    lentes: boolean | null;
    diabetes: boolean | null;
    idGrupoSanguineo: string | null; // Asumiendo que usas cadenas para GUIDs en Angular
    idFactorRh: string | null;       // Asumiendo que usas cadenas para GUIDs en Angular
    grupoSanguineo: string | null;
    factorRh: string | null;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;

    constructor() {
        this.id = 0;
        this.idPersonal = 0;
        this.estadoSalud = false;
        this.descripcionEnfermedad = '';
        this.alergia = false;
        this.hipertension = false;
        this.lentes = false;
        this.diabetes = false;
        this.idGrupoSanguineo = '00000000-0000-0000-0000-000000000000'; // Valor GUID por defecto
        this.idFactorRh = '00000000-0000-0000-0000-000000000000';       // Valor GUID por defecto
        this.grupoSanguineo = null;
        this.factorRh = null;
        this.activo = true;
        this.fechaCreacion = new Date();
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
    }
}
