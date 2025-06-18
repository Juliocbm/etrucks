export interface ColumnConfig {
  type: 'boolean' | 'date' | 'date-time' | 'number' | 'number-event' | 'default' | 'action' | 'default-truncate' | 'select' | 'icon' | 'money' | 'collapse';
  trueValue?: string;
  falseValue?: string;
  format?: string;
  showFilter?: boolean; // Agrega esta línea
  startDate?: Date | null | undefined;
  endDate?: Date | null | undefined;
  displayName?: string;
  editable?: boolean;
  event?:boolean;
  char?: string;
  customRender?: (value: any, row: any, column: string) => string;
  show?:boolean;
  visible?:boolean;
  widthColumn?:string;
  iniFilterBool?:boolean;
  bloquearSeleccion?: (value: any) => boolean;
  filterFunction?: (value: any) => string;
  functionEvent?: (event: any, item?:any) => void;
  disabledInput?: boolean;
  subArrayCollapse?: string;
  nomSubItemCollapse?: string;
  valueSubItemCollapse?: string;
  isOpenCollapse?: boolean;
}
  