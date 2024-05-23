import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';


import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalCategoriaComponent } from '../../modales/modal-categoria/modal-categoria.component';
import { Categoria } from 'src/app/interfaces/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})

export class CategoriaComponent implements OnInit, AfterViewInit{

  columnasTable: string[] = ['id','categoria','acciones' ] ;
  dataInicio : Categoria [] = [];
  dataListaCategorias = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog:MatDialog,
    private _categoriaServicio:CategoriaService,
    private _utilidadServicio:UtilidadService
  ){}
  ngOnInit():void{
    this.obtenerCategorias();
  }

  obtenerCategorias(){
    this._categoriaServicio.lista().subscribe({
      next:(data) =>{
        if(data.status){
          console.log(data);
          this.dataListaCategorias.data = data.value;

        }else
          this._utilidadServicio.mostrarAlerta(data.msg, "Oops!");

      },
      error:(e)=>{}
    })
  }



  ngAfterViewInit(): void {
    this.dataListaCategorias.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaCategorias.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevaCategoria(){
    this.dialog.open(ModalCategoriaComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado =>{
        if(resultado === "true") this.obtenerCategorias();
    });

  }

  editarCategoria(categoria: Categoria){
    this.dialog.open(ModalCategoriaComponent, {
      disableClose:true,
      data:categoria
    }).afterClosed().subscribe(resultado =>{
        if(resultado === "true") this.obtenerCategorias();
    });
  }

  eliminarCategoria(categoria: Categoria){
    Swal.fire({
      title: 'Desea eliminar la categoria?',
      text: categoria.nombreCategoria,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      cancelButtonAriaLabel: '#d33',
      cancelButtonText: "No, volver",

    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._categoriaServicio.eliminar(categoria.idCategoria).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("La categoria fue eliminada", "Listo!");
              this.obtenerCategorias();
            }else

              this._utilidadServicio.mostrarAlerta(data.msg, "Error")
          },
          error:(e)=>{}

        })
      }

    })

  }


}
