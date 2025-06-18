import { ColumnConfig } from "../../../shared-module/Interfaces/ColumnConfig";
import { TableConfig } from "../../../shared-module/Interfaces/TableConfig";

export const tableConfigsLiquidaciones: TableConfig = {
    pageSizeOptions: [10, 25, 50],
    headerColumFontSize: 10
};

export const ColumnConfigsLiquidaciones: { [key: string]: ColumnConfig } = {
    select: {
        displayName: '',
        type: 'default',
        showFilter: false,
        visible: true,
        widthColumn: '40px'
    },
    idLiquidacion: {
        displayName: 'No. Liquidación',
        type: 'default',
        showFilter: true,
        visible: true,
        widthColumn: '100px'
    },
    nombre: {
        displayName: 'Operador',
        type: 'default',
        showFilter: true,
        visible: true,
        widthColumn: '100px'
    },
    rfc: {
        displayName: 'RFC',
        type: 'default',
        showFilter: true,
        visible: true,
        widthColumn: '100px'
    },
    fecha: {
        displayName: 'Fecha',
        type: 'date',
        showFilter: true,
        visible: true,
        widthColumn: '100px'
    },
    estatus: {
        displayName: 'Estatus',
        type: 'number',
        showFilter: true,
        visible: true,
        widthColumn: '10px'
    },
    mensaje: {
        displayName: 'Mensaje',
        type: 'default',
        showFilter: false,
        visible: true,
        widthColumn: '10px'
    },
    intentos: {
        displayName: 'Intentos',
        type: 'number',
        showFilter: false,
        visible: true,
        widthColumn: '10px'
    },
    /*  proximoIntento: {
         displayName: 'Próximo Intento',
         type: 'date',
         showFilter: false,
         visible: true,
         widthColumn: '100px'
     }, */
    proximoIntento: {
        displayName: 'Próximo Intento',
        type: 'default',
        showFilter: false,
        visible: true,
        widthColumn: '100px',
        customRender: (rowData) =>
            rowData.proximoIntento == null
                ? 'No programado'
                : new Date(rowData.proximoIntento).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                }),
    },
    uuid: {
        displayName: 'UUID',
        type: 'default',
        showFilter: false,
        visible: true,
        widthColumn: '100px',
        customRender: (rowData) =>
            rowData.uuid == null
                ? 'Sin UUID'
                : rowData.uuid,
    },
    estatus2: {
        displayName: 'Estatus',
        type: 'default',
        showFilter: false,
        visible: true,
        widthColumn: '100px',
        customRender: (rowData) => rowData.timbrando ? 'Timbrando...' : ''
    }
};
