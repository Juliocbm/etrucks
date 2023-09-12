import { Component } from '@angular/core';
import { Marca } from '../..//../../models/Mantenimiento/marca';
import { MarcaService } from '../../../Services/marca.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-marca',
  templateUrl: './ver-marca.component.html',
  styleUrls: ['./ver-marca.component.css']
})
export class VerMarcaComponent {
  marca: Marca;

  constructor(private MarcaService: MarcaService, private router: Router) {
    this.marca = new Marca();
  }

  ngOnInit() {
    this.MarcaService.marcaActual.subscribe(marca => this.marca = marca);
  }

  goToEditarMarca() {
    this.MarcaService.changeMarca(this.marca);
    this.router.navigate(['/marcas/editarMarca']);
  }
}
