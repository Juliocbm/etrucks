import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { mttoEquipoComputo } from 'src/app/models/ti/mttoEquipoComputo';

@Injectable({
    providedIn: 'root'
})
export class MttoEquipoComputoService {
    private mttoEquipoComputoSource = new BehaviorSubject(new mttoEquipoComputo());
    mttoEquipoComputoSourceActual = this.mttoEquipoComputoSource.asObservable();

    constructor(){}
    changeMttoEquipoComputoSource(mtt: mttoEquipoComputo){
        this.mttoEquipoComputoSource.next(mtt);
    }
}