
# Simulación de control de inventarios

Esta simulación emula el control de inventarios de un almacen. Aparece como ejemplo en el libro "Simulación un enfoque práctico" de Raul Coss Bu. (pág. 84). Suponga que la demanda promedio mensual de cierto producto obedece a la siguiente distribución de probabilidad empírica:

```R
demanda=data.frame(cantidad=35:60,probabilidad=c(0.01,0.015,0.02,0.02,0.022,0.023,0.025,0.027,0.028,0.029,0.035,0.045,0.060,0.065,0.070,0.080,0.075,0.07,0.065,0.06,0.05,0.04,0.03,0.016,0.015,0.005))
plot(demanda,type="l",main="Distribución empírica de demanda")
```

![](distr_demanda.png)

Para diferenciar la distribución por mes se consideran los siguientes factores de estacionalidad:

|Mes|1|2|3|4|5|6|7|8|9|10|11|12|
|--|--|--|--|--|-|-|-|-|-|-|-|-|
|Factor|1.2|1|0.9|0.8|0.8|0.7|0.8|0.9|1|1.2|1.3|1.4|

