/* Main 
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░*/

(function(window, document, index, uploader, placer, worker){ "use strict";
  FileList.prototype.forEach = NodeList.prototype.forEach = Array.prototype.forEach;

  function human_readable_bytes_size(bytes, digits, sap, is_comma_sap, is_smaller_factor) {  "use strict";
    digits            = "number"  === typeof digits             ? digits             :  2;
    sap               = "string"  === typeof sap                ? sap                : "";
    is_comma_sap      = "boolean" === typeof is_comma_sap       ? is_comma_sap       : true;
    is_smaller_factor = "boolean" === typeof is_smaller_factor  ? is_smaller_factor  : true;

    var  size = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
       , factor = Math.floor(  (String(bytes).length - 1) / 3  )
       ;

    if(true === is_smaller_factor && factor > 0) factor-=1;  //more verbose to use a one mesurement less than maximum (1gb -> 1,024.00mb)

    bytes = bytes / Math.pow(1024, factor);  //calc
    bytes = Math.floor(bytes * Math.pow(10, digits)) / Math.pow(10, digits);  //round digits
    
    if(true === is_comma_sap){
      bytes = String(bytes).split(".");
      bytes[0] = bytes[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
      bytes = bytes.join(".");
    }

    return String(bytes) + sap + size[factor];
  }


  index    = 0;

  uploader.onchange = function(){

    uploader.files.forEach(function(file){
      var div, textarea;
      index+=1;
      div = document.createElement("div")
      div.innerHTML = '<label for="#IDTEXT#">#INDEX#. #FNAME# [#FSIZE#]</label><textarea id="#IDTEXT#" readonly placeholder="#PLACEHOLDER#"></textarea>'
                        .replace(/#IDTEXT#/g,       "text_" + index                      )
                        .replace(/#INDEX#/g,        String(index)                        )
                        .replace(/#FNAME#/g,        file.name                            )
                        .replace(/#FSIZE#/g,        human_readable_bytes_size(file.size) )
                        .replace(/#PLACEHOLDER#/g,  "data:" + ("" === file.type ? "application/octet-stream" : file.type) + ";base64," )
                        ;
      placer.appendChild(div);
      textarea = div.querySelector("textarea");


      worker = new Worker("worker.js");
      worker.onmessage = function(message){
        console.log(message);
        if("read_event_loadstart" === message.data.message_reason){
          textarea.placeholder = "data:" + message.data.type + ";base64," //more accurate type.
          textarea.value = "(..in progress..)";
        }else
        if("read_event_progress"  === message.data.message_reason){
            textarea.value = "(..in progress..[" + ((message.data.loaded/message.data.total)*100) + "%]..)";
        }else
        if("read_event_error"     === message.data.message_reason){
          textarea.value = "ERROR!";
        }else
        if("read_event_load"      === message.data.message_reason){
          textarea.value = "(..wait...updating large textual-content..)";
          setTimeout(function(){
            textarea.value = "data:" + message.data.type + ";base64," + message.data.result;
          },150);
        }
      };
      worker.postMessage({"message_reason":"read_file", "file":file});
    });
  };

  
}(
  self
 ,self.document
 ,null
 ,self.document.querySelector('[id="uploader"]')
 ,self.document.querySelector("[placer]")
 ,null
));
