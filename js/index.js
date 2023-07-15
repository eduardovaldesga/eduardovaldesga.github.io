
var app = new Vue({
    el: '#app',
    data: {
        info: null,
        table: [],
        selected_perfil: null,
        selected_color: null,
        selected_codigo: null,
        perfiles: [{id:1, nombre:"Riel"}, {id:2, nombre:"Jamba"}, {id:3, nombre:"Cerco chapa"}, {id:4, nombre:"Traslape"}, {id:5, nombre:"Cabezal/zoclo"}, {id:6, nombre:"Intermedio"}]
    },
    methods: {
      seleccionar_pieza(pieza) {
        if(this.selected_codigo == pieza.codigo) {
          this.selected_codigo = null;
        } else {
          this.selected_codigo = pieza.codigo;
        }
      },
      guardar_pieza(pieza) {
        if(this.selected_codigo == pieza.codigo) {
          this.selected_codigo = null;
        } else {
          this.selected_codigo = pieza.codigo;
        }
      },
      make_pieces_optimization(perfil, piezas) {
        let longitud = perfil.longitud;
        let url = "https://aluminio.onrender.com/optimal-partition/?"+ new URLSearchParams({
          size: longitud,
          pieces: piezas,
          });
        fetch(url, {
          
          mode: "cors", // no-cors, *cors, same-origin         
          
          headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': 'GET',
            "Connection": "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
            "Access-Control-Request-Headers": "X-PINGOTHER, Content-Type",
          },
          
        })
        .then(response => response.json())
        .then(data => {console.log(data);});
        
      },
      
        
 
      get_prices() {
        let url = "https://raw.githubusercontent.com/eduardovaldesga/eduardovaldesga.github.io/main/assets/precios.csv";
       
      fetch(url)
        .then(response => response.text())
        .then(data => {
          var lines = data.split("\n");          
          var headers;
          headers = lines[0].split(",");

          for (var i = 1; i < lines.length; i++) {
              var obj = {};

              if(lines[i] == undefined || lines[i].trim() == "") {
                  continue;
              }

              var words = lines[i].split(",");
              for(var j = 0; j < words.length; j++) {
                  obj[headers[j].trim()] = words[j];
              }

              this.table.push(obj);
          }
        })
        .catch(error => console.log(error));
      },
        get_info() {
    
          let url = "https://aluminio.onrender.com/read-info/";
        fetch(url, {
          
          mode: "cors", // no-cors, *cors, same-origin         
          
          headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': 'GET',
            "Connection": "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
            "Access-Control-Request-Headers": "X-PINGOTHER, Content-Type",
          },
        })
        .then(response => response.json())
        .then(data => {this.info = data;});
      },
    },
    mounted() {
      this.get_info();
    }
})


     