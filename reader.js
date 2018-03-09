"use strict";

function enc(buffer){ //this converts the file_reader.result to base64. The input and output is an ArrayBuffer.
  var tmp;
  
  tmp = (new TextDecoder("utf-8")).decode(buffer); //to UTF-8 text.
  tmp = unescape(encodeURIComponent(tmp));         //to binary-string.
  tmp = btoa(tmp);                                 //BASE64.
  tmp = (new TextEncoder("utf-8")).encode(tmp);    //to Uint8Array.
  tmp = tmp.buffer;                                //to ArrayBuffer.

  return tmp;
}


self.onmessage = function(message){                           //happens once per-file.
  var file_reader, message;

  if("read_file" !== message.data.reason) return;     //
  if("object"    !== typeof message.data.file)    return;     //

  file_reader = new FileReader();
  file_reader.onloadstart = function(ev){self.postMessage({"reason":"read_event_loadstart", /*"file":message.data.file,*/ "result":undefined, "loaded":undefined, "total":undefined, "error":undefined}           ); };
  file_reader.onprogress  = function(ev){self.postMessage({"reason":"read_event_progress",  /*"file":message.data.file,*/ "result":undefined, "loaded":ev.loaded, "total":ev.total,  "error":undefined}           ); };
  file_reader.onerror     = function(ev){self.postMessage({"reason":"read_event_error",     /*"file":message.data.file,*/ "result":undefined, "loaded":ev.loaded, "total":ev.total,  "error":ev.error }           ); };
  file_reader.onload      = function(ev){var result = enc(file_reader.result);
                                         self.postMessage({"reason":"read_event_load",      /*"file":message.data.file,*/ "result":result,    "loaded":ev.loaded, "total":ev.total,  "error":undefined}, [result] ); }; //result (which is an ArrayBuffer is just "marked" in the message, but actually passed 'as is' from the Worker-context to the client, without cloning the data.

  file_reader.readAsArrayBuffer(message.data.file);
};


//----------------------------------------------------------------


//worker.
//  reads a file, BASE64-encoded it and return it as an ArrayBuffer.
//  incoming message passes the 'File'-structure from the <input type="file">
//  the content is converted from raw-ArrayBuffer to UTF-8 text using 'TextDecoder',
//  converted to binary-string using the unescape/encodeURIComponent trick and converted to Base64 using btoa,
//  it then converted back to ArrayBuffer.
//  The ArrayBuffer class is a 'Transferable' object.
//  The result is passed back to the client (in there the ArrayBuffer is transfered to back to text).
//
//  improvements:
//  - using readAsArrayBuffer instead of using readAsBinaryText.
//  - using a 'Transferable' result to avoid data-cloning.
//  needed to check:
//  - what happens when reading binary-files using 'TextDecoder("utf-8")'?
//
//  Communication:
//    - incoming single message ("read").
//    - outgoing: "start", "progress", "load"
//             or "start", "progress", "error"      - error during read-out)
//             or "start", "error"                  - error before reading started)
//             or "error".                          - error before accessing content - maybe file-system related (locked file)
//
//  API used:
//    FileReader, ArrayBuffer, TextDecoder, TextEncoder, Uint8Array, btoa, postMessage.
//    postMessage uses a 'Transferable'-ArrayBuffer which won't work in Internet-Explorer (F**k it!).
//