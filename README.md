# Laboratorio de pruebas dinámicas con Jest

**Verificación y Validación de Software · Unidad 2: Evaluación dinámica**
Autor: Luis Duchi

Diseño de casos, automatización con Jest y gestión de defectos sobre el módulo `src/compras.js` de una tienda digital (`calcularTotal(precio, cantidad, descuento)`).

## Requisitos probados

| ID | Requisito |
|----|-----------|
| RF-01 | Subtotal = `precio × cantidad` para números positivos |
| RF-02 | Descuento de 0 a 100 % |
| RF-03 | Total con dos decimales (100 % produce 0) |
| RF-04 | `RangeError` para precio negativo, cantidad ≤ 0 o descuento fuera de rango |
| RF-05 | `TypeError` para entradas no numéricas o no finitas |
| RNF-01 | Exploración limitada de rendimiento |

## Estructura

```
├── src/compras.js              # módulo bajo prueba (corregido)
├── tests/compras.test.js       # 22 pruebas Jest (CP-01 … CP-22)
├── scripts/
│   ├── rendimiento.js          # exploración de rendimiento (RNF-01)
│   └── salidas-reales.js       # valores devueltos ante entradas inválidas
├── docs/
│   ├── plan-pruebas.md         # Fase A: plan (ISO/IEC/IEEE 29119-3)
│   ├── matriz-casos.md         # Fase A: 23 casos con trazabilidad
│   ├── defectos.md             # Fase C: DEF-01 … DEF-05
│   └── reporte-pruebas.md      # Fase D: reporte final
└── evidencias/                 # salidas reales de cada ejecución
```

## Cómo ejecutar

```bash
npm install
npm test                 # suite completa (jest --runInBand)
npm run test:coverage    # suite + reporte de cobertura
npm run rendimiento      # exploración de rendimiento (N = 1e6 por defecto)
```

Requiere Node.js 18 o superior (probado con v24.22.1).

## Resultados

| Ejecución | Aprobadas | Fallidas |
|-----------|-----------|----------|
| Código inicial | 8 | 14 |
| Después de las correcciones | **22** | **0** |

- **Defectos:** 5 confirmados y cerrados (3 de severidad alta). Ver [`docs/defectos.md`](docs/defectos.md).
- **Cobertura:** 100 % de sentencias, ramas, funciones y líneas en `src/compras.js`.
- **Rendimiento:** unos 42 ns por llamada válida (mediana de 7 repeticiones × 10⁶ llamadas). Las validaciones no agregan un costo medible frente a la versión inicial.

## Decisiones documentadas

- **Precio 0 se acepta** (total 0): RF-04 solo rechaza el precio negativo (supuesto S-01).
- Redondeo **half-up** a centavos (S-02); cantidad no entera no se rechaza (S-03).
- Se valida primero el tipo (`TypeError`) y luego el rango (`RangeError`) (S-04).

## Historial de trabajo

1. Código inicial tal como se entregó.
2. Fase A: plan de pruebas y matriz de casos.
3. Fase B: configuración de Jest y automatización.
4. Ejecución inicial y registro de defectos.
5. Fase C: rama `fix/defectos`, un commit por defecto con regresión después de cada cambio (PR #1).
6. Fase D: rendimiento, reporte de pruebas y este README.
