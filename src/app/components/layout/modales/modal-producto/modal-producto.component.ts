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
      nombreProducto: ["", [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9.,\s]*$/)]],
      descripcion: ["",[Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9.,\s]*$/)]],
      precio: ["",[Validators.required, Validators.maxLength(9), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      codigoBarras: ["",[Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9.,\s]*$/)]],
      marca: ["",[Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9.,\s]*$/)]],
      stock: ["",[Validators.required, Validators.maxLength(9), Validators.pattern(/^[0-9\s]*$/)]],
      stockMinimo: ["",[Validators.required, Validators.maxLength(9), Validators.pattern(/^[0-9\s]*$/)]],
      idCategoria: ["",Validators.required],
    });

    if(this.datosProducto != null){
      this.tituloAccion="Editar";
      this.botonAccion= "Actualizar";
    }

    this._categoriaServicio.lista().subscribe({
      next:(data) =>{
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
        descripcion: this.datosProducto.descripcion,
        precio: String(this.datosProducto.precio),
        codigoBarras: this.datosProducto.codigoBarras,
        marca: this.datosProducto.marca,
        stock: String(this.datosProducto.stock),
        stockMinimo: String(this.datosProducto.stockMinimo),
        idCategoria: this.datosProducto.idCategoria,

      })
    }

  }
 ///
  guardarEditar_Producto(){
    const _producto: Producto = {
      idProducto : this.datosProducto == null ? 0: this.datosProducto.idProducto,
      nombreProducto: this.formularioProducto.value.nombreProducto,
      descripcion: this.formularioProducto.value.descripcion,
      precio: this.formularioProducto.value.precio,
      codigoBarras: this.formularioProducto.value.codigoBarras,
      marca: this.formularioProducto.value.marca,
      stock: this.formularioProducto.value.stock,
      stockMinimo: this.formularioProducto.value.stockMinimo,
      idCategoria: this.formularioProducto.value.idCategoria,
    }

    if(this.datosProducto == null){
      //Crear
      this._productoServicio.guardar(_producto).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta(data.msg, "Exito");
            this.modalActual.close("true");
          }else
            this._utilidadServicio.mostrarAlerta(data.msg, "Error");
        },
        error:(e)=>{}
      })
      //Editar
    }else{
      this._productoServicio.editar(_producto.idProducto, _producto).subscribe({
        next: (data) => {

          if(data.status){
            this._utilidadServicio.mostrarAlerta(data.msg, "Exito");
            this.modalActual.close("true");
          }else
            this._utilidadServicio.mostrarAlerta(data.msg, "Error");
        },
        error:(e)=>{}
      })

    }

  }
}
