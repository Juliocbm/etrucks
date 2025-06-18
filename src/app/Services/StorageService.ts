import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService<T> {
  private itemSource: BehaviorSubject<T | null>;
  public itemActual: Observable<T | null>;
  private key: string = '';
  private defaultValue: T | null = null;

  constructor() {
    // Se asegura de que itemSource pueda manejar T o null desde el inicio.
    this.itemSource = new BehaviorSubject<T | null>(null);
    this.itemActual = this.itemSource.asObservable();
  }

  init(key: string
    /* , defaultValue: T */
    ): void {
    this.key = key;
    /* this.defaultValue = defaultValue; */
    // Se asegura de que cargarItemInicial pueda devolver T o null.
    // Y ahora es consistente con el tipo de itemSource.
    this.itemSource = new BehaviorSubject<T | null>(this.cargarItemInicial());
    this.itemActual = this.itemSource.asObservable();
  }

  private cargarItemInicial(): T | null {
    const itemGuardado = localStorage.getItem(this.key);
    if (itemGuardado) {
      return JSON.parse(itemGuardado);
    } else {
      return this.defaultValue;
    }
  }

  changeItem(item: T): void {
    this.itemSource.next(item);
    localStorage.setItem(this.key, JSON.stringify(item));
  }

  // Aquí puedes agregar más métodos según necesites para manejar operaciones CRUD
}
