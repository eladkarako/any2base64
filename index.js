/* Main 
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░*/

(function(window){                                                                       "use strict";
  window.FileList.prototype.forEach = window.NodeList.prototype.forEach = window.Array.prototype.forEach;
}(self));

(function(window, document, human_readable_bytes_size, uploader, placer, index, worker){ "use strict";

  uploader.onchange = function(){

    uploader.files.forEach(function(file){
      var div, textarea, type;

      index+=1;
      type = get_type(file);

      div = document.createElement("div")
      div.innerHTML = '<label for="#IDTEXT#">#INDEX#. &nbsp; #FNAME# <sup>(#TYPE#)</sup> &nbsp; [#FSIZE#]</label><textarea id="#IDTEXT#" readonly placeholder="#PLACEHOLDER#"></textarea>'
                        .replace(/#IDTEXT#/g,       "text_" + index                      )
                        .replace(/#INDEX#/g,        String(index)                        )
                        .replace(/#FNAME#/g,        file.name                            )
                        .replace(/#TYPE#/g,         type                                 )
                        .replace(/#FSIZE#/g,        human_readable_bytes_size(file.size) )
                        .replace(/#PLACEHOLDER#/g,  "data:" + type + ";base64," )
                        ;
      placer.appendChild(div);
      textarea = div.querySelector("textarea");


      worker = new Worker("worker.js");
      worker.onmessage = function(message){
        console.log(message);
        if("read_event_loadstart" === message.data.message_reason){
          textarea.value = "(..in progress..)";
        }else
        if("read_event_progress"  === message.data.message_reason){
            textarea.value = "(..in progress..[" + ((message.data.loaded/message.data.total)*100) + "%]..)";
        }else
        if("read_event_error"     === message.data.message_reason){
          textarea.value = "ERROR!";

          setTimeout(function(){  worker = null; }, 50); //cleanup
        }else
        if("read_event_load"      === message.data.message_reason){
          textarea.value = "(..wait...updating large textual-content..)";
          setTimeout(function(){
            textarea.value = "data:" + type + ";base64," + message.data.result;

            setTimeout(function(){  worker = null; }, 50); //cleanup
          },50);
        }
      };
      worker.postMessage({"message_reason":"read_file", "file":file});
    });
  };

  
}(
  /* window                     */   self
 ,/* document                   */   self.document
 ,/* human_readable_bytes_size  */   function(bytes, digits, sap, is_comma_sap, is_smaller_factor){  "use strict";
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
 ,/* uploader                   */   self.document.querySelector('[id="uploader"]')
 ,/* placer                     */   self.document.querySelector("[placer]")
 ,/* index                      */   0
 ,/* worker                     */   null
));


document.querySelector('[id="uploader"]' ).removeAttribute("disabled");
document.querySelector('[for="uploader"]').title = "ready...";