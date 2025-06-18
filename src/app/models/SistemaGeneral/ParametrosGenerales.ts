import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface IParametrosGenerales {
  ordenarPor?: string;
  descending?: boolean;
  noPagina?: number;
  tamanoPagina?: number;
  rangoFechas?: string | null;
  activos?: boolean;
  filtrosIniciales?: Record<string, string>;
  filtrosPorColumna?: Record<string, string>;
  multiIds?: string;
  actionMulti?: string;
  idCompania?: number;
}

export class ParametrosGenerales implements IParametrosGenerales {
  ordenarPor: string = 'FechaCreacion';
  descending: boolean = false;
  noPagina: number = 1;
  tamanoPagina: number = 10;
  activos: boolean = true;
  filtrosIniciales: Record<string, string> = {};
  filtrosPorColumna: Record<string, string> = {};

  rangoFechas: string = '';

  multiIds: string = '';
  actionMulti: string = '';
  idCompania: number = 0;

  constructor(init?: Partial<IParametrosGenerales>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionParametros {
  configurar(
    parametros: ParametrosGenerales,
    extraParams?: Record<string, any>
  ): HttpParams {
    let params = new HttpParams();
    parametros.idCompania = Number(localStorage.getItem('CompaniaSelect')) || 0;

    // Agregar valores básicos del objeto de parámetros
    Object.entries(parametros).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    // Agregar filtros iniciales
    params = this.agregarFiltros(
      params,
      'filtrosIniciales',
      parametros.filtrosIniciales
    );

    // Agregar filtros por columna
    params = this.agregarFiltros(
      params,
      'filtrosPorColumna',
      parametros.filtrosPorColumna
    );

    // Agregar parámetros adicionales
    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return params;
  }

  private agregarFiltros(
    params: HttpParams,
    prefix: string,
    filtros?: Record<string, string>
  ): HttpParams {
    // Añadir filtros si existen
    if (filtros) {
      Object.keys(filtros).forEach((key) => {
        const filtro = filtros![key];
        if (filtro) {
          params = params.set(`${prefix}[${key}]`, filtro);
        }
      });
    }

    return params;
  }
}
