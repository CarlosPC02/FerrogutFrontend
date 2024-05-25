
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductoService } from './../../../../services/producto.service';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import { ClienteService } from 'src/app/services/cliente.service';

import { Producto } from 'src/app/interfaces/producto';
import { Venta } from 'src/app/interfaces/venta';
import { DetalleVenta } from 'src/app/interfaces/detalle-venta';
import { Cliente } from 'src/app/interfaces/cliente';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];
  listaClientes: Cliente[] = [];
  listaClientesFiltro: Cliente[] = [];

  listaProductosParaVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!: Producto;
  clienteSeleccionado!: Cliente;
  facturado: number = 0;
  totalPagar: number = 0;

  formularioProductoVenta: FormGroup;
  clienteControl: FormControl = new FormControl('', Validators.required);

  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total', 'accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  constructor(
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService,
    private _clienteServicio: ClienteService
  ) {
    this.formularioProductoVenta = this.fb.group({
      producto: ["", Validators.required],
      cantidad: ["", Validators.required]
    });

    this._productoServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.stock > 0);
        }
      },
      error: (e) => { }
    });

    this._clienteServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Cliente[];
          this.listaClientes = lista.filter(p => p.nombres.length > 0);
        }
      },
      error: (e) => { }
    });

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
    });

    this.clienteControl.valueChanges.subscribe(value => {
      this.listaClientesFiltro = this.retornarClientesPorFiltro(value);
    });
  }

  ngOnInit(): void { }

  retornarProductosPorFiltro(busqueda: any): Producto[] {
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase() : busqueda.nombreProducto.toLocaleLowerCase();
    return this.listaProductos.filter(item => item.nombreProducto.toLocaleLowerCase().includes(valorBuscado));
  }

  retornarClientesPorFiltro(busqueda: any): Cliente[] {
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase() : busqueda.nombres.toLocaleLowerCase();
    return this.listaClientes.filter(item => item.nombres.toLocaleLowerCase().includes(valorBuscado));
  }

  mostrarProducto(producto: Producto): string {
    return producto.nombreProducto;
  }

  mostrarCliente(cliente: Cliente): string {
    return cliente.nombres;
  }

  productoParaVenta(event: any) {
    this.productoSeleccionado = event.option.value;
  }

  clienteParaVenta(event: any) {
    this.clienteSeleccionado = event.option.value;
  }

  agregarProductoParaVenta() {
    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;

    this.listaProductosParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombreProducto,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      subtotalTexto: String(_total.toFixed(2)),
    });

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: '',
    });
  }

  eliminarProducto(detalle: DetalleVenta) {
    this.totalPagar = this.totalPagar - parseFloat(detalle.subtotalTexto);
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p => p.idProducto != detalle.idProducto);
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
  }

  registrarVenta() {
    if (this.listaProductosParaVenta.length > 0) {
      this.bloquearBotonRegistrar = true;


      const request: Venta = {
        esFactura: this.facturado,
        total: parseFloat(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductosParaVenta,
        idCliente: this.clienteSeleccionado.idCliente,
        idUser: 6,
        estaFinalizado: 0,
      };


      let array:any[]=[request,this.listaProductosParaVenta];

      this._ventaServicio.guardar(array).subscribe({
        next: (response) => {
          if (response.status) {
            this.totalPagar = 0.00;
            this.listaProductosParaVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada',
              //text: `Numero de Venta: ${response.value.idVenta}`
            });
          } else {
            this._utilidadServicio.mostrarAlerta(response.msg, "Oops");
          }
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        },
        error: (e) => {
          console.log(e);
        }
      });
    }
  }
}
