import { Component, OnInit, Inject} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/interfaces/rol';
import { Usuario } from 'src/app/interfaces/usuario';

import { RolService } from 'src/app/services/rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit{

  formularioUsuario:FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";
  listaRoles: Rol[] = [];



  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario:Usuario,
    private fb: FormBuilder,
    private _rolServicio:RolService,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ){

    this.formularioUsuario = this.fb.group({
      nombres: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9.,\s]*$/)]],
      apellidos: ["",[Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9.,\s]*$/)]],
      ci: ["",[Validators.required, Validators.maxLength(9), Validators.pattern(/^[0-9\s]*$/)]],
      userName: ["",[Validators.required,Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9.,\s]*$/)]],
      idRol: ["",Validators.required],
      password: ["",[Validators.required,Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9.,\s]*$/)]],
      estaActivo: ['1',Validators.required],

    });

    if(this.datosUsuario != null){
      this.tituloAccion="Editar";
      this.botonAccion= "Actualizar";
    }

    this._rolServicio.lista().subscribe({
      next:(data) =>{
        if(data.status) this.listaRoles = data.value;

      },
      error:(e)=>{}
    })
  }
////
  ngOnInit(): void {
    if(this.datosUsuario != null){

      this.formularioUsuario.patchValue({
        nombres: this.datosUsuario.nombres,
        apellidos: this.datosUsuario.apellidos,
        ci: this.datosUsuario.ci,
        nombre: this.datosUsuario.nombre, //
        idRol: this.datosUsuario.idRol,
        userName: this.datosUsuario.userName,
        password: this.datosUsuario.password,
        estaActivo: String(this.datosUsuario.estaActivo),

      });
    }

  }
 ///
  guardarEditar_Usuario(){

    const _usuario: Usuario = {
      idUser : this.datosUsuario == null ? 0: this.datosUsuario.idUser,
      nombres: this.formularioUsuario.value.nombres,
      apellidos: this.formularioUsuario.value.apellidos,
      ci: this.formularioUsuario.value.ci,
      userName: this.formularioUsuario.value.userName,
      idRol: this.formularioUsuario.value.idRol,
      nombre: "", //
      password: this.formularioUsuario.value.password,
      estaActivo: parseInt (this.formularioUsuario.value.estaActivo),
    }
    console.log(_usuario);
    if(this.datosUsuario == null){
      //Crear
      this._usuarioServicio.guardar(_usuario).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta(data.msg, "Exito");
            this.modalActual.close("true");
          }else
            this._utilidadServicio.mostrarAlerta(data.msg, "Error");
        },
        error:(e)=>{
          console.log(e);
        }
      })
      //Editar
    }else{
      this._usuarioServicio.editar(_usuario.idUser,_usuario).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta(data.msg, "Exito");
            this.modalActual.close("true");
          }else
            this._utilidadServicio.mostrarAlerta(data.msg, "Error");
        },
        error:(e)=>{
          console.log(e);
        }
      })

    }

  }
}
