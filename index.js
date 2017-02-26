/* Main 
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░*/

(function(window, document, uploader, placer, worker){ "use strict";
  FileList.prototype.forEach = NodeList.prototype.forEach = Array.prototype.forEach;

  uploader.onchange = function(){
    
    uploader.files.forEach(function(file){
      worker = new Worker("worker.js");

      worker.onmessage = function(message){
        console.log(message);

        if("read_event_loadstart" === message.data.message_reason){}
        if("read_event_progress"  === message.data.message_reason){}
        if("read_event_load"      === message.data.message_reason){
          placer.innerHTML += "<hr/><textarea readonly>" 
                                      + "data:" + message.data.type + ";" 
                                    //+ "charset:UTF-8" + ";"
                                      + "base64," + message.data.result
                                  + "</textarea>";
        }
      };

      worker.postMessage({"message_reason":"read_file", "file":file});
    });
  };

  
}(
  self
 ,self.document
 ,self.document.querySelector('[id="uploader"]')
 ,self.document.querySelector("[placer]")
 ,null
));
