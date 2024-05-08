import { Component, OnInit, Inject} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/interfaces/categoria';

import { CategoriaService } from 'src/app/services/categoria.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-categoria',
  templateUrl: './modal-categoria.component.html',
  styleUrls: ['./modal-categoria.component.css']
})


export class ModalCategoriaComponent implements OnInit{

  formularioCategoria:FormGroup;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCategoria:Categoria,
    private fb: FormBuilder,
    private _categoriaServicio: CategoriaService,
    private _utilidadServicio: UtilidadService
  ){

    this.formularioCategoria = this.fb.group({
      nombreCategoria: ["", [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9.,\s]*$/)]],
    });

    if(this.datosCategoria != null){
      this.tituloAccion="Editar";
      this.botonAccion= "Actualizar";
    }

  }
////
  ngOnInit(): void {
    if(this.datosCategoria != null){

      this.formularioCategoria.patchValue({
        nombreCategoria: this.datosCategoria.nombreCategoria,

      })
    }

  }
 ///
  guardarEditar_Categoria(){
    const _categoria: Categoria = {
      idCategoria : this.datosCategoria == null ? 0: this.datosCategoria.idCategoria,
      nombreCategoria: this.formularioCategoria.value.nombreCategoria,
    }

    if(this.datosCategoria == null){
      //Crear
      this._categoriaServicio.guardar(_categoria).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("La Categoria fue registrada", "Exito");
            this.modalActual.close("true");
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo registrar la categoria", "Error");
        },
        error:(e)=>{}
      })
      //Editar
    }else{
      this._categoriaServicio.editar(_categoria.idCategoria,_categoria).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("La Categoria fue editada", "Exito");
            this.modalActual.close("true");
          }else
            this._utilidadServicio.mostrarAlerta(data.msg, "Error");
        },
        error:(e)=>{}
      })

    }

  }
}
