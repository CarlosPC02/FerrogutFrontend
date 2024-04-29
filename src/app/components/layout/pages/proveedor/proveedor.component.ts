import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';


import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProveedorComponent } from '../../modales/modal-proveedor/modal-proveedor.component';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit, AfterViewInit{

  columnasTable: string[] = ['id','nombre','apePaterno', 'apeMaterno','apeMaterno','ci','empresa','celular','estaActivo', 'acciones' ] ;
  dataInicio : Proveedor [] = [];
  dataListaProveedores = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog:MatDialog,
    private _proveedorServicio:ProveedorService,
    private _utilidadServicio:UtilidadService
  ){}
  ngOnInit():void{
    this.obtenerProveedores();
  }

  obtenerProveedores(){
    this._proveedorServicio.lista().subscribe({
      next:(data) =>{
        if(data.status){
          console.log(data);
          this.dataListaProveedores.data = data.value;

        }else
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");

      },
      error:(e)=>{}
    })
  }



  ngAfterViewInit(): void {
    this.dataListaProveedores.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProveedores.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoProveedor(){
    this.dialog.open(ModalProveedorComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado =>{
        if(resultado === "true") this.obtenerProveedores();
    });

  }

  editarProveedor(proveedor: Proveedor){
    this.dialog.open(ModalProveedorComponent, {
      disableClose:true,
      data:proveedor
    }).afterClosed().subscribe(resultado =>{
        if(resultado === "true") this.obtenerProveedores();
    });
  }

  eliminarProveedor(proveedor: Proveedor){
    Swal.fire({
      title: 'Desea eliminar el proveedor?',
      text: proveedor.nombre,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      cancelButtonAriaLabel: '#d33',
      cancelButtonText: "No, volver",

    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._proveedorServicio.eliminar(proveedor.idProveedor).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El proveedor fue eliminada", "Listo!");
              this.obtenerProveedores();
            }else

              this._utilidadServicio.mostrarAlerta(data.msg, "Error")
          },
          error:(e)=>{}

        })
      }

    })

  }


}
