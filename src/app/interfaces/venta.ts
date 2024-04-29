import { DetalleVenta } from "./detalle-venta";

export interface Venta {
  idVenta?: number,
  fechaVenta?: string,
  totalTexto: string,
  idUsuario: number;
  idCliente: number;
  esFactura: number,
  estaFinalizado: number,
  detalleVenta: DetalleVenta [],
}
