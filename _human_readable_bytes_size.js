function human_readable_bytes_size(bytes, digits, sap, is_comma_sap) {  "use strict";
  digits       = "number"  === typeof digits        ? digits         :  2;
  sap          = "string"  === typeof sap           ? sap            : "";
  is_comma_sap = "boolean" === typeof is_comma_sap  ? is_comma_sap   : false;

  var  size = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
     , factor = Math.floor(  (String(bytes).length - 1) / 3  )
     ;

  bytes = bytes / Math.pow(1024, factor);  //calc
  bytes = Math.floor(bytes * Math.pow(10, digits)) / Math.pow(10, digits);  //round digits
  
  if(true === is_comma_sap){
    bytes = String(bytes).split(".");
    bytes[0] = bytes[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    bytes = bytes.join(".");
  }

  return String(bytes) + sap + size[factor];
}
