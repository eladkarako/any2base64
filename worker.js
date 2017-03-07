/* Worker 
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░*/

function read_file(file){
  var  file_reader   = new FileReader();

  file_reader.onloadstart = function(ev){ self.postMessage({"message_reason":"read_event_loadstart",  "file":file,                                                                                                 });  };
  file_reader.onprogress  = function(ev){ self.postMessage({"message_reason":"read_event_progress",   "file":file,                                       "loaded":ev.loaded,  "total":ev.total                     });  };
  file_reader.onerror     = function(ev){ self.postMessage({"message_reason":"read_event_error",      "file":file,                                       "loaded":ev.loaded,  "total":ev.total,  "error":ev.error  });  };
  file_reader.onload      = function(ev){ self.postMessage({"message_reason":"read_event_load",       "file":file,  "result": btoa(file_reader.result),  "loaded":ev.loaded,  "total":ev.total                     });  };

  file_reader.readAsBinaryString(file);
}

self.onmessage = function(message){
  if("undefined" === typeof message.data.message_reason)                                   return;
  if("read_file" === message.data.message_reason && "object" !== typeof message.data.file) return;
  
  if("read_file" === message.data.message_reason) read_file(message.data.file);
};

