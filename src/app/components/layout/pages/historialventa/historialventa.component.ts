import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';


import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { ModalDetalleVentaComponent } from '../../modales/modal-detalle-venta/modal-detalle-venta.component';
import { Venta } from 'src/app/interfaces/venta';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import { Envio } from 'src/app/interfaces/envio';
import Swal from 'sweetalert2';

export const MY_DATA_FORMATS ={
  parse:{
    dateInput:'DD/MM/YYYY'
  },
  display:{
    dateInput:'DD/MM/YYYY',
    monthYearLabel:"DD/MM/YYYY"
  }
}
@Component({
  selector: 'app-historialventa',
  templateUrl: './historialventa.component.html',
  styleUrls: ['./historialventa.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ]
})
export class HistorialventaComponent implements OnInit, AfterViewInit{

  formularioBusqueda:FormGroup;
  opcionesBusqueda: any [] =[
    {value: "fecha", descripcion: "Por fechas"},
    {value: "numero", descripcion: "Numero venta"}
  ];
  columnasTabla: string[]=["fechaRegistro", 'numeroDocumento', "facturado", "finalizado", "total", "accion"];
  dataInicio: Venta [] = [];
  datosListaVenta = new MatTableDataSource<Venta>(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;


  constructor(
    private fb:FormBuilder,
    private dialog:MatDialog,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ){
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      numero:[''],
      fechaInicio:[''],
      fechaFin:[''],
    })

    this.formularioBusqueda.get("buscarPor")?.valueChanges.subscribe(value=>{
      this.formularioBusqueda.patchValue({
        numero: '',
        fechaInicio: '',
        fechaFin: ''
      })
    })
  }

  ngOnInit(): void {
    this.buscarVentas();
  }

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginacionTabla;
    this.datosListaVenta.filterPredicate = (data: Venta, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();

      const facturado = data.esFactura === 1 ? 'si' : 'no';
      const finalizado = data.estaFinalizado === 1 ? 'si' : 'no';

      const idVentaMatch = data.idVenta ? data.idVenta.toString().toLowerCase().includes(transformedFilter) : false;
      const fechaVentaMatch = data.fechaVenta ? moment(data.fechaVenta).format('DD-MM-YYYY').toLowerCase().includes(transformedFilter) : false;
      const totalMatch = data.total ? data.total.toString().toLowerCase().includes(transformedFilter) : false;
      const facturadoMatch = facturado.includes(transformedFilter);
      const finalizadoMatch = finalizado.includes(transformedFilter);

      return idVentaMatch || fechaVentaMatch || totalMatch || facturadoMatch || finalizadoMatch;
    };

  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaVenta.filter = filterValue.trim().toLowerCase();

    if (this.datosListaVenta.paginator) {
      this.datosListaVenta.paginator.firstPage();
    }
  }

  buscarVentas(){
    let _fechaInicio: string = "";
    let _fechaFin: string = "";

    if(this.formularioBusqueda.value.buscarPor === "fecha"){
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format("YYYY/MM/DD");
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format("YYYY/MM/DD");

      if(_fechaInicio === "Invalid date" || _fechaFin === "Invalid date" ){
        this._utilidadServicio.mostrarAlerta("Debe ingresar ambas fechas", "Oops!");
        return;
      }
    }


    const request: Envio = {
      buscarPor:this.formularioBusqueda.value.buscarPor,
      numero: parseInt(this.formularioBusqueda.value.numero),
      fechaInicial: _fechaInicio,
      fechaFinal: _fechaFin
    };

    this._ventaServicio.historial(request).subscribe({
      next:(data)=>{
        if(data.status)
          this.datosListaVenta.data = data.value;
        else
        this._utilidadServicio.mostrarAlerta(data.msg, "Oops!");


      },
      error:(e)=>{}
    })
  }

  verDetalleVenta(_venta:Venta){

    this.dialog.open(ModalDetalleVentaComponent,{
      data: _venta,
      disableClose: true,
      width: "700px"
    })
  }

  terminarRecoleccion(_venta:Venta){

    // Swal.fire({
    //   title: 'Esta seguro de terminar la venta con Id: ',
    //   text: _venta.idVenta,
    //   icon: "warning",
    //   confirmButtonColor: '#3085d6',
    //   confirmButtonText: "Si",
    //   cancelButtonAriaLabel: '#d33',
    //   cancelButtonText: "No, volver",

    // }).then((resultado)=>{
    //   if(resultado.isConfirmed){
    //     this._ventaServicio.guardar(_venta.idVenta).subscribe({
    //       next:(data)=>{
    //         if(data.status){
    //           this._utilidadServicio.mostrarAlerta(data.msg, "Listo!");
    //           this.buscarVentas();
    //         }else

    //           this._utilidadServicio.mostrarAlerta(data.msg, "Error")
    //       },
    //       error:(e)=>{}

    //     })
    //   }

    // })

  }


}
