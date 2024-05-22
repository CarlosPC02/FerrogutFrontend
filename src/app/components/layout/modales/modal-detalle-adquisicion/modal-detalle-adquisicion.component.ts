import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Adquisicion } from 'src/app/interfaces/adquisicion';
import { DetalleAdquisicion } from 'src/app/interfaces/detalle-adquisicion';

@Component({
  selector: 'app-modal-detalle-adquisicion',
  templateUrl: './modal-detalle-adquisicion.component.html',
  styleUrls: ['./modal-detalle-adquisicion.component.css']
})
export class ModalDetalleAdquisicionComponent implements OnInit{
  fechaRegistro: string = "";
  numeroDocumento: number = 0;
  facturado: number = 0;
  total?: string ="";
  DetalleAdquisicion: DetalleAdquisicion []= [];
  columnasTabla: string[]=['producto', "cantidad", "precio", "total"];


  constructor(@Inject(MAT_DIALOG_DATA) public _adquisicion: Adquisicion ){
    this.fechaRegistro = _adquisicion.fechaAdquisicion!;
    this.numeroDocumento = _adquisicion.idAdquisicion!;
    this.facturado = _adquisicion.esFactura;
    this.total = _adquisicion.totalTexto;
    this.DetalleAdquisicion = _adquisicion.detalleAdquisicion;
  }

  ngOnInit(): void {}
}
