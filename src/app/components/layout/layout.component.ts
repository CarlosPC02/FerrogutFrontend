import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
  nombres: string ='';
  apellidos: string = '';
  rol: string = '';

  constructor(private router:Router, private _utilidadServicio:UtilidadService){

  }

  ngOnInit(): void {

    const usuarioResp = this._utilidadServicio.obtenerSesionUsuario();

    if (usuarioResp && usuarioResp.usuario && usuarioResp.usuario.length > 0) {
      const usuario = usuarioResp.usuario[0];
      this.nombres = usuario.nombres;
      this.apellidos = usuario.apellidos;
      //this.rol = usuario.rol;
    }

  }


  cerrarSesion(){
    this._utilidadServicio.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }


}
