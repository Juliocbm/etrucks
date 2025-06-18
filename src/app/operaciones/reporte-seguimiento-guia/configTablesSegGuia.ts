
// =================================== SELECT: CLIENTE =================================== //

import { ColumnConfig } from "src/app/shared-module/Interfaces/ColumnConfig";
import { DisplayColumnConfigDF } from "src/app/shared-module/Interfaces/DisplayColumnConfigDF";
import { TableConfig } from "src/app/shared-module/Interfaces/TableConfig";



export const tableConfigsSegGuia: TableConfig = {
    pageSizeOptions: [10, 20, 30],
    headerColumFontSize: 10,
};

export const tableConfigsCliente: TableConfig = {
    pageSizeOptions: [10, 20, 30],
    headerColumFontSize: 10,
};

export const ColumnConfigsCliente: { [key: string]: ColumnConfig } = {
    id: {
        displayName: 'Id',
        type: 'default',
        showFilter: true,
        visible: true,
        widthColumn: '60px'
       /*  bloquearSeleccion: (item: Cliente) => !(item.nombreEstatus === 'DESBLOQUEADO'), */
    },
    nombre: {
        displayName: 'Nombre',
        type: 'default',
        showFilter: true,
        visible: true,
    },
    rfc: {
        displayName: 'Rfc',
        type: 'default',
        showFilter: true,
        visible: true,
    },
};

export const DisplayColumnConfCliente: DisplayColumnConfigDF = {
    identificador: 'id',
    separadorColumnas: ' - ',
    columnas: ['nombre'],
};


export const columnConfigsSegGuia: { [key: string]: ColumnConfig } = {
    cartaPorte: {
        displayName: 'Carta porte',
        type: 'default',
        showFilter: false,
        visible: true,
    },
    clasificacionDoc: {
        displayName: 'Clasificación doc',
        type: 'number',
        showFilter: false,
        visible: true,
    },
    cpac: {
        displayName: 'CPAC',
        type: 'default',
        showFilter: false,
        visible: true,
    },
    cruce: {
        displayName: 'Cruce',
        type: 'number',
        showFilter: false,
        visible: false,
    },
    descRuta: {
        displayName: 'Descripción ruta',
        type: 'default',
        showFilter: false,
        visible: true,
    },
    destinatario: {
        displayName: 'Destinatario',
        type: 'default',
        showFilter: false,
        visible: true,
    },
    destino: {
        displayName: 'Destino',
        type: 'default',
        showFilter: false,
        visible: true,
    },
    diasFechaCpVsPago: {
        displayName: 'Días CP vs Pago',
        type: 'number',
        showFilter: false,
        visible: false,
    },
    diasFechaFVsCobro: {
        displayName: 'Días FV vs Cobro',
        type: 'number',
        showFilter: false,
        visible: false,
    },
    diasFechaFVsPago: {
        displayName: 'Días FV vs Pago',
        type: 'number',
        showFilter: false,
        visible: false,
    },
    diasFechaGuiaVsFact: {
        displayName: 'Días Guía vs Factura',
        type: 'number',
        showFilter: false,
        visible: false,
    },
    diasVencido: {
        displayName: 'Días vencido',
        type: 'number',
        showFilter: false,
        visible: false,
    },
    factorCpac: {
        displayName: 'Factor CPAC',
        type: 'number',
        showFilter: false,
        visible: false,
    },
    factura: {
        displayName: 'Factura',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    fechaCancelacion: {
        displayName: 'Fecha cancelación',
        type: 'date',
        format: 'dd/MM/yyyy',
        showFilter: false,
        visible: true,
    },
    fechaCarta: {
        displayName: 'Fecha carta',
        type: 'date',
        format: 'dd/MM/yyyy',
        showFilter: false,
        visible: true,
    },
    fechaCartaPorte: {
        displayName: 'Fecha carta porte',
        type: 'date',
        format: 'dd/MM/yyyy',
        showFilter: false,
        visible: true,
    },
    fechaConfirmacion: {
        displayName: 'Fecha confirmación',
        type: 'date',
        format: 'dd/MM/yyyy',
        showFilter: false,
        visible: true,
    },
    fechaFactura: {
        displayName: 'Fecha factura',
        type: 'date',
        format: 'dd/MM/yyyy',
        showFilter: false,
        visible: false,
    },
    fechaPago: {
        displayName: 'Fecha pago',
        type: 'date',
        format: 'dd/MM/yyyy',
        showFilter: false,
        visible: false,
    },
    fianza: {
        displayName: 'Fianza',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    flete: {
        displayName: 'Flete',
        type: 'default',
        showFilter: false,
        visible: true,
    },
    idCliente: {
        displayName: 'ID Cliente',
        type: 'number',
        showFilter: false,
        visible: true,
    },
    idConvenio: {
        displayName: 'ID Convenio',
        type: 'number',
        showFilter: false,
        visible: true,
    },
    idIngreso: {
        displayName: 'ID Ingreso',
        type: 'default',
        showFilter: false,
        visible: true,
    },
    idLinearem1: {
        displayName: 'ID Linea remolque 1',
        type: 'default',
        showFilter: false,
        visible: true,
    },
    idRemolque1: {
        displayName: 'ID Remolque 1',
        type: 'default',
        showFilter: false,
        visible: true,
    },
    idUnidad: {
        displayName: 'ID Unidad',
        type: 'default',
        showFilter: false,
        visible: true,
    },
    ivaGuia: {
        displayName: 'IVA guía',
        type: 'default',
        showFilter: false,
        visible: true,
    },
    kmsCpac: {
        displayName: 'Kms CPAC',
        type: 'number',
        showFilter: false,
        visible: false,
    },
    maniobras: {
        displayName: 'Maniobras',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    montoRetencion: {
        displayName: 'Monto retención',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    montoTipoCambio: {
        displayName: 'Tipo cambio',
        type: 'number',
        showFilter: false,
        visible: false,
    },
    motivoCancelacion: {
        displayName: 'Motivo cancelación',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    noCarta: {
        displayName: 'No. carta',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    noCartaB: {
        displayName: 'No. carta B',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    noRemision: {
        displayName: 'No. remisión',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    noTransferenciaCobranza: {
        displayName: 'Transferencia cobranza',
        type: 'number',
        showFilter: false,
        visible: false,
    },
    noViaje: {
        displayName: 'No. viaje',
        type: 'number',
        showFilter: false,
        visible: false,
    },
    nombre: {
        displayName: 'Nombre',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    origen: {
        displayName: 'Origen',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    otros: {
        displayName: 'Otros',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    permisionario: {
        displayName: 'Permisionario',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    remitente: {
        displayName: 'Remitente',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    seguro: {
        displayName: 'Seguro',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    shipment: {
        displayName: 'Shipment',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    statusCp: {
        displayName: 'Estatus CP',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    subtotal: {
        displayName: 'Subtotal',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    tcFactura: {
        displayName: 'Tipo cambio factura',
        type: 'number',
        showFilter: false,
        visible: false,
    },
    tipoCpac: {
        displayName: 'Tipo CPAC',
        type: 'number',
        showFilter: false,
        visible: false,
    },
    tipoUnidad: {
        displayName: 'Tipo unidad',
        type: 'default',
        showFilter: false,
        visible: false,
    },
    total: {
        displayName: 'Total',
        type: 'default',
        showFilter: false,
        visible: false,
    }
};