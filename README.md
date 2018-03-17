<h1><img height="64" width="64" src="_res/favicon.png"> <a href="http://eladkarako.com/base64/">base64</a>- &nbsp; &nbsp; <a href="https://paypal.me/e1adkarak0" ok><img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" alt="PayPal Donation" ok></a></h1>

<h2>A Good Example On How To Use HTML5's Background Running <strong>Web-Worker</strong><br/>With Messaging, Async-FileReader and a Clone-less Object Context-Transferring From a Web-Worker to Main-Thread.</h2>

<ul>
  <li>No type limit!                                           <sub>(<em>Yes, <code>exe</code>, <code>swf</code>, <code>webm</code>,... too!</em>)                </sub></li>
  <li>No size limit!                                           <sub>(<em>Works best w/ files &lt;5MB</em>)                                                        </sub></li>
  <li><strong>No upload.</strong> Everything is on your PC!    <sub>(Private, secure &amp fast!)                                                                  </sub></li>
  <li>Convert multiple-files simultaneously!                   <sub>(Full use of multi-core CPUs!)                                                                </sub></li>
  <li>Base64 with an accurate-mimetype.                        <sub>(Identifies over 640 file-extensions!)                                                        </sub></li>
  <li>Low RAM usage.                                           <sub>(Data will just "switch-context" from worker to main-thread. No cloning!                      </sub></li>
  <li>Full <strong>Unicode support</strong>.                   <sub>(Text-based content will be rendered correctly, even w/o adding <code>;charset:utf8,</code>!) </sub></li>
</ul>

<h1>Visit: <a href="http://eladkarako.com/base64/">eladkarako.com/base64</a></h1>

<img src="_res/screenshot_1.png" alt="" />

<img src="_res/screenshot_2.png" alt="" />


Known issues:
<ol>
  <li>UI will still get stuck! <em>(sometimes..)</em><br/>
      Not while converting... but after: when the UI needs to get a &lt;textarea&gt; with the data (as a text) presented.<br/>
      Possible improvements are:<br/>
      Using a static-container for the text (instead of a &lt;textarea&gt;).<br/>
      Keeping the element hidden (<code>display:none;</code>) until added to the DOM (DOMNodeInsertedIntoDocument Mutation event). Can't avoid the reflow.<br/>
      or.. <strong>Simply stick to converting files&lt;5MB..</strong>.
  </li>
  <li>Base64-encoded SVGs won't work on most-browsers.<br/>
      <strong>This has nothing to do with this project.</strong><br/>
      To embed a SVG, simply minified it (remove new-lines, spaces, etc...), <code>escape</code> it and use it "as is"<br/>
      optionally add the <code>data:image/svg;,.....</code>-prefix explicitly (w/o the <code>";base64"</code> part).
  </li>
</ol>

<hr/>

<h3>See <a href="https://github.com/eladkarako/ConsoleBase64/">github.com/eladkarako/ConsoleBase64</a><br/>for a more "workable"/"streamline" solution.</h3>
