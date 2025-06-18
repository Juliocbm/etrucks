export interface TableAction {
  name: string;
  title: string;
  icon?: string;
  tooltip: string;
  callback: (item: any) => void;
  showCondition?: (item: any) => boolean;
  isVisible?: (item: any) => boolean;
  permission?: 'Crear' | 'Editar' | 'Eliminar' | 'Imprimir' | 'Ver';
  }