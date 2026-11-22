# Registro de defectos

Defectos confirmados al ejecutar `npm test` sobre el código inicial (commit `6b2c312`). Evidencia completa en `evidencias/pruebas-iniciales.txt` (14 fallidas, 8 aprobadas de 22) y valores devueltos en `evidencias/salidas-reales-iniciales.txt`.

Severidad: **Alta** = cobro incorrecto o dato corrupto que llega a la factura; **Media** = resultado incorrecto pero detectable o de bajo impacto económico; **Baja** = cosmético.

## Resumen

| ID | Título | Req. | Severidad | Prioridad | Casos que lo detectan | Estado |
|----|--------|------|-----------|-----------|------------------------|--------|
| DEF-01 | Descuento fuera de 0–100 % se acepta | RF-02, RF-04 | Alta | Alta | CP-11, CP-12 | Abierto |
| DEF-02 | Precio negativo y cantidad ≤ 0 se aceptan | RF-04 | Alta | Alta | CP-04, CP-05, CP-07 | Abierto |
| DEF-03 | El total no se redondea a dos decimales | RF-03 | Media | Media | CP-13, CP-14, CP-15 | Abierto |
| DEF-04 | Coerción de tipos: string, `null` y booleano se aceptan como números | RF-05 | Alta | Alta | CP-17, CP-18, CP-22 | Abierto |
| DEF-05 | `NaN`, `Infinity` y `undefined` producen un total no finito sin error | RF-05 | Media | Alta | CP-19, CP-20, CP-21 | Abierto |

---

## DEF-01 · Descuento fuera de 0–100 % se acepta

- **Requisito:** RF-02 (descuento de 0 a 100 %) y RF-04 (`RangeError` si está fuera de rango).
- **Pasos:** 1) `npm test`; 2) o en Node: `calcularTotal(100, 1, 100.01)` y `calcularTotal(100, 1, -0.01)`.
- **Esperado:** `RangeError` en ambos casos.
- **Real:** devuelve `-0.010000000000005116` (total negativo) y `100.01` (el «descuento» encarece la compra). Con 150 % devuelve `-50`.
- **Severidad:** Alta: permite cobrar importes negativos o mayores al precio.
- **Evidencia:** `CP-11 [VL] descuento -0.01 → RangeError` y `CP-12 [VL] descuento 100.01 → RangeError`:
  ```
  ✕ CP-11 [VL] descuento -0.01 → RangeError
  ✕ CP-12 [VL] descuento 100.01 → RangeError
      expect(received).toThrow(expected)
      Expected constructor: RangeError
      Received function did not throw
  ```

## DEF-02 · Precio negativo y cantidad ≤ 0 se aceptan

- **Requisito:** RF-04.
- **Pasos:** `calcularTotal(10, 0, 0)`, `calcularTotal(10, -1, 0)`, `calcularTotal(-0.01, 1, 0)`.
- **Esperado:** `RangeError` en los tres casos.
- **Real:** devuelve `0`, `-10` y `-0.01`.
- **Severidad:** Alta: una cantidad negativa genera un total negativo (equivale a una devolución no autorizada).
- **Evidencia:** `CP-04`, `CP-05`, `CP-07`:
  ```
  ✕ CP-04 [VL] cantidad 0 → RangeError
  ✕ CP-05 [PE] cantidad negativa (10, -1, 0) → RangeError
  ✕ CP-07 [VL] precio -0.01 → RangeError
      Expected constructor: RangeError
      Received function did not throw
  ```

## DEF-03 · El total no se redondea a dos decimales

- **Requisito:** RF-03.
- **Pasos:** `calcularTotal(0.1, 3, 0)`, `calcularTotal(19.99, 3, 15)`, `calcularTotal(12.345, 1, 0)`.
- **Esperado:** `0.3`, `50.97` y `12.35`.
- **Real:** `0.30000000000000004`, `50.9745` y `12.345`.
- **Severidad:** Media: el importe es casi correcto, pero no cumple el formato monetario y puede descuadrar sumas.
- **Evidencia:** `CP-13`, `CP-14`, `CP-15`:
  ```
  ✕ CP-13 [PE] error de coma flotante (0.1, 3, 0) → 0.3
      Expected: 0.3
      Received: 0.30000000000000004
  ✕ CP-14 [PE] redondeo con descuento (19.99, 3, 15) → 50.97
      Expected: 50.97
      Received: 50.9745
  ```

## DEF-04 · Coerción de tipos: string, `null` y booleano se aceptan como números

- **Requisito:** RF-05.
- **Pasos:** `calcularTotal("10", 3, 0)`, `calcularTotal(10, null, 0)`, `calcularTotal(10, 2, true)`.
- **Esperado:** `TypeError`.
- **Real:** `30`, `0` y `19.8`: JavaScript convierte implícitamente `"10"`→10, `null`→0 y `true`→1.
- **Severidad:** Alta: un dato mal formado desde un formulario se cobra sin aviso (`true` aplica un 1 % de descuento).
- **Evidencia:** `CP-17`, `CP-18`, `CP-22`:
  ```
  ✕ CP-17 [DI] precio string ("10", 3, 0) → TypeError
  ✕ CP-18 [DI] cantidad null (10, null, 0) → TypeError
  ✕ CP-22 [DI] descuento booleano (10, 2, true) → TypeError
      Expected constructor: TypeError
      Received function did not throw
  ```

## DEF-05 · `NaN`, `Infinity` y `undefined` producen un total no finito sin error

- **Requisito:** RF-05.
- **Pasos:** `calcularTotal(10, 2)`, `calcularTotal(NaN, 2, 0)`, `calcularTotal(10, Infinity, 0)`.
- **Esperado:** `TypeError`.
- **Real:** `NaN` en los tres casos (`Infinity * 0` también da `NaN`).
- **Severidad:** Media: no cobra un valor falso, pero `NaN` se propaga a totales, reportes y base de datos sin indicar la causa. Prioridad alta porque comparte la corrección con DEF-04.
- **Evidencia:** `CP-19`, `CP-20`, `CP-21`:
  ```
  ✕ CP-19 [DI] descuento omitido / undefined (10, 2) → TypeError
  ✕ CP-20 [DI] precio NaN → TypeError
  ✕ CP-21 [DI] cantidad Infinity → TypeError
      Expected constructor: TypeError
      Received function did not throw
  ```

## Orden de corrección

Primero los tipos (DEF-04, DEF-05), porque las validaciones de rango solo tienen sentido sobre números finitos (supuesto S-04). Después los rangos (DEF-02, DEF-01) y al final el redondeo (DEF-03). Después de cada corrección se ejecuta la suite completa (regresión) y se guarda la salida en `evidencias/intermedias/`.
