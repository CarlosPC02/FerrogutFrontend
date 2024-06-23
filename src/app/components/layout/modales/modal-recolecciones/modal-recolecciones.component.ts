import { Component, OnInit, Inject, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Recoleccion } from 'src/app/interfaces/recoleccion';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import { DetalleVenta } from 'src/app/interfaces/detalle-venta';

@Component({
  selector: 'app-modal-recolecciones',
  templateUrl: './modal-recolecciones.component.html',
  styleUrls: ['./modal-recolecciones.component.css']
})
export class ModalRecoleccionesComponent implements OnInit {

  id: number = 0;
  columnasTabla: string[]=['recoleccion', "detalleVenta", "precio", "cantidad", "cantidadMaxima", "accion"];

  dataInicio : Recoleccion [] = [];
  dataListaRecolecciones = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;


  constructor(@Inject(MAT_DIALOG_DATA) public _detalleVenta: DetalleVenta,
  private dialog:MatDialog,
  private _ventaServicio:VentaService,
  private _utilidadServicio:UtilidadService){
    this.id = _detalleVenta.idDetalleVenta!;
  }


  ngOnInit(): void {
    this.obtenerListaRecoleccion();
  }

  ngAfterViewInit(): void {
    this.dataListaRecolecciones.paginator = this.paginacionTabla;
  }


  obtenerListaRecoleccion(){
    this._ventaServicio.listarRecolecciones(this.id).subscribe({
      next:(data) =>{
        if(data.status){
          //console.log(data);
          this.dataListaRecolecciones.data = data.value;

        }else
          this._utilidadServicio.mostrarAlerta(data.msg, "Oops!");

      },
      error:(e)=>{}
    })
  }
}
