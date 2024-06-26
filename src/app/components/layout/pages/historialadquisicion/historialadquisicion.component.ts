import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';


import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import { Adquisicion } from 'src/app/interfaces/adquisicion';
import { AdquisicionService } from '../../../../services/adquisicion.service';
import { ModalDetalleAdquisicionComponent } from '../../modales/modal-detalle-adquisicion/modal-detalle-adquisicion.component';
import { Envio } from 'src/app/interfaces/envio';


export const MY_DATA_FORMATS ={
  parse:{
    dateInput:'DD/MM/YYYY'
  },
  display:{
    dateInput:'DD/MM/YYYY',
    monthYearLabel:'DD/MM/YYYY'
  }
}

@Component({
  selector: 'app-historialadquisicion',
  templateUrl: './historialadquisicion.component.html',
  styleUrls: ['./historialadquisicion.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ]
})
export class HistorialadquisicionComponent implements OnInit, AfterViewInit{
  formularioBusqueda:FormGroup;
  opcionesBusqueda: any [] =[
    {value: "fecha", descripcion: "Por fechas"},
    {value: "numero", descripcion: "Numero Adquisicion"}
  ];
  columnasTabla: string[]=["fechaRegistro", 'numeroDocumento', "facturado", "total", "accion"];
  dataInicio: Adquisicion [] = [];
  datosListaAdquisicion = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;


  constructor(
    private fb:FormBuilder,
    private dialog:MatDialog,
    private _adquisicionServicio: AdquisicionService,
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
    this.buscarAdquisiciones();
  }

  ngAfterViewInit(): void {
    this.datosListaAdquisicion.paginator = this.paginacionTabla;
    this.datosListaAdquisicion.filterPredicate = (data: Adquisicion, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();

      const facturado = data.esFactura === 1 ? 'si' : 'no';

      const idAdquisicionMatch = data.idAdquisicion? data.idAdquisicion.toString().toLowerCase().includes(transformedFilter) : false;
      const fechaAdquisicionMatch = data.fechaAdquisicion ? moment(data.fechaAdquisicion).format('DD-MM-YYYY').toLowerCase().includes(transformedFilter) : false;
      const totalMatch = data.total ? data.total.toString().toLowerCase().includes(transformedFilter) : false;
      const facturadoMatch = facturado.includes(transformedFilter);

      return idAdquisicionMatch || fechaAdquisicionMatch || totalMatch || facturadoMatch;
    };
  }

  aplicarFiltroTabla(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaAdquisicion.filter = filterValue.trim().toLowerCase();

    if (this.datosListaAdquisicion.paginator) {
      this.datosListaAdquisicion.paginator.firstPage();
    }
  }

  buscarAdquisiciones(){
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
    let inicio = new Date(_fechaInicio);
    let fin= new Date(_fechaFin);
    const request: Envio = {
      buscarPor: this.formularioBusqueda.value.buscarPor,
      numero:parseInt(this.formularioBusqueda.value.numero),
      fechaInicial: _fechaInicio,
      fechaFinal: _fechaFin
    };


    this._adquisicionServicio.historial(
      request
    ).subscribe({
      next:(data)=>{
        if(data.status)
          this.datosListaAdquisicion.data = data.value;
        else
        this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");


      },
      error:(e)=>{}
    })
  }

  verDetalleAdquisicion(_adquisicion:Adquisicion){

    this.dialog.open(ModalDetalleAdquisicionComponent,{
      data: _adquisicion,
      disableClose: true,
      width: "700px"
    })
  }

}
