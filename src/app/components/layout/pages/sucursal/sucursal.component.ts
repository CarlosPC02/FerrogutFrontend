import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';


import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalSucursalComponent } from '../../modales/modal-sucursal/modal-sucursal.component';
import { Sucursal } from 'src/app/interfaces/sucursal';
import { SucursalService } from 'src/app/services/sucursal.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.css']
})
export class SucursalComponent implements OnInit, AfterViewInit{

  columnasTable: string[] = ['id','direccion','localidad', 'barrio','departamento', 'acciones' ] ;
  dataInicio : Sucursal [] = [];
  dataListaSucursales = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog:MatDialog,
    private _sucursalServicio:SucursalService,
    private _utilidadServicio:UtilidadService
  ){}
  ngOnInit():void{
    this.obtenerSucursales();
  }

  obtenerSucursales(){
    this._sucursalServicio.lista().subscribe({
      next:(data) =>{
        if(data.status){
          console.log(data);
          this.dataListaSucursales.data = data.value;

        }else
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");

      },
      error:(e)=>{}
    })
  }



  ngAfterViewInit(): void {
    this.dataListaSucursales.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaSucursales.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevaSucursal(){
    this.dialog.open(ModalSucursalComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado =>{
        if(resultado === "true") this.obtenerSucursales();
    });

  }

  editarSucursal(sucursal: Sucursal){
    this.dialog.open(ModalSucursalComponent, {
      disableClose:true,
      data:sucursal
    }).afterClosed().subscribe(resultado =>{
        if(resultado === "true") this.obtenerSucursales();
    });
  }

  eliminarSucursal(sucursal: Sucursal){
    Swal.fire({
      title: 'Desea eliminar la sucursal?',
      text: sucursal.barrio,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      cancelButtonAriaLabel: '#d33',
      cancelButtonText: "No, volver",

    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._sucursalServicio.eliminar(sucursal.idSucursal).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("La sucursal fue eliminada", "Listo!");
              this.obtenerSucursales();
            }else

              this._utilidadServicio.mostrarAlerta(data.msg, "Error")
          },
          error:(e)=>{}

        })
      }

    })

  }


}
