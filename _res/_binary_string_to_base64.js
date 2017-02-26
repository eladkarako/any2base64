function binary_string_to_base64(str){
  if("function" === typeof btoa) return btoa(str);

  var   b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
       ,o1, o2, o3
       ,h1, h2, h3, h4
       ,bits
       ,i  = 0
       ,ac = 0
       ,enc = ''
       ,tmpArr = []
       ,r
       ;

  do {
    o1            = str.charCodeAt(i++); // pack three octets into four hexets
    o2            = str.charCodeAt(i++);
    o3            = str.charCodeAt(i++);
    bits          = o1 << 16 | o2 << 8 | o3;
    h1            = bits >> 18 & 0x3f;
    h2            = bits >> 12 & 0x3f;
    h3            = bits >> 6 & 0x3f;
    h4            = bits & 0x3f;
    tmpArr[ac++]  = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4); // use hexets to index into b64, and append result to encoded string
  } while (i < str.length);
  
  enc = tmpArr.join('');
  r   = str.length % 3;
  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}

String.prototype.to_base64 = function(){
  try{
    return binary_string_to_base64(this);
  }catch(err){
    return binary_string_to_base64(  unescape(encodeURIComponent(this))  );
  }
}