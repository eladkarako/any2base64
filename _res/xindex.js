
/*
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */

    FileList.prototype.forEach = NodeList.prototype.forEach = Array.prototype.forEach;
    addEventListener("mouseover",  over_focusin, {passive:true});


    var uploader = document.querySelector("#uploader");
    var placer   = document.querySelector("[placer]");
    var index    = 0;

    document.querySelector("#uploader")
    uploader.onchange = function(ev){
                          uploader.files.forEach(function(file){
                            var div, textarea, file_reader;

                            div = document.createElement("div");
                            div.innerHTML = '<label for="#IDTEXT#">#INDEX#. #FNAME# [#FSIZE#]</label><textarea id="#IDTEXT#" readonly placeholder="#PLACEHOLDER#"></textarea>'
                                              .replace(/#IDTEXT#/g,       "text_" + index                      )
                                              .replace(/#INDEX#/g,        String(index+1)                      )
                                              .replace(/#FNAME#/g,        file.name                            )
                                              .replace(/#FSIZE#/g,        human_readable_bytes_size(file.size) )
                                              .replace(/#PLACEHOLDER#/g,  "data:" + ("" === file.type ? "application/octet-stream" : file.type) + ";base64," )
                                              ;
                            placer.appendChild(div);
                            textarea = div.querySelector("textarea");

                            file_reader = new FileReader();
                            file_reader.onload     = function(ev){ textarea.value = textarea.placeholder + btoa(file_reader.result); };
                            file_reader.onprogress = function(ev){
                                                       console.log(ev);
                                                     };
                            file_reader.readAsBinaryString(file);

                            index+=1;
                          });
                        };
/*]]>*/
  </script>
</body>
</html>