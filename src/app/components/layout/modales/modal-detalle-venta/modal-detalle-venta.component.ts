import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from 'src/app/interfaces/venta';
import { DetalleVenta } from 'src/app/interfaces/detalle-venta';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent implements OnInit{

  fechaRegistro: string = "";
  numeroDocumento: number = 0;
  facturado: number = 0;
  total?: string ="";
  detalleVenta: DetalleVenta []= [];
  columnasTabla: string[]=['producto', "cantidad", "precio", "total"];


  constructor(@Inject(MAT_DIALOG_DATA) public _venta: Venta ){
    this.fechaRegistro = _venta.fechaVenta!;
    this.numeroDocumento = _venta.idVenta!;
    this.facturado = _venta.esFactura;
    this.total = _venta.totalTexto;
    this.detalleVenta = _venta.detalleVenta;
  }

  ngOnInit(): void {}
}
