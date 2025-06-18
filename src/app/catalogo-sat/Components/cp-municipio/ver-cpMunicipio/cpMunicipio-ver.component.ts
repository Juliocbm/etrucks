import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { GeneralParametersService } from '../../../../shared-module/services/general-parameters.service';
import { cpMunicipio } from 'src/app/models/catalogo-sat/cpMunicipio';
import { ApiCpMunicipio } from 'src/app/DataAccess/api-catalogoSat-cpMunicipio.service';
import { CpMunicipioService } from 'src/app/catalogo-sat/Services/cpMunicipio.service';

@Component({
    selector: 'app-catalogo-cpMunicipioVer',
    templateUrl: './cpMunicipio-ver.component.html',
    styleUrls: ['./cpMunicipio-ver.component.css']
})
export class CpMunicipioVer{
cp: cpMunicipio;
    constructor(private cpService : CpMunicipioService, private router :  Router)
    {
        this.cp = new cpMunicipio;
    }
    ngOnInit() {
        this.cpService.CpMunicipioActual.subscribe((cpActual) => (this.cp = cpActual));
      }
}