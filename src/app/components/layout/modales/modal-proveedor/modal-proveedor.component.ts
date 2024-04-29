import { Component, OnInit, Inject} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proveedor } from 'src/app/interfaces/proveedor';


import { ProveedorService } from 'src/app/services/proveedor.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-proveedor',
  templateUrl: './modal-proveedor.component.html',
  styleUrls: ['./modal-proveedor.component.css']
})
export class ModalProveedorComponent implements OnInit{

  formularioProveedor:FormGroup;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";



  constructor(
    private modalActual: MatDialogRef<ModalProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProveedor:Proveedor,
    private fb: FormBuilder,
    private _proveedorServicio: ProveedorService,
    private _utilidadServicio: UtilidadService
  ){

    this.formularioProveedor = this.fb.group({
      nombre: ["", Validators.required],
      apePaterno: ["",Validators.required],
      apeMaterno: ["",Validators.required],
      ci: ["",Validators.required],
      empresa: ["",Validators.required],
      celular: ["",Validators.required],
      estaActivo: ['1',Validators.required],

    });

    if(this.datosProveedor != null){
      this.tituloAccion="Editar";
      this.botonAccion= "Actualizar";
    }

  }
////
  ngOnInit(): void {
    if(this.datosProveedor != null){

      this.formularioProveedor.patchValue({
        nombre: this.datosProveedor.nombre,
        apePaterno: this.datosProveedor.apePaterno,
        apellidos: this.datosProveedor.apeMaterno,
        ci: this.datosProveedor.ci,
        empresa: this.datosProveedor.empresa,
        celular: this.datosProveedor.celular,
        estaActivo: String(this.datosProveedor.estaActivo),

      })
    }

  }
 ///
  guardarEditar_Proveedor(){
    const _proveedor: Proveedor = {
      idProveedor : this.datosProveedor == null ? 0: this.datosProveedor.idProveedor,
      nombre: this.formularioProveedor.value.nombre,
      apePaterno: this.formularioProveedor.value.apePaterno,
      apeMaterno: this.formularioProveedor.value.apeMaterno,
      ci: this.formularioProveedor.value.ci,
      empresa: this.formularioProveedor.value.empresa,
      celular: this.formularioProveedor.value.celular,
      estaActivo: parseInt (this.formularioProveedor.value.estaActivo),
    }

    if(this.datosProveedor == null){
      //Crear
      this._proveedorServicio.guardar(_proveedor).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El proveedor fue registrado", "Exito");
            this.modalActual.close("true");
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el proveedor", "Error");
        },
        error:(e)=>{}
      })
      //Editar
    }else{
      this._proveedorServicio.editar(_proveedor.idProveedor,_proveedor).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El proveedor fue editado", "Exito");
            this.modalActual.close("true");
          }else
            this._utilidadServicio.mostrarAlerta(data.msg, "Error");
        },
        error:(e)=>{}
      })

    }

  }
}
