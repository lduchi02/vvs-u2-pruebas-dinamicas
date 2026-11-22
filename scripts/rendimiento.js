// RNF-01 · Exploración limitada de rendimiento de calcularTotal.
// Mide el tiempo por llamada con process.hrtime.bigint(): calentamiento,
// varias repeticiones y mediana. No es un benchmark formal (ver limitaciones).
const os = require('os');
const { calcularTotal } = require('../src/compras');

// Versión inicial (commit 6b2c312), solo como referencia para estimar
// cuánto cuestan las validaciones y el redondeo agregados.
function calcularTotalInicial(precio, cantidad, descuento) {
  const subtotal = precio * cantidad;
  const valorDescuento = subtotal * descuento / 100;
  return subtotal - valorDescuento;
}

const N = Number(process.argv[2]) || 1_000_000; // llamadas por repetición
const REPETICIONES = 7;
const CALENTAMIENTO = 100_000;

// Entradas válidas variadas para evitar que el motor optimice un valor constante.
const entradas = [
  [10, 3, 0], [19.99, 3, 15], [0.1, 3, 0], [45.5, 2, 100],
  [80, 1, 12.5], [25, 1, 0], [12.345, 7, 33], [999.99, 12, 5],
];

function medir(fn, n) {
  let acumulado = 0;
  const inicio = process.hrtime.bigint();
  for (let i = 0; i < n; i++) {
    const [p, c, d] = entradas[i & 7];
    acumulado += fn(p, c, d);
  }
  const fin = process.hrtime.bigint();
  return { ns: Number(fin - inicio), acumulado };
}

function medirErrores(n) {
  let errores = 0;
  const inicio = process.hrtime.bigint();
  for (let i = 0; i < n; i++) {
    try {
      calcularTotal(10, 1, 150);
    } catch (e) {
      errores++;
    }
  }
  const fin = process.hrtime.bigint();
  return { ns: Number(fin - inicio), errores };
}

const mediana = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

function escenario(nombre, ejecutar, n) {
  ejecutar(CALENTAMIENTO);
  const tiempos = [];
  for (let r = 0; r < REPETICIONES; r++) {
    tiempos.push(ejecutar(n).ns / n);
  }
  const med = mediana(tiempos);
  console.log(
    `${nombre.padEnd(38)} mediana ${med.toFixed(2).padStart(7)} ns/llamada` +
    ` | min ${Math.min(...tiempos).toFixed(2)} | max ${Math.max(...tiempos).toFixed(2)}` +
    ` | ${(1e9 / med / 1e6).toFixed(1)} M llamadas/s`
  );
  return { nombre, tiempos, med };
}

const cpus = os.cpus();
console.log('== Ambiente ==');
console.log(`Node.js        : ${process.version} (V8 ${process.versions.v8})`);
console.log(`Sistema        : ${os.type()} ${os.release()} (${os.platform()}/${os.arch()})`);
console.log(`CPU            : ${cpus[0].model} × ${cpus.length}`);
console.log(`Memoria total  : ${(os.totalmem() / 1024 ** 3).toFixed(1)} GiB`);
console.log(`Parámetros     : N = ${N.toLocaleString('es-EC')} llamadas, ${REPETICIONES} repeticiones, calentamiento ${CALENTAMIENTO.toLocaleString('es-EC')}`);
console.log('');
console.log('== Resultados (tiempo por llamada) ==');

const actual = escenario('calcularTotal corregida (válidas)', (n) => medir(calcularTotal, n), N);
const inicial = escenario('versión inicial, referencia (válidas)', (n) => medir(calcularTotalInicial, n), N);
const nErr = Math.max(1, Math.floor(N / 10));
const errores = escenario(`entrada inválida → RangeError (N/10)`, medirErrores, nErr);

console.log('');
console.log('== Detalle por repetición (ns/llamada) ==');
for (const e of [actual, inicial, errores]) {
  console.log(`${e.nombre.padEnd(38)} ${e.tiempos.map((t) => t.toFixed(2)).join('  ')}`);
}
console.log('');
console.log(`Sobrecosto de validaciones + redondeo: ${(actual.med - inicial.med).toFixed(2)} ns/llamada (${(actual.med / inicial.med).toFixed(1)}× la versión inicial)`);
const ruido = Math.max(...inicial.tiempos) - Math.min(...inicial.tiempos);
if (Math.abs(actual.med - inicial.med) <= ruido) {
  console.log(`La diferencia queda dentro de la dispersión medida (${ruido.toFixed(2)} ns): no es significativa.`);
}
console.log(`Lanzar y capturar un error cuesta ≈ ${(errores.med / actual.med).toFixed(0)}× una llamada válida.`);
console.log('');
console.log('== Limitaciones ==');
console.log('- Microbenchmark en una máquina virtual compartida: el ruido de otros procesos afecta min/max.');
console.log('- El compilador JIT de V8 puede optimizar el bucle; los valores son orientativos, no absolutos.');
console.log('- Un solo ambiente y una sola versión de Node; no se probó concurrencia ni memoria.');
console.log('- RNF-01 no define un umbral, por eso no hay veredicto pasa/falla, solo una línea base.');
