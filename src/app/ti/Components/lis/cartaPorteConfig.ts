import { ColumnConfig } from "src/app/shared-module/Interfaces/ColumnConfig";
import { TableConfig } from "src/app/shared-module/Interfaces/TableConfig";

export const tableConfigsFacturas: TableConfig = {
    pageSizeOptions: [5, 20, 50],
    headerColumFontSize: 10,
};

export const ColumnConfigsFacturas: { [key: string]: ColumnConfig } = {
    numGuia: {
        displayName: 'Remisión',
        type: 'default',
        showFilter: true,
        visible: true,
        widthColumn: '60px'
    },
    cteReceptorId: {
        displayName: 'Id cliente',
        type: 'default',
        showFilter: true,
        visible: true,
    },
    cteReceptorNombre: {
        displayName: 'Receptor',
        type: 'default',
        showFilter: true,
        visible: true,
    },
    idUnidad: {
        displayName: 'Unidad',
        type: 'default',
        showFilter: true,
        visible: true,
    },
    operador: {
        displayName: 'Operador',
        type: 'default',
        showFilter: true,
        visible: true,
    },
    fechaTimbrado: {
        displayName: 'Fecha timbrado',
        type: 'date',
        showFilter: true,
        visible: true,
    },
};
