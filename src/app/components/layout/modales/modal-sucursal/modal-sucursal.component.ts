import { Component, OnInit, Inject} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sucursal } from 'src/app/interfaces/sucursal';

import { SucursalService } from 'src/app/services/sucursal.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-sucursal',
  templateUrl: './modal-sucursal.component.html',
  styleUrls: ['./modal-sucursal.component.css']
})
export class ModalSucursalComponent implements OnInit{

  formularioSucursal:FormGroup;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalSucursalComponent>,
    @Inject(MAT_DIALOG_DATA) public datosSucursal:Sucursal,
    private fb: FormBuilder,
    private _sucursalServicio: SucursalService,
    private _utilidadServicio: UtilidadService
  ){

    this.formularioSucursal = this.fb.group({
      direccion: ["", Validators.required],
      localidad: ["",Validators.required],
      barrio: ["",Validators.required],
      departamento: ["",Validators.required],

    });

    if(this.datosSucursal != null){
      this.tituloAccion="Editar";
      this.botonAccion= "Actualizar";
    }

  }
////
  ngOnInit(): void {
    if(this.datosSucursal != null){

      this.formularioSucursal.patchValue({
        direccion: this.datosSucursal.direccion,
        localidad: this.datosSucursal.localidad,
        barrio: this.datosSucursal.barrio,
        departamento: this.datosSucursal.departamento,
      })
    }

  }
 ///
  guardarEditar_Sucursal(){
    const _sucursal: Sucursal = {
      idSucursal : this.datosSucursal == null ? 0: this.datosSucursal.idSucursal,
      direccion: this.formularioSucursal.value.direccion,
      localidad: this.formularioSucursal.value.localidad,
      barrio: this.formularioSucursal.value.barrio,
      departamento: this.formularioSucursal.value.departamento,
    }

    if(this.datosSucursal == null){
      //Crear
      this._sucursalServicio.guardar(_sucursal).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("La sucursal fue registrada", "Exito");
            this.modalActual.close("true");
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo registrar la sucursal", "Error");
        },
        error:(e)=>{}
      })
      //Editar
    }else{
      this._sucursalServicio.editar(_sucursal.idSucursal,_sucursal).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("La sucursal fue editada", "Exito");
            this.modalActual.close("true");
          }else
            this._utilidadServicio.mostrarAlerta(data.msg, "Error");
        },
        error:(e)=>{}
      })

    }

  }
}

