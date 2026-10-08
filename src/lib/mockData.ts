import type { StoreData } from "./types";

const ahora = () => new Date().toISOString();

export function buildInitialData(): StoreData {
  const now = ahora();

  const productos = [
    {
      id: 1,
      codigo: "HB-M-DOC",
      nombre: "Huevo blanco M (docena)",
      tipo: "BLANCO" as const,
      tamano: "M" as const,
      formato: "DOCENA" as const,
      precioUnitario: 1.85,
      stockActual: 500,
      stockMinimo: 100,
      activo: true,
      creadoEn: now,
      actualizadoEn: now,
    },
    {
      id: 2,
      codigo: "HB-L-DOC",
      nombre: "Huevo blanco L (docena)",
      tipo: "BLANCO" as const,
      tamano: "L" as const,
      formato: "DOCENA" as const,
      precioUnitario: 2.1,
      stockActual: 380,
      stockMinimo: 100,
      activo: true,
      creadoEn: now,
      actualizadoEn: now,
    },
    {
      id: 3,
      codigo: "HM-L-C30",
      nombre: "Huevo moreno L (cartón 30u)",
      tipo: "MORENO" as const,
      tamano: "L" as const,
      formato: "CARTON_30" as const,
      precioUnitario: 4.95,
      stockActual: 220,
      stockMinimo: 50,
      activo: true,
      creadoEn: now,
      actualizadoEn: now,
    },
    {
      id: 4,
      codigo: "HC-XL-C30",
      nombre: "Huevo campero XL (cartón 30u)",
      tipo: "CAMPERO" as const,
      tamano: "XL" as const,
      formato: "CARTON_30" as const,
      precioUnitario: 6.75,
      stockActual: 140,
      stockMinimo: 40,
      activo: true,
      creadoEn: now,
      actualizadoEn: now,
    },
    {
      id: 5,
      codigo: "HE-L-C180",
      nombre: "Huevo ecológico L (caja 180u)",
      tipo: "ECOLOGICO" as const,
      tamano: "L" as const,
      formato: "CAJA_180" as const,
      precioUnitario: 42.0,
      stockActual: 30,
      stockMinimo: 10,
      activo: true,
      creadoEn: now,
      actualizadoEn: now,
    },
  ];

  const clientes = [
    {
      id: 1,
      nombre: "Granja Los Robles S.L.",
      cif: "B12345678",
      direccion: "Camino del Pinar, km 4",
      ciudad: "Olot",
      codigoPostal: "17800",
      provincia: "Girona",
      telefono: "972 123 456",
      email: "compras@losrobles.es",
      personaContacto: "María Puig",
      descuento: 5,
      notas: null,
      activo: true,
      creadoEn: now,
      actualizadoEn: now,
    },
    {
      id: 2,
      nombre: "Avícola La Dehesa",
      cif: "B87654321",
      direccion: "Carretera Vieja s/n",
      ciudad: "Cáceres",
      codigoPostal: "10001",
      provincia: "Cáceres",
      telefono: "927 555 222",
      email: "pedidos@ladehesa.com",
      personaContacto: "Juan Romero",
      descuento: 3,
      notas: null,
      activo: true,
      creadoEn: now,
      actualizadoEn: now,
    },
    {
      id: 3,
      nombre: "Mas Vilanova",
      cif: "B11223344",
      direccion: "Mas Vilanova, 1",
      ciudad: "Vic",
      codigoPostal: "08500",
      provincia: "Barcelona",
      telefono: "938 444 111",
      email: "info@masvilanova.cat",
      personaContacto: "Anna Vila",
      descuento: 0,
      notas: null,
      activo: true,
      creadoEn: now,
      actualizadoEn: now,
    },
  ];

  const movimientos = productos.map((p, idx) => ({
    id: idx + 1,
    productoId: p.id,
    tipo: "ENTRADA" as const,
    motivo: "PRODUCCION" as const,
    cantidad: p.stockActual,
    pedidoId: null,
    notas: "Stock inicial",
    fecha: now,
  }));

  const linea1Cantidad = 50;
  const linea2Cantidad = 20;
  const precio1 = productos[0].precioUnitario;
  const precio2 = productos[2].precioUnitario;
  const sub1 = linea1Cantidad * precio1;
  const sub2 = linea2Cantidad * precio2;
  const subtotal = sub1 + sub2;
  const descuento = subtotal * 0.05;
  const baseIva = subtotal - descuento;
  const iva = baseIva * 0.1;
  const total = baseIva + iva;

  const pedidos = [
    {
      id: 1,
      numero: "P-2026-0001",
      clienteId: 1,
      fecha: now,
      fechaEntrega: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
      estado: "CONFIRMADO" as const,
      subtotal,
      descuento,
      iva,
      total,
      notas: "Entrega por la mañana",
      creadoEn: now,
      actualizadoEn: now,
    },
  ];

  const lineas = [
    {
      id: 1,
      pedidoId: 1,
      productoId: 1,
      cantidad: linea1Cantidad,
      precioUnitario: precio1,
      subtotal: sub1,
    },
    {
      id: 2,
      pedidoId: 1,
      productoId: 3,
      cantidad: linea2Cantidad,
      precioUnitario: precio2,
      subtotal: sub2,
    },
  ];

  return { productos, clientes, pedidos, lineas, movimientos };
}
