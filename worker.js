/* Worker 
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░*/

self.importScripts('_array_buffer_to_binary_string.js');
self.importScripts('_binary_string_to_base64.js');
self.importScripts('_file_extension_to_mime_type.js');

function read_file(file){
  var  file_reader   = new FileReader()
      ,type          = get_type(file)
      ;

  file_reader.onloadstart = function(ev){ self.postMessage({"message_reason":"read_event_loadstart",  "file":file,  "type": type,                                                                                                                          });  };
  file_reader.onprogress  = function(ev){ self.postMessage({"message_reason":"read_event_progress",   "file":file,  "type": type,                                                                "loaded":ev.loaded,  "total":ev.total                     });  };
  file_reader.onerror     = function(ev){ self.postMessage({"message_reason":"read_event_error",      "file":file,  "type": type,                                                                "loaded":ev.loaded,  "total":ev.total,  "error":ev.error  });  };
  file_reader.onload      = function(ev){ self.postMessage({"message_reason":"read_event_load",       "file":file,  "type": type,  "result": file_reader.result.to_binary_string().to_base64(),  "loaded":ev.loaded,  "total":ev.total                     });  };

  file_reader.readAsArrayBuffer(file);
}

self.onmessage = function(message){
  if("undefined" === typeof message.data.message_reason)                                   return;
  if("read_file" === message.data.message_reason && "object" !== typeof message.data.file) return;
  
  if("read_file" === message.data.message_reason) read_file(message.data.file);
};

