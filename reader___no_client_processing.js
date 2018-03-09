"use strict";

function enc(buffer){
  var tmp;
  
  tmp = (new TextDecoder("utf-8")).decode(buffer); //to UTF-8 text.
  tmp = unescape(encodeURIComponent(tmp));         //to binary-string.
  tmp = btoa(tmp);                                 //BASE64.
//tmp = (new TextEncoder("utf-8")).encode(tmp);    //to Uint8Array.
//tmp = tmp.buffer;                                //to ArrayBuffer.

  return tmp;
}


self.onmessage = function(message){                           //happens once per-file.
  var file_reader, message;

  if("read_file" !== message.data.reason) return;     //
  if("object"    !== typeof message.data.file)    return;     //

  file_reader = new FileReader();
  file_reader.onloadstart = function(ev){self.postMessage({"reason":"read_event_loadstart", /*"file":message.data.file,*/ "result":undefined, "loaded":undefined, "total":undefined, "error":undefined}               ); };
  file_reader.onprogress  = function(ev){self.postMessage({"reason":"read_event_progress",  /*"file":message.data.file,*/ "result":undefined, "loaded":ev.loaded, "total":ev.total,  "error":undefined}               ); };
  file_reader.onerror     = function(ev){self.postMessage({"reason":"read_event_error",     /*"file":message.data.file,*/ "result":undefined, "loaded":ev.loaded, "total":ev.total,  "error":ev.error }               ); };
  file_reader.onload      = function(ev){var result = enc(file_reader.result);
                                         self.postMessage({"reason":"read_event_load",      /*"file":message.data.file,*/ "result":result,    "loaded":ev.loaded, "total":ev.total,  "error":undefined}/*, [result]*/ ); };

  file_reader.readAsArrayBuffer(message.data.file);
};


//----------------------------------------------------------------


//worker.
//  reads a file, BASE64-encoded it, sends it back to client.
