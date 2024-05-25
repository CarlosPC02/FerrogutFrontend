import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/login';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  formularioLogin:FormGroup;
  ocultarPassword:boolean= true;
  mostrarLoading:boolean=false;

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private _usuarioServicio:UsuarioService,
    private _utilidadServicio:UtilidadService
  ){
    this.formularioLogin = this.fb.group({
      userName:["", Validators.required],
      password:["", Validators.required]

    });
  }

  ngOnInit(): void {

  }

  iniciarSesion(){
    this.mostrarLoading=true;
    const request:Login= {
      userName : String(this.formularioLogin.value.userName),
      password: String( this.formularioLogin.value.password)
    }

    this._usuarioServicio.iniciarSesion(request).subscribe({
      next:(data)=>{
        if(data.status){
          this._utilidadServicio.guardarSesionUsuario(data.value);
          this.router.navigate(["pages"]);

        }else{
          this._utilidadServicio.mostrarAlerta(data.msg, "Opps!");
        }
      },
      complete: () =>{
        this.mostrarLoading = false;
      },
      error:(e)=>{
        //console.log(e);
        this._utilidadServicio.mostrarAlerta("Error", "Fallo");
      }
    })
  }
}
