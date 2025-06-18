import { ColumnConfig } from "src/app/shared-module/Interfaces/ColumnConfig";
import { DisplayColumnConfigDF } from "src/app/shared-module/Interfaces/DisplayColumnConfigDF";
import { TableConfig } from "src/app/shared-module/Interfaces/TableConfig";




export const tableConfigs: TableConfig = {
  pageSizeOptions: [5, 10, 15, 20],
  headerColumFontSize: 5,
  heightRow: 'auto',
};


export const columnConfigsOperadorUsuario: { [key: string]: ColumnConfig } = {
  // idOperadorUsuario: {
  //   displayName: 'Id',
  //   type: 'default',
  //   showFilter: true,
  //   visible: false,
  // },
  idPersonal: {
    displayName: 'No. personal',
    type: 'default',
    showFilter: true,
    visible: true,
    widthColumn: '10%'
  },
  nombre: {
    displayName: 'Nombre',
    type: 'default',
    showFilter: true,
    visible: true,
    customRender: (rowData) => `${rowData.nombre}`,
    widthColumn: '25%'
  },
  categoria: {
    displayName: 'Categoria',
    type: 'default',
    showFilter: false,
    visible: true,
    widthColumn: '15%'
  },
  claveValida: {
    displayName: 'Clave configurada',
    type: 'boolean',
    trueValue: 'SI',
    falseValue: 'NO',
    showFilter: false,
    visible: true,
    widthColumn: '15%'
  },
  clave: {
    displayName: 'Clave',
    type: 'default',
    showFilter: false,
    visible: true,
    // editable: true,
    // customRender: (rowData) => `${rowData.pin}`,
    widthColumn: '10%',
    // maxLength: 4,
    // char: '0'
  },
  // activo: {
  //     displayName: 'Estatus',
  //     type: 'boolean',
  //     trueValue: 'Activo',
  //     falseValue: 'Inactivo',
  //     showFilter: false,
  //     visible: false,
  //   },
  fechaModificacion: {
    displayName: 'Modificado',
    type: 'date',
    format: 'dd/MMM/yyyy',
    showFilter: true,
    startDate: null,
    endDate: null,
    visible: true,
    widthColumn: '15%'
  },
  usuarioModificadoPor: {
    displayName: 'Modificado por',
    type: 'default',
    showFilter: true,
    visible: true,
    widthColumn: '20%'
  },
};