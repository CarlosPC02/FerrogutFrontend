export interface DetalleAdquisicion {
  idProducto: number,
  descripcionProducto: string,
  cantidad: number,
  precioUnitario: number,
  subtotalTexto: string,
  idAdquisicion?: number,
  idDetalleAdquisicion?: number,
}
