import { ColumnConfig } from "./ColumnConfig";
import { TableConfig } from "./TableConfig";

export interface StepInfo {
  label: string;
  content: string; // Aquí puedes usar cualquier tipo que necesites, como HTML o componentes dinámicos
  columnConfigs: { [key: string]: ColumnConfig };
  tableConfigs: TableConfig;
  datos: any[];
  isLoading: boolean;
}
