export interface ClienteAlternoEdi {
    idClienteAlternoEdi?: number;
    idClientePadre: string;
    clientePadreNombre: string;
    clientePadreDireccion: string;
    clientePadreRfc: string;
    clientePadreNumero: number;
    idClienteAlterno: string;
    clienteAlternoNombre: string;
    clienteAlternoDireccion: string;
    clienteAlternoRfc: string;
    clienteAlternoNumero: number;
    idCompania: number;
    creadoPor: string;
    fechaCreacion: string;
    modificadoPor: string;
    fechaModificacion: string;
    activo: boolean;
    countAlternos?: number;
    alternos?: ClienteAlternoEdi[];
}

export interface ClientePrincipalEDI {
    idClientePrincipalEdi: number;
    id: string;
    nombre: string;
    domicilio: string;
    rfc: string;
    noCliente: number;
    idCompania: number;
    creadoPor: string;
    fechaCreacion: string;
    modificadoPor: string;
    fechaModificacion: string;
    activo: boolean;
}

export interface ClienteAlternoEDI extends ClientePrincipalEDI{
    idClienteAlternoEdi: number;
}