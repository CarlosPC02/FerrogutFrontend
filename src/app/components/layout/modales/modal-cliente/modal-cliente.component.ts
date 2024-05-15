import { Component, OnInit, Inject} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from 'src/app/interfaces/cliente';


import { ClienteService } from 'src/app/services/cliente.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.css']
})
export class ModalClienteComponent implements OnInit{

  formularioCliente:FormGroup;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";



  constructor(
    private modalActual: MatDialogRef<ModalClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCliente:Cliente,
    private fb: FormBuilder,
    private _clienteServicio: ClienteService,
    private _utilidadServicio: UtilidadService
  ){

    this.formularioCliente = this.fb.group({
      nombres: ["", [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9.,\s]*$/)]],
      apellidos: ["",[Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9.,\s]*$/)]],
      esPreferencial: ['1',Validators.required],

    });

    if(this.datosCliente != null){
      this.tituloAccion="Editar";
      this.botonAccion= "Actualizar";
    }

  }
////
  ngOnInit(): void {
    if(this.datosCliente != null){

      this.formularioCliente.patchValue({
        nombres: this.datosCliente.nombres,
        apellidos: this.datosCliente.apellidos,
        esPreferencial: String(this.datosCliente.esPreferencial),

      })
    }

  }
 ///
  guardarEditar_Cliente(){
    const _cliente: Cliente = {
      idCliente : this.datosCliente == null ? 0: this.datosCliente.idCliente,
      nombres: this.formularioCliente.value.nombres,
      apellidos: this.formularioCliente.value.apellidos,
      esPreferencial: parseInt (this.formularioCliente.value.esPreferencial),
    }

    if(this.datosCliente == null){
      //Crear
      this._clienteServicio.guardar(_cliente).subscribe({
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
      this._clienteServicio.editar(_cliente.idCliente,_cliente).subscribe({
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
