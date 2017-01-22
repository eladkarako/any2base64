/* Main 
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░*/

FileList.prototype.forEach = NodeList.prototype.forEach = Array.prototype.forEach;

(function(window, document, uploader){ "use strict";
  uploader = document.querySelector("#uploader");

  uploader.addEventListener("change", function change_handler(){
    uploader.setAttribute("data-files", (uploader.files.length || 0));

    if(0 === uploader.files.length) return;
    
    uploader.files.forEach(function(file){
      var worker = new Worker("worker.js");
      worker.addEventListener("message", function message_handler(message){
        if("undefined" === typeof message.data.message_reason) return;
        
        switch (message.data.message_reason) {
          "read_event_start":       console.log(message.data); break;
          "read_event_progress":    console.log(message.data); break;
          "read_event_error":       console.log(message.data); break;
          "read_event_complete":    console.log(message.data); break;
          default:                  console.log(message.data);
        }
      },{capture:false, passive:true});
      worker.postMessage({"message_reason":"read_file", "file":file});
    });
  }, {capture:false, passive:true});

}(
 self
,self.document
));
