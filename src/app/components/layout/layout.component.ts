import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
  userName: string ='';
  rolUsuario: string = '';

  constructor(private router:Router, private _utilidadServicio:UtilidadService){

  }

  ngOnInit(): void {

    const usuario = this._utilidadServicio.obtenerSesionUsuario();

    if(usuario!=null){
      this.userName = usuario.nombres;
      this.rolUsuario = usuario.apellidos;
    }

    //console.log(usuario);
  }


  cerrarSesion(){
    this._utilidadServicio.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }
}
