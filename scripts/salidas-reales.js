// Muestra lo que realmente devuelve calcularTotal para las entradas inválidas
// de la matriz (los fallos "did not throw" de Jest no indican el valor devuelto).
const { calcularTotal } = require('../src/compras');

const casos = [
  ['CP-04', [10, 0, 0]],
  ['CP-05', [10, -1, 0]],
  ['CP-07', [-0.01, 1, 0]],
  ['CP-11', [100, 1, -0.01]],
  ['CP-12', [100, 1, 100.01]],
  ['CP-13', [0.1, 3, 0]],
  ['CP-14', [19.99, 3, 15]],
  ['CP-15', [12.345, 1, 0]],
  ['CP-17', ['10', 3, 0]],
  ['CP-18', [10, null, 0]],
  ['CP-19', [10, 2]],
  ['CP-20', [NaN, 2, 0]],
  ['CP-21', [10, Infinity, 0]],
  ['CP-22', [10, 2, true]],
  ['extra', [100, 1, 150]],
  ['extra', [100, 1, -20]],
  ['extra', [-50, 2, 0]],
];

const fmt = (v) => (typeof v === 'string' ? JSON.stringify(v) : String(v));
for (const [id, args] of casos) {
  let salida;
  try {
    salida = fmt(calcularTotal(...args));
  } catch (e) {
    salida = `${e.name}: ${e.message}`;
  }
  console.log(`${id.padEnd(6)} calcularTotal(${args.map(fmt).join(', ')}) => ${salida}`);
}
