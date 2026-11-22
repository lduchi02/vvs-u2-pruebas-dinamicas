# Plan de pruebas · Módulo de cálculo de compras

Estructura basada en el plan de pruebas de ISO/IEC/IEEE 29119-3:2021 (identificación, contexto, alcance, riesgos, estrategia, ambiente, criterios y entregables).

## 1. Identificación

| Campo | Detalle |
|-------|---------|
| Proyecto | Tienda digital · módulo `src/compras.js` (`calcularTotal`) |
| Versión bajo prueba | Commit inicial del repositorio (código entregado con defectos intencionales) |
| Responsable | Luis Duchi |
| Fecha | 22 de noviembre de 2026 |
| Documentos relacionados | `docs/matriz-casos.md`, `docs/defectos.md`, `docs/reporte-pruebas.md` |

## 2. Base de prueba (requisitos)

| ID | Requisito |
|----|-----------|
| RF-01 | El subtotal es `precio × cantidad` para números positivos. |
| RF-02 | El descuento va de 0 a 100 %. |
| RF-03 | El total se entrega con dos decimales; un descuento del 100 % produce 0. |
| RF-04 | Se lanza `RangeError` para precio negativo, cantidad ≤ 0 o descuento fuera de rango. |
| RF-05 | Se lanza `TypeError` para entradas no numéricas o no finitas. |
| RNF-01 | Exploración limitada de rendimiento. |

## 3. Alcance

**Incluido:** la función `calcularTotal(precio, cantidad, descuento)` como unidad aislada: cálculo correcto (RF-01 a RF-03), manejo de errores (RF-04, RF-05) y una medición exploratoria de tiempo por llamada (RNF-01).

**Excluido:** interfaz de usuario, persistencia, impuestos, monedas distintas, integración con otros módulos de la tienda y pruebas de carga o concurrencia.

## 4. Supuestos y decisiones de diseño

| ID | Supuesto / decisión | Motivo | Estado |
|----|---------------------|--------|--------|
| S-01 | **Precio 0 se acepta** y produce total 0. | RF-01 habla de «números positivos», pero RF-04 solo rechaza el precio *negativo*. Se toma RF-04 como regla de error porque es la más específica; un artículo gratuito (precio 0) es un caso real de negocio. | Pendiente de confirmación |
| S-02 | El redondeo a dos decimales es **half-up** (0,005 sube al centavo siguiente), como el redondeo comercial. | RF-03 no indica el método de redondeo. | Pendiente de confirmación |
| S-03 | La **cantidad no entera** (p. ej. 2,5) no se rechaza. | La especificación no exige enteros; podría tratarse de productos por peso. | Pendiente de confirmación · riesgo residual |
| S-04 | Si hay varios datos inválidos, se valida primero el **tipo** (`TypeError`) y después el **rango** (`RangeError`). | Un rango solo tiene sentido sobre un número válido. | Decisión técnica |
| S-05 | Solo se redondea el **total**; el subtotal intermedio no se redondea. | Redondear dos veces acumula error. | Decisión técnica |

## 5. Riesgos de producto

| ID | Riesgo | Prob. | Impacto | Mitigación (casos) |
|----|--------|-------|---------|--------------------|
| RP-01 | Descuento fuera de rango produce totales negativos o mayores al subtotal. | Alta | Alto | CP-11, CP-12 |
| RP-02 | Cantidades o precios inválidos se cobran sin error. | Alta | Alto | CP-04, CP-05, CP-07 |
| RP-03 | Errores de coma flotante muestran importes como `0.30000000000000004`. | Alta | Medio | CP-13 a CP-15 |
| RP-04 | Coerción de tipos: `"10"` o `null` se aceptan como números. | Media | Alto | CP-17, CP-18, CP-22 |
| RP-05 | `NaN` o `Infinity` llegan al total y rompen la interfaz o la facturación. | Media | Alto | CP-19 a CP-21 |
| RP-06 | Las validaciones añadidas degradan el rendimiento. | Baja | Bajo | CP-23 (RNF-01) |

Riesgos de proyecto: tiempo limitado (laboratorio individual), ausencia de un responsable de negocio para confirmar supuestos y un solo ambiente de ejecución.

## 6. Estrategia: niveles, tipos y técnicas

| Aspecto | Decisión |
|---------|----------|
| Nivel | Pruebas de **componente (unitarias)** sobre `calcularTotal`. |
| Tipos | Funcionales (RF-01 a RF-05), de **regresión** tras cada corrección y **no funcional exploratoria** de rendimiento (RNF-01). |
| Técnicas de caja negra | **Partición de equivalencia** (válidas e inválidas), **análisis de valores límite** (0, 1, 100, −0,01, 100,01) y **datos inválidos** (string, `null`, `undefined`, `NaN`, `Infinity`, booleano). |
| Técnica de caja blanca | Medición de **cobertura** de sentencias y ramas con Jest como criterio de salida complementario. |
| Automatización | Jest; cada prueba lleva el ID del caso en su nombre (`CP-xx`) para trazabilidad. |
| Gestión de defectos | Registro en `docs/defectos.md`; corrección incremental (un commit por defecto) con reejecución completa después de cada cambio. |

## 7. Ambiente de pruebas

| Elemento | Valor |
|----------|-------|
| Sistema operativo | Debian GNU/Linux 13 (trixie), kernel Linux 6.12 |
| CPU | Intel(R) Xeon(R) Processor, 8 núcleos virtuales |
| Node.js / npm | v24.22.1 / 11.21.1 |
| Framework | Jest (dependencia de desarrollo, versión fijada en `package-lock.json`) |
| Editor | Visual Studio Code |

## 8. Criterios

**Entrada:** requisitos RF-01 a RF-05 disponibles; supuestos S-01 a S-05 registrados; matriz de casos revisada; ambiente instalado (`npm install`) y Jest ejecutándose.

**Suspensión / reanudación:** se suspende si el ambiente impide ejecutar la suite (error de configuración); se reanuda cuando `npm test` vuelve a ejecutarse.

**Salida:**
1. 100 % de los casos automatizables ejecutados.
2. 0 pruebas fallidas en la ejecución final (regresión completa).
3. Todos los defectos de severidad alta corregidos y verificados.
4. Cobertura de sentencias y ramas ≥ 90 % en `src/compras.js`.
5. Medición exploratoria de rendimiento registrada con su ambiente y limitaciones.

## 9. Entregables

`docs/matriz-casos.md`, `tests/compras.test.js`, `evidencias/pruebas-iniciales.txt`, `docs/defectos.md`, `evidencias/intermedias/`, `evidencias/pruebas-finales.txt`, `evidencias/cobertura.txt`, `evidencias/rendimiento.txt`, `docs/reporte-pruebas.md`.
