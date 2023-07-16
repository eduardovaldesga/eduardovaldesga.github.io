
var app = new Vue({
    el: '#app',
    data: {
        info: null,
        table: [],
        selected_perfil: null,
        selected_color: null,
        selected_codigo: null,
        pieza_new: {},
        perfil_new: {
          perfil: null,
          color: null,
          piezas: []
        },
        selected_new_perfil: false,
        selected_menu: "registro",
        perfiles: [{id:1, nombre:"Riel"}, {id:2, nombre:"Jamba"}, {id:3, nombre:"Cerco chapa"}, {id:4, nombre:"Traslape"}, {id:5, nombre:"Cabezal/zoclo"}, {id:6, nombre:"Intermedio"}]
    },
    methods: {
      select_menu(id) {
        this.selected_menu = id;
      },
      iniciar_nuevo_perfil() {
        
        this.perfil_new = {
          perfil: null,
          color: null,
          piezas: []
        }
        this.selected_new_perfil=true
      },
      nueva_pieza(perfil) {
        if(perfil.perfil == this.selected_perfil && perfil.color == this.selected_color) {
          this.selected_perfil = null;
          this.selected_color = null;
        } else {
          this.selected_perfil = perfil.perfil;
          this.selected_color = perfil.color;
          this.pieza_new = {
            pieza: null,
            id: null,
            descripcion: null,
            unidadMedida: "pieza",
            longitud: 610,
            codigo: "",
            precioUnitario: null,
            fechaActualizacion: this.get_fecha_hoy(),
            categoria: "perfil"
          }
        }
      },
      find_pieza_id(pieza){
        for (const element of this.perfiles) {
          console.log(element.nombre);
          if(element.nombre == pieza) {
            return element.id;
          }
        }
      },
      enable_pieza_new() {
        // check if all elements are not null
        if(this.pieza_new.pieza != null &&  this.pieza_new.descripcion != null && this.pieza_new.unidadMedida != null && this.pieza_new.precioUnitario != null && this.pieza_new.categoria != null) {
          return true;
        }
        return false;
      },
      eliminar_pieza(perfil, pieza) {
        for(const element of this.info) {
          if(element.perfil == perfil.perfil && element.color == perfil.color) {
            element.piezas.splice(element.piezas.indexOf(pieza), 1);
            this.update_info();
            this.selected_perfil = null;
            this.selected_color = null;
          }
        }
      },
      eliminar_perfil(perfil) {
        //ask for confirmation
        if(!confirm("¿Está seguro que desea eliminar el perfil " + perfil.perfil + " " + perfil.color + "?")) {
          return;
        }
        this.info.splice(this.info.indexOf(perfil), 1);
        this.update_info();
        this.pieza_new = {};
        this.selected_perfil = null;
        this.selected_color = null;
      },
      cancelar_nueva_pieza(){
        this.selected_perfil = null;
        this.selected_color = null;
      },
      guardar_nueva_pieza() {
        if(this.selected_perfil == this.perfil_new.perfil && this.selected_color == this.perfil_new.color) {
          this.perfil_new.piezas.push(this.pieza_new);
          this.info.push(this.perfil_new);
          this.update_info();
          this.selected_perfil = null;
          this.selected_color = null;
          this.selected_new_perfil = false;
        }

        //find the perfil and color
        for(const element of this.info) {
          if(element.perfil == this.selected_perfil && element.color == this.selected_color) {
            this.pieza_new.id = this.find_pieza_id(this.pieza_new.pieza);
            element.piezas.push(this.pieza_new);
            this.update_info();
            this.selected_perfil = null;
            this.selected_color = null;
          }
        }
      },
      get_fecha_hoy() {
        var today = new Date();
        var year = today.getFullYear();
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var day = String(today.getDate()).padStart(2, '0');

        return formattedDate = year + '-' + month + '-' + day;
      },
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
          this.update_info();
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

      update_info() {
        console.log("updating info...");
        let url = "https://aluminio.onrender.com/update-info/"
        fetch(url, {
          method: "POST",
          mode: "cors", // no-cors, *cors, same-origin         
          body: JSON.stringify(this.info),
          headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': 'GET, POST',
            "Connection": "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
            "Access-Control-Request-Headers": "X-PINGOTHER, Content-Type",
          },
          
        })
        .then(response => response.json())
        .then(data => {});
        
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
    },
    watch: {
    }
})


     