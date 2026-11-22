# Matriz de casos de prueba

Técnicas: **PE** = partición de equivalencia, **VL** = valores límite, **DI** = datos inválidos, **EX** = exploratoria. Prioridad según el riesgo asociado (`docs/plan-pruebas.md`, sección 5). Todos los casos funcionales están automatizados en `tests/compras.test.js` con el mismo ID en el nombre de la prueba.

| ID | Req. | Técnica | Datos (precio, cantidad, descuento) | Resultado esperado | Prioridad | Estado inicial | Estado final |
|----|------|---------|-------------------------------------|--------------------|-----------|----------------|--------------|
| CP-01 | RF-01 | PE válida (enteros) | (10, 3, 0) | 30 | Alta | Pasa | Pasa |
| CP-02 | RF-01 | PE válida (decimales) | (19.99, 3, 0) | 59.97 | Media | Pasa | Pasa |
| CP-03 | RF-01 | VL cantidad mínima válida | (25, 1, 0) | 25 | Alta | Pasa | Pasa |
| CP-04 | RF-04 | VL cantidad = 0 | (10, 0, 0) | `RangeError` | Alta | Falla | Pasa |
| CP-05 | RF-04 | PE inválida cantidad negativa | (10, −1, 0) | `RangeError` | Alta | Falla | Pasa |
| CP-06 | RF-01 | VL precio = 0 (supuesto S-01) | (0, 5, 0) | 0 | Media | Pasa | Pasa |
| CP-07 | RF-04 | VL precio −0.01 | (−0.01, 1, 0) | `RangeError` | Alta | Falla | Pasa |
| CP-08 | RF-02 | VL descuento = 0 | (50, 2, 0) | 100 | Alta | Pasa | Pasa |
| CP-09 | RF-02 | PE descuento intermedio | (100, 2, 15) | 170 | Alta | Pasa | Pasa |
| CP-10 | RF-02, RF-03 | VL descuento = 100 | (45.5, 2, 100) | 0 | Alta | Pasa | Pasa |
| CP-11 | RF-04 | VL descuento −0.01 | (100, 1, −0.01) | `RangeError` | Alta | Falla | Pasa |
| CP-12 | RF-04 | VL descuento 100.01 | (100, 1, 100.01) | `RangeError` | Alta | Falla | Pasa |
| CP-13 | RF-03 | PE error de coma flotante | (0.1, 3, 0) | 0.3 | Media | Falla | Pasa |
| CP-14 | RF-03 | PE redondeo con descuento | (19.99, 3, 15) | 50.97 | Alta | Falla | Pasa |
| CP-15 | RF-03 | VL medio centavo (supuesto S-02) | (12.345, 1, 0) | 12.35 | Media | Falla | Pasa |
| CP-16 | RF-02 | PE descuento con decimales | (80, 1, 12.5) | 70 | Baja | Pasa | Pasa |
| CP-17 | RF-05 | DI precio string | ("10", 3, 0) | `TypeError` | Alta | Falla | Pasa |
| CP-18 | RF-05 | DI cantidad `null` | (10, null, 0) | `TypeError` | Media | Falla | Pasa |
| CP-19 | RF-05 | DI descuento `undefined` (omitido) | (10, 2) | `TypeError` | Media | Falla | Pasa |
| CP-20 | RF-05 | DI precio `NaN` | (NaN, 2, 0) | `TypeError` | Alta | Falla | Pasa |
| CP-21 | RF-05 | DI cantidad `Infinity` | (10, Infinity, 0) | `TypeError` | Media | Falla | Pasa |
| CP-22 | RF-05 | DI descuento booleano | (10, 2, true) | `TypeError` | Baja | Falla | Pasa |
| CP-23 | RNF-01 | EX rendimiento | 10⁶ llamadas válidas × 7 repeticiones | Registrar mediana (ns/llamada); sin umbral definido | Baja | — | Medido |

## Resumen por requisito

| Requisito | Casos | Técnicas |
|-----------|-------|----------|
| RF-01 | CP-01, CP-02, CP-03, CP-06 | PE, VL |
| RF-02 | CP-08, CP-09, CP-10, CP-16 | PE, VL |
| RF-03 | CP-10, CP-13, CP-14, CP-15 | PE, VL |
| RF-04 | CP-04, CP-05, CP-07, CP-11, CP-12 | PE inválida, VL |
| RF-05 | CP-17 a CP-22 | DI |
| RNF-01 | CP-23 | EX |

Total: **23 casos** (22 automatizados con Jest y 1 exploratorio de rendimiento con `scripts/rendimiento.js`).

> La columna «Estado inicial» se completó después de ejecutar la suite sobre el código entregado (`evidencias/pruebas-iniciales.txt`) y «Estado final» tras las correcciones (`evidencias/pruebas-finales.txt`).
