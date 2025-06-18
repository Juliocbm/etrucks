import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CatalogoModalComponent } from '../components/catalogo-modal/catalogo-modal.component';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogoModalService {
  bsModalRef?: BsModalRef;

  // Usaremos un Subject para comunicarnos entre el servicio y el componente modal
  private modalDataSubject = new Subject<any>();
  modalData$: Observable<any> = this.modalDataSubject.asObservable();

  config = {
    class: 'gray modal-lg',
    backdrop: true,
    ignoreBackdropClick: false,
    keyboard: true,
  };

  data = {
    columns: [],
    columnConfigs: {},
    datos: [],
    datosFiltrados: []
  };;
  

  constructor(private modalService: BsModalService) {}

  openCatalogoModal(data: any): void {

    console.log("Informacion recibida del componente solicitante: ", data);
    const initialState = {
      data: data
    };

    this.bsModalRef = this.modalService.show(CatalogoModalComponent, {initialState, ...this.config} );
    // this.bsModalRef = this.modalService.show(CatalogoModalComponent, this.modalConfig );
    this.bsModalRef.content.closeBtnName = 'Cerrar';

    // Puedes exponer un método en el componente del modal para enviar información
    this.bsModalRef.content.enviarInformacion.subscribe((data: any) => {
        console.log('Información enviada desde el modal al servicio:', data);
        this.modalDataSubject.next(data);
      });
  }
}