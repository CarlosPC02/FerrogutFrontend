import { DetalleVenta } from "./detalle-venta";

export interface Venta {
  idVenta?: number,
  fechaVenta?: string,
  totalTexto?: string,
  idUser: number;
  idCliente: number;
  esFactura: number,
  estaFinalizado?: number,
  detalleVenta: DetalleVenta [],
}
