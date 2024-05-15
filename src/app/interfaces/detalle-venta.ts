export interface DetalleVenta {
  idProducto: number,
  descripcionProducto: string,
  cantidad: number,
  precioTexto: string,
  entregado?: boolean,
  subtotalTexto: string,
  idVenta?: number,
  idDetalleVenta?: number,
}
