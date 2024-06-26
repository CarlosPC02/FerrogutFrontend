import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { VentaComponent } from './pages/venta/venta.component';
import { HistorialventaComponent } from './pages/historialventa/historialventa.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { AdquisicionComponent } from './pages/adquisicion/adquisicion.component'
import { HistorialadquisicionComponent } from './pages/historialadquisicion/historialadquisicion.component';
import { authGuardGuard } from 'src/app/interfaces/auth-guard.guard';

const routes: Routes = [{
  path:'',
  //path:",
  component:LayoutComponent, canActivateChild: [authGuardGuard],
  children:[
    {path:'dashboard', component:DashboardComponent},
    {path:'usuario', component:UsuarioComponent},
    {path:'categoria', component:CategoriaComponent},
    {path:'producto', component:ProductoComponent},
    {path:'proveedor', component:ProveedorComponent},
    {path:'cliente', component:ClienteComponent},
    // {path:'inventario', component:InventarioComponent},
    {path:'venta', component:VentaComponent},
    {path:'adquisicion', component:AdquisicionComponent},
    {path:'historial_venta', component:HistorialventaComponent},
    {path:'historial_adquisicion', component:HistorialadquisicionComponent},
    // {path:'reporte', component:ReporteComponent},
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
