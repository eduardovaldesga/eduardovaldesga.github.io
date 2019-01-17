# Simulacion 1: Control de inventarios

```R 

#demanda
demanda=data.frame(cantidad=35:60,probabilidad=c(0.01,0.015,0.02,0.02,0.022,0.023,0.025,0.027,0.028,0.029,0.035,0.045,0.060,0.065,0.070,0.080,0.075,0.07,0.065,0.06,0.05,0.04,0.03,0.016,0.015,0.005))
# plot(demanda,type="h",main="DistribuciÃ³n empÃ­rica de demanda")

#tiempo de entrega (meses)
tiempo.entrega=data.frame(meses=1:3,probabilidad=c(0.3,0.4,0.3))
# plot(tiempo.entrega,type="h",ylim=c(0,0.4))

#factores de estacionalidad para los meses del aÃ±o
factor.estacional=data.frame(mes=1:12,factor=c(1.2,1,0.9,0.8,0.8,0.7,0.8,0.9,1,1.2,1.3,1.4))
# plot(1:36,rep(factor.estacional$factor,3),type="s",xlab="mes",ylab="factor de estacionalidad")
# abline(v=c(12,24),col="blue")



###################################################################################################

ui <- fluidPage(
  titlePanel("SimulaciÃ³n 1: Control de Inventarios"),
  fluidRow(
    column(6, plotOutput("grafica.demanda")),
    column(6,plotOutput("grafica.estacionalidad"))
  ),
  column(3,
    strong(textOutput("salida.tiempo.entrega")),
    h4("Costos",align="center"),
    numericInput("costo.orden","Costo por orden",1000,min=0),
    numericInput("costo.inventario","Costo de inventario (unidad/aÃ±o)",20,min=0),
    numericInput("costo.faltante","PenalizaciÃ³n por faltante (unidad)",200,min=0)
    
         ),
  column(3,
         h4("Variables",align="center"),
         numericInput("inventario","Nivel de inventario inicial",150,min=0),
         numericInput("tiempo.simulacion","Horizonte de la simulaciÃ³n (aÃ±os)",5,min=0),
         numericInput("cantidad.ordenar","Cantidad de piezas a ordenar",250,min=0),
         numericInput("nivel.reorden","Nivel de reorden",150,min=0),
         actionButton("una.simulacion","Iniciar")
         ),
  column(6,
         plotOutput("grafica.simulacion"),
         strong(textOutput("inventario.promedio")),
         h4(),
         strong(textOutput("costo"))
         )
  
  
)
server = function(input,output,session){
  output$grafica.demanda=renderPlot(plot(demanda,type="h",main="DistribuciÃ³n empÃ­rica de demanda",xlab="Cantidad de productos"))
  output$grafica.estacionalidad=renderPlot({
    plot(1:36,rep(factor.estacional$factor,3),type="s",xlab="mes",ylab="factor de estacionalidad",main="Estacionalidad")
    abline(v=c(12,24),col="blue")
  })
  output$salida.tiempo.entrega=renderText("Tiempo de entrega promedio: 2 semanas")
  
  observeEvent(input$una.simulacion,{
    
    ############################################
    inventario.inicial=input$inventario
    inventario.mensual=inventario.inicial
    orden.en.transcurso=FALSE
    costo=0
    for(mes in 1:(12*input$tiempo.simulacion)){
      #pagar por inventario
      costo=costo+max(0,input$inventario.inicial)*(input$costo.inventario/12)
      
      #simular demanda
      D=sample(demanda$cantidad,1,p=demanda$probabilidad)
      
      #inventario al final del mes
      inventario.final=inventario.inicial-D
      
      #Verificar si se hace una nueva orden
      #si no hay orden en transcurso y si estamos debajo del nivel de reorden
      if(!orden.en.transcurso & inventario.final<=input$nivel.reorden){
        orden.en.transcurso=TRUE
        #Â¿cuÃ¡ntos meses tarda en llegar?
        faltan.para.entregar=sample(tiempo.entrega$meses,1,p=tiempo.entrega$probabilidad)
        
        #pagar por ordenar
        costo=costo+input$costo.orden
      }
      
      
      #entrega de orden (solo cuando hay una orden en transcurso)
      if(orden.en.transcurso){
        if(faltan.para.entregar==0){
          inventario.final=inventario.final+input$cantidad.ordenar
          orden.en.transcurso=FALSE
          
          #Si cuando llega la orden estoy debajo del nivel de reorden volver a pedir
          if(!orden.en.transcurso & inventario.final<=input$nivel.reorden){
            orden.en.transcurso=TRUE  
            faltan.para.entregar=sample(tiempo.entrega$meses,1,p=tiempo.entrega$probabilidad)+1
            costo=costo+input$costo.orden
          }
        }
        #falta un mes menos
        faltan.para.entregar=faltan.para.entregar-1
      }
      
      #pagar por unidades faltantes
      if(inventario.final<0){
        faltantes=-inventario.final
        costo=costo+faltantes*input$costo.faltante
      }
      
      #actualizar inventario
      inventario.inicial=inventario.final
      inventario.mensual=c(inventario.mensual,inventario.final)
      
    }
    
    output$grafica.simulacion=renderPlot({
      #grafica
      plot(inventario.mensual,type="ol",pch=19,cex=0.7,main="SimulaciÃ³n control de inventario",ylab="nivel de inventario",xlab="mes",ylim=c(min(0,min(inventario.mensual))-10,max(inventario.mensual)+10),xaxt="n")
      abline(h=input$nivel.reorden,lty="dashed",col="green")
      abline(h=0,lty="dashed",col="red")
      axis(1,at=1:(12*input$tiempo.simulacion+1))
    })
    
    output$inventario.promedio=renderText(paste("Nivel promedio de inventario:",format(mean(inventario.mensual),digits=2)))
    output$costo=renderText(paste("Costo total: $",costo,sep=""))
    
    
  })
}
shinyApp(ui = ui, server = server,options = ) 
```
