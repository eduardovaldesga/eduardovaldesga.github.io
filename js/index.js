
var app = new Vue({
    el: '#app',
    data: {
        info: null
    },
    methods: {
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