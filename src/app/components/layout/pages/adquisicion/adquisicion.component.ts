import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl}  from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductoService } from 'src/app/services/producto.service';
import { AdquisicionService } from 'src/app/services/adquisicion.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import { ProveedorService } from 'src/app/services/proveedor.service';

import { Producto } from 'src/app/interfaces/producto';
import { Adquisicion } from 'src/app/interfaces/adquisicion';
import { DetalleAdquisicion } from 'src/app/interfaces/detalle-adquisicion';
import { Proveedor } from 'src/app/interfaces/proveedor';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-adquisicion',
  templateUrl: './adquisicion.component.html',
  styleUrls: ['./adquisicion.component.css']
})
export class AdquisicionComponent implements OnInit {

  listaProductos: Producto []=[];
  listaProductosFiltro: Producto [] =[];
  listaProveedores: Proveedor []=[];
  listaProveedoresFiltro: Proveedor[] = [];

  listaProductosParaAdquisicion: DetalleAdquisicion[]=[];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!: Producto;
  proveedorSeleccionado!: Proveedor;
  facturado: string = '0';
  totalPagar: number = 0;

  formularioProductoAdquisicion: FormGroup;
  proveedorControl: FormControl = new FormControl('', Validators.required);

  columnasTabla: string[]=['producto', 'cantidad', 'precio', 'total', 'accion'];
  datosDetalleAdquisicion = new MatTableDataSource(this.listaProductosParaAdquisicion);

  idUsuario:number = 0;

  constructor(
    private fb:FormBuilder,
    private _productoServicio: ProductoService,
    private _adquisicionServicio: AdquisicionService,
    private _utilidadServicio: UtilidadService,
    private _proveedorServicio: ProveedorService

  ){
    this.formularioProductoAdquisicion = this.fb.group({
      producto: ["", Validators.required],
      precio: ["", [Validators.required, Validators.maxLength(9), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      cantidad: ["", [Validators.required, Validators.maxLength(9), Validators.pattern(/^[0-9\s]*$/)]],

    });

    this._productoServicio.lista().subscribe({
      next:(data) =>{
        if(data.status){
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.stock>0);
        }
      },
      error:(e)=>{}
    })

    this._proveedorServicio.lista().subscribe({
      next:(data) =>{
        if(data.status){
          const lista = data.value as Proveedor[];
          this.listaProveedores = lista.filter(p => p.empresa.length > 0);
        }
      },
      error:(e)=>{}
    })


    this.formularioProductoAdquisicion.get('producto')?.valueChanges.subscribe(value=>{
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
    });

    this.proveedorControl.valueChanges.subscribe(value=>{
      this.listaProveedoresFiltro = this.retornarProveedoresPorFiltro(value);
    });

  }

  ngOnInit():void{
    const usuarioResp = this._utilidadServicio.obtenerSesionUsuario();

    if (usuarioResp && usuarioResp.usuario && usuarioResp.usuario.length > 0) {
      const usuario = usuarioResp.usuario[0];
      this.idUsuario = usuario.idUser;
    }
  }

  retornarProductosPorFiltro(busqueda: any):Producto[]{
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase():busqueda.nombreProducto.toLocaleLowerCase();
    return this.listaProductos.filter(item => item.nombreProducto.toLocaleLowerCase().includes(valorBuscado));
  }

  retornarProveedoresPorFiltro(busqueda: any): Proveedor[] {
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase() : busqueda.empresa.toLocaleLowerCase();
    return this.listaProveedores.filter(item => item.empresa.toLocaleLowerCase().includes(valorBuscado));
  }


  mostrarProducto(producto: Producto): string{
    return producto.nombreProducto;
  }

  mostrarProveedor(proveedor: Proveedor): string {
    return proveedor.empresa;
  }

  productoParaAdquisicion(event: any ){
    this.productoSeleccionado = event.option.value;
  }

  proveedorParaVenta(event: any) {
    this.proveedorSeleccionado = event.option.value;
  }

  agregarProductoParaAdquisicion(){

    const productoExistente = this.listaProductosParaAdquisicion.find(
      p => p.idProducto === this.productoSeleccionado.idProducto
    );

    if (productoExistente) {
      Swal.fire({
        icon: 'warning',
        title: 'Producto Duplicado',
        text: 'Este producto ya está en la lista. Por favor, actualiza la cantidad, elimina el producto existente antes para poder agregarlo con la cantidad correcta.'
      });
      return;
    }

    const _cantidad:number = parseInt(this.formularioProductoAdquisicion.value.cantidad);
    const _precio:number = parseFloat(this.formularioProductoAdquisicion.value.precio)
    const _total:number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;

    this.listaProductosParaAdquisicion.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombreProducto,
      cantidad: _cantidad,
      precioUnitario: _precio,
      idAdquisicion: 1,
      total: parseFloat (_total.toFixed(2)),
    })

    this.datosDetalleAdquisicion = new MatTableDataSource(this.listaProductosParaAdquisicion);

    this.formularioProductoAdquisicion.patchValue({
      producto:'',
      cantidad:'',
      precio:''
    })


  }

  eliminarProducto(detalle: DetalleAdquisicion){
    this.totalPagar = this.totalPagar - detalle.total,
    this.listaProductosParaAdquisicion = this.listaProductosParaAdquisicion.filter(p => p.idProducto != detalle.idProducto);
    this.datosDetalleAdquisicion = new MatTableDataSource(this.listaProductosParaAdquisicion);
  }

  registrarAdquisicion(){

    if(this.listaProductosParaAdquisicion.length>0){
      this.bloquearBotonRegistrar = true;


      const request: Adquisicion = {
        esFactura:  parseInt(this.facturado),
        total: parseFloat( this.totalPagar.toFixed(2)),
        idProveedor: this.proveedorSeleccionado.idProveedor,
        idUser: this.idUsuario,
        detalleAdquisicion: this.listaProductosParaAdquisicion,
      }

      let array:any[]=[request,this.listaProductosParaAdquisicion];



      this._adquisicionServicio.guardar(array).subscribe({
        next:(response) =>{

          if(response.status){
            this.totalPagar= 0.00;
            this.listaProductosParaAdquisicion = [];
            this.datosDetalleAdquisicion = new MatTableDataSource(this.listaProductosParaAdquisicion);

            Swal.fire({
              icon:'success',
              title: 'Adquisicion Registrada'
            })

          }else{
            this._utilidadServicio.mostrarAlerta(response.msg,"Oops")
          }
        },
        complete:()=>{
          this.bloquearBotonRegistrar = false;

        },
        error:(e)=>{
          console.log(e);
        }


      })

    }
  }

}
