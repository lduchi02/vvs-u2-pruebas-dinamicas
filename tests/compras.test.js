// Pruebas dinámicas de calcularTotal (src/compras.js)
// Cada prueba lleva el ID del caso de docs/matriz-casos.md para mantener la trazabilidad.
const { calcularTotal } = require('../src/compras');

describe('RF-01 · Subtotal = precio × cantidad', () => {
  test('CP-01 [PE] enteros válidos (10, 3, 0) → 30', () => {
    expect(calcularTotal(10, 3, 0)).toBe(30);
  });

  test('CP-02 [PE] precio con decimales (19.99, 3, 0) → 59.97', () => {
    expect(calcularTotal(19.99, 3, 0)).toBe(59.97);
  });

  test('CP-03 [VL] cantidad mínima válida (25, 1, 0) → 25', () => {
    expect(calcularTotal(25, 1, 0)).toBe(25);
  });

  test('CP-06 [VL] precio 0 permitido por supuesto S-01 (0, 5, 0) → 0', () => {
    expect(calcularTotal(0, 5, 0)).toBe(0);
  });
});

describe('RF-02 · Descuento de 0 a 100 %', () => {
  test('CP-08 [VL] descuento 0 (50, 2, 0) → 100', () => {
    expect(calcularTotal(50, 2, 0)).toBe(100);
  });

  test('CP-09 [PE] descuento intermedio (100, 2, 15) → 170', () => {
    expect(calcularTotal(100, 2, 15)).toBe(170);
  });

  test('CP-16 [PE] descuento con decimales (80, 1, 12.5) → 70', () => {
    expect(calcularTotal(80, 1, 12.5)).toBe(70);
  });
});

describe('RF-03 · Total con dos decimales', () => {
  test('CP-10 [VL] descuento 100 produce 0 (45.5, 2, 100) → 0', () => {
    expect(calcularTotal(45.5, 2, 100)).toBe(0);
  });

  test('CP-13 [PE] error de coma flotante (0.1, 3, 0) → 0.3', () => {
    expect(calcularTotal(0.1, 3, 0)).toBe(0.3);
  });

  test('CP-14 [PE] redondeo con descuento (19.99, 3, 15) → 50.97', () => {
    expect(calcularTotal(19.99, 3, 15)).toBe(50.97);
  });

  test('CP-15 [VL] medio centavo, redondeo half-up S-02 (12.345, 1, 0) → 12.35', () => {
    expect(calcularTotal(12.345, 1, 0)).toBe(12.35);
  });
});

describe('RF-04 · RangeError para valores fuera de rango', () => {
  test('CP-04 [VL] cantidad 0 → RangeError', () => {
    expect(() => calcularTotal(10, 0, 0)).toThrow(RangeError);
  });

  test('CP-05 [PE] cantidad negativa (10, -1, 0) → RangeError', () => {
    expect(() => calcularTotal(10, -1, 0)).toThrow(RangeError);
  });

  test('CP-07 [VL] precio -0.01 → RangeError', () => {
    expect(() => calcularTotal(-0.01, 1, 0)).toThrow(RangeError);
  });

  test('CP-11 [VL] descuento -0.01 → RangeError', () => {
    expect(() => calcularTotal(100, 1, -0.01)).toThrow(RangeError);
  });

  test('CP-12 [VL] descuento 100.01 → RangeError', () => {
    expect(() => calcularTotal(100, 1, 100.01)).toThrow(RangeError);
  });
});

describe('RF-05 · TypeError para entradas no numéricas o no finitas', () => {
  test('CP-17 [DI] precio string ("10", 3, 0) → TypeError', () => {
    expect(() => calcularTotal('10', 3, 0)).toThrow(TypeError);
  });

  test('CP-18 [DI] cantidad null (10, null, 0) → TypeError', () => {
    expect(() => calcularTotal(10, null, 0)).toThrow(TypeError);
  });

  test('CP-19 [DI] descuento omitido / undefined (10, 2) → TypeError', () => {
    expect(() => calcularTotal(10, 2)).toThrow(TypeError);
  });

  test('CP-20 [DI] precio NaN → TypeError', () => {
    expect(() => calcularTotal(NaN, 2, 0)).toThrow(TypeError);
  });

  test('CP-21 [DI] cantidad Infinity → TypeError', () => {
    expect(() => calcularTotal(10, Infinity, 0)).toThrow(TypeError);
  });

  test('CP-22 [DI] descuento booleano (10, 2, true) → TypeError', () => {
    expect(() => calcularTotal(10, 2, true)).toThrow(TypeError);
  });
});
