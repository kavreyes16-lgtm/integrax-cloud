"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Rol = "admin" | "empleado";

type Usuario = {
  id?: string;
  empresa_ruc?: string;
  nombre: string;
  correo: string;
  password: string;
  rol: Rol;
};

export default function Dashboard() {
  const [empresa, setEmpresa] = useState("");
  const [ruc, setRuc] = useState("");
  const [empresaActiva, setEmpresaActiva] = useState<any>(null);
  const [logoEmpresa, setLogoEmpresa] = useState("");
  const [direccionEmpresa, setDireccionEmpresa] = useState("");
  const [telefonoEmpresa, setTelefonoEmpresa] = useState("");
  const [correoEmpresa, setCorreoEmpresa] = useState("");

  const [correoLogin, setCorreoLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [usuarioActivo, setUsuarioActivo] = useState<Usuario | null>(null);

  const [seccion, setSeccion] = useState("dashboard");
  const [modoOscuro, setModoOscuro] = useState(false);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [nombreClienteNuevo, setNombreClienteNuevo] = useState("");
  const [telefonoClienteNuevo, setTelefonoClienteNuevo] = useState("");
  const [correoClienteNuevo, setCorreoClienteNuevo] = useState("");
  const [direccionClienteNuevo, setDireccionClienteNuevo] = useState("");
  const [rucCedulaClienteNuevo, setRucCedulaClienteNuevo] = useState("");

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [nuevoRol, setNuevoRol] = useState<Rol>("empleado");

  const [cliente, setCliente] = useState("");
  const [tipoPago, setTipoPago] = useState("Efectivo");
  const [estadoPago, setEstadoPago] = useState("Pagada");
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [itemsFactura, setItemsFactura] = useState<any[]>([]);

  const [facturas, setFacturas] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [empleadosPlanilla, setEmpleadosPlanilla] = useState<any[]>([]);
  const [pagosPlanilla, setPagosPlanilla] = useState<any[]>([]);
  const [movimientosContables, setMovimientosContables] = useState<any[]>([]);

  const [tipoMovimiento, setTipoMovimiento] = useState("ingreso");
  const [categoriaMovimiento, setCategoriaMovimiento] = useState("");
  const [descripcionMovimiento, setDescripcionMovimiento] = useState("");
  const [montoMovimiento, setMontoMovimiento] = useState("");
  const [fechaMovimiento, setFechaMovimiento] = useState("");

  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const [cedulaEmpleado, setCedulaEmpleado] = useState("");
  const [cargoEmpleado, setCargoEmpleado] = useState("");
  const [salarioBaseEmpleado, setSalarioBaseEmpleado] = useState("");

  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");
  const [periodoPago, setPeriodoPago] = useState("");
  const [horasExtra, setHorasExtra] = useState("");
  const [pagoHoraExtra, setPagoHoraExtra] = useState("");
  const [bonificacionesPago, setBonificacionesPago] = useState("");
  const [deduccionesPago, setDeduccionesPago] = useState("");

  const [nombreProducto, setNombreProducto] = useState("");
  const [codigoProducto, setCodigoProducto] = useState("");
  const [categoriaProducto, setCategoriaProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState("");
  const [stockProducto, setStockProducto] = useState("");
  const [stockMinimoProducto, setStockMinimoProducto] = useState("");
  const [productoEditandoId, setProductoEditandoId] = useState<string | null>(null);

  useEffect(() => {
    setModoOscuro(localStorage.getItem("modoOscuro") === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("modoOscuro", String(modoOscuro));
  }, [modoOscuro]);

  const cargarUsuarios = async (rucEmpresa: string) => {
    const { data } = await supabase
      .from("usuarios")
      .select("*")
      .eq("empresa_ruc", rucEmpresa);

    setUsuarios((data || []) as Usuario[]);
  };

  const cargarClientes = async (rucEmpresa: string) => {
    const { data } = await supabase
      .from("clientes")
      .select("*")
      .eq("empresa_ruc", rucEmpresa)
      .order("created_at", { ascending: false });

    setClientes(data || []);
  };

  const cargarProductos = async (rucEmpresa: string) => {
    const { data } = await supabase
      .from("productos")
      .select("*")
      .eq("empresa_ruc", rucEmpresa)
      .or("activo.eq.true,activo.is.null")
      .order("created_at", { ascending: false });

    setProductos(data || []);
  };

  const cargarFacturas = async (rucEmpresa: string) => {
    const { data } = await supabase
      .from("facturas")
      .select("*")
      .eq("empresa_ruc", rucEmpresa)
      .order("created_at", { ascending: false });

    setFacturas(data || []);
  };

  const cargarEmpleadosPlanilla = async (rucEmpresa: string) => {
    const { data } = await supabase
      .from("empleados_planilla")
      .select("*")
      .eq("empresa_ruc", rucEmpresa)
      .order("created_at", { ascending: false });

    setEmpleadosPlanilla(data || []);
  };

  const cargarPagosPlanilla = async (rucEmpresa: string) => {
    const { data } = await supabase
      .from("pagos_planilla")
      .select("*")
      .eq("empresa_ruc", rucEmpresa)
      .order("created_at", { ascending: false });

    setPagosPlanilla(data || []);
  };

  const cargarMovimientosContables = async (rucEmpresa: string) => {
    const { data } = await supabase
      .from("movimientos_contables")
      .select("*")
      .eq("empresa_ruc", rucEmpresa)
      .order("created_at", { ascending: false });

    setMovimientosContables(data || []);
  };

  const ingresarEmpresa = async (e: any) => {
    e.preventDefault();

    if (!empresa || !ruc) {
      alert("Debes ingresar nombre de empresa y RUC");
      return;
    }

    let empresaData = null;

    const { data: empresaExistente } = await supabase
      .from("empresas")
      .select("*")
      .eq("ruc", ruc)
      .maybeSingle();

    if (empresaExistente) {
      empresaData = empresaExistente;
    } else {
      const { data: nuevaEmpresa, error } = await supabase
        .from("empresas")
        .insert([{ nombre: empresa, ruc }])
        .select()
        .single();

      if (error) {
        console.error(error);
        alert("Error creando empresa");
        return;
      }

      empresaData = nuevaEmpresa;
    }

    const { data: usuariosDB } = await supabase
      .from("usuarios")
      .select("*")
      .eq("empresa_ruc", ruc);

    if (!usuariosDB || usuariosDB.length === 0) {
      await supabase.from("usuarios").insert([
        {
          empresa_ruc: ruc,
          nombre: "Administrador",
          correo: "admin@empresa.com",
          password: ruc,
          rol: "admin",
        },
      ]);
    }

    setEmpresaActiva(empresaData);
    setLogoEmpresa(empresaData?.logo_url || "");
    setDireccionEmpresa(empresaData?.direccion || "");
    setTelefonoEmpresa(empresaData?.telefono || "");
    setCorreoEmpresa(empresaData?.correo || "");

    await cargarUsuarios(ruc);
    await cargarClientes(ruc);
    await cargarProductos(ruc);
    await cargarFacturas(ruc);
    await cargarEmpleadosPlanilla(ruc);
    await cargarPagosPlanilla(ruc);
    await cargarMovimientosContables(ruc);
  };

  const iniciarSesion = async (e: any) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("correo", correoLogin)
      .eq("password", passwordLogin)
      .eq("empresa_ruc", empresaActiva.ruc)
      .single();

    if (error || !data) {
      alert("Correo o contraseña incorrectos");
      return;
    }

    setUsuarioActivo(data as Usuario);
    setSeccion(data.rol === "admin" ? "dashboard" : "facturacion");
  };

  const cerrarSesion = () => {
    setUsuarioActivo(null);
    setCorreoLogin("");
    setPasswordLogin("");
    setSeccion("dashboard");
  };

  const cambiarEmpresa = () => {
    setEmpresaActiva(null);
    setUsuarioActivo(null);
    setEmpresa("");
    setRuc("");
    setLogoEmpresa("");
    setDireccionEmpresa("");
    setTelefonoEmpresa("");
    setCorreoEmpresa("");
    setClientes([]);
    setMovimientosContables([]);
    setClienteSeleccionado("");
    setNombreClienteNuevo("");
    setTelefonoClienteNuevo("");
    setCorreoClienteNuevo("");
    setDireccionClienteNuevo("");
    setRucCedulaClienteNuevo("");
    setCorreoLogin("");
    setPasswordLogin("");
  };

  const crearUsuario = async (e: any) => {
    e.preventDefault();

    if (!nuevoNombre || !nuevoCorreo || !nuevoPassword || !empresaActiva) {
      alert("Completa todos los datos del usuario");
      return;
    }

    const { error } = await supabase.from("usuarios").insert([
      {
        empresa_ruc: empresaActiva.ruc,
        nombre: nuevoNombre,
        correo: nuevoCorreo,
        password: nuevoPassword,
        rol: nuevoRol,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error creando usuario");
      return;
    }

    await cargarUsuarios(empresaActiva.ruc);

    setNuevoNombre("");
    setNuevoCorreo("");
    setNuevoPassword("");
    setNuevoRol("empleado");
  };

  const eliminarUsuario = async (id?: string) => {
    if (!id || !empresaActiva) return;

    await supabase.from("usuarios").delete().eq("id", id);
    await cargarUsuarios(empresaActiva.ruc);
  };

  const limpiarFormularioProducto = () => {
    setNombreProducto("");
    setCodigoProducto("");
    setCategoriaProducto("");
    setPrecioProducto("");
    setStockProducto("");
    setStockMinimoProducto("");
    setProductoEditandoId(null);
  };

  const agregarProductoInventario = async (e: any) => {
    e.preventDefault();

    if (!nombreProducto || !precioProducto || !empresaActiva) {
      alert("Completa nombre y precio del producto");
      return;
    }

    const productoPayload = {
      empresa_ruc: empresaActiva.ruc,
      nombre: nombreProducto,
      codigo: codigoProducto,
      categoria: categoriaProducto,
      precio: Number(precioProducto),
      stock: Number(stockProducto || 0),
      stock_minimo: Number(stockMinimoProducto || 5),
      activo: true,
    };

    if (productoEditandoId) {
      const { error } = await supabase
        .from("productos")
        .update(productoPayload)
        .eq("id", productoEditandoId);

      if (error) {
        console.error(error);
        alert("Error actualizando producto");
        return;
      }

      await cargarProductos(empresaActiva.ruc);
      limpiarFormularioProducto();
      alert("Producto actualizado correctamente");
      return;
    }

    const { error } = await supabase.from("productos").insert([productoPayload]);

    if (error) {
      console.error(error);
      alert("Error guardando producto");
      return;
    }

    await cargarProductos(empresaActiva.ruc);
    limpiarFormularioProducto();
    alert("Producto agregado correctamente");
  };

  const editarProductoInventario = (producto: any) => {
    setProductoEditandoId(producto.id);
    setNombreProducto(producto.nombre || "");
    setCodigoProducto(producto.codigo || "");
    setCategoriaProducto(producto.categoria || "");
    setPrecioProducto(String(producto.precio || ""));
    setStockProducto(String(producto.stock || 0));
    setStockMinimoProducto(String(producto.stock_minimo || 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarProductoInventario = async (id?: string) => {
    if (!id || !empresaActiva) return;

    const confirmar = confirm(
      "¿Seguro que deseas eliminar este producto del inventario? Si ya fue usado en facturas, se ocultará para no dañar el historial."
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("productos")
      .update({ activo: false })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("No se pudo eliminar el producto. Ejecuta el SQL de inventario y vuelve a intentar.");
      return;
    }

    await cargarProductos(empresaActiva.ruc);

    if (productoEditandoId === id) {
      limpiarFormularioProducto();
    }

    alert("Producto eliminado del inventario correctamente");
  };

  const agregarProductoAFactura = () => {
    if (!productoSeleccionado) return;

    const producto = productos.find((p) => p.id === productoSeleccionado);
    if (!producto) return;

    if (Number(producto.stock || 0) <= 0) {
      alert("Este producto no tiene stock disponible");
      return;
    }

    const vecesAgregado = itemsFactura.filter(
      (item) => item.id === producto.id
    ).length;

    if (vecesAgregado >= Number(producto.stock || 0)) {
      alert("No hay suficiente stock disponible");
      return;
    }

    setItemsFactura([...itemsFactura, producto]);
    setProductoSeleccionado("");
  };

  const eliminarItemFactura = (index: number) => {
    setItemsFactura(itemsFactura.filter((_, i) => i !== index));
  };

  const subtotal = itemsFactura.reduce(
    (sum, item) => sum + Number(item.precio || 0),
    0
  );

  const iva = subtotal * 0.15;
  const totalConIVA = subtotal + iva;

  const facturasValidas = facturas.filter((f) => f.estado !== "erronea");

  const totalVendido = facturasValidas.reduce(
    (sum, f) => sum + Number(f.total || 0),
    0
  );

  const ventasHoy = facturasValidas
    .filter((f) => f.fecha === new Date().toLocaleDateString("es-NI"))
    .reduce((sum, f) => sum + Number(f.total || 0), 0);

  const promedioFactura =
    facturasValidas.length > 0 ? totalVendido / facturasValidas.length : 0;

  const crearCliente = async (e: any) => {
    e.preventDefault();

    if (!empresaActiva) return;

    if (!nombreClienteNuevo) {
      alert("Escribe el nombre del cliente");
      return;
    }

    const { error } = await supabase.from("clientes").insert([
      {
        empresa_ruc: empresaActiva.ruc,
        nombre: nombreClienteNuevo,
        telefono: telefonoClienteNuevo,
        correo: correoClienteNuevo,
        direccion: direccionClienteNuevo,
        ruc_cedula: rucCedulaClienteNuevo,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error guardando cliente");
      return;
    }

    await cargarClientes(empresaActiva.ruc);

    setNombreClienteNuevo("");
    setTelefonoClienteNuevo("");
    setCorreoClienteNuevo("");
    setDireccionClienteNuevo("");
    setRucCedulaClienteNuevo("");

    alert("Cliente guardado correctamente");
  };

  const eliminarCliente = async (id?: string) => {
    if (usuarioActivo?.rol !== "admin" || !id || !empresaActiva) return;

    const confirmar = confirm("¿Seguro que deseas eliminar este cliente?");
    if (!confirmar) return;

    await supabase.from("clientes").delete().eq("id", id);
    await cargarClientes(empresaActiva.ruc);
  };

  const generarNumeroFactura = () => {
    const anio = new Date().getFullYear();
    const facturasDelAnio = facturas.filter((f) =>
      String(f.numero_factura || "").startsWith(`FAC-${anio}-`)
    );

    const siguiente = facturasDelAnio.length + 1;
    return `FAC-${anio}-${String(siguiente).padStart(4, "0")}`;
  };

  const guardarFactura = async (e: any) => {
    e.preventDefault();

    const clienteData = clientes.find((c) => c.id === clienteSeleccionado);

    if (!cliente || itemsFactura.length === 0 || !empresaActiva || !usuarioActivo) {
      alert("Completa cliente y agrega al menos un producto");
      return;
    }

    const { data: facturaNueva, error } = await supabase
      .from("facturas")
      .insert([
        {
          empresa_ruc: empresaActiva.ruc,
          numero_factura: generarNumeroFactura(),
          cliente_id: clienteData?.id || null,
          cliente,
          cliente_telefono: clienteData?.telefono || "",
          cliente_correo: clienteData?.correo || "",
          cliente_direccion: clienteData?.direccion || "",
          cliente_ruc_cedula: clienteData?.ruc_cedula || "",
          tipo_pago: tipoPago,
          estado_pago: estadoPago,
          subtotal,
          iva,
          total: totalConIVA,
          fecha: new Date().toLocaleDateString("es-NI"),
          hora: new Date().toLocaleTimeString("es-NI"),
          usuario_nombre: usuarioActivo.nombre,
          estado: "valida",
          motivo_error: null,
          empresa_nombre: empresaActiva.nombre,
          empresa_direccion: direccionEmpresa,
          empresa_telefono: telefonoEmpresa,
          empresa_correo: correoEmpresa,
          empresa_logo_url: logoEmpresa,
        },
      ])
      .select()
      .single();

    if (error || !facturaNueva) {
      console.error(error);
      alert("Error guardando factura");
      return;
    }

    const items = itemsFactura.map((item) => ({
      factura_id: facturaNueva.id,
      producto_id: item.id,
      nombre_producto: item.nombre,
      precio: Number(item.precio),
      cantidad: 1,
      subtotal: Number(item.precio),
    }));

    const { error: itemsError } = await supabase
      .from("factura_items")
      .insert(items);

    if (itemsError) {
      console.error(itemsError);
      alert("La factura se creó, pero hubo error guardando los productos");
      return;
    }

    for (const item of itemsFactura) {
      const productoActual = productos.find((p) => p.id === item.id);
      const stockActual = Number(productoActual?.stock || 0);

      await supabase
        .from("productos")
        .update({ stock: stockActual - 1 })
        .eq("id", item.id);
    }

    setFacturas((actuales) => [facturaNueva, ...actuales]);

    setCliente("");
    setClienteSeleccionado("");
    setTipoPago("Efectivo");
    setEstadoPago("Pagada");
    setItemsFactura([]);
    setProductoSeleccionado("");

    await cargarProductos(empresaActiva.ruc);

    alert("Factura guardada correctamente");
  };

  const eliminarFactura = async (id?: string) => {
    if (usuarioActivo?.rol !== "admin" || !id || !empresaActiva) return;

    await supabase.from("factura_items").delete().eq("factura_id", id);
    await supabase.from("facturas").delete().eq("id", id);

    await cargarFacturas(empresaActiva.ruc);
  };

  const marcarFacturaErronea = async (factura: any) => {
    if (usuarioActivo?.rol !== "admin" || !empresaActiva) return;

    if (factura.estado === "erronea") {
      alert("Esta factura ya fue marcada como errónea.");
      return;
    }

    const confirmar = confirm(
      "¿Seguro que deseas marcar esta factura como errónea? Esto devolverá los productos al inventario y no contará como venta."
    );

    if (!confirmar) return;

    const motivo = prompt("Motivo del error (ej: tarjeta rechazada)");

    const { data: items, error: itemsError } = await supabase
      .from("factura_items")
      .select("*")
      .eq("factura_id", factura.id);

    if (itemsError) {
      console.error(itemsError);
      alert("Error buscando los productos de la factura.");
      return;
    }

    for (const item of items || []) {
      const productoActual = productos.find((p) => p.id === item.producto_id);
      const stockActual = Number(productoActual?.stock || 0);
      const cantidad = Number(item.cantidad || 1);

      await supabase
        .from("productos")
        .update({ stock: stockActual + cantidad })
        .eq("id", item.producto_id);
    }

    const { error } = await supabase
      .from("facturas")
      .update({
        estado: "erronea",
        motivo_error: motivo || "Error de pago",
      })
      .eq("id", factura.id);

    if (error) {
      console.error(error);
      alert("Error marcando factura como errónea.");
      return;
    }

    await cargarFacturas(empresaActiva.ruc);
    await cargarProductos(empresaActiva.ruc);

    alert("Factura marcada como errónea y productos devueltos al inventario.");
  };

  const ingresosContables = movimientosContables
    .filter((m) => m.tipo === "ingreso")
    .reduce((sum, m) => sum + Number(m.monto || 0), 0);

  const egresosContables = movimientosContables
    .filter((m) => m.tipo === "egreso")
    .reduce((sum, m) => sum + Number(m.monto || 0), 0);

  const totalPlanillaPagada = pagosPlanilla.reduce(
    (sum, p) => sum + Number(p.salario_neto || 0),
    0
  );

  const utilidadEstimada = totalVendido + ingresosContables - egresosContables - totalPlanillaPagada;

  const productosStockBajo = productos.filter(
    (p) => Number(p.stock || 0) <= Number(p.stock_minimo || 5)
  );

  const totalPendientePago = facturasValidas
    .filter((f) => f.estado_pago === "Pendiente")
    .reduce((sum, f) => sum + Number(f.total || 0), 0);

  const encabezadoReportePDF = (doc: jsPDF, titulo: string) => {
    const azulOscuro = [15, 23, 42] as [number, number, number];
    const azul = [37, 99, 235] as [number, number, number];

    doc.setFillColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.rect(0, 0, 210, 32, "F");

    doc.setFillColor(azul[0], azul[1], azul[2]);
    doc.rect(0, 29, 210, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(17);
    doc.setFont("helvetica", "bold");
    doc.text(titulo, 14, 14);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Empresa: ${empresaActiva?.nombre || ""}`, 14, 22);
    doc.text(`RUC: ${empresaActiva?.ruc || ""}`, 100, 22);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-NI")}`, 160, 22);
  };

  const generarReporteVentas = () => {
    const doc = new jsPDF();

    encabezadoReportePDF(doc, "Reporte de ventas");

    const ventas = facturas.map((f: any) => [
      f.numero_factura || "Sin número",
      f.cliente || "",
      f.fecha || "",
      f.tipo_pago || "",
      f.estado_pago || "",
      f.estado === "erronea" ? "Errónea" : "Válida",
      `NIO ${Number(f.total || 0).toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [["Factura", "Cliente", "Fecha", "Pago", "Estado pago", "Estado", "Total"]],
      body: ventas,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 45;

    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Total vendido válido: NIO ${totalVendido.toFixed(2)}`, 14, finalY + 12);
    doc.text(`Facturas válidas: ${facturasValidas.length}`, 14, finalY + 20);
    doc.text(`Facturas erróneas: ${Math.max(0, facturas.length - facturasValidas.length)}`, 14, finalY + 28);
    doc.text(`Pendiente de cobro: NIO ${totalPendientePago.toFixed(2)}`, 14, finalY + 36);

    doc.save(`reporte-ventas-${empresaActiva?.nombre || "empresa"}.pdf`);
  };

  const generarReporteContable = () => {
    const doc = new jsPDF();

    encabezadoReportePDF(doc, "Reporte contable");

    const movimientos = movimientosContables.map((m: any) => [
      m.tipo === "ingreso" ? "Ingreso" : "Egreso",
      m.categoria || "",
      m.descripcion || "",
      m.fecha || "",
      `NIO ${Number(m.monto || 0).toFixed(2)}`,
      m.usuario_nombre || "",
    ]);

    autoTable(doc, {
      head: [["Tipo", "Categoría", "Descripción", "Fecha", "Monto", "Usuario"]],
      body: movimientos,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 45;

    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Ingresos contables: NIO ${ingresosContables.toFixed(2)}`, 14, finalY + 12);
    doc.text(`Egresos contables: NIO ${egresosContables.toFixed(2)}`, 14, finalY + 20);
    doc.text(`Planilla pagada: NIO ${totalPlanillaPagada.toFixed(2)}`, 14, finalY + 28);
    doc.text(`Utilidad estimada: NIO ${utilidadEstimada.toFixed(2)}`, 14, finalY + 36);

    doc.save(`reporte-contable-${empresaActiva?.nombre || "empresa"}.pdf`);
  };

  const generarReporteGeneral = () => {
    const doc = new jsPDF();

    encabezadoReportePDF(doc, "Reporte general empresarial");

    const resumen = [
      ["Ventas válidas", `NIO ${totalVendido.toFixed(2)}`],
      ["Ventas del día", `NIO ${ventasHoy.toFixed(2)}`],
      ["Promedio por factura", `NIO ${promedioFactura.toFixed(2)}`],
      ["Pendiente de cobro", `NIO ${totalPendientePago.toFixed(2)}`],
      ["Ingresos contables", `NIO ${ingresosContables.toFixed(2)}`],
      ["Egresos contables", `NIO ${egresosContables.toFixed(2)}`],
      ["Planilla pagada", `NIO ${totalPlanillaPagada.toFixed(2)}`],
      ["Utilidad estimada", `NIO ${utilidadEstimada.toFixed(2)}`],
      ["Clientes registrados", String(clientes.length)],
      ["Productos registrados", String(productos.length)],
      ["Productos con stock bajo", String(productosStockBajo.length)],
      ["Usuarios registrados", String(usuarios.length)],
    ];

    autoTable(doc, {
      head: [["Indicador", "Valor"]],
      body: resumen,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [15, 23, 42] },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });

    doc.save(`reporte-general-${empresaActiva?.nombre || "empresa"}.pdf`);
  };

  const generarReporteInventario = () => {
    const doc = new jsPDF();

    encabezadoReportePDF(doc, "Reporte de inventario");

    const inventario = productos.map((p: any) => [
      p.codigo || "Sin código",
      p.nombre || "",
      p.categoria || "",
      `NIO ${Number(p.precio || 0).toFixed(2)}`,
      String(Number(p.stock || 0)),
      String(Number(p.stock_minimo || 5)),
      Number(p.stock || 0) <= Number(p.stock_minimo || 5) ? "Stock bajo" : "Normal",
    ]);

    autoTable(doc, {
      head: [["Código", "Producto", "Categoría", "Precio", "Stock", "Mínimo", "Estado"]],
      body: inventario,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });

    doc.save(`reporte-inventario-${empresaActiva?.nombre || "empresa"}.pdf`);
  };

  const cargarDatosDemo = async () => {
    if (usuarioActivo?.rol !== "admin" || !empresaActiva) return;

    const confirmar = confirm(
      "¿Deseas cargar datos demo? Esto agregará clientes, productos, facturas, contabilidad y pagos de ejemplo para presentación."
    );

    if (!confirmar) return;

    try {
      const clientesDemo = [
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Distribuidora La Central",
          telefono: "8888-1020",
          correo: "compras@lacentral.com",
          direccion: "Managua, Nicaragua",
          ruc_cedula: "J0310000001111",
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Comercial San José",
          telefono: "8777-2200",
          correo: "admin@sanjose.com",
          direccion: "Jinotepe, Carazo",
          ruc_cedula: "J0410000002222",
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Hotel Vista Azul",
          telefono: "8666-3300",
          correo: "contabilidad@vistaazul.com",
          direccion: "Diriamba, Carazo",
          ruc_cedula: "J0510000003333",
        },
      ];

      const { data: clientesInsertados, error: clientesError } = await supabase
        .from("clientes")
        .insert(clientesDemo)
        .select();

      if (clientesError) throw clientesError;

      const productosDemo = [
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Servicio de instalación",
          codigo: "SRV-001",
          categoria: "Servicios",
          precio: 2500,
          stock: 30,
          stock_minimo: 5,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Licencia mensual",
          codigo: "LIC-001",
          categoria: "Software",
          precio: 1200,
          stock: 50,
          stock_minimo: 10,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Soporte técnico",
          codigo: "SOP-001",
          categoria: "Servicios",
          precio: 800,
          stock: 25,
          stock_minimo: 5,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Impresora térmica",
          codigo: "IMP-001",
          categoria: "Equipos",
          precio: 4200,
          stock: 3,
          stock_minimo: 5,
        },
      ];

      const { data: productosInsertados, error: productosError } = await supabase
        .from("productos")
        .insert(productosDemo)
        .select();

      if (productosError) throw productosError;

      const empleadosDemo = [
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "María López",
          cedula: "001-120390-0001A",
          cargo: "Contadora",
          salario_base: 18000,
          activo: true,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Carlos Mendoza",
          cedula: "002-220495-0002B",
          cargo: "Vendedor",
          salario_base: 14500,
          activo: true,
        },
      ];

      const { data: empleadosInsertados, error: empleadosError } = await supabase
        .from("empleados_planilla")
        .insert(empleadosDemo)
        .select();

      if (empleadosError) throw empleadosError;

      const anio = new Date().getFullYear();
      const fechas = [
        new Date().toLocaleDateString("es-NI"),
        new Date(Date.now() - 86400000).toLocaleDateString("es-NI"),
        new Date(Date.now() - 2 * 86400000).toLocaleDateString("es-NI"),
        new Date(Date.now() - 3 * 86400000).toLocaleDateString("es-NI"),
      ];

      const facturasDemo = [
        {
          empresa_ruc: empresaActiva.ruc,
          numero_factura: `FAC-${anio}-0001`,
          cliente_id: clientesInsertados?.[0]?.id || null,
          cliente: clientesInsertados?.[0]?.nombre || "Cliente Demo 1",
          cliente_telefono: clientesInsertados?.[0]?.telefono || "",
          cliente_correo: clientesInsertados?.[0]?.correo || "",
          cliente_direccion: clientesInsertados?.[0]?.direccion || "",
          cliente_ruc_cedula: clientesInsertados?.[0]?.ruc_cedula || "",
          tipo_pago: "Transferencia",
          estado_pago: "Pagada",
          subtotal: 3700,
          iva: 555,
          total: 4255,
          fecha: fechas[0],
          hora: new Date().toLocaleTimeString("es-NI"),
          usuario_nombre: usuarioActivo.nombre,
          estado: "valida",
          motivo_error: null,
          empresa_nombre: empresaActiva.nombre,
          empresa_direccion: direccionEmpresa,
          empresa_telefono: telefonoEmpresa,
          empresa_correo: correoEmpresa,
          empresa_logo_url: logoEmpresa,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          numero_factura: `FAC-${anio}-0002`,
          cliente_id: clientesInsertados?.[1]?.id || null,
          cliente: clientesInsertados?.[1]?.nombre || "Cliente Demo 2",
          cliente_telefono: clientesInsertados?.[1]?.telefono || "",
          cliente_correo: clientesInsertados?.[1]?.correo || "",
          cliente_direccion: clientesInsertados?.[1]?.direccion || "",
          cliente_ruc_cedula: clientesInsertados?.[1]?.ruc_cedula || "",
          tipo_pago: "Efectivo",
          estado_pago: "Pagada",
          subtotal: 5000,
          iva: 750,
          total: 5750,
          fecha: fechas[1],
          hora: new Date().toLocaleTimeString("es-NI"),
          usuario_nombre: usuarioActivo.nombre,
          estado: "valida",
          motivo_error: null,
          empresa_nombre: empresaActiva.nombre,
          empresa_direccion: direccionEmpresa,
          empresa_telefono: telefonoEmpresa,
          empresa_correo: correoEmpresa,
          empresa_logo_url: logoEmpresa,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          numero_factura: `FAC-${anio}-0003`,
          cliente_id: clientesInsertados?.[2]?.id || null,
          cliente: clientesInsertados?.[2]?.nombre || "Cliente Demo 3",
          cliente_telefono: clientesInsertados?.[2]?.telefono || "",
          cliente_correo: clientesInsertados?.[2]?.correo || "",
          cliente_direccion: clientesInsertados?.[2]?.direccion || "",
          cliente_ruc_cedula: clientesInsertados?.[2]?.ruc_cedula || "",
          tipo_pago: "Tarjeta",
          estado_pago: "Pendiente",
          subtotal: 8000,
          iva: 1200,
          total: 9200,
          fecha: fechas[2],
          hora: new Date().toLocaleTimeString("es-NI"),
          usuario_nombre: usuarioActivo.nombre,
          estado: "valida",
          motivo_error: null,
          empresa_nombre: empresaActiva.nombre,
          empresa_direccion: direccionEmpresa,
          empresa_telefono: telefonoEmpresa,
          empresa_correo: correoEmpresa,
          empresa_logo_url: logoEmpresa,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          numero_factura: `FAC-${anio}-0004`,
          cliente_id: clientesInsertados?.[0]?.id || null,
          cliente: clientesInsertados?.[0]?.nombre || "Cliente Demo 1",
          cliente_telefono: clientesInsertados?.[0]?.telefono || "",
          cliente_correo: clientesInsertados?.[0]?.correo || "",
          cliente_direccion: clientesInsertados?.[0]?.direccion || "",
          cliente_ruc_cedula: clientesInsertados?.[0]?.ruc_cedula || "",
          tipo_pago: "Transferencia",
          estado_pago: "Pagada",
          subtotal: 2500,
          iva: 375,
          total: 2875,
          fecha: fechas[3],
          hora: new Date().toLocaleTimeString("es-NI"),
          usuario_nombre: usuarioActivo.nombre,
          estado: "erronea",
          motivo_error: "Pago no aprobado",
          empresa_nombre: empresaActiva.nombre,
          empresa_direccion: direccionEmpresa,
          empresa_telefono: telefonoEmpresa,
          empresa_correo: correoEmpresa,
          empresa_logo_url: logoEmpresa,
        },
      ];

      const { data: facturasInsertadas, error: facturasError } = await supabase
        .from("facturas")
        .insert(facturasDemo)
        .select();

      if (facturasError) throw facturasError;

      const itemsDemo = [
        {
          factura_id: facturasInsertadas?.[0]?.id,
          producto_id: productosInsertados?.[0]?.id,
          nombre_producto: productosInsertados?.[0]?.nombre || "Servicio",
          precio: 2500,
          cantidad: 1,
          subtotal: 2500,
        },
        {
          factura_id: facturasInsertadas?.[0]?.id,
          producto_id: productosInsertados?.[1]?.id,
          nombre_producto: productosInsertados?.[1]?.nombre || "Licencia",
          precio: 1200,
          cantidad: 1,
          subtotal: 1200,
        },
        {
          factura_id: facturasInsertadas?.[1]?.id,
          producto_id: productosInsertados?.[3]?.id,
          nombre_producto: productosInsertados?.[3]?.nombre || "Equipo",
          precio: 4200,
          cantidad: 1,
          subtotal: 4200,
        },
        {
          factura_id: facturasInsertadas?.[1]?.id,
          producto_id: productosInsertados?.[2]?.id,
          nombre_producto: productosInsertados?.[2]?.nombre || "Soporte",
          precio: 800,
          cantidad: 1,
          subtotal: 800,
        },
        {
          factura_id: facturasInsertadas?.[2]?.id,
          producto_id: productosInsertados?.[0]?.id,
          nombre_producto: productosInsertados?.[0]?.nombre || "Servicio",
          precio: 2500,
          cantidad: 2,
          subtotal: 5000,
        },
        {
          factura_id: facturasInsertadas?.[2]?.id,
          producto_id: productosInsertados?.[1]?.id,
          nombre_producto: productosInsertados?.[1]?.nombre || "Licencia",
          precio: 1200,
          cantidad: 2,
          subtotal: 2400,
        },
        {
          factura_id: facturasInsertadas?.[2]?.id,
          producto_id: productosInsertados?.[2]?.id,
          nombre_producto: productosInsertados?.[2]?.nombre || "Soporte",
          precio: 600,
          cantidad: 1,
          subtotal: 600,
        },
      ].filter((item) => item.factura_id && item.producto_id);

      if (itemsDemo.length > 0) {
        const { error: itemsError } = await supabase
          .from("factura_items")
          .insert(itemsDemo);

        if (itemsError) throw itemsError;
      }

      const movimientosDemo = [
        {
          empresa_ruc: empresaActiva.ruc,
          tipo: "ingreso",
          categoria: "Servicio adicional",
          descripcion: "Ingreso por configuración especial",
          monto: 3500,
          fecha: fechas[0],
          usuario_nombre: usuarioActivo.nombre,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          tipo: "egreso",
          categoria: "Proveedor",
          descripcion: "Pago a proveedor de equipos",
          monto: 1800,
          fecha: fechas[1],
          usuario_nombre: usuarioActivo.nombre,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          tipo: "egreso",
          categoria: "Servicios básicos",
          descripcion: "Internet y energía",
          monto: 950,
          fecha: fechas[2],
          usuario_nombre: usuarioActivo.nombre,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          tipo: "ingreso",
          categoria: "Consultoría",
          descripcion: "Asesoría empresarial",
          monto: 2200,
          fecha: fechas[3],
          usuario_nombre: usuarioActivo.nombre,
        },
      ];

      const { error: movimientosError } = await supabase
        .from("movimientos_contables")
        .insert(movimientosDemo);

      if (movimientosError) throw movimientosError;

      const pagosDemo = empleadosInsertados?.map((empleado: any, index: number) => {
        const salarioBase = Number(empleado.salario_base || 0);
        const horasExtraPago = index === 0 ? 1200 : 850;
        const bonos = index === 0 ? 1500 : 900;
        const deducciones = index === 0 ? 500 : 350;
        const bruto = salarioBase + horasExtraPago + bonos;
        const inss = bruto * 0.07;
        const neto = bruto - inss - deducciones;

        return {
          empresa_ruc: empresaActiva.ruc,
          empleado_id: empleado.id,
          empleado_nombre: empleado.nombre,
          periodo: "Demo Abril 2026",
          salario_base: salarioBase,
          horas_extra: index === 0 ? 6 : 4,
          pago_horas_extra: horasExtraPago,
          bonificaciones: bonos,
          deducciones,
          inss,
          salario_neto: neto,
          fecha_pago: fechas[0],
        };
      }) || [];

      if (pagosDemo.length > 0) {
        const { error: pagosError } = await supabase
          .from("pagos_planilla")
          .insert(pagosDemo);

        if (pagosError) throw pagosError;
      }

      await cargarClientes(empresaActiva.ruc);
      await cargarProductos(empresaActiva.ruc);
      await cargarFacturas(empresaActiva.ruc);
      await cargarEmpleadosPlanilla(empresaActiva.ruc);
      await cargarPagosPlanilla(empresaActiva.ruc);
      await cargarMovimientosContables(empresaActiva.ruc);

      alert("Datos demo cargados correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los datos demo. Revisa la consola para ver el detalle.");
    }
  };

  const cargarDemoCWIngenieria = async () => {
    if (usuarioActivo?.rol !== "admin" || !empresaActiva) return;

    const confirmar = confirm(
      "¿Deseas cargar una demo personalizada para CW Ingeniería S.A.? Se agregarán clientes industriales, productos, servicios, facturas, contabilidad y planilla de ejemplo."
    );

    if (!confirmar) return;

    try {
      const datosEmpresa = {
        nombre: "CW Ingeniería S.A.",
        direccion: "Managua, Nicaragua",
        telefono: "+505 2222-0000",
        correo: "info@cwingenieriasa.com",
      };

      await supabase
        .from("empresas")
        .update({
          nombre: datosEmpresa.nombre,
          direccion: datosEmpresa.direccion,
          telefono: datosEmpresa.telefono,
          correo: datosEmpresa.correo,
        })
        .eq("ruc", empresaActiva.ruc);

      setEmpresaActiva({
        ...empresaActiva,
        nombre: datosEmpresa.nombre,
        direccion: datosEmpresa.direccion,
        telefono: datosEmpresa.telefono,
        correo: datosEmpresa.correo,
      });

      setDireccionEmpresa(datosEmpresa.direccion);
      setTelefonoEmpresa(datosEmpresa.telefono);
      setCorreoEmpresa(datosEmpresa.correo);

      const clientesCW = [
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Supermercado La Colonia",
          telefono: "2222-1100",
          correo: "mantenimiento@lacolonia.com",
          direccion: "Managua, Nicaragua",
          ruc_cedula: "J0310000001010",
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Planta Procesadora Norte",
          telefono: "8888-2100",
          correo: "operaciones@plantanorte.com",
          direccion: "Carretera Norte, Managua",
          ruc_cedula: "J0310000002020",
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Hotel Industrial Pacific",
          telefono: "8777-3100",
          correo: "compras@industrialpacific.com",
          direccion: "Diriamba, Carazo",
          ruc_cedula: "J0410000003030",
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Centro de Distribución Frío Express",
          telefono: "8666-4100",
          correo: "admin@frioexpress.com",
          direccion: "Tipitapa, Managua",
          ruc_cedula: "J0510000004040",
        },
      ];

      const { data: clientesInsertados, error: clientesError } = await supabase
        .from("clientes")
        .insert(clientesCW)
        .select();

      if (clientesError) throw clientesError;

      const productosCW = [
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Compresor industrial Copeland",
          codigo: "REF-COMP-001",
          categoria: "Refrigeración industrial",
          precio: 125000,
          stock: 2,
          stock_minimo: 1,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Válvula de expansión industrial",
          codigo: "REF-VAL-002",
          categoria: "Repuestos",
          precio: 18500,
          stock: 8,
          stock_minimo: 3,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Tablero eléctrico de control",
          codigo: "ELEC-TAB-003",
          categoria: "Tableros eléctricos",
          precio: 68000,
          stock: 3,
          stock_minimo: 2,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Sensor de temperatura industrial",
          codigo: "REF-SEN-004",
          categoria: "Automatización",
          precio: 7200,
          stock: 15,
          stock_minimo: 5,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Servicio mantenimiento preventivo",
          codigo: "SRV-MAN-005",
          categoria: "Servicios técnicos",
          precio: 22500,
          stock: 40,
          stock_minimo: 5,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Diseño de sistema de refrigeración",
          codigo: "SRV-DIS-006",
          categoria: "Ingeniería",
          precio: 95000,
          stock: 20,
          stock_minimo: 2,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Diagnóstico técnico de compresor",
          codigo: "SRV-DIA-007",
          categoria: "Servicios técnicos",
          precio: 14500,
          stock: 35,
          stock_minimo: 5,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Refrigerante industrial R404A",
          codigo: "REF-GAS-008",
          categoria: "Consumibles",
          precio: 12500,
          stock: 4,
          stock_minimo: 6,
        },
      ];

      const { data: productosInsertados, error: productosError } = await supabase
        .from("productos")
        .insert(productosCW)
        .select();

      if (productosError) throw productosError;

      const empleadosCW = [
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Ing. Roberto Méndez",
          cedula: "001-150385-0001R",
          cargo: "Ingeniero de proyectos",
          salario_base: 42000,
          activo: true,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "Luis Hernández",
          cedula: "002-220490-0002L",
          cargo: "Técnico en refrigeración",
          salario_base: 26000,
          activo: true,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          nombre: "María José Duarte",
          cedula: "003-110492-0003M",
          cargo: "Asistente contable",
          salario_base: 22000,
          activo: true,
        },
      ];

      const { data: empleadosInsertados, error: empleadosError } = await supabase
        .from("empleados_planilla")
        .insert(empleadosCW)
        .select();

      if (empleadosError) throw empleadosError;

      const anio = new Date().getFullYear();
      const fechas = [
        new Date().toLocaleDateString("es-NI"),
        new Date(Date.now() - 86400000).toLocaleDateString("es-NI"),
        new Date(Date.now() - 2 * 86400000).toLocaleDateString("es-NI"),
        new Date(Date.now() - 3 * 86400000).toLocaleDateString("es-NI"),
        new Date(Date.now() - 4 * 86400000).toLocaleDateString("es-NI"),
      ];

      const facturasCW = [
        {
          empresa_ruc: empresaActiva.ruc,
          numero_factura: `FAC-${anio}-0101`,
          cliente_id: clientesInsertados?.[0]?.id || null,
          cliente: clientesInsertados?.[0]?.nombre || "Supermercado La Colonia",
          cliente_telefono: clientesInsertados?.[0]?.telefono || "",
          cliente_correo: clientesInsertados?.[0]?.correo || "",
          cliente_direccion: clientesInsertados?.[0]?.direccion || "",
          cliente_ruc_cedula: clientesInsertados?.[0]?.ruc_cedula || "",
          tipo_pago: "Transferencia",
          estado_pago: "Pagada",
          subtotal: 162500,
          iva: 24375,
          total: 186875,
          fecha: fechas[0],
          hora: new Date().toLocaleTimeString("es-NI"),
          usuario_nombre: usuarioActivo.nombre,
          estado: "valida",
          motivo_error: null,
          empresa_nombre: datosEmpresa.nombre,
          empresa_direccion: datosEmpresa.direccion,
          empresa_telefono: datosEmpresa.telefono,
          empresa_correo: datosEmpresa.correo,
          empresa_logo_url: logoEmpresa,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          numero_factura: `FAC-${anio}-0102`,
          cliente_id: clientesInsertados?.[1]?.id || null,
          cliente: clientesInsertados?.[1]?.nombre || "Planta Procesadora Norte",
          cliente_telefono: clientesInsertados?.[1]?.telefono || "",
          cliente_correo: clientesInsertados?.[1]?.correo || "",
          cliente_direccion: clientesInsertados?.[1]?.direccion || "",
          cliente_ruc_cedula: clientesInsertados?.[1]?.ruc_cedula || "",
          tipo_pago: "Transferencia",
          estado_pago: "Pendiente",
          subtotal: 231000,
          iva: 34650,
          total: 265650,
          fecha: fechas[1],
          hora: new Date().toLocaleTimeString("es-NI"),
          usuario_nombre: usuarioActivo.nombre,
          estado: "valida",
          motivo_error: null,
          empresa_nombre: datosEmpresa.nombre,
          empresa_direccion: datosEmpresa.direccion,
          empresa_telefono: datosEmpresa.telefono,
          empresa_correo: datosEmpresa.correo,
          empresa_logo_url: logoEmpresa,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          numero_factura: `FAC-${anio}-0103`,
          cliente_id: clientesInsertados?.[2]?.id || null,
          cliente: clientesInsertados?.[2]?.nombre || "Hotel Industrial Pacific",
          cliente_telefono: clientesInsertados?.[2]?.telefono || "",
          cliente_correo: clientesInsertados?.[2]?.correo || "",
          cliente_direccion: clientesInsertados?.[2]?.direccion || "",
          cliente_ruc_cedula: clientesInsertados?.[2]?.ruc_cedula || "",
          tipo_pago: "Tarjeta",
          estado_pago: "Pagada",
          subtotal: 44200,
          iva: 6630,
          total: 50830,
          fecha: fechas[2],
          hora: new Date().toLocaleTimeString("es-NI"),
          usuario_nombre: usuarioActivo.nombre,
          estado: "valida",
          motivo_error: null,
          empresa_nombre: datosEmpresa.nombre,
          empresa_direccion: datosEmpresa.direccion,
          empresa_telefono: datosEmpresa.telefono,
          empresa_correo: datosEmpresa.correo,
          empresa_logo_url: logoEmpresa,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          numero_factura: `FAC-${anio}-0104`,
          cliente_id: clientesInsertados?.[3]?.id || null,
          cliente: clientesInsertados?.[3]?.nombre || "Centro de Distribución Frío Express",
          cliente_telefono: clientesInsertados?.[3]?.telefono || "",
          cliente_correo: clientesInsertados?.[3]?.correo || "",
          cliente_direccion: clientesInsertados?.[3]?.direccion || "",
          cliente_ruc_cedula: clientesInsertados?.[3]?.ruc_cedula || "",
          tipo_pago: "Transferencia",
          estado_pago: "Pagada",
          subtotal: 109500,
          iva: 16425,
          total: 125925,
          fecha: fechas[3],
          hora: new Date().toLocaleTimeString("es-NI"),
          usuario_nombre: usuarioActivo.nombre,
          estado: "valida",
          motivo_error: null,
          empresa_nombre: datosEmpresa.nombre,
          empresa_direccion: datosEmpresa.direccion,
          empresa_telefono: datosEmpresa.telefono,
          empresa_correo: datosEmpresa.correo,
          empresa_logo_url: logoEmpresa,
        },
      ];

      const { data: facturasInsertadas, error: facturasError } = await supabase
        .from("facturas")
        .insert(facturasCW)
        .select();

      if (facturasError) throw facturasError;

      const itemsCW = [
        {
          factura_id: facturasInsertadas?.[0]?.id,
          producto_id: productosInsertados?.[0]?.id,
          nombre_producto: productosInsertados?.[0]?.nombre || "Compresor industrial",
          precio: 125000,
          cantidad: 1,
          subtotal: 125000,
        },
        {
          factura_id: facturasInsertadas?.[0]?.id,
          producto_id: productosInsertados?.[4]?.id,
          nombre_producto: productosInsertados?.[4]?.nombre || "Mantenimiento preventivo",
          precio: 22500,
          cantidad: 1,
          subtotal: 22500,
        },
        {
          factura_id: facturasInsertadas?.[0]?.id,
          producto_id: productosInsertados?.[6]?.id,
          nombre_producto: productosInsertados?.[6]?.nombre || "Diagnóstico técnico",
          precio: 15000,
          cantidad: 1,
          subtotal: 15000,
        },
        {
          factura_id: facturasInsertadas?.[1]?.id,
          producto_id: productosInsertados?.[5]?.id,
          nombre_producto: productosInsertados?.[5]?.nombre || "Diseño de sistema",
          precio: 95000,
          cantidad: 1,
          subtotal: 95000,
        },
        {
          factura_id: facturasInsertadas?.[1]?.id,
          producto_id: productosInsertados?.[2]?.id,
          nombre_producto: productosInsertados?.[2]?.nombre || "Tablero eléctrico",
          precio: 68000,
          cantidad: 2,
          subtotal: 136000,
        },
        {
          factura_id: facturasInsertadas?.[2]?.id,
          producto_id: productosInsertados?.[1]?.id,
          nombre_producto: productosInsertados?.[1]?.nombre || "Válvula industrial",
          precio: 18500,
          cantidad: 2,
          subtotal: 37000,
        },
        {
          factura_id: facturasInsertadas?.[2]?.id,
          producto_id: productosInsertados?.[3]?.id,
          nombre_producto: productosInsertados?.[3]?.nombre || "Sensor temperatura",
          precio: 7200,
          cantidad: 1,
          subtotal: 7200,
        },
        {
          factura_id: facturasInsertadas?.[3]?.id,
          producto_id: productosInsertados?.[4]?.id,
          nombre_producto: productosInsertados?.[4]?.nombre || "Mantenimiento preventivo",
          precio: 22500,
          cantidad: 3,
          subtotal: 67500,
        },
        {
          factura_id: facturasInsertadas?.[3]?.id,
          producto_id: productosInsertados?.[7]?.id,
          nombre_producto: productosInsertados?.[7]?.nombre || "Refrigerante R404A",
          precio: 14000,
          cantidad: 3,
          subtotal: 42000,
        },
      ].filter((item) => item.factura_id && item.producto_id);

      if (itemsCW.length > 0) {
        const { error: itemsError } = await supabase
          .from("factura_items")
          .insert(itemsCW);

        if (itemsError) throw itemsError;
      }

      const movimientosCW = [
        {
          empresa_ruc: empresaActiva.ruc,
          tipo: "ingreso",
          categoria: "Proyecto industrial",
          descripcion: "Anticipo por implementación de sistema de refrigeración",
          monto: 95000,
          fecha: fechas[0],
          usuario_nombre: usuarioActivo.nombre,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          tipo: "ingreso",
          categoria: "Servicio técnico",
          descripcion: "Mantenimiento preventivo de cámaras frías",
          monto: 67500,
          fecha: fechas[1],
          usuario_nombre: usuarioActivo.nombre,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          tipo: "egreso",
          categoria: "Compra de repuestos",
          descripcion: "Compra de válvulas, sensores y refrigerante",
          monto: 42000,
          fecha: fechas[2],
          usuario_nombre: usuarioActivo.nombre,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          tipo: "egreso",
          categoria: "Transporte técnico",
          descripcion: "Traslado de cuadrilla a planta industrial",
          monto: 8500,
          fecha: fechas[3],
          usuario_nombre: usuarioActivo.nombre,
        },
        {
          empresa_ruc: empresaActiva.ruc,
          tipo: "egreso",
          categoria: "Herramientas",
          descripcion: "Herramientas especializadas para diagnóstico",
          monto: 15500,
          fecha: fechas[4],
          usuario_nombre: usuarioActivo.nombre,
        },
      ];

      const { error: movimientosError } = await supabase
        .from("movimientos_contables")
        .insert(movimientosCW);

      if (movimientosError) throw movimientosError;

      const pagosCW = empleadosInsertados?.map((empleado: any, index: number) => {
        const salarioBase = Number(empleado.salario_base || 0);
        const horasExtraPago = index === 0 ? 2800 : index === 1 ? 4200 : 900;
        const bonos = index === 0 ? 3500 : index === 1 ? 2600 : 1200;
        const deducciones = index === 0 ? 700 : index === 1 ? 600 : 350;
        const bruto = salarioBase + horasExtraPago + bonos;
        const inss = bruto * 0.07;
        const neto = bruto - inss - deducciones;

        return {
          empresa_ruc: empresaActiva.ruc,
          empleado_id: empleado.id,
          empleado_nombre: empleado.nombre,
          periodo: "Demo CW Ingeniería - Abril 2026",
          salario_base: salarioBase,
          horas_extra: index === 0 ? 8 : index === 1 ? 14 : 3,
          pago_horas_extra: horasExtraPago,
          bonificaciones: bonos,
          deducciones,
          inss,
          salario_neto: neto,
          fecha_pago: fechas[0],
        };
      }) || [];

      if (pagosCW.length > 0) {
        const { error: pagosError } = await supabase
          .from("pagos_planilla")
          .insert(pagosCW);

        if (pagosError) throw pagosError;
      }

      await cargarClientes(empresaActiva.ruc);
      await cargarProductos(empresaActiva.ruc);
      await cargarFacturas(empresaActiva.ruc);
      await cargarEmpleadosPlanilla(empresaActiva.ruc);
      await cargarPagosPlanilla(empresaActiva.ruc);
      await cargarMovimientosContables(empresaActiva.ruc);

      alert("Demo CW Ingeniería cargada correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudo cargar la demo CW Ingeniería. Revisa la consola para ver el detalle.");
    }
  };

  const registrarMovimientoContable = async (e: any) => {
    e.preventDefault();

    if (usuarioActivo?.rol !== "admin" || !empresaActiva) return;

    if (!categoriaMovimiento || !descripcionMovimiento || !montoMovimiento) {
      alert("Completa categoría, descripción y monto");
      return;
    }

    const { error } = await supabase.from("movimientos_contables").insert([
      {
        empresa_ruc: empresaActiva.ruc,
        tipo: tipoMovimiento,
        categoria: categoriaMovimiento,
        descripcion: descripcionMovimiento,
        monto: Number(montoMovimiento || 0),
        fecha: fechaMovimiento || new Date().toLocaleDateString("es-NI"),
        usuario_nombre: usuarioActivo.nombre,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error guardando movimiento contable");
      return;
    }

    await cargarMovimientosContables(empresaActiva.ruc);

    setTipoMovimiento("ingreso");
    setCategoriaMovimiento("");
    setDescripcionMovimiento("");
    setMontoMovimiento("");
    setFechaMovimiento("");

    alert("Movimiento contable guardado correctamente");
  };

  const eliminarMovimientoContable = async (id?: string) => {
    if (usuarioActivo?.rol !== "admin" || !id || !empresaActiva) return;

    const confirmar = confirm("¿Seguro que deseas eliminar este movimiento contable?");
    if (!confirmar) return;

    await supabase.from("movimientos_contables").delete().eq("id", id);
    await cargarMovimientosContables(empresaActiva.ruc);
  };

  const agregarEmpleadoPlanilla = async (e: any) => {
    e.preventDefault();

    if (usuarioActivo?.rol !== "admin" || !empresaActiva) return;

    if (!nombreEmpleado || !salarioBaseEmpleado) {
      alert("Completa el nombre y salario base del empleado");
      return;
    }

    const { error } = await supabase.from("empleados_planilla").insert([
      {
        empresa_ruc: empresaActiva.ruc,
        nombre: nombreEmpleado,
        cedula: cedulaEmpleado,
        cargo: cargoEmpleado,
        salario_base: Number(salarioBaseEmpleado || 0),
        activo: true,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error guardando empleado");
      return;
    }

    await cargarEmpleadosPlanilla(empresaActiva.ruc);

    setNombreEmpleado("");
    setCedulaEmpleado("");
    setCargoEmpleado("");
    setSalarioBaseEmpleado("");

    alert("Empleado agregado correctamente");
  };

  const eliminarEmpleadoPlanilla = async (id?: string) => {
    if (usuarioActivo?.rol !== "admin" || !id || !empresaActiva) return;

    const confirmar = confirm("¿Seguro que deseas eliminar este empleado de planilla?");
    if (!confirmar) return;

    await supabase.from("empleados_planilla").delete().eq("id", id);
    await cargarEmpleadosPlanilla(empresaActiva.ruc);
    await cargarPagosPlanilla(empresaActiva.ruc);
  };

  const empleadoPago = empleadosPlanilla.find((emp) => emp.id === empleadoSeleccionado);
  const salarioBasePago = Number(empleadoPago?.salario_base || 0);
  const montoHorasExtra = Number(horasExtra || 0) * Number(pagoHoraExtra || 0);
  const bonificaciones = Number(bonificacionesPago || 0);
  const deducciones = Number(deduccionesPago || 0);
  const ingresoBrutoPlanilla = salarioBasePago + montoHorasExtra + bonificaciones;
  const inssLaboral = ingresoBrutoPlanilla * 0.07;
  const salarioNetoPlanilla = ingresoBrutoPlanilla - inssLaboral - deducciones;

  const guardarPagoPlanilla = async (e: any) => {
    e.preventDefault();

    if (usuarioActivo?.rol !== "admin" || !empresaActiva) return;

    if (!empleadoPago || !periodoPago) {
      alert("Selecciona un empleado y escribe el periodo de pago");
      return;
    }

    const { error } = await supabase.from("pagos_planilla").insert([
      {
        empresa_ruc: empresaActiva.ruc,
        empleado_id: empleadoPago.id,
        empleado_nombre: empleadoPago.nombre,
        periodo: periodoPago,
        salario_base: salarioBasePago,
        horas_extra: Number(horasExtra || 0),
        pago_horas_extra: montoHorasExtra,
        bonificaciones,
        deducciones,
        inss: inssLaboral,
        salario_neto: salarioNetoPlanilla,
        fecha_pago: new Date().toLocaleDateString("es-NI"),
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error guardando pago de planilla");
      return;
    }

    await cargarPagosPlanilla(empresaActiva.ruc);

    setEmpleadoSeleccionado("");
    setPeriodoPago("");
    setHorasExtra("");
    setPagoHoraExtra("");
    setBonificacionesPago("");
    setDeduccionesPago("");

    alert("Pago de planilla guardado correctamente");
  };

  const eliminarPagoPlanilla = async (id?: string) => {
    if (usuarioActivo?.rol !== "admin" || !id || !empresaActiva) return;

    const confirmar = confirm("¿Seguro que deseas eliminar este pago de planilla?");
    if (!confirmar) return;

    await supabase.from("pagos_planilla").delete().eq("id", id);
    await cargarPagosPlanilla(empresaActiva.ruc);
  };

  const generarPDFPagoPlanilla = (pago: any) => {
    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("INTEGRAX Cloud", 20, 15);

    doc.setFontSize(10);
    doc.text("Comprobante de pago de planilla", 20, 23);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.text("Pago de planilla", 20, 50);

    doc.setFontSize(11);
    doc.text(`Empresa: ${empresaActiva?.nombre || ""}`, 20, 65);
    doc.text(`RUC: ${empresaActiva?.ruc || ""}`, 20, 73);
    doc.text(`Empleado: ${pago.empleado_nombre || ""}`, 20, 81);
    doc.text(`Periodo: ${pago.periodo || ""}`, 20, 89);
    doc.text(`Fecha de pago: ${pago.fecha_pago || ""}`, 20, 97);

    let y = 115;

    doc.setFillColor(241, 245, 249);
    doc.rect(20, y, 170, 10, "F");
    doc.text("Concepto", 25, y + 7);
    doc.text("Monto", 150, y + 7);

    y += 20;
    doc.text("Salario base", 25, y);
    doc.text(`NIO ${Number(pago.salario_base || 0).toFixed(2)}`, 150, y);

    y += 10;
    doc.text("Horas extra", 25, y);
    doc.text(`NIO ${Number(pago.pago_horas_extra || 0).toFixed(2)}`, 150, y);

    y += 10;
    doc.text("Bonificaciones", 25, y);
    doc.text(`NIO ${Number(pago.bonificaciones || 0).toFixed(2)}`, 150, y);

    y += 10;
    doc.text("INSS laboral 7%", 25, y);
    doc.text(`- NIO ${Number(pago.inss || 0).toFixed(2)}`, 150, y);

    y += 10;
    doc.text("Deducciones", 25, y);
    doc.text(`- NIO ${Number(pago.deducciones || 0).toFixed(2)}`, 150, y);

    y += 15;
    doc.setFontSize(15);
    doc.text(`Salario neto: NIO ${Number(pago.salario_neto || 0).toFixed(2)}`, 25, y);

    y += 25;
    doc.setFontSize(9);
    doc.text("Este documento fue generado automáticamente por INTEGRAX Cloud.", 20, y);

    doc.save(`pago-planilla-${pago.empleado_nombre}.pdf`);
  };

  const generarPDF = async (factura: any) => {
    const { data: items } = await supabase
      .from("factura_items")
      .select("*")
      .eq("factura_id", factura.id);

    const doc = new jsPDF();

    const azulOscuro = [15, 23, 42] as [number, number, number];
    const azul = [37, 99, 235] as [number, number, number];
    const azulClaro = [219, 234, 254] as [number, number, number];
    const gris = [100, 116, 139] as [number, number, number];
    const grisClaro = [241, 245, 249] as [number, number, number];
    const blanco = [255, 255, 255] as [number, number, number];
    const rojo = [220, 38, 38] as [number, number, number];
    const verde = [22, 163, 74] as [number, number, number];
    const naranja = [234, 88, 12] as [number, number, number];

    const numeroFactura =
      factura.numero_factura ||
      `FAC-${new Date().getFullYear()}-${String(facturas.indexOf(factura) + 1).padStart(4, "0")}`;

    const empresaNombre = factura.empresa_nombre || empresaActiva?.nombre || "INTEGRAX Cloud";
    const empresaTelefono = factura.empresa_telefono || telefonoEmpresa || "";
    const empresaCorreo = factura.empresa_correo || correoEmpresa || "";
    const logo = factura.empresa_logo_url || logoEmpresa || "";

    doc.setFillColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.rect(0, 0, 210, 42, "F");

    doc.setFillColor(azul[0], azul[1], azul[2]);
    doc.rect(0, 38, 210, 4, "F");

    doc.setTextColor(blanco[0], blanco[1], blanco[2]);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(empresaNombre, 20, 17);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Sistema empresarial de facturación, inventario y control financiero", 20, 26);

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(148, 9, 42, 17, 4, 4, "F");
    doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("FACTURA", 158, 16);
    doc.setFontSize(8);
    doc.text(numeroFactura, 153, 22);

    if (logo) {
      try {
        doc.addImage(logo, "PNG", 160, 49, 25, 25);
      } catch (error) {
        console.warn("No se pudo cargar el logo. Usa una URL pública PNG.", error);
      }
    } else {
      doc.setFillColor(azul[0], azul[1], azul[2]);
      doc.roundedRect(160, 49, 25, 25, 5, 5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("IX", 166, 64);
    }

    doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Factura comercial", 20, 58);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(gris[0], gris[1], gris[2]);
    doc.text(`No. factura: ${numeroFactura}`, 20, 68);
    doc.text(`Fecha: ${factura.fecha || ""}`, 20, 76);
    doc.text(`Hora: ${factura.hora || ""}`, 20, 84);
    doc.text(`Atendido por: ${factura.usuario_nombre || ""}`, 20, 92);

    const estadoPagoTexto = factura.estado_pago || "No especificado";

    if (estadoPagoTexto === "Pagada") {
      doc.setFillColor(220, 252, 231);
      doc.setTextColor(verde[0], verde[1], verde[2]);
    } else {
      doc.setFillColor(255, 237, 213);
      doc.setTextColor(naranja[0], naranja[1], naranja[2]);
    }

    doc.roundedRect(20, 99, 44, 10, 3, 3, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(estadoPagoTexto.toUpperCase(), 27, 106);

    if (factura.estado === "erronea") {
      doc.setFillColor(254, 226, 226);
      doc.setTextColor(rojo[0], rojo[1], rojo[2]);
      doc.roundedRect(68, 99, 55, 10, 3, 3, "F");
      doc.text("FACTURA ERRÓNEA", 74, 106);
    }

    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(20, 118, 80, 48, 4, 4, "FD");

    doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Datos de empresa", 25, 129);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(gris[0], gris[1], gris[2]);
    doc.text(`Empresa: ${empresaNombre}`, 25, 139);
    doc.text(`RUC: ${empresaActiva?.ruc || factura.empresa_ruc || ""}`, 25, 147);
    doc.text(`Teléfono: ${empresaTelefono || "No registrado"}`, 25, 155);
    doc.text(`Correo: ${empresaCorreo || "No registrado"}`, 25, 163);

    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(110, 118, 80, 48, 4, 4, "FD");

    doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Datos del cliente", 115, 129);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(gris[0], gris[1], gris[2]);
    doc.text(`Cliente: ${factura.cliente || ""}`, 115, 139);
    doc.text(`RUC/Cédula: ${factura.cliente_ruc_cedula || "No registrado"}`, 115, 147);
    doc.text(`Teléfono: ${factura.cliente_telefono || "No registrado"}`, 115, 155);
    doc.text(`Pago: ${factura.tipo_pago || "No especificado"}`, 115, 163);

    let y = 180;

    doc.setFillColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.roundedRect(20, y, 170, 11, 3, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text("Producto", 25, y + 7);
    doc.text("Cant.", 113, y + 7);
    doc.text("Precio", 136, y + 7);
    doc.text("Subtotal", 164, y + 7);

    y += 18;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);

    items?.forEach((p: any, index: number) => {
      if (y > 240) {
        doc.addPage();

        doc.setFillColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
        doc.rect(0, 0, 210, 24, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${empresaNombre} - ${numeroFactura}`, 20, 15);

        y = 38;

        doc.setFillColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
        doc.roundedRect(20, y, 170, 11, 3, 3, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8.5);
        doc.text("Producto", 25, y + 7);
        doc.text("Cant.", 113, y + 7);
        doc.text("Precio", 136, y + 7);
        doc.text("Subtotal", 164, y + 7);
        y += 18;
      }

      if (index % 2 === 0) {
        doc.setFillColor(grisClaro[0], grisClaro[1], grisClaro[2]);
        doc.rect(20, y - 6, 170, 9, "F");
      }

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(8.5);
      doc.text(String(p.nombre_producto || ""), 25, y);
      doc.text(String(p.cantidad || 1), 116, y);
      doc.text(`NIO ${Number(p.precio || 0).toFixed(2)}`, 136, y);
      doc.text(`NIO ${Number(p.subtotal || p.precio || 0).toFixed(2)}`, 164, y);
      y += 10;
    });

    y += 6;

    if (y > 235) {
      doc.addPage();
      y = 35;
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(118, y, 72, 42, 4, 4, "FD");

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(gris[0], gris[1], gris[2]);
    doc.text("Subtotal", 125, y + 10);
    doc.text(`NIO ${Number(factura.subtotal || 0).toFixed(2)}`, 158, y + 10);

    doc.text("IVA 15%", 125, y + 20);
    doc.text(`NIO ${Number(factura.iva || 0).toFixed(2)}`, 158, y + 20);

    doc.setDrawColor(226, 232, 240);
    doc.line(125, y + 26, 183, y + 26);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.text("TOTAL", 125, y + 36);
    doc.text(`NIO ${Number(factura.total || 0).toFixed(2)}`, 154, y + 36);

    if (factura.estado === "erronea") {
      y += 55;
      doc.setFillColor(254, 226, 226);
      doc.roundedRect(20, y, 170, 18, 4, 4, "F");
      doc.setTextColor(rojo[0], rojo[1], rojo[2]);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Esta factura fue marcada como errónea.", 25, y + 7);
      doc.setFont("helvetica", "normal");
      doc.text(`Motivo: ${factura.motivo_error || "No especificado"}`, 25, y + 14);
    }

    doc.setFillColor(azulClaro[0], azulClaro[1], azulClaro[2]);
    doc.roundedRect(20, 263, 170, 14, 4, 4, "F");
    doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.text("Gracias por su preferencia. Documento generado automáticamente por INTEGRAX Cloud.", 25, 272);

    doc.setFontSize(7);
    doc.setTextColor(gris[0], gris[1], gris[2]);
    doc.text("Sistema empresarial desarrollado por INTEGRAX Cloud.", 20, 287);

    doc.save(`${numeroFactura}-${factura.cliente}.pdf`);
  };

  const menuAdmin = [
    ["dashboard", "Dashboard"],
    ["planilla", "Planilla"],
    ["clientes", "Clientes"],
    ["facturacion", "Facturación"],
    ["contabilidad", "Contabilidad"],
    ["inventario", "Inventario"],
    ["reportes", "Reportes"],
    ["usuarios", "Usuarios"],
    ["configuracion", "Configuración"],
  ];

  const menuEmpleado = [
    ["facturacion", "Facturación"],
    ["inventario", "Inventario"],
  ];

  const esAdmin = String(usuarioActivo?.rol || "").toLowerCase() === "admin";
  const menuActual = esAdmin ? menuAdmin : menuEmpleado;

  const fondo = modoOscuro ? "bg-slate-950" : "bg-slate-100";
  const texto = modoOscuro ? "text-white" : "text-gray-900";
  const tarjeta = modoOscuro
    ? "bg-slate-900 border border-slate-800 text-white"
    : "bg-white border border-gray-100 text-gray-900";

  const inputClass =
    "w-full min-w-0 p-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const ventasChartData = facturasValidas
    .slice(0, 7)
    .reverse()
    .map((f, index) => ({
      nombre: f.numero_factura || `FAC ${index + 1}`,
      total: Number(f.total || 0),
    }));

  const contabilidadChartData = [
    { nombre: "Ventas", monto: totalVendido },
    { nombre: "Ingresos", monto: ingresosContables },
    { nombre: "Egresos", monto: egresosContables },
    { nombre: "Planilla", monto: totalPlanillaPagada },
  ];

  const pieData = [
    { name: "Facturas válidas", value: facturasValidas.length },
    { name: "Facturas erróneas", value: Math.max(0, facturas.length - facturasValidas.length) },
    { name: "Pendientes", value: facturasValidas.filter((f) => f.estado_pago === "Pendiente").length },
  ];

  const coloresPie = ["#2563eb", "#dc2626", "#f97316"];


  const FondoAnimado = () => (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.10)_0,rgba(2,6,23,0.40)_55%,rgba(2,6,23,0.85)_100%)]" />
    </div>
  );

  if (!empresaActiva) {
    return (
      <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4 sm:p-8 text-white">
        <FondoAnimado />

        <form
          onSubmit={ingresarEmpresa}
          className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <span className="text-2xl font-black">IX</span>
          </div>

          <h1 className="text-3xl font-bold text-center">
            INTEGRAX <span className="text-blue-400">Cloud</span>
          </h1>

          <p className="mt-3 text-blue-100 text-center">
            Sistema profesional para facturación, inventario y control empresarial.
          </p>

          <div className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Nombre de la empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className={inputClass}
            />

            <input
              type="text"
              placeholder="RUC registrado en DGI"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              className={inputClass}
            />

            <button className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition shadow-lg">
              Continuar
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-blue-100">
            <div className="rounded-xl bg-white/10 p-3">Ventas</div>
            <div className="rounded-xl bg-white/10 p-3">Stock</div>
            <div className="rounded-xl bg-white/10 p-3">Reportes</div>
          </div>
        </form>
      </main>
    );
  }

  if (!usuarioActivo) {
    return (
      <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4 sm:p-8 text-white">
        <FondoAnimado />

        <form
          onSubmit={iniciarSesion}
          className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            {logoEmpresa ? (
              <img src={logoEmpresa} alt="Logo empresa" className="h-full w-full rounded-2xl object-cover" />
            ) : (
              <span className="text-2xl font-black">IX</span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-center">
            INTEGRAX <span className="text-blue-400">Cloud</span>
          </h1>

          <p className="mt-3 text-blue-100 text-center">
            Empresa: {empresaActiva.nombre}
          </p>

          <div className="mt-8 space-y-4">
            <input
              type="email"
              placeholder="Correo del usuario"
              value={correoLogin}
              onChange={(e) => setCorreoLogin(e.target.value)}
              className={inputClass}
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={passwordLogin}
              onChange={(e) => setPasswordLogin(e.target.value)}
              className={inputClass}
            />

            <button className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition shadow-lg">
              Ingresar
            </button>

            <button
              type="button"
              onClick={cambiarEmpresa}
              className="w-full rounded-xl border border-white/30 px-6 py-3 font-semibold hover:bg-white/10 transition"
            >
              Cambiar empresa
            </button>
          </div>

          <p className="mt-6 text-xs text-blue-100 text-center">
            Primer acceso admin: admin@empresa.com / contraseña: RUC
          </p>
        </form>
      </main>
    );
  }

  return (
    <div className={`flex min-h-screen flex-col lg:flex-row transition-colors duration-300 ${fondo}`}>
      <aside className="w-full lg:w-64 bg-gradient-to-b from-slate-950 to-slate-900 text-white p-4 sm:p-6 lg:min-h-screen">
        <div className="flex items-start justify-between gap-4 lg:block">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-1">
              INTEGRAX <span className="text-blue-400">Cloud</span>
            </h2>

            <p className="text-xs text-slate-400">{empresaActiva.nombre}</p>
            <p className="text-xs text-slate-500">RUC: {empresaActiva.ruc}</p>
            <p className="mt-2 text-xs text-slate-400 uppercase">
              {usuarioActivo.nombre} / {usuarioActivo.rol}
            </p>
          </div>

          <div className="flex flex-col gap-2 lg:hidden">
            <button
              onClick={cerrarSesion}
              className="rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold hover:bg-red-600"
            >
              Salir
            </button>

            <button
              onClick={cambiarEmpresa}
              className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-800"
            >
              Empresa
            </button>
          </div>
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0 text-sm">
          {menuActual.map(([id, textoMenu]) => (
            <button
              key={id}
              onClick={() => setSeccion(id)}
              className={`min-w-max lg:min-w-0 text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                seccion === id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {textoMenu}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block mt-8 space-y-3">
          <button
            onClick={cerrarSesion}
            className="w-full rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-600"
          >
            Cerrar sesión
          </button>

          <button
            onClick={cambiarEmpresa}
            className="w-full rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
          >
            Cambiar empresa
          </button>
        </div>
      </aside>

      <main className={`w-full overflow-x-hidden p-4 sm:p-6 lg:p-8 ${texto}`}>
        <header
          className={`border-b px-4 sm:px-8 py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center shadow-sm ${
            modoOscuro
              ? "bg-slate-900 border-slate-800 text-white"
              : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          <h1 className="text-xl font-semibold capitalize">{seccion}</h1>

          <button
            onClick={() => setModoOscuro(!modoOscuro)}
            className="rounded-full bg-blue-600 px-5 py-2 text-white font-semibold hover:bg-blue-700"
          >
            {modoOscuro ? "Modo claro" : "Modo oscuro"}
          </button>
        </header>

        <div className={`p-4 sm:p-6 lg:p-8 ${texto}`}>
          {seccion === "dashboard" && (
            <section>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold">Dashboard empresarial</h1>
                <p className="opacity-70">
                  Panel ejecutivo con ventas, contabilidad, inventario, clientes y alertas del sistema.
                </p>

                <div className={`mt-4 rounded-2xl border p-4 ${modoOscuro ? "border-cyan-500/30 bg-cyan-500/10" : "border-cyan-200 bg-cyan-50"}`}>
                  <p className="font-bold text-cyan-500">Demo personalizada para CW Ingeniería S.A.</p>
                  <p className="text-sm opacity-70">
                    Incluye clientes industriales, refrigeración, tableros eléctricos, servicios técnicos,
                    contabilidad y planilla de técnicos para una presentación más enfocada.
                  </p>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={cargarDatosDemo}
                    className="w-full sm:w-auto rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700"
                  >
                    Cargar datos demo
                  </button>

                  <button
                    type="button"
                    onClick={generarReporteVentas}
                    className="w-full sm:w-auto rounded-xl bg-green-600 px-5 py-3 text-white font-semibold hover:bg-green-700"
                  >
                    PDF Ventas
                  </button>

                  <button
                    type="button"
                    onClick={generarReporteContable}
                    className="w-full sm:w-auto rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700"
                  >
                    PDF Contable
                  </button>

                  <button
                    type="button"
                    onClick={generarReporteGeneral}
                    className="w-full sm:w-auto rounded-xl bg-slate-700 px-5 py-3 text-white font-semibold hover:bg-slate-800"
                  >
                    PDF General
                  </button>

                  <button
                    type="button"
                    onClick={generarReporteInventario}
                    className="w-full sm:w-auto rounded-xl bg-orange-600 px-5 py-3 text-white font-semibold hover:bg-orange-700"
                  >
                    PDF Inventario
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Ventas válidas</p>
                  <h2 className="text-3xl font-bold mt-2">
                    NIO {totalVendido.toFixed(2)}
                  </h2>
                  <p className="mt-2 text-sm opacity-70">{facturasValidas.length} facturas válidas</p>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Utilidad estimada</p>
                  <h2 className={`text-3xl font-bold mt-2 ${utilidadEstimada < 0 ? "text-red-500" : "text-green-500"}`}>
                    NIO {utilidadEstimada.toFixed(2)}
                  </h2>
                  <p className="mt-2 text-sm opacity-70">Ventas + ingresos - egresos - planilla</p>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Clientes</p>
                  <h2 className="text-3xl font-bold mt-2">{clientes.length}</h2>
                  <p className="mt-2 text-sm opacity-70">Registrados</p>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Stock bajo</p>
                  <h2 className={`text-3xl font-bold mt-2 ${productosStockBajo.length > 0 ? "text-red-500" : "text-green-500"}`}>
                    {productosStockBajo.length}
                  </h2>
                  <p className="mt-2 text-sm opacity-70">Productos en alerta</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
                <div className={`p-6 rounded-2xl shadow-lg lg:col-span-2 ${tarjeta}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold">Ventas recientes</h2>
                      <p className="text-sm opacity-70">Gráfica de facturas válidas recientes</p>
                    </div>
                    <span className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white">
                      Recharts
                    </span>
                  </div>

                  <div className="mt-6 h-64 sm:h-72">
                    {ventasChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ventasChartData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="nombre" tick={{ fill: modoOscuro ? "#cbd5e1" : "#334155", fontSize: 11 }} />
                          <YAxis tick={{ fill: modoOscuro ? "#cbd5e1" : "#334155", fontSize: 11 }} />
                          <Tooltip
                            formatter={(value: any) => [`NIO ${Number(value).toFixed(2)}`, "Total"]}
                            contentStyle={{
                              background: modoOscuro ? "#0f172a" : "#ffffff",
                              border: "1px solid #2563eb",
                              borderRadius: "12px",
                              color: modoOscuro ? "#ffffff" : "#0f172a",
                            }}
                          />
                          <Bar dataKey="total" radius={[10, 10, 0, 0]} fill="#2563eb" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-300/30">
                        <p className="opacity-60">Aún no hay ventas para graficar.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <h2 className="text-lg sm:text-xl font-bold">Estado de facturas</h2>
                  <p className="text-sm opacity-70">Válidas, erróneas y pendientes</p>

                  <div className="mt-6 h-64 sm:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={90}
                          innerRadius={45}
                          paddingAngle={4}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={coloresPie[index % coloresPie.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: modoOscuro ? "#0f172a" : "#ffffff",
                            border: "1px solid #2563eb",
                            borderRadius: "12px",
                            color: modoOscuro ? "#ffffff" : "#0f172a",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p><span className="text-blue-500 font-bold">●</span> Facturas válidas: {facturasValidas.length}</p>
                    <p><span className="text-red-500 font-bold">●</span> Erróneas: {Math.max(0, facturas.length - facturasValidas.length)}</p>
                    <p><span className="text-orange-500 font-bold">●</span> Pendientes: {facturasValidas.filter((f) => f.estado_pago === "Pendiente").length}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
                <div className={`p-6 rounded-2xl shadow-lg lg:col-span-2 ${tarjeta}`}>
                  <h2 className="text-lg sm:text-xl font-bold">Resumen financiero</h2>
                  <p className="text-sm opacity-70">Ventas, ingresos, egresos y planilla</p>

                  <div className="mt-6 h-64 sm:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={contabilidadChartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="nombre" tick={{ fill: modoOscuro ? "#cbd5e1" : "#334155", fontSize: 12 }} />
                        <YAxis tick={{ fill: modoOscuro ? "#cbd5e1" : "#334155", fontSize: 12 }} />
                        <Tooltip
                          formatter={(value: any) => [`NIO ${Number(value).toFixed(2)}`, "Monto"]}
                          contentStyle={{
                            background: modoOscuro ? "#0f172a" : "#ffffff",
                            border: "1px solid #2563eb",
                            borderRadius: "12px",
                            color: modoOscuro ? "#ffffff" : "#0f172a",
                          }}
                        />
                        <Line type="monotone" dataKey="monto" stroke="#22c55e" strokeWidth={4} dot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <h2 className="text-lg sm:text-xl font-bold">Alertas inteligentes</h2>

                  <div className="mt-5 space-y-3">
                    {productosStockBajo.length > 0 && (
                      <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
                        <p className="font-bold text-red-500">Stock bajo</p>
                        <p className="text-sm opacity-70">
                          {productosStockBajo.length} productos necesitan revisión.
                        </p>
                      </div>
                    )}

                    {totalPendientePago > 0 && (
                      <div className="rounded-2xl border border-orange-400/30 bg-orange-500/10 p-4">
                        <p className="font-bold text-orange-500">Pendiente de cobro</p>
                        <p className="text-sm opacity-70">
                          NIO {totalPendientePago.toFixed(2)} pendiente.
                        </p>
                      </div>
                    )}

                    {utilidadEstimada < 0 && (
                      <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
                        <p className="font-bold text-red-500">Utilidad negativa</p>
                        <p className="text-sm opacity-70">
                          Revisar egresos y planilla.
                        </p>
                      </div>
                    )}

                    {productosStockBajo.length === 0 && totalPendientePago === 0 && utilidadEstimada >= 0 && (
                      <div className="rounded-2xl border border-green-400/30 bg-green-500/10 p-4">
                        <p className="font-bold text-green-500">Todo en orden</p>
                        <p className="text-sm opacity-70">No hay alertas críticas.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <h2 className="text-xl font-bold mb-4">Facturas recientes</h2>

                  <div className="mt-4 lg:mt-0 space-y-3">
                    {facturas.slice(0, 5).map((f) => (
                      <div key={f.id} className={`rounded-2xl p-4 border ${modoOscuro ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-50"}`}>
                        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                          <div>
                            <p className="font-bold">{f.numero_factura || "Sin número"}</p>
                            <p className="text-sm opacity-70">{f.cliente}</p>
                          </div>
                          <p className="font-bold">NIO {Number(f.total || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}

                    {facturas.length === 0 && (
                      <p className="opacity-60">No hay facturas recientes.</p>
                    )}
                  </div>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <h2 className="text-xl font-bold mb-4">Productos con stock bajo</h2>

                  <div className="mt-4 lg:mt-0 space-y-3">
                    {productosStockBajo.slice(0, 5).map((p) => (
                      <div key={p.id} className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
                        <p className="font-bold text-red-500">{p.nombre}</p>
                        <p className="text-sm opacity-70">
                          Stock actual: {Number(p.stock || 0)} / mínimo: {Number(p.stock_minimo || 5)}
                        </p>
                      </div>
                    ))}

                    {productosStockBajo.length === 0 && (
                      <p className="opacity-60">No hay productos con stock bajo.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {seccion === "clientes" && usuarioActivo.rol === "admin" && (
            <section>
              <h1 className="text-2xl sm:text-3xl font-bold">Clientes</h1>
              <p className="mt-2 opacity-70">
                Registra clientes para facturación profesional e historial de ventas.
              </p>

              <form
                onSubmit={crearCliente}
                className={`mt-6 grid gap-4 grid-cols-1 md:grid-cols-2 p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}
              >
                <input
                  type="text"
                  placeholder="Nombre del cliente"
                  value={nombreClienteNuevo}
                  onChange={(e) => setNombreClienteNuevo(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="RUC o cédula"
                  value={rucCedulaClienteNuevo}
                  onChange={(e) => setRucCedulaClienteNuevo(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Teléfono"
                  value={telefonoClienteNuevo}
                  onChange={(e) => setTelefonoClienteNuevo(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="email"
                  placeholder="Correo"
                  value={correoClienteNuevo}
                  onChange={(e) => setCorreoClienteNuevo(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Dirección"
                  value={direccionClienteNuevo}
                  onChange={(e) => setDireccionClienteNuevo(e.target.value)}
                  className={`${inputClass} md:col-span-2`}
                />

                <button className="md:col-span-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                  Guardar cliente
                </button>
              </form>

              <div className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold">Clientes registrados</h2>

                {clientes.length === 0 && (
                  <p className="opacity-60">No hay clientes registrados.</p>
                )}

                {clientes.map((c) => {
                  const facturasCliente = facturas.filter(
                    (f) => f.cliente_id === c.id || f.cliente === c.nombre
                  );

                  const totalCliente = facturasCliente
                    .filter((f) => f.estado !== "erronea")
                    .reduce((sum, f) => sum + Number(f.total || 0), 0);

                  return (
                    <div
                      key={c.id}
                      className={`p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center ${tarjeta}`}
                    >
                      <div>
                        <p className="font-bold">{c.nombre}</p>
                        <p>RUC/Cédula: {c.ruc_cedula || "No registrado"}</p>
                        <p>Teléfono: {c.telefono || "No registrado"}</p>
                        <p>Correo: {c.correo || "No registrado"}</p>
                        <p>Dirección: {c.direccion || "No registrada"}</p>
                        <p className="mt-2 font-semibold">
                          Facturas: {facturasCliente.length} | Total comprado: NIO {totalCliente.toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => eliminarCliente(c.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {seccion === "facturacion" && (
            <section>
              <h1 className="text-2xl sm:text-3xl font-bold">Facturación</h1>

              <form onSubmit={guardarFactura} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <select
                    value={clienteSeleccionado}
                    onChange={(e) => {
                      setClienteSeleccionado(e.target.value);
                      const seleccionado = clientes.find((c) => c.id === e.target.value);
                      setCliente(seleccionado?.nombre || "");
                    }}
                    className={inputClass}
                  >
                    <option value="">Seleccionar cliente guardado</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} {c.ruc_cedula ? `- ${c.ruc_cedula}` : ""}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Cliente manual"
                    value={cliente}
                    onChange={(e) => {
                      setCliente(e.target.value);
                      setClienteSeleccionado("");
                    }}
                    className={inputClass}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <select
                    value={tipoPago}
                    onChange={(e) => setTipoPago(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Efectivo">Pago en efectivo</option>
                    <option value="Tarjeta">Pago con tarjeta</option>
                    <option value="Transferencia">Pago por transferencia</option>
                  </select>

                  <select
                    value={estadoPago}
                    onChange={(e) => setEstadoPago(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Pagada">Pagada</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={productoSeleccionado}
                    onChange={(e) => setProductoSeleccionado(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Seleccionar producto</option>

                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} - NIO {Number(p.precio).toFixed(2)} | Stock:{" "}
                        {Number(p.stock || 0)}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={agregarProductoAFactura}
                    className="bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-blue-600"
                  >
                    Agregar
                  </button>
                </div>

                <div className={`rounded-2xl shadow-lg p-5 ${tarjeta}`}>
                  <h2 className="font-bold mb-3">Productos en la factura</h2>

                  {itemsFactura.length === 0 && (
                    <p className="opacity-60">No hay productos agregados.</p>
                  )}

                  {itemsFactura.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row gap-2 sm:justify-between border-b border-gray-300/20 py-2"
                    >
                      <span>{item.nombre}</span>

                      <div className="flex flex-wrap gap-4">
                        <span>NIO {Number(item.precio).toFixed(2)}</span>

                        <button
                          type="button"
                          onClick={() => eliminarItemFactura(index)}
                          className="text-red-500 font-semibold"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 text-right space-y-1">
                    <p>Subtotal: NIO {subtotal.toFixed(2)}</p>
                    <p>IVA (15%): NIO {iva.toFixed(2)}</p>
                    <p className="font-bold text-xl">
                      Total: NIO {totalConIVA.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                  Guardar factura
                </button>
              </form>

              <div className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold">Facturas guardadas</h2>

                {facturas.length === 0 && (
                  <p className="opacity-60">No hay facturas guardadas.</p>
                )}

                {facturas.map((f) => (
                  <div
                    key={f.id}
                    className={`p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center ${tarjeta}`}
                  >
                    <div>
                      <p><strong>No. Factura:</strong> {f.numero_factura || "Sin número"}</p>
                      <p><strong>Cliente:</strong> {f.cliente}</p>
                      {f.cliente_ruc_cedula && <p><strong>RUC/Cédula:</strong> {f.cliente_ruc_cedula}</p>}
                      {f.cliente_telefono && <p><strong>Teléfono:</strong> {f.cliente_telefono}</p>}
                      <p><strong>Empleado:</strong> {f.usuario_nombre}</p>
                      <p><strong>Tipo de pago:</strong> {f.tipo_pago || "No especificado"}</p>
                      <p>
                        <strong>Estado de pago:</strong>{" "}
                        <span className={f.estado_pago === "Pagada" ? "text-green-500 font-bold" : "text-orange-500 font-bold"}>
                          {f.estado_pago || "No especificado"}
                        </span>
                      </p>
                      <p><strong>Fecha:</strong> {f.fecha} {f.hora}</p>
                      <p>
                        <strong>Total:</strong> NIO{" "}
                        {Number(f.total || 0).toFixed(2)}
                      </p>

                      <p>
                        <strong>Estado:</strong>{" "}
                        <span className={f.estado === "erronea" ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                          {f.estado === "erronea" ? "Errónea" : "Válida"}
                        </span>
                      </p>

                      {f.estado === "erronea" && (
                        <p className="text-red-500 text-sm">
                          <strong>Motivo:</strong> {f.motivo_error}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => generarPDF(f)}
                        className="bg-green-600 px-4 py-2 text-white rounded-xl hover:bg-green-700"
                      >
                        PDF
                      </button>

                      {usuarioActivo.rol === "admin" && f.estado !== "erronea" && (
                        <button
                          onClick={() => marcarFacturaErronea(f)}
                          className="bg-yellow-500 px-4 py-2 text-white rounded-xl hover:bg-yellow-600"
                        >
                          Marcar error
                        </button>
                      )}

                      {usuarioActivo.rol === "admin" && (
                        <button
                          onClick={() => eliminarFactura(f.id)}
                          className="bg-red-500 px-4 py-2 text-white rounded-xl hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {seccion === "inventario" && (
            <section>
              <h1 className="text-2xl sm:text-3xl font-bold">Inventario</h1>

              <form
                onSubmit={agregarProductoInventario}
                className={`mt-6 grid gap-4 grid-cols-1 md:grid-cols-2 p-6 rounded-2xl shadow-lg ${tarjeta}`}
              >
                <div className="md:col-span-2">
                  <h2 className="text-lg sm:text-xl font-bold">
                    {productoEditandoId ? "Editar producto" : "Agregar producto"}
                  </h2>
                  <p className="mt-1 text-sm opacity-70">
                    {productoEditandoId
                      ? "Actualiza el precio, stock o datos del producto seleccionado."
                      : "Registra productos, servicios, repuestos o equipos para facturación."}
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={nombreProducto}
                  onChange={(e) => setNombreProducto(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Código del producto"
                  value={codigoProducto}
                  onChange={(e) => setCodigoProducto(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Categoría"
                  value={categoriaProducto}
                  onChange={(e) => setCategoriaProducto(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="number"
                  placeholder="Precio NIO"
                  value={precioProducto}
                  onChange={(e) => setPrecioProducto(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="number"
                  placeholder="Stock disponible"
                  value={stockProducto}
                  onChange={(e) => setStockProducto(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="number"
                  placeholder="Stock mínimo"
                  value={stockMinimoProducto}
                  onChange={(e) => setStockMinimoProducto(e.target.value)}
                  className={inputClass}
                />

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                    {productoEditandoId ? "Guardar cambios" : "Agregar producto"}
                  </button>

                  {productoEditandoId && (
                    <button
                      type="button"
                      onClick={limpiarFormularioProducto}
                      className="bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-700"
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold">Productos registrados</h2>

                {productos.length === 0 && (
                  <p className="opacity-60">No hay productos registrados.</p>
                )}

                {productos.map((p) => {
                  const stock = Number(p.stock || 0);
                  const minimo = Number(p.stock_minimo || 5);
                  const bajo = stock <= minimo;

                  return (
                    <div
                      key={p.id}
                      className={`p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center ${tarjeta}`}
                    >
                      <div>
                        <p className="font-bold">{p.nombre}</p>
                        <p>Código: {p.codigo || "Sin código"}</p>
                        <p>Categoría: {p.categoria || "Sin categoría"}</p>
                        <p>NIO {Number(p.precio || 0).toFixed(2)}</p>
                        <p>
                          Stock:{" "}
                          <span className={bajo ? "text-red-500 font-bold" : ""}>
                            {stock}
                          </span>{" "}
                          / mínimo: {minimo}
                        </p>
                        {bajo && (
                          <p className="text-red-500 font-semibold">
                            ⚠ Stock bajo: edita este producto para aumentar cantidades.
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => editarProductoInventario(p)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => eliminarProductoInventario(p.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {seccion === "reportes" && usuarioActivo.rol === "admin" && (
            <section>
              <h1 className="text-2xl sm:text-3xl font-bold">Reportes</h1>

              <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
                <button
                  type="button"
                  onClick={generarReporteVentas}
                  className="w-full sm:w-auto rounded-xl bg-green-600 px-5 py-3 text-white font-semibold hover:bg-green-700"
                >
                  Reporte ventas PDF
                </button>

                <button
                  type="button"
                  onClick={generarReporteContable}
                  className="w-full sm:w-auto rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700"
                >
                  Reporte contable PDF
                </button>

                <button
                  type="button"
                  onClick={generarReporteGeneral}
                  className="w-full sm:w-auto rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700"
                >
                  Reporte general PDF
                </button>

                <button
                  type="button"
                  onClick={generarReporteInventario}
                  className="w-full sm:w-auto rounded-xl bg-orange-600 px-5 py-3 text-white font-semibold hover:bg-orange-700"
                >
                  Reporte inventario PDF
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Total vendido</p>
                  <h2 className="text-2xl font-bold mt-2">
                    NIO {totalVendido.toFixed(2)}
                  </h2>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Facturas válidas</p>
                  <h2 className="text-2xl font-bold mt-2">{facturasValidas.length}</h2>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Promedio por factura</p>
                  <h2 className="text-2xl font-bold mt-2">
                    NIO {promedioFactura.toFixed(2)}
                  </h2>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Ventas del día</p>
                  <h2 className="text-2xl font-bold mt-2">
                    NIO {ventasHoy.toFixed(2)}
                  </h2>
                </div>
              </div>

              <div className={`mt-8 p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                <h2 className="text-xl font-bold mb-4">Resumen</h2>
                <p>Productos registrados: {productos.length}</p>
                <p>Usuarios registrados: {usuarios.length}</p>
                <p>Clientes registrados: {clientes.length}</p>
                <p>Facturas emitidas: {facturas.length}</p>
                <p>Facturas válidas: {facturasValidas.length}</p>
                <p>Facturas erróneas: {facturas.length - facturasValidas.length}</p>
                <p>Total vendido: NIO {totalVendido.toFixed(2)}</p>
                <p>Ingresos contables: NIO {ingresosContables.toFixed(2)}</p>
                <p>Egresos contables: NIO {egresosContables.toFixed(2)}</p>
                <p>Planilla pagada: NIO {totalPlanillaPagada.toFixed(2)}</p>
                <p>Utilidad estimada: NIO {utilidadEstimada.toFixed(2)}</p>
              </div>
            </section>
          )}

          {seccion === "usuarios" && usuarioActivo.rol === "admin" && (
            <section>
              <h1 className="text-2xl sm:text-3xl font-bold">Usuarios</h1>

              <form onSubmit={crearUsuario} className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Nombre del usuario"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="email"
                  placeholder="Correo"
                  value={nuevoCorreo}
                  onChange={(e) => setNuevoCorreo(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="password"
                  placeholder="Contraseña asignada"
                  value={nuevoPassword}
                  onChange={(e) => setNuevoPassword(e.target.value)}
                  className={inputClass}
                />

                <select
                  value={nuevoRol}
                  onChange={(e) => setNuevoRol(e.target.value as Rol)}
                  className={inputClass}
                >
                  <option value="empleado">Empleado</option>
                  <option value="admin">Administrador</option>
                </select>

                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">
                  Crear usuario
                </button>
              </form>

              <div className="mt-8 space-y-4">
                {usuarios.map((u) => (
                  <div
                    key={u.id}
                    className={`p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-4 sm:justify-between ${tarjeta}`}
                  >
                    <div>
                      <p><strong>{u.nombre}</strong></p>
                      <p>{u.correo}</p>
                      <p className="capitalize">{u.rol}</p>
                    </div>

                    <button
                      onClick={() => eliminarUsuario(u.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {seccion === "planilla" && usuarioActivo.rol === "admin" && (
            <section>
              <h1 className="text-2xl sm:text-3xl font-bold">Planilla</h1>
              <p className="mt-2 opacity-70">
                Control de empleados, horas extra, bonificaciones, deducciones, INSS y salario neto.
              </p>

              <div className="mt-6 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <h2 className="text-xl font-bold mb-4">Agregar empleado</h2>

                  <form onSubmit={agregarEmpleadoPlanilla} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={nombreEmpleado}
                      onChange={(e) => setNombreEmpleado(e.target.value)}
                      className={inputClass}
                    />

                    <input
                      type="text"
                      placeholder="Cédula"
                      value={cedulaEmpleado}
                      onChange={(e) => setCedulaEmpleado(e.target.value)}
                      className={inputClass}
                    />

                    <input
                      type="text"
                      placeholder="Cargo"
                      value={cargoEmpleado}
                      onChange={(e) => setCargoEmpleado(e.target.value)}
                      className={inputClass}
                    />

                    <input
                      type="number"
                      placeholder="Salario base mensual NIO"
                      value={salarioBaseEmpleado}
                      onChange={(e) => setSalarioBaseEmpleado(e.target.value)}
                      className={inputClass}
                    />

                    <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                      Guardar empleado
                    </button>
                  </form>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <h2 className="text-xl font-bold mb-4">Registrar pago</h2>

                  <form onSubmit={guardarPagoPlanilla} className="space-y-4">
                    <select
                      value={empleadoSeleccionado}
                      onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Seleccionar empleado</option>
                      {empleadosPlanilla.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.nombre} - {emp.cargo || "Sin cargo"} - NIO {Number(emp.salario_base || 0).toFixed(2)}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Periodo. Ejemplo: Abril 2026 / Quincena 1"
                      value={periodoPago}
                      onChange={(e) => setPeriodoPago(e.target.value)}
                      className={inputClass}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        type="number"
                        placeholder="Horas extra"
                        value={horasExtra}
                        onChange={(e) => setHorasExtra(e.target.value)}
                        className={inputClass}
                      />

                      <input
                        type="number"
                        placeholder="Pago por hora extra NIO"
                        value={pagoHoraExtra}
                        onChange={(e) => setPagoHoraExtra(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        type="number"
                        placeholder="Bonificaciones NIO"
                        value={bonificacionesPago}
                        onChange={(e) => setBonificacionesPago(e.target.value)}
                        className={inputClass}
                      />

                      <input
                        type="number"
                        placeholder="Otras deducciones NIO"
                        value={deduccionesPago}
                        onChange={(e) => setDeduccionesPago(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div className={`rounded-2xl p-5 border ${modoOscuro ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-50"}`}>
                      <h3 className="font-bold mb-3">Resumen del pago</h3>
                      <p>Salario base: NIO {salarioBasePago.toFixed(2)}</p>
                      <p>Horas extra: NIO {montoHorasExtra.toFixed(2)}</p>
                      <p>Bonificaciones: NIO {bonificaciones.toFixed(2)}</p>
                      <p>INSS laboral 7%: NIO {inssLaboral.toFixed(2)}</p>
                      <p>Deducciones: NIO {deducciones.toFixed(2)}</p>
                      <p className="mt-2 text-xl font-bold">
                        Neto a pagar: NIO {salarioNetoPlanilla.toFixed(2)}
                      </p>
                    </div>

                    <button className="w-full bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700">
                      Guardar pago
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <h2 className="text-xl font-bold mb-4">Empleados registrados</h2>

                  <div className="space-y-4">
                    {empleadosPlanilla.length === 0 && (
                      <p className="opacity-60">No hay empleados registrados.</p>
                    )}

                    {empleadosPlanilla.map((emp) => (
                      <div
                        key={emp.id}
                        className={`p-4 rounded-2xl border flex justify-between items-center ${modoOscuro ? "border-slate-700" : "border-gray-200"}`}
                      >
                        <div>
                          <p className="font-bold">{emp.nombre}</p>
                          <p className="text-sm opacity-70">Cédula: {emp.cedula || "Sin cédula"}</p>
                          <p className="text-sm opacity-70">Cargo: {emp.cargo || "Sin cargo"}</p>
                          <p>Salario: NIO {Number(emp.salario_base || 0).toFixed(2)}</p>
                        </div>

                        <button
                          onClick={() => eliminarEmpleadoPlanilla(emp.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <h2 className="text-xl font-bold mb-4">Historial de pagos</h2>

                  <div className="space-y-4">
                    {pagosPlanilla.length === 0 && (
                      <p className="opacity-60">No hay pagos registrados.</p>
                    )}

                    {pagosPlanilla.map((pago) => (
                      <div
                        key={pago.id}
                        className={`p-4 rounded-2xl border ${modoOscuro ? "border-slate-700" : "border-gray-200"}`}
                      >
                        <div className="flex justify-between gap-4">
                          <div>
                            <p className="font-bold">{pago.empleado_nombre}</p>
                            <p className="text-sm opacity-70">Periodo: {pago.periodo}</p>
                            <p className="text-sm opacity-70">Fecha: {pago.fecha_pago}</p>
                            <p>Salario base: NIO {Number(pago.salario_base || 0).toFixed(2)}</p>
                            <p>Horas extra: NIO {Number(pago.pago_horas_extra || 0).toFixed(2)}</p>
                            <p>Bonificaciones: NIO {Number(pago.bonificaciones || 0).toFixed(2)}</p>
                            <p>INSS: NIO {Number(pago.inss || 0).toFixed(2)}</p>
                            <p>Deducciones: NIO {Number(pago.deducciones || 0).toFixed(2)}</p>
                            <p className="font-bold text-lg">
                              Neto: NIO {Number(pago.salario_neto || 0).toFixed(2)}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => generarPDFPagoPlanilla(pago)}
                              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
                            >
                              PDF
                            </button>

                            <button
                              onClick={() => eliminarPagoPlanilla(pago.id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {seccion === "contabilidad" && (
            <section>
              <h1 className="text-2xl sm:text-3xl font-bold">Contabilidad</h1>
              <p className="mt-2 opacity-70">
                Registra ingresos y egresos para estimar balance, utilidad y control financiero.
              </p>

              <div className="mt-6 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Ingresos contables</p>
                  <h2 className="text-2xl font-bold mt-2 text-green-500">
                    NIO {ingresosContables.toFixed(2)}
                  </h2>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Egresos contables</p>
                  <h2 className="text-2xl font-bold mt-2 text-red-500">
                    NIO {egresosContables.toFixed(2)}
                  </h2>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Planilla pagada</p>
                  <h2 className="text-2xl font-bold mt-2">
                    NIO {totalPlanillaPagada.toFixed(2)}
                  </h2>
                </div>

                <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Utilidad estimada</p>
                  <h2 className={`text-2xl font-bold mt-2 ${utilidadEstimada < 0 ? "text-red-500" : "text-green-500"}`}>
                    NIO {utilidadEstimada.toFixed(2)}
                  </h2>
                </div>
              </div>

              <form
                onSubmit={registrarMovimientoContable}
                className={`mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}
              >
                <select
                  value={tipoMovimiento}
                  onChange={(e) => setTipoMovimiento(e.target.value)}
                  className={inputClass}
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>

                <input
                  type="text"
                  placeholder="Categoría. Ej: Venta extra, alquiler, servicios"
                  value={categoriaMovimiento}
                  onChange={(e) => setCategoriaMovimiento(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Descripción"
                  value={descripcionMovimiento}
                  onChange={(e) => setDescripcionMovimiento(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="number"
                  placeholder="Monto NIO"
                  value={montoMovimiento}
                  onChange={(e) => setMontoMovimiento(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Fecha. Ej: 26/04/2026"
                  value={fechaMovimiento}
                  onChange={(e) => setFechaMovimiento(e.target.value)}
                  className={inputClass}
                />

                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                  Guardar movimiento
                </button>
              </form>

              <div className={`mt-8 p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                <h2 className="text-xl font-bold mb-4">Historial contable</h2>

                <div className="space-y-4">
                  {movimientosContables.length === 0 && (
                    <p className="opacity-60">No hay movimientos contables.</p>
                  )}

                  {movimientosContables.map((m) => (
                    <div
                      key={m.id}
                      className={`p-5 rounded-2xl border flex justify-between items-center ${modoOscuro ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-50"}`}
                    >
                      <div>
                        <p className={`font-bold ${m.tipo === "ingreso" ? "text-green-500" : "text-red-500"}`}>
                          {m.tipo === "ingreso" ? "Ingreso" : "Egreso"} - NIO {Number(m.monto || 0).toFixed(2)}
                        </p>
                        <p><strong>Categoría:</strong> {m.categoria}</p>
                        <p><strong>Descripción:</strong> {m.descripcion}</p>
                        <p><strong>Fecha:</strong> {m.fecha}</p>
                        <p className="text-sm opacity-70">Registrado por: {m.usuario_nombre}</p>
                      </div>

                      <button
                        onClick={() => eliminarMovimientoContable(m.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {seccion === "configuracion" && usuarioActivo.rol === "admin" && (
            <section className={`p-4 sm:p-6 rounded-2xl shadow-lg ${tarjeta}`}>
              <h1 className="text-2xl sm:text-3xl font-bold">Configuración</h1>
              <p className="mt-2 opacity-70">
                Personaliza los datos de empresa que aparecerán en la factura profesional.
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-semibold">
                      URL del logo para factura
                    </label>
                    <input
                      type="text"
                      placeholder="Pega aquí la URL pública del logo PNG"
                      value={logoEmpresa}
                      onChange={(e) => setLogoEmpresa(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Dirección de la empresa"
                    value={direccionEmpresa}
                    onChange={(e) => setDireccionEmpresa(e.target.value)}
                    className={inputClass}
                  />

                  <input
                    type="text"
                    placeholder="Teléfono de la empresa"
                    value={telefonoEmpresa}
                    onChange={(e) => setTelefonoEmpresa(e.target.value)}
                    className={inputClass}
                  />

                  <input
                    type="email"
                    placeholder="Correo de la empresa"
                    value={correoEmpresa}
                    onChange={(e) => setCorreoEmpresa(e.target.value)}
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={async () => {
                      if (!empresaActiva) return;

                      const { error } = await supabase
                        .from("empresas")
                        .update({
                          logo_url: logoEmpresa,
                          direccion: direccionEmpresa,
                          telefono: telefonoEmpresa,
                          correo: correoEmpresa,
                        })
                        .eq("ruc", empresaActiva.ruc);

                      if (error) {
                        console.error(error);
                        alert("Error guardando configuración");
                        return;
                      }

                      setEmpresaActiva({
                        ...empresaActiva,
                        logo_url: logoEmpresa,
                        direccion: direccionEmpresa,
                        telefono: telefonoEmpresa,
                        correo: correoEmpresa,
                      });

                      alert("Configuración guardada correctamente");
                    }}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700"
                  >
                    Guardar configuración
                  </button>

                  <p className="text-sm opacity-70">
                    Recomendado: usar una imagen PNG con enlace público para que aparezca correctamente en el PDF.
                  </p>
                </div>

                <div className={`rounded-2xl p-5 border ${modoOscuro ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-50"}`}>
                  <p className="font-semibold mb-3">Vista previa empresarial</p>

                  {logoEmpresa ? (
                    <img
                      src={logoEmpresa}
                      alt="Logo empresa"
                      className="h-28 w-28 rounded-2xl object-cover border"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-blue-600 text-white text-3xl font-black">
                      IX
                    </div>
                  )}

                  <div className="mt-5 space-y-1">
                    <p className="font-bold">{empresaActiva.nombre}</p>
                    <p className="text-sm opacity-70">RUC: {empresaActiva.ruc}</p>
                    <p className="text-sm opacity-70">{direccionEmpresa || "Dirección no registrada"}</p>
                    <p className="text-sm opacity-70">{telefonoEmpresa || "Teléfono no registrado"}</p>
                    <p className="text-sm opacity-70">{correoEmpresa || "Correo no registrado"}</p>
                    <p className="mt-4 text-sm font-semibold">
                      Próxima factura: {generarNumeroFactura()}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
