import { DetalleAdquisicion } from "./detalle-adquisicion";

export interface Adquisicion {
  idAdquisicion?: number,
  fechaAdquisicion?: string,
  esFactura: number,
  totalTexto?: string,
  idUser: number;
  idProveedor: number;
  detalleAdquisicion: DetalleAdquisicion [],
}
