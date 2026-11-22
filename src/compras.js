function validarNumero(nombre, valor) {
  if (typeof valor !== 'number' || !Number.isFinite(valor)) {
    throw new TypeError(`${nombre} debe ser un número finito`);
  }
}

function calcularTotal(precio, cantidad, descuento) {
  validarNumero('precio', precio);
  validarNumero('cantidad', cantidad);
  validarNumero('descuento', descuento);

  const subtotal = precio * cantidad;
  const valorDescuento = subtotal * descuento / 100;
  return subtotal - valorDescuento;
}
module.exports = { calcularTotal };
