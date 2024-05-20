import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { VentaComponent } from './pages/venta/venta.component';
import { HistorialventaComponent } from './pages/historialventa/historialventa.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { SharedModule } from 'src/app/reutilizable/shared/shared.module';
import { ModalUsuarioComponent } from './modales/modal-usuario/modal-usuario.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { ModalCategoriaComponent } from './modales/modal-categoria/modal-categoria.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ModalProveedorComponent } from './modales/modal-proveedor/modal-proveedor.component';
import { ModalProductoComponent } from './modales/modal-producto/modal-producto.component';
import { ModalClienteComponent } from './modales/modal-cliente/modal-cliente.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { AdquisicionComponent } from './pages/adquisicion/adquisicion.component';
import { HistorialadquisicionComponent } from './pages/historialadquisicion/historialadquisicion.component';
import { ModalDetalleVentaComponent } from './modales/modal-detalle-venta/modal-detalle-venta.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    HistorialventaComponent,
    ReporteComponent,
    ModalUsuarioComponent,
    CategoriaComponent,
    ModalCategoriaComponent,
    ProveedorComponent,
    ModalProveedorComponent,
    ModalProductoComponent,
    ModalClienteComponent,
    ClienteComponent,
    AdquisicionComponent,
    HistorialadquisicionComponent,
    ModalDetalleVentaComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
  ]
})
export class LayoutModule { }
