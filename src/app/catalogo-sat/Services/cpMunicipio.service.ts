import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cpMunicipio } from 'src/app/models/catalogo-sat/cpMunicipio';
import { CpMunicipioView } from '../Components/cp-municipio/view-cpMunicipio/cpMunicipio-view.component';

@Injectable({
    providedIn: 'root'
})
export class CpMunicipioService {
    private CpMunicipioSource = new BehaviorSubject(new cpMunicipio());
    CpMunicipioActual = this.CpMunicipioSource.asObservable();

    constructor(){}
    changeCpMunicipioSource(cp: cpMunicipio){
        this.CpMunicipioSource.next(cp);
    }
}