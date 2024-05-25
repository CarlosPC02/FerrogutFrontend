export interface DetalleAdquisicion {
  idProducto: number,
  descripcionProducto: string,
  cantidad: number,
  precioUnitario: number,
  total: number,
  idAdquisicion?: number,
  idDetalleAdquisicion?: number,
}
