import { Component, OnInit, Inject} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/interfaces/categoria';
import { Producto } from 'src/app/interfaces/producto';

import { CategoriaService } from 'src/app/services/categoria.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit{

  formularioProducto:FormGroup;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";
  listaCategorias: Categoria[] = [];



  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto:Producto,
    private fb: FormBuilder,
    private _categoriaServicio:CategoriaService,
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtilidadService
  ){

    this.formularioProducto = this.fb.group({
      nombreProducto: ["", Validators.required],
      descripcion: ["",Validators.required],
      precio: ["",Validators.required],
      codigoBarras: ["",Validators.required],
      marca: ["",Validators.required],
      idCategoria: ["",Validators.required],
    });

    if(this.datosProducto != null){
      this.tituloAccion="Editar";
      this.botonAccion= "Actualizar";
    }

    this._categoriaServicio.lista().subscribe({
      next:(data) =>{
        console.log(data);
        if(data.status) this.listaCategorias = data.value;

      },
      error:(e)=>{}
    })
  }
////
  ngOnInit(): void {
    if(this.datosProducto != null){

      this.formularioProducto.patchValue({
        nombreProducto: this.datosProducto.nombreProducto,
        idCategoria: this.datosProducto.idCategoria,
        codigoBarras: this.datosProducto.codigoBarras,
        marca: this.datosProducto.marca,
        precio: String(this.datosProducto.precio),

      })
    }

  }
 ///
  guardarEditar_Producto(){
    const _producto: Producto = {
      idProducto : this.datosProducto == null ? 0: this.datosProducto.idProducto,
      nombreProducto: this.formularioProducto.value.nombreProducto,
      marca: this.formularioProducto.value.marca,
      codigoBarras: this.formularioProducto.value.codigoBarras,
      idCategoria: this.formularioProducto.value.idCategoria,
      descripcion: "",
      precio: this.formularioProducto.value.precio,
    }

    if(this.datosProducto == null){
      //Crear
      this._productoServicio.guardar(_producto).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El producto fue registrado", "Exito");
            this.modalActual.close("true");
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el producto", "Error");
        },
        error:(e)=>{}
      })
      //Editar
    }else{
      this._productoServicio.editar(_producto.idProducto,_producto).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El producto fue editado", "Exito");
            this.modalActual.close("true");
          }else
            this._utilidadServicio.mostrarAlerta(data.msg, "Error");
        },
        error:(e)=>{}
      })

    }

  }
}
