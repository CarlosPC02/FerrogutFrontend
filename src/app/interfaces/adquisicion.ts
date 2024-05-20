import { DetalleAdquisicion } from "./detalle-adquisicion";

export interface Adquisicion {
  idVenta?: number,
  fechaVenta?: string,
  esFactura: number,
  totalTexto?: string,
  idUser: number;
  idProveedor: number;
  detalleAdquisicion: DetalleAdquisicion [],
}
