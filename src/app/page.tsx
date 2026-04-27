"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { supabase } from "@/lib/supabase";

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

  const agregarProductoInventario = async (e: any) => {
    e.preventDefault();

    if (!nombreProducto || !precioProducto || !empresaActiva) {
      alert("Completa nombre y precio del producto");
      return;
    }

    const { error } = await supabase.from("productos").insert([
      {
        empresa_ruc: empresaActiva.ruc,
        nombre: nombreProducto,
        codigo: codigoProducto,
        categoria: categoriaProducto,
        precio: Number(precioProducto),
        stock: Number(stockProducto || 0),
        stock_minimo: Number(stockMinimoProducto || 5),
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error guardando producto");
      return;
    }

    await cargarProductos(empresaActiva.ruc);

    setNombreProducto("");
    setCodigoProducto("");
    setCategoriaProducto("");
    setPrecioProducto("");
    setStockProducto("");
    setStockMinimoProducto("");
  };

  const eliminarProductoInventario = async (id?: string) => {
    if (usuarioActivo?.rol !== "admin" || !id || !empresaActiva) return;

    await supabase.from("productos").delete().eq("id", id);
    await cargarProductos(empresaActiva.ruc);
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

  const menuActual = usuarioActivo?.rol === "admin" ? menuAdmin : menuEmpleado;

  const fondo = modoOscuro ? "bg-slate-950" : "bg-slate-100";
  const texto = modoOscuro ? "text-white" : "text-gray-900";
  const tarjeta = modoOscuro
    ? "bg-slate-900 border border-slate-800 text-white"
    : "bg-white border border-gray-100 text-gray-900";

  const inputClass =
    "w-full p-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const FondoAnimado = () => (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.10)_0,rgba(2,6,23,0.40)_55%,rgba(2,6,23,0.85)_100%)]" />
    </div>
  );

  if (!empresaActiva) {
    return (
      <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-8 text-white">
        <FondoAnimado />

        <form
          onSubmit={ingresarEmpresa}
          className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
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
      <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-8 text-white">
        <FondoAnimado />

        <form
          onSubmit={iniciarSesion}
          className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
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
    <div className={`flex min-h-screen transition-colors duration-300 ${fondo}`}>
      <aside className="w-64 bg-gradient-to-b from-slate-950 to-slate-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            INTEGRAX <span className="text-blue-400">Cloud</span>
          </h2>

          <p className="text-xs text-slate-400">{empresaActiva.nombre}</p>
          <p className="mb-6 text-xs text-slate-500">RUC: {empresaActiva.ruc}</p>

          <p className="mb-4 text-xs text-slate-400 uppercase">
            {usuarioActivo.nombre} / {usuarioActivo.rol}
          </p>

          <nav className="flex flex-col gap-2 text-sm">
            {menuActual.map(([id, textoMenu]) => (
              <button
                key={id}
                onClick={() => setSeccion(id)}
                className={`text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                  seccion === id
                    ? "bg-blue-600 text-white shadow-lg scale-[1.02]"
                    : "text-slate-300 hover:bg-slate-800 hover:translate-x-1"
                }`}
              >
                {textoMenu}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-3">
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

      <main className="flex-1 flex flex-col">
        <header
          className={`border-b px-8 py-4 flex justify-between items-center shadow-sm ${
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

        <div className={`p-8 ${texto}`}>
          {seccion === "dashboard" && (
            <section>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Dashboard empresarial</h1>
                <p className="opacity-70">
                  Resumen visual de ventas, inventario, clientes, planilla y contabilidad.
                </p>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-4">
                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Ventas válidas</p>
                  <h2 className="text-3xl font-bold mt-2">NIO {totalVendido.toFixed(2)}</h2>
                  <div className="mt-4 h-2 rounded-full bg-blue-100">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: `${Math.min(100, facturasValidas.length * 12)}%` }} />
                  </div>
                </div>

                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Utilidad estimada</p>
                  <h2 className={`text-3xl font-bold mt-2 ${utilidadEstimada < 0 ? "text-red-500" : "text-green-500"}`}>
                    NIO {utilidadEstimada.toFixed(2)}
                  </h2>
                  <p className="mt-2 text-sm opacity-70">Ventas + ingresos - egresos - planilla</p>
                </div>

                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Clientes</p>
                  <h2 className="text-3xl font-bold mt-2">{clientes.length}</h2>
                  <p className="mt-2 text-sm opacity-70">Registrados para facturación</p>
                </div>

                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Stock bajo</p>
                  <h2 className={`text-3xl font-bold mt-2 ${productosStockBajo.length > 0 ? "text-red-500" : "text-green-500"}`}>
                    {productosStockBajo.length}
                  </h2>
                  <p className="mt-2 text-sm opacity-70">Productos en alerta</p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className={`p-6 rounded-2xl shadow-lg lg:col-span-2 ${tarjeta}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Ventas y operación</h2>
                      <p className="text-sm opacity-70">Indicadores principales</p>
                    </div>
                    <span className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white">
                      {new Date().toLocaleDateString("es-NI")}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className={`rounded-2xl p-5 ${modoOscuro ? "bg-slate-800" : "bg-slate-50"}`}>
                      <p className="opacity-70">Ventas del día</p>
                      <p className="text-2xl font-bold">NIO {ventasHoy.toFixed(2)}</p>
                    </div>

                    <div className={`rounded-2xl p-5 ${modoOscuro ? "bg-slate-800" : "bg-slate-50"}`}>
                      <p className="opacity-70">Pendiente de cobro</p>
                      <p className="text-2xl font-bold text-orange-500">NIO {totalPendientePago.toFixed(2)}</p>
                    </div>

                    <div className={`rounded-2xl p-5 ${modoOscuro ? "bg-slate-800" : "bg-slate-50"}`}>
                      <p className="opacity-70">Facturas válidas</p>
                      <p className="text-2xl font-bold">{facturasValidas.length}</p>
                    </div>

                    <div className={`rounded-2xl p-5 ${modoOscuro ? "bg-slate-800" : "bg-slate-50"}`}>
                      <p className="opacity-70">Promedio por factura</p>
                      <p className="text-2xl font-bold">NIO {promedioFactura.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="mb-3 font-semibold">Gráfico visual de ventas recientes</p>
                    <div className="flex h-40 items-end gap-3 rounded-2xl border border-gray-200/20 p-4">
                      {facturasValidas.slice(0, 8).reverse().map((f, index) => {
                        const altura = Math.max(12, Math.min(100, (Number(f.total || 0) / Math.max(totalVendido, 1)) * 180));
                        return (
                          <div key={f.id || index} className="flex flex-1 flex-col items-center gap-2">
                            <div
                              className="w-full rounded-t-xl bg-blue-600"
                              style={{ height: `${altura}px` }}
                            />
                            <span className="text-[10px] opacity-70">FAC</span>
                          </div>
                        );
                      })}

                      {facturasValidas.length === 0 && (
                        <p className="w-full text-center opacity-60">Aún no hay ventas para mostrar.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <h2 className="text-xl font-bold">Balance contable</h2>
                  <p className="text-sm opacity-70">Ingresos y egresos manuales</p>

                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>Ingresos</span>
                        <span>NIO {ingresosContables.toFixed(2)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-200">
                        <div className="h-3 rounded-full bg-green-500" style={{ width: `${Math.min(100, ingresosContables / Math.max(ingresosContables + egresosContables, 1) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>Egresos</span>
                        <span>NIO {egresosContables.toFixed(2)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-200">
                        <div className="h-3 rounded-full bg-red-500" style={{ width: `${Math.min(100, egresosContables / Math.max(ingresosContables + egresosContables, 1) * 100)}%` }} />
                      </div>
                    </div>

                    <div className={`mt-6 rounded-2xl p-4 ${utilidadEstimada < 0 ? "bg-red-500/10" : "bg-green-500/10"}`}>
                      <p className="text-sm opacity-70">Resultado estimado</p>
                      <p className={`text-2xl font-bold ${utilidadEstimada < 0 ? "text-red-500" : "text-green-500"}`}>
                        NIO {utilidadEstimada.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <h2 className="text-xl font-bold mb-4">Facturas recientes</h2>

                  <div className="space-y-3">
                    {facturas.slice(0, 5).map((f) => (
                      <div key={f.id} className={`rounded-2xl p-4 border ${modoOscuro ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-50"}`}>
                        <div className="flex justify-between">
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

                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <h2 className="text-xl font-bold mb-4">Alertas del sistema</h2>

                  <div className="space-y-3">
                    {productosStockBajo.map((p) => (
                      <div key={p.id} className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
                        <p className="font-bold text-red-500">Stock bajo: {p.nombre}</p>
                        <p className="text-sm opacity-70">
                          Stock actual: {Number(p.stock || 0)} / mínimo: {Number(p.stock_minimo || 5)}
                        </p>
                      </div>
                    ))}

                    {totalPendientePago > 0 && (
                      <div className="rounded-2xl border border-orange-400/30 bg-orange-500/10 p-4">
                        <p className="font-bold text-orange-500">Facturas pendientes</p>
                        <p className="text-sm opacity-70">
                          Hay NIO {totalPendientePago.toFixed(2)} pendiente de cobro.
                        </p>
                      </div>
                    )}

                    {productosStockBajo.length === 0 && totalPendientePago === 0 && (
                      <div className="rounded-2xl border border-green-400/30 bg-green-500/10 p-4">
                        <p className="font-bold text-green-500">Todo en orden</p>
                        <p className="text-sm opacity-70">No hay alertas importantes por ahora.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {seccion === "clientes" && usuarioActivo.rol === "admin" && (
            <section>
              <h1 className="text-3xl font-bold">Clientes</h1>
              <p className="mt-2 opacity-70">
                Registra clientes para facturación profesional e historial de ventas.
              </p>

              <form
                onSubmit={crearCliente}
                className={`mt-6 grid gap-4 md:grid-cols-2 p-6 rounded-2xl shadow-lg ${tarjeta}`}
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
                <h2 className="text-2xl font-bold">Clientes registrados</h2>

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
                      className={`p-5 rounded-2xl shadow-lg flex justify-between items-center ${tarjeta}`}
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
              <h1 className="text-3xl font-bold">Facturación</h1>

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

                <div className="flex gap-3">
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
                    className="bg-slate-900 text-white px-5 rounded-xl hover:bg-blue-600"
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
                      className="flex justify-between border-b border-gray-300/20 py-2"
                    >
                      <span>{item.nombre}</span>

                      <div className="flex gap-4">
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
                <h2 className="text-2xl font-bold">Facturas guardadas</h2>

                {facturas.length === 0 && (
                  <p className="opacity-60">No hay facturas guardadas.</p>
                )}

                {facturas.map((f) => (
                  <div
                    key={f.id}
                    className={`p-5 rounded-2xl shadow-lg flex justify-between items-center ${tarjeta}`}
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

                    <div className="flex gap-2">
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
              <h1 className="text-3xl font-bold">Inventario</h1>

              <form
                onSubmit={agregarProductoInventario}
                className="mt-6 grid gap-4 md:grid-cols-2"
              >
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

                <button className="md:col-span-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                  Agregar producto
                </button>
              </form>

              <div className="mt-8 space-y-4">
                {productos.map((p) => {
                  const stock = Number(p.stock || 0);
                  const minimo = Number(p.stock_minimo || 5);
                  const bajo = stock <= minimo;

                  return (
                    <div
                      key={p.id}
                      className={`p-5 rounded-2xl shadow-lg flex justify-between items-center ${tarjeta}`}
                    >
                      <div>
                        <p className="font-bold">{p.nombre}</p>
                        <p>Código: {p.codigo || "Sin código"}</p>
                        <p>Categoría: {p.categoria || "Sin categoría"}</p>
                        <p>NIO {Number(p.precio).toFixed(2)}</p>
                        <p>
                          Stock:{" "}
                          <span className={bajo ? "text-red-500 font-bold" : ""}>
                            {stock}
                          </span>
                        </p>
                        {bajo && (
                          <p className="text-red-500 font-semibold">
                            ⚠ Stock bajo
                          </p>
                        )}
                      </div>

                      {usuarioActivo.rol === "admin" && (
                        <button
                          onClick={() => eliminarProductoInventario(p.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-xl"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {seccion === "reportes" && usuarioActivo.rol === "admin" && (
            <section>
              <h1 className="text-3xl font-bold">Reportes</h1>

              <div className="mt-6 grid gap-6 md:grid-cols-4">
                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Total vendido</p>
                  <h2 className="text-2xl font-bold mt-2">
                    NIO {totalVendido.toFixed(2)}
                  </h2>
                </div>

                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Facturas válidas</p>
                  <h2 className="text-2xl font-bold mt-2">{facturasValidas.length}</h2>
                </div>

                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Promedio por factura</p>
                  <h2 className="text-2xl font-bold mt-2">
                    NIO {promedioFactura.toFixed(2)}
                  </h2>
                </div>

                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
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
              <h1 className="text-3xl font-bold">Usuarios</h1>

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
                    className={`p-5 rounded-2xl shadow-lg flex justify-between ${tarjeta}`}
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
              <h1 className="text-3xl font-bold">Planilla</h1>
              <p className="mt-2 opacity-70">
                Control de empleados, horas extra, bonificaciones, deducciones, INSS y salario neto.
              </p>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
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

                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
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

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
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

                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
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
              <h1 className="text-3xl font-bold">Contabilidad</h1>
              <p className="mt-2 opacity-70">
                Registra ingresos y egresos para estimar balance, utilidad y control financiero.
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-4">
                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Ingresos contables</p>
                  <h2 className="text-2xl font-bold mt-2 text-green-500">
                    NIO {ingresosContables.toFixed(2)}
                  </h2>
                </div>

                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Egresos contables</p>
                  <h2 className="text-2xl font-bold mt-2 text-red-500">
                    NIO {egresosContables.toFixed(2)}
                  </h2>
                </div>

                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Planilla pagada</p>
                  <h2 className="text-2xl font-bold mt-2">
                    NIO {totalPlanillaPagada.toFixed(2)}
                  </h2>
                </div>

                <div className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
                  <p className="opacity-70">Utilidad estimada</p>
                  <h2 className={`text-2xl font-bold mt-2 ${utilidadEstimada < 0 ? "text-red-500" : "text-green-500"}`}>
                    NIO {utilidadEstimada.toFixed(2)}
                  </h2>
                </div>
              </div>

              <form
                onSubmit={registrarMovimientoContable}
                className={`mt-8 grid gap-4 md:grid-cols-2 p-6 rounded-2xl shadow-lg ${tarjeta}`}
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
            <section className={`p-6 rounded-2xl shadow-lg ${tarjeta}`}>
              <h1 className="text-3xl font-bold">Configuración</h1>
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
