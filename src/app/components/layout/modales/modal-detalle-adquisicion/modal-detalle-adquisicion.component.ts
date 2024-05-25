import { Component, OnInit, Inject, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';

import { Adquisicion } from 'src/app/interfaces/adquisicion';
import { DetalleAdquisicion } from 'src/app/interfaces/detalle-adquisicion';
import { AdquisicionService } from 'src/app/services/adquisicion.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';


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


  dataInicio : DetalleAdquisicion [] = [];
  dataListaDetalleAdquisicion = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) public _adquisicion: Adquisicion,
  private _adquisicionServicio:AdquisicionService,
  private _utilidadServicio:UtilidadService

  ){
    this.fechaRegistro = _adquisicion.fechaAdquisicion!;
    this.numeroDocumento = _adquisicion.idAdquisicion!;
    this.facturado = _adquisicion.esFactura;
    this.total = String (_adquisicion.total);
    this.DetalleAdquisicion = _adquisicion.detalleAdquisicion;
  }

  ngOnInit(): void {
    this.obtenerListaDetalleAdquisicion();
  }

  obtenerListaDetalleAdquisicion(){
    this._adquisicionServicio.listaDetalleAdquisicion(this.numeroDocumento).subscribe({
      next:(data) =>{
        if(data.status){
          console.log(data);
          this.dataListaDetalleAdquisicion.data = data.value;

        }else
          this._utilidadServicio.mostrarAlerta(data.msg, "Oops!");

      },
      error:(e)=>{}
    })
  }

  ngAfterViewInit(): void {
    this.dataListaDetalleAdquisicion.paginator = this.paginacionTabla;
  }
}
