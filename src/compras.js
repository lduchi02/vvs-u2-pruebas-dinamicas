function validarNumero(nombre, valor) {
  if (typeof valor !== 'number' || !Number.isFinite(valor)) {
    throw new TypeError(`${nombre} debe ser un número finito`);
  }
}

// Redondeo a 2 decimales (half-up). Se suma Number.EPSILON para que valores
// como 1.005, que en binario quedan en 1.00499..., suban a 1.01.
function redondear2(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

function calcularTotal(precio, cantidad, descuento) {
  validarNumero('precio', precio);
  validarNumero('cantidad', cantidad);
  validarNumero('descuento', descuento);

  if (precio < 0) {
    throw new RangeError('precio no puede ser negativo');
  }
  if (cantidad <= 0) {
    throw new RangeError('cantidad debe ser mayor que 0');
  }
  if (descuento < 0 || descuento > 100) {
    throw new RangeError('descuento debe estar entre 0 y 100');
  }

  const subtotal = precio * cantidad;
  const valorDescuento = subtotal * descuento / 100;
  return redondear2(subtotal - valorDescuento);
}
module.exports = { calcularTotal };
