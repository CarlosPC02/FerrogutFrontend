import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';


import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuarioComponent } from '../../modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit{

  columnasTable: string[] = ['id','nombres','apellidos', 'ci', 'rolDescripcion', 'estado','acciones' ] ;
  dataInicio : Usuario [] = [];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog:MatDialog,
    private _usuarioServicio:UsuarioService,
    private _utilidadServicio:UtilidadService
  ){}
  ngOnInit():void{
    this.obtenerUsuarios();

    this.dataListaUsuarios.filterPredicate = (data, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
      const estado = data.estaActivo === 1 ? 'activo' : 'no activo';
      return estado.includes(transformedFilter) ||
             data.nombres.toLowerCase().includes(transformedFilter) ||
             data.apellidos.toLowerCase().includes(transformedFilter) ||
             data.ci.toLowerCase().includes(transformedFilter) ||
             data.nombre.toLowerCase().includes(transformedFilter);
    };

  }

  obtenerUsuarios(){
    this._usuarioServicio.lista().subscribe({
      next:(data) =>{
        if(data.status){
          this.dataListaUsuarios.data = data.value;
        }else
          this._utilidadServicio.mostrarAlerta(data.msg, "Oops!");
      },
      error:(e)=>{}
    })
  }



  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado =>{
        if(resultado === "true") this.obtenerUsuarios();
    });

  }

  editarUsuario(usuario: Usuario){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose:true,
      data:usuario
    }).afterClosed().subscribe(resultado =>{
        if(resultado === "true") this.obtenerUsuarios();
    });
  }

  eliminarUsuario(usuario: Usuario){
    Swal.fire({
      title: 'Desea eliminar el usuario?',
      text: usuario.nombres,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      cancelButtonAriaLabel: '#d33',
      cancelButtonText: "No, volver",

    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._usuarioServicio.eliminar(usuario.idUser).subscribe({
          next:(data)=>{
            if(data.status){

              this._utilidadServicio.mostrarAlerta(data.msg, "Listo!");
              this.obtenerUsuarios();
            }else

              this._utilidadServicio.mostrarAlerta(data.msg, "Error")
          },
          error:(e)=>{}

        })
      }

    })

  }


}
