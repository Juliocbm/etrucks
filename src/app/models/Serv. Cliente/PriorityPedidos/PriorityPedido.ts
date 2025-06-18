export class PriorityPedido {
    idArea: number;
    idPedido: number;
    idSucursal: number;
    sucursal: string;
    estatusPedido: number;
    priorityPosition: number;
    fechaPedido: Date;
    cliente: string;
    origen: string;
    destino: string;
    ruta: string;
    tipoRuta: string;
    conCita: boolean;
    fechaInsert: Date;
    manualPosition: boolean;

    constructor(
        idArea: number,
        idPedido: number,
        idSucursal: number,
        sucursal: string,
        estatusPedido: number,
        priorityPosition: number,
        fechaPedido: string,
        cliente: string,
        origen: string,
        destino: string,
        ruta: string,
        tipoRuta: string,
        conCita: boolean,
        fechaInsert: string,
        manualPosition: boolean
    ) {
        this.idArea = idArea;
        this.idPedido = idPedido;
        this.idSucursal = idSucursal;
        this.sucursal = sucursal;
        this.estatusPedido = estatusPedido;
        this.priorityPosition = priorityPosition;
        this.fechaPedido = new Date(fechaPedido);
        this.cliente = cliente;
        this.origen = origen;
        this.destino = destino;
        this.ruta = ruta;
        this.tipoRuta = tipoRuta;
        this.conCita = conCita;
        this.fechaInsert = new Date(fechaInsert);
        this.manualPosition = manualPosition;
    }
}
