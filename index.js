/* Main 
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░*/

FileList.prototype.forEach = NodeList.prototype.forEach = Array.prototype.forEach;

(function(window, document, uploader
    /*UI Crap ->>>*/, read_loadstart, read_progress, read_error, read_complete, read_default
                                                                                              ){ "use strict";
    /*LOGIC Crap ->>>*/
  uploader = document.querySelector("#uploader");

  uploader.addEventListener("change", function change_handler(){
    uploader.setAttribute("data-files", (uploader.files.length || 0));

    if(0 === uploader.files.length) return;
    
    uploader.files.forEach(function(file){
      var worker = new Worker("worker.js");
      worker.addEventListener("message", function message_handler(message){
        if("string" !== typeof message.data.message_reason) return;
        
        console.log(message.data);
        switch (message.data.message_reason) {
          "read_event_loadstart": read_loadstart( message.data.file                                                                                  ); break;
          "read_event_progress":  read_progress(  message.data.file, message.data.result, message.data.loaded, message.data.total                    ); break;
          "read_event_error":     read_error(     message.data.file, message.data.result, message.data.loaded, message.data.total, message.data.error); break;
          "read_event_complete":  read_complete(  message.data.file, message.data.result, message.data.loaded, message.data.total                    ); break;
          default:                read_default(   message.data                                                                                       ); break;
        }
      },{capture:false, passive:true});
      worker.postMessage({"message_reason":"read_file", "file":file});
    });
  }, {capture:false, passive:true});

}(
 self
,self.document
,
 function read_loadstart(file){
   var placer = document.querySelector("[placer]");
   var div    = document.createElement("div");
   div.innerHTML = 
 }
));

  placer   = document.querySelector("[placer]");