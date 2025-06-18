import { ParametrosGenerales } from "src/app/models/SistemaGeneral/ParametrosGenerales";
import { FieldsFormConfig } from "src/app/shared-module/Interfaces/FieldsFormConfig";

export const fieldsFormTipoCambio: { [key: string]: FieldsFormConfig } = { 
  valor: {
    alias: 'tipo de cambio'
  }
};

export const ParametrosTipoCambio = new ParametrosGenerales({
    ordenarPor: 'fecha',
    descending: true,
    activos: false,
  });
  