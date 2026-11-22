# Reporte de pruebas · Módulo de cálculo de compras

Reporte de finalización de pruebas según la estructura de ISO/IEC/IEEE 29119-3:2021 (resumen, desviaciones, resultados, defectos, cobertura, riesgos residuales y conclusión).

## 1. Resumen

Se probó la función `calcularTotal(precio, cantidad, descuento)` de `src/compras.js` con 22 casos automatizados en Jest y una exploración de rendimiento. La ejecución inicial confirmó **5 defectos** (14 de 22 pruebas fallidas). Tras cinco correcciones incrementales, la regresión final aprueba **22 de 22** pruebas con **100 %** de cobertura de sentencias y ramas. Se cumplen los criterios de salida del plan.

## 2. Desviaciones respecto al plan

- Ninguna en alcance o ambiente.
- Se agregó `scripts/salidas-reales.js` para registrar el valor que devolvía la función en los casos donde Jest solo informa «did not throw»; sirvió para completar el campo «real» de cada defecto.

## 3. Resultados de ejecución

| Ejecución | Commit | Aprobadas | Fallidas | Evidencia |
|-----------|--------|-----------|----------|-----------|
| Inicial (código entregado) | `2fd949a` | 8 | 14 | `evidencias/pruebas-iniciales.txt` |
| Tras DEF-04 | `7a31987` | 12 | 10 | `evidencias/intermedias/tras-DEF-04.txt` |
| Tras DEF-05 | `40b0986` | 14 | 8 | `evidencias/intermedias/tras-DEF-05.txt` |
| Tras DEF-02 | `13a5eeb` | 17 | 5 | `evidencias/intermedias/tras-DEF-02.txt` |
| Tras DEF-01 | `f225400` | 19 | 3 | `evidencias/intermedias/tras-DEF-01.txt` |
| Final (regresión completa) | `134c102` | **22** | **0** | `evidencias/pruebas-finales.txt` |

Ninguna corrección rompió una prueba que ya pasaba: el número de aprobadas solo aumentó.

## 4. Defectos

| ID | Descripción | Severidad | Estado |
|----|-------------|-----------|--------|
| DEF-01 | Descuento fuera de 0–100 % aceptado (total −0,01 con 100,01 %) | Alta | Cerrado |
| DEF-02 | Precio negativo y cantidad ≤ 0 aceptados (−10 con cantidad −1) | Alta | Cerrado |
| DEF-03 | Total sin redondeo (0.30000000000000004; 50.9745) | Media | Cerrado |
| DEF-04 | Coerción de string, `null` y booleano (`"10"` → 30) | Alta | Cerrado |
| DEF-05 | `NaN`/`Infinity`/`undefined` devuelven `NaN` sin error | Media | Cerrado |

Detalle, pasos y evidencia: `docs/defectos.md`.

## 5. Cobertura por requisito

| Requisito | Casos | Estado inicial | Estado final |
|-----------|-------|----------------|--------------|
| RF-01 Subtotal | CP-01, CP-02, CP-03, CP-06 | 4/4 pasan | 4/4 pasan |
| RF-02 Descuento 0–100 % | CP-08, CP-09, CP-10, CP-16 | 4/4 pasan | 4/4 pasan |
| RF-03 Dos decimales | CP-10, CP-13, CP-14, CP-15 | 1/4 pasan | 4/4 pasan |
| RF-04 `RangeError` | CP-04, CP-05, CP-07, CP-11, CP-12 | 0/5 pasan | 5/5 pasan |
| RF-05 `TypeError` | CP-17 a CP-22 | 0/6 pasan | 6/6 pasan |
| RNF-01 Rendimiento | CP-23 (exploratorio) | — | Medido |

Cobertura estructural (Jest, `evidencias/cobertura.txt`): sentencias 100 % (16/16), ramas 100 % (12/12), funciones 100 % (3/3), líneas 100 % (16/16).

## 6. Rendimiento (RNF-01)

Ambiente: Node.js v24.22.1, Intel Xeon × 8 (máquina virtual), Debian 13, Linux 6.12. N = 1 000 000 llamadas, 7 repeticiones, mediana (`evidencias/rendimiento.txt`).

| Escenario | Mediana (ns/llamada) | Rango |
|-----------|----------------------|-------|
| Versión corregida, entradas válidas | 42,17 | 41,02 – 44,26 |
| Versión inicial (referencia) | 41,91 | 39,58 – 43,01 |
| Entrada inválida (`RangeError`) | 2 956,88 | 2 919,94 – 3 084,96 |

Las validaciones y el redondeo no agregan un costo medible (0,26 ns, dentro de la dispersión de 3,43 ns). Lanzar y capturar una excepción cuesta unas 70 veces más que una llamada válida; es aceptable porque solo ocurre con datos erróneos.

## 7. Riesgos residuales

| Riesgo | Motivo | Recomendación |
|--------|--------|---------------|
| Supuestos S-01 (precio 0) y S-02 (half-up) sin confirmar | La especificación es ambigua | Validar con el responsable de negocio y, si cambia, ajustar requisito y prueba juntos. |
| Cantidad no entera aceptada (S-03) | No está especificado | Definir si la cantidad debe ser entera y agregar el caso correspondiente. |
| Precisión con importes muy grandes | `Number.EPSILON` solo corrige errores cerca de la unidad; sobre ~10¹³ se pierde precisión de centavos | Para importes altos, trabajar en centavos enteros o con una librería decimal. |
| Total muy pequeño que redondea a 0 | p. ej. (0.001, 1, 0) → 0 | Confirmar la regla de negocio para importes menores a un centavo. |
| Rendimiento medido en un solo ambiente | Microbenchmark orientativo | Repetir en el servidor real si se define un umbral para RNF-01. |

## 8. Conclusión

Se cumplen todos los criterios de salida: 100 % de casos ejecutados, 0 fallos en la regresión final, los 3 defectos de severidad alta corregidos y verificados, cobertura de sentencias y ramas ≥ 90 % y rendimiento registrado con su ambiente y limitaciones. El módulo queda apto para integración, con los riesgos residuales indicados.
