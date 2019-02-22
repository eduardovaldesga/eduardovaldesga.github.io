# Ejercicio 1: Control de inventarios
## Realizar la simulación del inventario de un almacen para disminuir pérdidas

Este ejercicio está basado en un ejemplo del libro: Simulación un enfoque práctico. Raul Coss Bu. *Editorial Limusa* (pág. 84)
Se desea representar el control de inventario de una empresa. 

Los datos históricos del volumen de ventas diario durante un año se encuentran el en archivo [demanda.csv](demanda.csv). La Figura 1 muestra el comportamiento de la demanda diaria.

| ![comportamiento_demanda.png](comportamiento_demanda.png) | 
|:--:| 
| *Figura 1. Comportamiento de la demanda. Fuente: propia* |

![alt text](comportamiento_demanda.png)

El precio de venta del producto es de $160 por unidad. El costo diario por unidad en inventario es de $5. La empresa se compromete a siempre entregar el producto al cliente; si hace falta una unidad, la empresa la compra a un tercero a un costo de $200.

El encargado del almacen hace un pedido de 150 unidades cuando el nivel de inventario baja de las 200 unidades, pero sus decisiones le están costando a la empresa el 45% de los insumos. Realice una simulación del control de inventarios y proporcione un tamaño de orden y nivel de reorden adecuados para disminuir las pérdidas.
