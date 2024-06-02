import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';


import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalClienteComponent } from '../../modales/modal-cliente/modal-cliente.component';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit, AfterViewInit {
  columnasTable: string[] = ['id','nombres','apellidos', 'esPreferencial', 'acciones' ] ;
  dataInicio : Cliente [] = [];
  dataListaClientes = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog:MatDialog,
    private _clienteServicio:ClienteService,
    private _utilidadServicio:UtilidadService
  ){}
  ngOnInit():void{
    this.obtenerClientes();
    this.dataListaClientes.filterPredicate = (data, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
      const estado = data.esPreferencial === 1 ? 'preferencial' : 'no es preferencial';
      return estado.includes(transformedFilter) ||
             data.nombres.toLowerCase().includes(transformedFilter) ||
             data.apellidos.toLowerCase().includes(transformedFilter);
    };
  }

  obtenerClientes(){
    this._clienteServicio.lista().subscribe({
      next:(data) =>{
        if(data.status){
          this.dataListaClientes.data = data.value;

        }else
          this._utilidadServicio.mostrarAlerta(data.msg, "Oops!");

      },
      error:(e)=>{}
    })
  }



  ngAfterViewInit(): void {
    this.dataListaClientes.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaClientes.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoCliente(){
    this.dialog.open(ModalClienteComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado =>{
        if(resultado === "true") this.obtenerClientes();
    });

  }

  editarCliente(cliente: Cliente){
    this.dialog.open(ModalClienteComponent, {
      disableClose:true,
      data:cliente
    }).afterClosed().subscribe(resultado =>{
        if(resultado === "true") this.obtenerClientes();
    });
  }

  eliminarCliente(cliente: Cliente){
    Swal.fire({
      title: 'Desea eliminar el cliente?',
      text: cliente.nombres,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      cancelButtonAriaLabel: '#d33',
      cancelButtonText: "No, volver",

    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._clienteServicio.eliminar(cliente.idCliente).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta(data.msg, "Listo!");
              this.obtenerClientes();
            }else

              this._utilidadServicio.mostrarAlerta(data.msg, "Error")
          },
          error:(e)=>{}

        })
      }

    })

  }
}
