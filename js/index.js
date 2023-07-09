
var app = new Vue({
    el: '#app',
    data: {
        info: null,
        table: [],
    },
    methods: {
      make_pieces_optimization(perfil, piezas) {
        let longitud = perfil.longitud;
        // axios("https://aluminio.onrender.com/optimal-partition/", {
        //   method: "GET",
        //   mode: "no-cors",
        //   params: {
        //     size: longitud,
        //     pieces: piezas,
        //   },
        //   headers: {
        //     // "Access-Control-Allow-Origin": "*",
        //     "Content-Type": "application/json",
        //   },
        //   // mode: "no-cors",
        // })
        // .then(function (response) {console.log(response.data);});
        let url = "https://aluminio.onrender.com/optimal-partition/?"+ new URLSearchParams({
          size: longitud,
          pieces: piezas,
          });
          console.log(url);
        fetch(url, {
          
          mode: "cors", // no-cors, *cors, same-origin         
          
          headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "POST, GET, PUT",
            "Access-Control-Allow-Headers": "origin, x-requested-with",
            "Origin": 'http://127.0.0.1:5501',
            "Access-Control-Max-Age": 86400,
            "Connection": "keep-alive",
            
            "Access-Control-Allow-Credentials" : false ,
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          
        })
        .then(response => console.log(response))
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
    
            axios.get("https://aluminio.onrender.com/read-info/", config = {headers : {            
            "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, PUT, PATCH, GET, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
        }})
              .then(function (response) {
                let rsp = response.data;
                app.info = rsp;
              })
              .catch(function (error) {
    
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  app.error = "Error " + error.response.status + ": " + error.response.data.message;
    
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  app.error = 'Error: ' + error.request;
                } else {
                  // Something happened in setting up the request that triggered an Error
                  app.error = 'Error: ' + error.message;
                }
    
                app.loading = false;
              });
            },

        text2obj: function (text) {
            arr = text.split('\n'); 
            var jsonObj = [];
            var headers = arr[0].split(',');
            for(var i = 1; i < arr.length; i++) {
              var data = arr[i].split(',');
              var obj = {};
              for(var j = 0; j < data.length; j++) {
                 obj[headers[j].trim()] = data[j].trim();
              }
              jsonObj.push(obj);
            }
            return jsonObj;
        },
        convert_info_to_csv_string: function () {
            headers = Object.keys(this.info[0]).join(',');
            csv_string = headers + '\n';
            this.info.forEach(function (item) {
                csv_string += Object.values(item).join(',') + '\n';
            })
            return csv_string;
        },
        download_csv: function () {
            csvContent = "data:text/csv;charset=utf-8,"  + this.convert_info_to_csv_string();
            var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
        }

    },
    mounted() {
      this.get_prices();
    }
})
const myForm = document.getElementById("myForm");
      const csvFile = document.getElementById("csvFile");
      myForm.addEventListener("submit", function (e) {
         e.preventDefault();
         const input = csvFile.files[0];
         const reader = new FileReader();
         reader.onload = function (e) {
            const text = e.target.result;
            app.info = app.text2obj(text);
         };
         reader.readAsText(input);
      });

     