/* Worker 
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░*/
function read_file(file){
  var file_reader = new FileReader();
 
  file_reader.addEventListener("loadstart", function loadstart_handler(ev){ self.postMessage({"message_reason":"read_event_loadstart",  "file":file                                                                                       });  },{capture:false, passive:true});
  file_reader.addEventListener("progress",  function progress_handler(ev){  self.postMessage({"message_reason":"read_event_progress",   "file":file, "result":file_reader.result, "loaded":ev.loaded, "total":ev.total                    });  },{capture:false, passive:true});
  file_reader.addEventListener("error",     function progress_handler(ev){  self.postMessage({"message_reason":"read_event_error",      "file":file, "result":file_reader.result, "loaded":ev.loaded, "total":ev.total, "error":ev.error  });  },{capture:false, passive:true});
  file_reader.addEventListener("load",      function progress_handler(ev){  self.postMessage({"message_reason":"read_event_complete",   "file":file, "result":file_reader.result, "loaded":ev.loaded, "total":ev.total                    });  },{capture:false, passive:true});

  file_reader.readAsArrayBuffer(file);
}

self.addEventListener("message", function message_handler(message){
  if("undefined" === typeof message.data.message_reason)                                   return;
  if("read_file" === message.data.message_reason && "object" !== typeof message.data.file) return;
  
  if("read_file" === message.data.message_reason) read_file(message.data.file);
},{capture:false, passive:true});

