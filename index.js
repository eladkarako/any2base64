"use strict";

NodeList.prototype.forEach = Array.prototype.forEach;
FileList.prototype.forEach = Array.prototype.forEach;


const TEMPLATE = '<label for="#IDTEXT#">#INDEX#. &nbsp; #FNAME# <sup>(#TYPE#)</sup> &nbsp; [#FSIZE#]</label><textarea id="#IDTEXT#" readonly placeholder="#PLACEHOLDER#"></textarea>'
     ,uploader = document.querySelector('[id="uploader"]')
     ,up_title = document.querySelector('[for="uploader"]')
     ,placer   = self.document.querySelector("[placer]")
     ,text_dec = new TextDecoder("utf-8");
     ;


var   index    = 0;


function human_readable_bytes_size(bytes){  //(simplified version)
  var description = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
     ,factor      = Math.floor(  (String(bytes).length - 1) / 3  )
     ;
  bytes = bytes / Math.pow(1024, factor);   //calc
  bytes = Math.floor(bytes * 100) / 100;    //round digits
  return String(bytes) + description[factor];
}


function file_handler(file){
  var type     = get_type(file)
     ,div      = document.createElement("div")
     ,textarea
     ,reader   = new Worker("reader.js")
     ;

  index+=1;

  div.innerHTML = TEMPLATE.replace(/#IDTEXT#/g,      "text_" + index                           )
                          .replace(/#INDEX#/g,       String(index)                             )
                          .replace(/#FNAME#/g,       file.name                                 )
                          .replace(/#TYPE#/g,        type                                      )
                          .replace(/#FSIZE#/g,       human_readable_bytes_size(file.size)      )
                          .replace(/#PLACEHOLDER#/g, "data:" + type + ";base64,..processing.." )
                          ;
  placer.appendChild(div);
  textarea = div.querySelector("textarea");

  function message_handler(message){
    switch(message.data.reason){
      case "read_event_loadstart":  textarea.value = "(in progress..)";                                                                                                  break;
      case "read_event_progress":   textarea.value = "(in progress..[" + Math.trunc(message.data.loaded/message.data.total*100) + "%]..)";                               break;
      case "read_event_error":      textarea.value = "Error!";                                                                                                           break;
      case "read_event_load":       textarea.value = "(updating...)";  textarea.value = "data:" + type + ";base64," + text_dec.decode(message.data.result);              break;
      default:                      textarea.value = "You Should Not See This.. Error?!?!";
    }
  }

  reader.onmessage = message_handler;
  reader.onerror   = function(ev){console.error(ev); reader = null;};

  reader.postMessage({"reason":"read_file", "file":file});
}


uploader.onchange = function(){ uploader.files.forEach(file_handler); };
uploader.removeAttribute("disabled");
up_title.title = "ready...";
document.querySelector("body").removeAttribute("noscript");