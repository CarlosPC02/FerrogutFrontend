import { Component, OnInit, Inject, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalRecoleccionComponent } from '../../modales/modal-recoleccion/modal-recoleccion.component';
import { ModalRecoleccionesComponent } from '../../modales/modal-recolecciones/modal-recolecciones.component';

import { Venta } from 'src/app/interfaces/venta';
import { DetalleVenta } from 'src/app/interfaces/detalle-venta';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

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
  finalizado?: number = 0;
  detalleVenta: DetalleVenta []= [];
  columnasTabla: string[]=['producto', "cantidad", "precio", "entregado", "total", "accion"];


  dataInicio : DetalleVenta [] = [];
  dataListaDetalleVenta = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;



  constructor(@Inject(MAT_DIALOG_DATA) public _venta: Venta,
  private dialog:MatDialog,
  private _ventaServicio:VentaService,
  private _utilidadServicio:UtilidadService){
    this.fechaRegistro = _venta.fechaVenta!;
    this.numeroDocumento = _venta.idVenta!;
    this.facturado = _venta.esFactura;
    this.finalizado = _venta.estaFinalizado;
    this.total = String(_venta.total);
  }

  ngOnInit(): void {
    this.obtenerListaDetalleVenta();
  }

  obtenerListaDetalleVenta(){
    this._ventaServicio.listaDetalleVenta(this.numeroDocumento).subscribe({
      next:(data) =>{
        if(data.status){
          //console.log(data);
          this.dataListaDetalleVenta.data = data.value;

        }else
          this._utilidadServicio.mostrarAlerta(data.msg, "Oops!");

      },
      error:(e)=>{}
    })
  }

  abrirModalRecoleccion(detalleVenta: DetalleVenta ){
    this.dialog.open(ModalRecoleccionComponent, {
      disableClose:true,
      data:detalleVenta
    }).afterClosed().subscribe(resultado =>{
        if(resultado === "true")  this.obtenerListaDetalleVenta();
    });
  }


  abrirModalRecolecciones(detalleVenta: DetalleVenta ){
    this.dialog.open(ModalRecoleccionesComponent, {
      disableClose:true,
      data:detalleVenta
    }).afterClosed().subscribe(resultado =>{
        if(resultado === "true")  this.obtenerListaDetalleVenta();
    });
  }


  ngAfterViewInit(): void {
    this.dataListaDetalleVenta.paginator = this.paginacionTabla;
  }
}
