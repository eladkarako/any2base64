function human_readable_bytes_size(bytes, decimals, sap) {  "use strict";
  decimals = "number" === typeof decimals ? decimals : 2;
  sap = "string" === typeof sap ? sap : "";

  var  size = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
     , factor = Math.floor(  (String(bytes).length - 1) / 3  )
     ;

  bytes = bytes / Math.pow(1024, factor);  //calc
  bytes = Math.floor(bytes * Math.pow(10, decimals)) / Math.pow(10, decimals);  //round digits

  return String(bytes) + sap + size[factor];
}
