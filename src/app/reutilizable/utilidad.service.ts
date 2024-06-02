import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private _snackBar:MatSnackBar){}

  mostrarAlerta(mensaje:string, tipo:string){

    this._snackBar.open(mensaje,tipo, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000
    })
  }

  guardarSesionUsuario(usuarioSesion:Sesion){
    localStorage.setItem("usuario",JSON.stringify(usuarioSesion));
    localStorage.setItem("token", usuarioSesion.token);
  }

  obtenerSesionUsuario(){
    // const dataCadena = localStorage.getItem("usuario");
    // const usuario = JSON.parse(dataCadena!);
    // return usuario;
    const dataCadena = localStorage.getItem("usuario");
    if (dataCadena) {
      const usuario = JSON.parse(dataCadena);
      return usuario;
    }
    return null;
  }

  getToken(){
    return localStorage.getItem("token");
  }

  eliminarSesionUsuario(){
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  }


}
