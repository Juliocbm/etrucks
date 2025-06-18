import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartaPorteService } from '../../../../../Services/CartaPorteService';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  pedidoForm!: FormGroup;

  private destroy$ = new Subject<void>(); // Para limpiar suscripciones

  shipmentTypes = [
    { key: "Sin asignar", value: "" },
    { key: "OutboundAirShuttle", value: "AIR-LINEHAUL-MX" },
    { key: "TransfersEmptyBags", value: "CRET-TL-MX" },
    { key: "OutboundReturns", value: "CRET-TL-MX" },
    { key: "TransfersReturns", value: "CRET-TL-MX" },
    { key: "TransfersMissorts", value: "CRET-TL-MX" },
    { key: "WELLDEX/NAFN", value: "IMPORT-TL-MX" },
    { key: "OutboundAMZLMM", value: "OBLH-MX" },
    { key: "OutboundExternalFulfillment", value: "OBLH-MX" },
    { key: "OutboundVendorFlex", value: "OBLH-MX" },
    { key: "OutboundAMZL", value: "OBLH-MX" },
    { key: "TransfersInventoryCorrection", value: "WAREHOUSE-TRANSFERS-MX" },
    { key: "TransfersReactive", value: "WAREHOUSE-TRANSFERS-MX" },
    { key: "TransfersTotelnjection", value: "WAREHOUSE-TRANSFERS-MX" },
    { key: "Inbound/Milkrun/WePay", value: "INBOUND-TL-MX" },
    { key: "LTL Vendors", value: "INBOUND-LTL-MX" },
    { key: "V Returns", value: "VRET-TL-MX" }
  ];

  shipperAccountOptions = this.shipmentTypes;

  constructor(private fb: FormBuilder, private cartaPorteService: CartaPorteService) {
    this.pedidoForm = this.fb.group({
      shipment: new FormControl(''),
      shipperAccount: new FormControl(''),
      observacionesPedido: new FormControl(''),
      cteReceptorId: new FormControl('', [Validators.required]),
      cteReceptorNombre: new FormControl('', [Validators.required]),
      cteReceptorCp: new FormControl('', [Validators.required]),
      cteReceptorRegimenFiscal: new FormControl('', [Validators.required]),
      cteReceptorRfc: new FormControl('', [Validators.required]),
      cteReceptorUsoCfdi: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.cartaPorteService.cartaPorte$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cartaPorte => {
        this.pedidoForm.patchValue({ ...cartaPorte }, { emitEvent: false }); // 🔥 Evita disparar valueChanges
        this.cartaPorteService.actualizarValidacion2('pedido', this.pedidoForm);
      });

    // 🔥 Solo actualizar si los valores realmente cambian
    this.pedidoForm.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.validarFormulario());
  }

  validarFormulario() {
    this.cartaPorteService.actualizarValidacion2('pedido', this.pedidoForm);
    this.cartaPorteService.actualizarCartaPorte(this.pedidoForm.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
