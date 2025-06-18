export class PedidosCobranza {
  index: number;
  cliente: string;
  pedido: number;
  numGuia: string;
  guia: string;
  viaje: string;
  caja: string;
  unidad: string;
  shipment: string;
  fecha_guia: Date;
  statusGuia: string;
  ediFinalizado: string;
  tipoOperacion: string;
  remitente: string;
  destinatario: string;
  subtotal: number;
  total: number;

  constructor(
      index: number,
      cliente: string,
      pedido: number,
      numGuia: string,
      guia: string,
      viaje: string,
      caja: string,
      unidad: string,
      shipment: string,
      fecha_guia: Date,
      ediFinalizado: string,
      statusGuia: string,
      tipoOperacion: string,
      remitente: string,
      destinatario: string,
      subtotal: number,
      total: number
  ) {
      this.index = index;
      this.cliente = cliente;
      this.pedido = pedido;
      this.numGuia = numGuia;
      this.guia = guia;
      this.viaje = viaje;
      this.caja = caja;
      this.unidad = unidad;
      this.shipment = shipment;
      this.fecha_guia = fecha_guia;
      this.statusGuia = statusGuia;
      this.ediFinalizado = ediFinalizado;
      this.tipoOperacion = tipoOperacion;
      this.remitente = remitente;
      this.destinatario = destinatario;
      this.subtotal = subtotal;
      this.total = total;
  }
}
