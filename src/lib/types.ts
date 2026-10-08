export type TipoHuevo = "BLANCO" | "MORENO" | "CAMPERO" | "ECOLOGICO";
export type Tamano = "S" | "M" | "L" | "XL" | "XXL";
export type Formato = "DOCENA" | "CARTON_30" | "CAJA_180" | "CAJA_360";
export type EstadoPedido =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO";
export type TipoMovimiento = "ENTRADA" | "SALIDA" | "AJUSTE";
export type MotivoMovimiento =
  | "PRODUCCION"
  | "COMPRA"
  | "VENTA"
  | "MERMA"
  | "AJUSTE_INVENTARIO"
  | "DEVOLUCION";

export type Producto = {
  id: number;
  codigo: string;
  nombre: string;
  tipo: TipoHuevo;
  tamano: Tamano;
  formato: Formato;
  precioUnitario: number;
  stockActual: number;
  stockMinimo: number;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
};

export type Cliente = {
  id: number;
  nombre: string;
  cif: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  provincia: string;
  telefono: string | null;
  email: string | null;
  personaContacto: string | null;
  descuento: number;
  notas: string | null;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
};

export type LineaPedido = {
  id: number;
  pedidoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
};

export type Pedido = {
  id: number;
  numero: string;
  clienteId: number;
  fecha: string;
  fechaEntrega: string | null;
  estado: EstadoPedido;
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  notas: string | null;
  creadoEn: string;
  actualizadoEn: string;
};

export type MovimientoStock = {
  id: number;
  productoId: number;
  tipo: TipoMovimiento;
  motivo: MotivoMovimiento;
  cantidad: number;
  pedidoId: number | null;
  notas: string | null;
  fecha: string;
};

export type StoreData = {
  productos: Producto[];
  clientes: Cliente[];
  pedidos: Pedido[];
  lineas: LineaPedido[];
  movimientos: MovimientoStock[];
};
