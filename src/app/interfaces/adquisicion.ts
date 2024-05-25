import { DetalleAdquisicion } from "./detalle-adquisicion";

export interface Adquisicion {
  idAdquisicion?: number,
  fechaAdquisicion?: string,
  esFactura: number,
  total: number,
  idUser: number;
  idProveedor: number;
  detalleAdquisicion: DetalleAdquisicion [],
}
