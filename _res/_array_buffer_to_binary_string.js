function array_buffer_to_binary_string(array_buffer){  //alternative to the direct 'readAsBinaryString', which is not standardised in Internet-Explorer... :/
  if(array_buffer.byteLength < 500) return String.fromCharCode.apply(String, new Uint8Array(array_buffer));  //should be enough..
  /*---*/
  var  array    = new Uint8Array(array_buffer)         //if there are more-than 500 bytes, we need to prevent overflow in `String.fromCharCode` stack, so we will process the information in chunks.......
     , length   = array.length
     , cache    = []
     , addition = 500
     , i
     ;
  
  for(i=0; i<array.length; i += addition){
    if(i + addition > length){
      addition = length - i;
    }
    cache.push(  String.fromCharCode.apply(null, array.subarray(i, i + addition))  );
  }
  cache = cache.join("");
  return cache;
}


ArrayBuffer.prototype.to_binary_string = function(){  return array_buffer_to_binary_string(this);  };

