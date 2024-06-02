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

  columnasTable: string[] = ['id','nombre','apePaterno', 'apeMaterno','ci','empresa','celular','estaActivo', 'acciones' ] ;
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

    this.dataListaProveedores.filterPredicate = (data, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
      const estado = data.estaActivo === 1 ? 'activo' : 'no activo';
      return estado.includes(transformedFilter) ||
             data.nombre.toLowerCase().includes(transformedFilter) ||
             data.apePaterno.toLowerCase().includes(transformedFilter) ||
             data.apeMaterno.toLowerCase().includes(transformedFilter) ||
             data.ci.toLowerCase().includes(transformedFilter) ||
             data.empresa.toLowerCase().includes(transformedFilter) ||
             data.celular.toLowerCase().includes(transformedFilter);
    };
  }

  obtenerProveedores(){
    this._proveedorServicio.lista().subscribe({
      next:(data) =>{
        if(data.status){
          this.dataListaProveedores.data = data.value;

        }else
          this._utilidadServicio.mostrarAlerta(data.msg, "Oops!");

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
