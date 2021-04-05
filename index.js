var URI=function(){function parse(uriStr){var m=(""+uriStr).match(URI_RE_);if(!m){return null}return new URI(nullIfAbsent(m[1]),nullIfAbsent(m[2]),nullIfAbsent(m[3]),nullIfAbsent(m[4]),nullIfAbsent(m[5]),nullIfAbsent(m[6]),nullIfAbsent(m[7]))}function create(scheme,credentials,domain,port,path,query,fragment){var uri=new URI(encodeIfExists2(scheme,URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_),encodeIfExists2(credentials,URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_),encodeIfExists(domain),port>0?port.toString():null,encodeIfExists2(path,URI_DISALLOWED_IN_PATH_),null,encodeIfExists(fragment));if(query){if("string"===typeof query){uri.setRawQuery(query.replace(/[^?&=0-9A-Za-z_\-~.%]/g,encodeOne))}else{uri.setAllParameters(query)}}return uri}function encodeIfExists(unescapedPart){if("string"==typeof unescapedPart){return encodeURIComponent(unescapedPart)}return null}function encodeIfExists2(unescapedPart,extra){if("string"==typeof unescapedPart){return encodeURI(unescapedPart).replace(extra,encodeOne)}return null}function encodeOne(ch){var n=ch.charCodeAt(0);return"%"+"0123456789ABCDEF".charAt(n>>4&15)+"0123456789ABCDEF".charAt(n&15)}function normPath(path){return path.replace(/(^|\/)\.(?:\/|$)/g,"$1").replace(/\/{2,}/g,"/")}var PARENT_DIRECTORY_HANDLER=new RegExp(""+"(/|^)"+"(?:[^./][^/]*|\\.{2,}(?:[^./][^/]*)|\\.{3,}[^/]*)"+"/\\.\\.(?:/|$)");var PARENT_DIRECTORY_HANDLER_RE=new RegExp(PARENT_DIRECTORY_HANDLER);var EXTRA_PARENT_PATHS_RE=/^(?:\.\.\/)*(?:\.\.$)?/;function collapse_dots(path){if(path===null){return null}var p=normPath(path);var r=PARENT_DIRECTORY_HANDLER_RE;for(var q;(q=p.replace(r,"$1"))!=p;p=q){}return p}function resolve(baseUri,relativeUri){var absoluteUri=baseUri.clone();var overridden=relativeUri.hasScheme();if(overridden){absoluteUri.setRawScheme(relativeUri.getRawScheme())}else{overridden=relativeUri.hasCredentials()}if(overridden){absoluteUri.setRawCredentials(relativeUri.getRawCredentials())}else{overridden=relativeUri.hasDomain()}if(overridden){absoluteUri.setRawDomain(relativeUri.getRawDomain())}else{overridden=relativeUri.hasPort()}var rawPath=relativeUri.getRawPath();var simplifiedPath=collapse_dots(rawPath);if(overridden){absoluteUri.setPort(relativeUri.getPort());simplifiedPath=simplifiedPath&&simplifiedPath.replace(EXTRA_PARENT_PATHS_RE,"")}else{overridden=!!rawPath;if(overridden){if(simplifiedPath.charCodeAt(0)!==47){var absRawPath=collapse_dots(absoluteUri.getRawPath()||"").replace(EXTRA_PARENT_PATHS_RE,"");var slash=absRawPath.lastIndexOf("/")+1;simplifiedPath=collapse_dots((slash?absRawPath.substring(0,slash):"")+collapse_dots(rawPath)).replace(EXTRA_PARENT_PATHS_RE,"")}}else{simplifiedPath=simplifiedPath&&simplifiedPath.replace(EXTRA_PARENT_PATHS_RE,"");if(simplifiedPath!==rawPath){absoluteUri.setRawPath(simplifiedPath)}}}if(overridden){absoluteUri.setRawPath(simplifiedPath)}else{overridden=relativeUri.hasQuery()}if(overridden){absoluteUri.setRawQuery(relativeUri.getRawQuery())}else{overridden=relativeUri.hasFragment()}if(overridden){absoluteUri.setRawFragment(relativeUri.getRawFragment())}return absoluteUri}function URI(rawScheme,rawCredentials,rawDomain,port,rawPath,rawQuery,rawFragment){this.scheme_=rawScheme;this.credentials_=rawCredentials;this.domain_=rawDomain;this.port_=port;this.path_=rawPath;this.query_=rawQuery;this.fragment_=rawFragment;this.paramCache_=null}URI.prototype.toString=function(){var out=[];if(null!==this.scheme_){out.push(this.scheme_,":")}if(null!==this.domain_){out.push("//");if(null!==this.credentials_){out.push(this.credentials_,"@")}out.push(this.domain_);if(null!==this.port_){out.push(":",this.port_.toString())}}if(null!==this.path_){out.push(this.path_)}if(null!==this.query_){out.push("?",this.query_)}if(null!==this.fragment_){out.push("#",this.fragment_)}return out.join("")};URI.prototype.clone=function(){return new URI(this.scheme_,this.credentials_,this.domain_,this.port_,this.path_,this.query_,this.fragment_)};URI.prototype.getScheme=function(){return this.scheme_&&decodeURIComponent(this.scheme_).toLowerCase()};URI.prototype.getRawScheme=function(){return this.scheme_};URI.prototype.setScheme=function(newScheme){this.scheme_=encodeIfExists2(newScheme,URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_);return this};URI.prototype.setRawScheme=function(newScheme){this.scheme_=newScheme?newScheme:null;return this};URI.prototype.hasScheme=function(){return null!==this.scheme_};URI.prototype.getCredentials=function(){return this.credentials_&&decodeURIComponent(this.credentials_)};URI.prototype.getRawCredentials=function(){return this.credentials_};URI.prototype.setCredentials=function(newCredentials){this.credentials_=encodeIfExists2(newCredentials,URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_);return this};URI.prototype.setRawCredentials=function(newCredentials){this.credentials_=newCredentials?newCredentials:null;return this};URI.prototype.hasCredentials=function(){return null!==this.credentials_};URI.prototype.getDomain=function(){return this.domain_&&decodeURIComponent(this.domain_)};URI.prototype.getRawDomain=function(){return this.domain_};URI.prototype.setDomain=function(newDomain){return this.setRawDomain(newDomain&&encodeURIComponent(newDomain))};URI.prototype.setRawDomain=function(newDomain){this.domain_=newDomain?newDomain:null;return this.setRawPath(this.path_)};URI.prototype.hasDomain=function(){return null!==this.domain_};URI.prototype.getPort=function(){return this.port_&&decodeURIComponent(this.port_)};URI.prototype.setPort=function(newPort){if(newPort){newPort=Number(newPort);if(newPort!==(newPort&65535)){throw new Error("Bad port number "+newPort)}this.port_=""+newPort}else{this.port_=null}return this};URI.prototype.hasPort=function(){return null!==this.port_};URI.prototype.getPath=function(){return this.path_&&decodeURIComponent(this.path_)};URI.prototype.getRawPath=function(){return this.path_};URI.prototype.setPath=function(newPath){return this.setRawPath(encodeIfExists2(newPath,URI_DISALLOWED_IN_PATH_))};URI.prototype.setRawPath=function(newPath){if(newPath){newPath=String(newPath);this.path_=!this.domain_||/^\//.test(newPath)?newPath:"/"+newPath}else{this.path_=null}return this};URI.prototype.hasPath=function(){return null!==this.path_};URI.prototype.getQuery=function(){return this.query_&&decodeURIComponent(this.query_).replace(/\+/g," ")};URI.prototype.getRawQuery=function(){return this.query_};URI.prototype.setQuery=function(newQuery){this.paramCache_=null;this.query_=encodeIfExists(newQuery);return this};URI.prototype.setRawQuery=function(newQuery){this.paramCache_=null;this.query_=newQuery?newQuery:null;return this};URI.prototype.hasQuery=function(){return null!==this.query_};URI.prototype.setAllParameters=function(params){if(typeof params==="object"){if(!(params instanceof Array)&&(params instanceof Object||Object.prototype.toString.call(params)!=="[object Array]")){var newParams=[];var i=-1;for(var k in params){var v=params[k];if("string"===typeof v){newParams[++i]=k;newParams[++i]=v}}params=newParams}}this.paramCache_=null;var queryBuf=[];var separator="";for(var j=0;j<params.length;){var k=params[j++];var v=params[j++];queryBuf.push(separator,encodeURIComponent(k.toString()));separator="&";if(v){queryBuf.push("=",encodeURIComponent(v.toString()))}}this.query_=queryBuf.join("");return this};URI.prototype.checkParameterCache_=function(){if(!this.paramCache_){var q=this.query_;if(!q){this.paramCache_=[]}else{var cgiParams=q.split(/[&\?]/);var out=[];var k=-1;for(var i=0;i<cgiParams.length;++i){var m=cgiParams[i].match(/^([^=]*)(?:=(.*))?$/);out[++k]=decodeURIComponent(m[1]).replace(/\+/g," ");out[++k]=decodeURIComponent(m[2]||"").replace(/\+/g," ")}this.paramCache_=out}}};URI.prototype.setParameterValues=function(key,values){if(typeof values==="string"){values=[values]}this.checkParameterCache_();var newValueIndex=0;var pc=this.paramCache_;var params=[];for(var i=0,k=0;i<pc.length;i+=2){if(key===pc[i]){if(newValueIndex<values.length){params.push(key,values[newValueIndex++])}}else{params.push(pc[i],pc[i+1])}}while(newValueIndex<values.length){params.push(key,values[newValueIndex++])}this.setAllParameters(params);return this};URI.prototype.removeParameter=function(key){return this.setParameterValues(key,[])};URI.prototype.getAllParameters=function(){this.checkParameterCache_();return this.paramCache_.slice(0,this.paramCache_.length)};URI.prototype.getParameterValues=function(paramNameUnescaped){this.checkParameterCache_();var values=[];for(var i=0;i<this.paramCache_.length;i+=2){if(paramNameUnescaped===this.paramCache_[i]){values.push(this.paramCache_[i+1])}}return values};URI.prototype.getParameterMap=function(paramNameUnescaped){this.checkParameterCache_();var paramMap={};for(var i=0;i<this.paramCache_.length;i+=2){var key=this.paramCache_[i++],value=this.paramCache_[i++];if(!(key in paramMap)){paramMap[key]=[value]}else{paramMap[key].push(value)}}return paramMap};URI.prototype.getParameterValue=function(paramNameUnescaped){this.checkParameterCache_();for(var i=0;i<this.paramCache_.length;i+=2){if(paramNameUnescaped===this.paramCache_[i]){return this.paramCache_[i+1]}}return null};URI.prototype.getFragment=function(){return this.fragment_&&decodeURIComponent(this.fragment_)};URI.prototype.getRawFragment=function(){return this.fragment_};URI.prototype.setFragment=function(newFragment){this.fragment_=newFragment?encodeURIComponent(newFragment):null;return this};URI.prototype.setRawFragment=function(newFragment){this.fragment_=newFragment?newFragment:null;return this};URI.prototype.hasFragment=function(){return null!==this.fragment_};function nullIfAbsent(matchPart){return"string"==typeof matchPart&&matchPart.length>0?matchPart:null}var URI_RE_=new RegExp("^"+"(?:"+"([^:/?#]+)"+":)?"+"(?://"+"(?:([^/?#]*)@)?"+"([^/?#:@]*)"+"(?::([0-9]+))?"+")?"+"([^?#]+)?"+"(?:\\?([^#]*))?"+"(?:#(.*))?"+"$");var URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_=/[#\/\?@]/g;var URI_DISALLOWED_IN_PATH_=/[\#\?]/g;URI.parse=parse;URI.create=create;URI.resolve=resolve;URI.collapse_dots=collapse_dots;URI.utils={mimeTypeOf:function(uri){var uriObj=parse(uri);if(/\.html$/.test(uriObj.getPath())){return"text/html"}else{return"application/javascript"}},resolve:function(base,uri){if(base){return resolve(parse(base),parse(uri)).toString()}else{return""+uri}}};return URI}();if(typeof window!=="undefined"){window["URI"]=URI}var html4={};html4.atype={NONE:0,URI:1,URI_FRAGMENT:11,SCRIPT:2,STYLE:3,HTML:12,ID:4,IDREF:5,IDREFS:6,GLOBAL_NAME:7,LOCAL_NAME:8,CLASSES:9,FRAME_TARGET:10,MEDIA_QUERY:13};html4["atype"]=html4.atype;html4.ATTRIBS={"*::class":9,"*::dir":0,"*::draggable":0,"*::hidden":0,"*::id":4,"*::inert":0,"*::itemprop":0,"*::itemref":6,"*::itemscope":0,"*::lang":0,"*::onblur":2,"*::onchange":2,"*::onclick":2,"*::ondblclick":2,"*::onerror":2,"*::onfocus":2,"*::onkeydown":2,"*::onkeypress":2,"*::onkeyup":2,"*::onload":2,"*::onmousedown":2,"*::onmousemove":2,"*::onmouseout":2,"*::onmouseover":2,"*::onmouseup":2,"*::onreset":2,"*::onscroll":2,"*::onselect":2,"*::onsubmit":2,"*::ontouchcancel":2,"*::ontouchend":2,"*::ontouchenter":2,"*::ontouchleave":2,"*::ontouchmove":2,"*::ontouchstart":2,"*::onunload":2,"*::spellcheck":0,"*::style":3,"*::title":0,"*::translate":0,"a::accesskey":0,"a::coords":0,"a::href":1,"a::hreflang":0,"a::name":7,"a::onblur":2,"a::onfocus":2,"a::shape":0,"a::tabindex":0,"a::target":10,"a::type":0,"area::accesskey":0,"area::alt":0,"area::coords":0,"area::href":1,"area::nohref":0,"area::onblur":2,"area::onfocus":2,"area::shape":0,"area::tabindex":0,"area::target":10,"audio::controls":0,"audio::loop":0,"audio::mediagroup":5,"audio::muted":0,"audio::preload":0,"audio::src":1,"bdo::dir":0,"blockquote::cite":1,"br::clear":0,"button::accesskey":0,"button::disabled":0,"button::name":8,"button::onblur":2,"button::onfocus":2,"button::tabindex":0,"button::type":0,"button::value":0,"canvas::height":0,"canvas::width":0,"caption::align":0,"col::align":0,"col::char":0,"col::charoff":0,"col::span":0,"col::valign":0,"col::width":0,"colgroup::align":0,"colgroup::char":0,"colgroup::charoff":0,"colgroup::span":0,"colgroup::valign":0,"colgroup::width":0,"command::checked":0,"command::command":5,"command::disabled":0,"command::icon":1,"command::label":0,"command::radiogroup":0,"command::type":0,"data::value":0,"del::cite":1,"del::datetime":0,"details::open":0,"dir::compact":0,"div::align":0,"dl::compact":0,"fieldset::disabled":0,"font::color":0,"font::face":0,"font::size":0,"form::accept":0,"form::action":1,"form::autocomplete":0,"form::enctype":0,"form::method":0,"form::name":7,"form::novalidate":0,"form::onreset":2,"form::onsubmit":2,"form::target":10,"h1::align":0,"h2::align":0,"h3::align":0,"h4::align":0,"h5::align":0,"h6::align":0,"hr::align":0,"hr::noshade":0,"hr::size":0,"hr::width":0,"iframe::align":0,"iframe::frameborder":0,"iframe::height":0,"iframe::marginheight":0,"iframe::marginwidth":0,"iframe::width":0,"img::align":0,"img::alt":0,"img::border":0,"img::height":0,"img::hspace":0,"img::ismap":0,"img::name":7,"img::src":1,"img::usemap":11,"img::vspace":0,"img::width":0,"input::accept":0,"input::accesskey":0,"input::align":0,"input::alt":0,"input::autocomplete":0,"input::checked":0,"input::disabled":0,"input::inputmode":0,"input::ismap":0,"input::list":5,"input::max":0,"input::maxlength":0,"input::min":0,"input::multiple":0,"input::name":8,"input::onblur":2,"input::onchange":2,"input::onfocus":2,"input::onselect":2,"input::placeholder":0,"input::readonly":0,"input::required":0,"input::size":0,"input::src":1,"input::step":0,"input::tabindex":0,"input::type":0,"input::usemap":11,"input::value":0,"ins::cite":1,"ins::datetime":0,"label::accesskey":0,"label::for":5,"label::onblur":2,"label::onfocus":2,"legend::accesskey":0,"legend::align":0,"li::type":0,"li::value":0,"map::name":7,"menu::compact":0,"menu::label":0,"menu::type":0,"meter::high":0,"meter::low":0,"meter::max":0,"meter::min":0,"meter::value":0,"ol::compact":0,"ol::reversed":0,"ol::start":0,"ol::type":0,"optgroup::disabled":0,"optgroup::label":0,"option::disabled":0,"option::label":0,"option::selected":0,"option::value":0,"output::for":6,"output::name":8,"p::align":0,"pre::width":0,"progress::max":0,"progress::min":0,"progress::value":0,"q::cite":1,"select::autocomplete":0,"select::disabled":0,"select::multiple":0,"select::name":8,"select::onblur":2,"select::onchange":2,"select::onfocus":2,"select::required":0,"select::size":0,"select::tabindex":0,"source::type":0,"table::align":0,"table::bgcolor":0,"table::border":0,"table::cellpadding":0,"table::cellspacing":0,"table::frame":0,"table::rules":0,"table::summary":0,"table::width":0,"tbody::align":0,"tbody::char":0,"tbody::charoff":0,"tbody::valign":0,"td::abbr":0,"td::align":0,"td::axis":0,"td::bgcolor":0,"td::char":0,"td::charoff":0,"td::colspan":0,"td::headers":6,"td::height":0,"td::nowrap":0,"td::rowspan":0,"td::scope":0,"td::valign":0,"td::width":0,"textarea::accesskey":0,"textarea::autocomplete":0,"textarea::cols":0,"textarea::disabled":0,"textarea::inputmode":0,"textarea::name":8,"textarea::onblur":2,"textarea::onchange":2,"textarea::onfocus":2,"textarea::onselect":2,"textarea::placeholder":0,"textarea::readonly":0,"textarea::required":0,"textarea::rows":0,"textarea::tabindex":0,"textarea::wrap":0,"tfoot::align":0,"tfoot::char":0,"tfoot::charoff":0,"tfoot::valign":0,"th::abbr":0,"th::align":0,"th::axis":0,"th::bgcolor":0,"th::char":0,"th::charoff":0,"th::colspan":0,"th::headers":6,"th::height":0,"th::nowrap":0,"th::rowspan":0,"th::scope":0,"th::valign":0,"th::width":0,"thead::align":0,"thead::char":0,"thead::charoff":0,"thead::valign":0,"tr::align":0,"tr::bgcolor":0,"tr::char":0,"tr::charoff":0,"tr::valign":0,"track::default":0,"track::kind":0,"track::label":0,"track::srclang":0,"ul::compact":0,"ul::type":0,"video::controls":0,"video::height":0,"video::loop":0,"video::mediagroup":5,"video::muted":0,"video::poster":1,"video::preload":0,"video::src":1,"video::width":0};html4["ATTRIBS"]=html4.ATTRIBS;html4.eflags={OPTIONAL_ENDTAG:1,EMPTY:2,CDATA:4,RCDATA:8,UNSAFE:16,FOLDABLE:32,SCRIPT:64,STYLE:128,VIRTUALIZED:256};html4["eflags"]=html4.eflags;html4.ELEMENTS={a:0,abbr:0,acronym:0,address:0,applet:272,area:2,article:0,aside:0,audio:0,b:0,base:274,basefont:274,bdi:0,bdo:0,big:0,blockquote:0,body:305,br:2,button:0,canvas:0,caption:0,center:0,cite:0,code:0,col:2,colgroup:1,command:2,data:0,datalist:0,dd:1,del:0,details:0,dfn:0,dialog:272,dir:0,div:0,dl:0,dt:1,em:0,fieldset:0,figcaption:0,figure:0,font:0,footer:0,form:0,frame:274,frameset:272,h1:0,h2:0,h3:0,h4:0,h5:0,h6:0,head:305,header:0,hgroup:0,hr:2,html:305,i:0,iframe:4,img:2,input:2,ins:0,isindex:274,kbd:0,keygen:274,label:0,legend:0,li:1,link:274,map:0,mark:0,menu:0,meta:274,meter:0,nav:0,nobr:0,noembed:276,noframes:276,noscript:276,object:272,ol:0,optgroup:0,option:1,output:0,p:1,param:274,pre:0,progress:0,q:0,s:0,samp:0,script:84,section:0,select:0,small:0,source:2,span:0,strike:0,strong:0,style:148,sub:0,summary:0,sup:0,table:0,tbody:1,td:1,textarea:8,tfoot:1,th:1,thead:1,time:0,title:280,tr:1,track:2,tt:0,u:0,ul:0,"var":0,video:0,wbr:2};html4["ELEMENTS"]=html4.ELEMENTS;html4.ELEMENT_DOM_INTERFACES={a:"HTMLAnchorElement",abbr:"HTMLElement",acronym:"HTMLElement",address:"HTMLElement",applet:"HTMLAppletElement",area:"HTMLAreaElement",article:"HTMLElement",aside:"HTMLElement",audio:"HTMLAudioElement",b:"HTMLElement",base:"HTMLBaseElement",basefont:"HTMLBaseFontElement",bdi:"HTMLElement",bdo:"HTMLElement",big:"HTMLElement",blockquote:"HTMLQuoteElement",body:"HTMLBodyElement",br:"HTMLBRElement",button:"HTMLButtonElement",canvas:"HTMLCanvasElement",caption:"HTMLTableCaptionElement",center:"HTMLElement",cite:"HTMLElement",code:"HTMLElement",col:"HTMLTableColElement",colgroup:"HTMLTableColElement",command:"HTMLCommandElement",data:"HTMLElement",datalist:"HTMLDataListElement",dd:"HTMLElement",del:"HTMLModElement",details:"HTMLDetailsElement",dfn:"HTMLElement",dialog:"HTMLDialogElement",dir:"HTMLDirectoryElement",div:"HTMLDivElement",dl:"HTMLDListElement",dt:"HTMLElement",em:"HTMLElement",fieldset:"HTMLFieldSetElement",figcaption:"HTMLElement",figure:"HTMLElement",font:"HTMLFontElement",footer:"HTMLElement",form:"HTMLFormElement",frame:"HTMLFrameElement",frameset:"HTMLFrameSetElement",h1:"HTMLHeadingElement",h2:"HTMLHeadingElement",h3:"HTMLHeadingElement",h4:"HTMLHeadingElement",h5:"HTMLHeadingElement",h6:"HTMLHeadingElement",head:"HTMLHeadElement",header:"HTMLElement",hgroup:"HTMLElement",hr:"HTMLHRElement",html:"HTMLHtmlElement",i:"HTMLElement",iframe:"HTMLIFrameElement",img:"HTMLImageElement",input:"HTMLInputElement",ins:"HTMLModElement",isindex:"HTMLUnknownElement",kbd:"HTMLElement",keygen:"HTMLKeygenElement",label:"HTMLLabelElement",legend:"HTMLLegendElement",li:"HTMLLIElement",link:"HTMLLinkElement",map:"HTMLMapElement",mark:"HTMLElement",menu:"HTMLMenuElement",meta:"HTMLMetaElement",meter:"HTMLMeterElement",nav:"HTMLElement",nobr:"HTMLElement",noembed:"HTMLElement",noframes:"HTMLElement",noscript:"HTMLElement",object:"HTMLObjectElement",ol:"HTMLOListElement",optgroup:"HTMLOptGroupElement",option:"HTMLOptionElement",output:"HTMLOutputElement",p:"HTMLParagraphElement",param:"HTMLParamElement",pre:"HTMLPreElement",progress:"HTMLProgressElement",q:"HTMLQuoteElement",s:"HTMLElement",samp:"HTMLElement",script:"HTMLScriptElement",section:"HTMLElement",select:"HTMLSelectElement",small:"HTMLElement",source:"HTMLSourceElement",span:"HTMLSpanElement",strike:"HTMLElement",strong:"HTMLElement",style:"HTMLStyleElement",sub:"HTMLElement",summary:"HTMLElement",sup:"HTMLElement",table:"HTMLTableElement",tbody:"HTMLTableSectionElement",td:"HTMLTableDataCellElement",textarea:"HTMLTextAreaElement",tfoot:"HTMLTableSectionElement",th:"HTMLTableHeaderCellElement",thead:"HTMLTableSectionElement",time:"HTMLTimeElement",title:"HTMLTitleElement",tr:"HTMLTableRowElement",track:"HTMLTrackElement",tt:"HTMLElement",u:"HTMLElement",ul:"HTMLUListElement","var":"HTMLElement",video:"HTMLVideoElement",wbr:"HTMLElement"};html4["ELEMENT_DOM_INTERFACES"]=html4.ELEMENT_DOM_INTERFACES;html4.ueffects={NOT_LOADED:0,SAME_DOCUMENT:1,NEW_DOCUMENT:2};html4["ueffects"]=html4.ueffects;html4.URIEFFECTS={"a::href":2,"area::href":2,"audio::src":1,"blockquote::cite":0,"command::icon":1,"del::cite":0,"form::action":2,"img::src":1,"input::src":1,"ins::cite":0,"q::cite":0,"video::poster":1,"video::src":1};html4["URIEFFECTS"]=html4.URIEFFECTS;html4.ltypes={UNSANDBOXED:2,SANDBOXED:1,DATA:0};html4["ltypes"]=html4.ltypes;html4.LOADERTYPES={"a::href":2,"area::href":2,"audio::src":2,"blockquote::cite":2,"command::icon":1,"del::cite":2,"form::action":2,"img::src":1,"input::src":1,"ins::cite":2,"q::cite":2,"video::poster":1,"video::src":2};html4["LOADERTYPES"]=html4.LOADERTYPES;if(typeof window!=="undefined"){window["html4"]=html4}if("I".toLowerCase()!=="i"){throw"I/i problem"}var html=function(html4){var parseCssDeclarations,sanitizeCssProperty,cssSchema;if("undefined"!==typeof window){parseCssDeclarations=window["parseCssDeclarations"];sanitizeCssProperty=window["sanitizeCssProperty"];cssSchema=window["cssSchema"]}var ENTITIES={lt:"<",LT:"<",gt:">",GT:">",amp:"&",AMP:"&",quot:'"',apos:"'",nbsp:" "};var decimalEscapeRe=/^#(\d+)$/;var hexEscapeRe=/^#x([0-9A-Fa-f]+)$/;var safeEntityNameRe=/^[A-Za-z][A-za-z0-9]+$/;var entityLookupElement="undefined"!==typeof window&&window["document"]?window["document"].createElement("textarea"):null;function lookupEntity(name){if(ENTITIES.hasOwnProperty(name)){return ENTITIES[name]}var m=name.match(decimalEscapeRe);if(m){return String.fromCharCode(parseInt(m[1],10))}else if(!!(m=name.match(hexEscapeRe))){return String.fromCharCode(parseInt(m[1],16))}else if(entityLookupElement&&safeEntityNameRe.test(name)){entityLookupElement.innerHTML="&"+name+";";var text=entityLookupElement.textContent;ENTITIES[name]=text;return text}else{return"&"+name+";"}}function decodeOneEntity(_,name){return lookupEntity(name)}var nulRe=/\0/g;function stripNULs(s){return s.replace(nulRe,"")}var ENTITY_RE_1=/&(#[0-9]+|#[xX][0-9A-Fa-f]+|\w+);/g;var ENTITY_RE_2=/^(#[0-9]+|#[xX][0-9A-Fa-f]+|\w+);/;function unescapeEntities(s){return s.replace(ENTITY_RE_1,decodeOneEntity)}var ampRe=/&/g;var looseAmpRe=/&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi;var ltRe=/[<]/g;var gtRe=/>/g;var quotRe=/\"/g;function escapeAttrib(s){return(""+s).replace(ampRe,"&amp;").replace(ltRe,"&lt;").replace(gtRe,"&gt;").replace(quotRe,"&#34;")}function normalizeRCData(rcdata){return rcdata.replace(looseAmpRe,"&amp;$1").replace(ltRe,"&lt;").replace(gtRe,"&gt;")}var ATTR_RE=new RegExp("^\\s*"+"([-.:\\w]+)"+"(?:"+("\\s*(=)\\s*"+"("+('(")[^"]*("|$)'+"|"+"(')[^']*('|$)"+"|"+"(?=[a-z][-\\w]*\\s*=)"+"|"+"[^\"'\\s]*")+")")+")?","i");var splitWillCapture="a,b".split(/(,)/).length===3;var EFLAGS_TEXT=html4.eflags["CDATA"]|html4.eflags["RCDATA"];function makeSaxParser(handler){var hcopy={cdata:handler.cdata||handler["cdata"],comment:handler.comment||handler["comment"],endDoc:handler.endDoc||handler["endDoc"],endTag:handler.endTag||handler["endTag"],pcdata:handler.pcdata||handler["pcdata"],rcdata:handler.rcdata||handler["rcdata"],startDoc:handler.startDoc||handler["startDoc"],startTag:handler.startTag||handler["startTag"]};return function(htmlText,param){return parse(htmlText,hcopy,param)}}var continuationMarker={};function parse(htmlText,handler,param){var m,p,tagName;var parts=htmlSplit(htmlText);var state={noMoreGT:false,noMoreEndComments:false};parseCPS(handler,parts,0,state,param)}function continuationMaker(h,parts,initial,state,param){return function(){parseCPS(h,parts,initial,state,param)}}function parseCPS(h,parts,initial,state,param){try{if(h.startDoc&&initial==0){h.startDoc(param)}var m,p,tagName;for(var pos=initial,end=parts.length;pos<end;){var current=parts[pos++];var next=parts[pos];switch(current){case"&":if(ENTITY_RE_2.test(next)){if(h.pcdata){h.pcdata("&"+next,param,continuationMarker,continuationMaker(h,parts,pos,state,param))}pos++}else{if(h.pcdata){h.pcdata("&amp;",param,continuationMarker,continuationMaker(h,parts,pos,state,param))}}break;case"</":if(m=/^([-\w:]+)[^\'\"]*/.exec(next)){if(m[0].length===next.length&&parts[pos+1]===">"){pos+=2;tagName=m[1].toLowerCase();if(h.endTag){h.endTag(tagName,param,continuationMarker,continuationMaker(h,parts,pos,state,param))}}else{pos=parseEndTag(parts,pos,h,param,continuationMarker,state)}}else{if(h.pcdata){h.pcdata("&lt;/",param,continuationMarker,continuationMaker(h,parts,pos,state,param))}}break;case"<":if(m=/^([-\w:]+)\s*\/?/.exec(next)){if(m[0].length===next.length&&parts[pos+1]===">"){pos+=2;tagName=m[1].toLowerCase();if(h.startTag){h.startTag(tagName,[],param,continuationMarker,continuationMaker(h,parts,pos,state,param))}var eflags=html4.ELEMENTS[tagName];if(eflags&EFLAGS_TEXT){var tag={name:tagName,next:pos,eflags:eflags};pos=parseText(parts,tag,h,param,continuationMarker,state)}}else{pos=parseStartTag(parts,pos,h,param,continuationMarker,state)}}else{if(h.pcdata){h.pcdata("&lt;",param,continuationMarker,continuationMaker(h,parts,pos,state,param))}}break;case"<!--":if(!state.noMoreEndComments){for(p=pos+1;p<end;p++){if(parts[p]===">"&&/--$/.test(parts[p-1])){break}}if(p<end){if(h.comment){var comment=parts.slice(pos,p).join("");h.comment(comment.substr(0,comment.length-2),param,continuationMarker,continuationMaker(h,parts,p+1,state,param))}pos=p+1}else{state.noMoreEndComments=true}}if(state.noMoreEndComments){if(h.pcdata){h.pcdata("&lt;!--",param,continuationMarker,continuationMaker(h,parts,pos,state,param))}}break;case"<!":if(!/^\w/.test(next)){if(h.pcdata){h.pcdata("&lt;!",param,continuationMarker,continuationMaker(h,parts,pos,state,param))}}else{if(!state.noMoreGT){for(p=pos+1;p<end;p++){if(parts[p]===">"){break}}if(p<end){pos=p+1}else{state.noMoreGT=true}}if(state.noMoreGT){if(h.pcdata){h.pcdata("&lt;!",param,continuationMarker,continuationMaker(h,parts,pos,state,param))}}}break;case"<?":if(!state.noMoreGT){for(p=pos+1;p<end;p++){if(parts[p]===">"){break}}if(p<end){pos=p+1}else{state.noMoreGT=true}}if(state.noMoreGT){if(h.pcdata){h.pcdata("&lt;?",param,continuationMarker,continuationMaker(h,parts,pos,state,param))}}break;case">":if(h.pcdata){h.pcdata("&gt;",param,continuationMarker,continuationMaker(h,parts,pos,state,param))}break;case"":break;default:if(h.pcdata){h.pcdata(current,param,continuationMarker,continuationMaker(h,parts,pos,state,param))}break}}if(h.endDoc){h.endDoc(param)}}catch(e){if(e!==continuationMarker){throw e}}}function htmlSplit(str){var re=/(<\/|<\!--|<[!?]|[&<>])/g;str+="";if(splitWillCapture){return str.split(re)}else{var parts=[];var lastPos=0;var m;while((m=re.exec(str))!==null){parts.push(str.substring(lastPos,m.index));parts.push(m[0]);lastPos=m.index+m[0].length}parts.push(str.substring(lastPos));return parts}}function parseEndTag(parts,pos,h,param,continuationMarker,state){var tag=parseTagAndAttrs(parts,pos);if(!tag){return parts.length}if(h.endTag){h.endTag(tag.name,param,continuationMarker,continuationMaker(h,parts,pos,state,param))}return tag.next}function parseStartTag(parts,pos,h,param,continuationMarker,state){var tag=parseTagAndAttrs(parts,pos);if(!tag){return parts.length}if(h.startTag){h.startTag(tag.name,tag.attrs,param,continuationMarker,continuationMaker(h,parts,tag.next,state,param))}if(tag.eflags&EFLAGS_TEXT){return parseText(parts,tag,h,param,continuationMarker,state)}else{return tag.next}}var endTagRe={};function parseText(parts,tag,h,param,continuationMarker,state){var end=parts.length;if(!endTagRe.hasOwnProperty(tag.name)){endTagRe[tag.name]=new RegExp("^"+tag.name+"(?:[\\s\\/]|$)","i")}var re=endTagRe[tag.name];var first=tag.next;var p=tag.next+1;for(;p<end;p++){if(parts[p-1]==="</"&&re.test(parts[p])){break}}if(p<end){p-=1}var buf=parts.slice(first,p).join("");if(tag.eflags&html4.eflags["CDATA"]){if(h.cdata){h.cdata(buf,param,continuationMarker,continuationMaker(h,parts,p,state,param))}}else if(tag.eflags&html4.eflags["RCDATA"]){if(h.rcdata){h.rcdata(normalizeRCData(buf),param,continuationMarker,continuationMaker(h,parts,p,state,param))}}else{throw new Error("bug")}return p}function parseTagAndAttrs(parts,pos){var m=/^([-\w:]+)/.exec(parts[pos]);var tag={};tag.name=m[1].toLowerCase();tag.eflags=html4.ELEMENTS[tag.name];var buf=parts[pos].substr(m[0].length);var p=pos+1;var end=parts.length;for(;p<end;p++){if(parts[p]===">"){break}buf+=parts[p]}if(end<=p){return void 0}var attrs=[];while(buf!==""){m=ATTR_RE.exec(buf);if(!m){buf=buf.replace(/^[\s\S][^a-z\s]*/,"")}else if(m[4]&&!m[5]||m[6]&&!m[7]){var quote=m[4]||m[6];var sawQuote=false;var abuf=[buf,parts[p++]];for(;p<end;p++){if(sawQuote){if(parts[p]===">"){break}}else if(0<=parts[p].indexOf(quote)){sawQuote=true}abuf.push(parts[p])}if(end<=p){break}buf=abuf.join("");continue}else{var aName=m[1].toLowerCase();var aValue=m[2]?decodeValue(m[3]):"";attrs.push(aName,aValue);buf=buf.substr(m[0].length)}}tag.attrs=attrs;tag.next=p+1;return tag}function decodeValue(v){var q=v.charCodeAt(0);if(q===34||q===39){v=v.substr(1,v.length-2)}return unescapeEntities(stripNULs(v))}function makeHtmlSanitizer(tagPolicy){var stack;var ignoring;var emit=function(text,out){if(!ignoring){out.push(text)}};return makeSaxParser({startDoc:function(_){stack=[];ignoring=false},startTag:function(tagNameOrig,attribs,out){if(ignoring){return}if(!html4.ELEMENTS.hasOwnProperty(tagNameOrig)){return}var eflagsOrig=html4.ELEMENTS[tagNameOrig];if(eflagsOrig&html4.eflags["FOLDABLE"]){return}var decision=tagPolicy(tagNameOrig,attribs);if(!decision){ignoring=!(eflagsOrig&html4.eflags["EMPTY"]);return}else if(typeof decision!=="object"){throw new Error("tagPolicy did not return object (old API?)")}if("attribs"in decision){attribs=decision["attribs"]}else{throw new Error("tagPolicy gave no attribs")}var eflagsRep;var tagNameRep;if("tagName"in decision){tagNameRep=decision["tagName"];eflagsRep=html4.ELEMENTS[tagNameRep]}else{tagNameRep=tagNameOrig;eflagsRep=eflagsOrig}if(eflagsOrig&html4.eflags["OPTIONAL_ENDTAG"]){var onStack=stack[stack.length-1];if(onStack&&onStack.orig===tagNameOrig&&(onStack.rep!==tagNameRep||tagNameOrig!==tagNameRep)){out.push("</",onStack.rep,">")}}if(!(eflagsOrig&html4.eflags["EMPTY"])){stack.push({orig:tagNameOrig,rep:tagNameRep})}out.push("<",tagNameRep);for(var i=0,n=attribs.length;i<n;i+=2){var attribName=attribs[i],value=attribs[i+1];if(value!==null&&value!==void 0){out.push(" ",attribName,'="',escapeAttrib(value),'"')}}out.push(">");if(eflagsOrig&html4.eflags["EMPTY"]&&!(eflagsRep&html4.eflags["EMPTY"])){out.push("</",tagNameRep,">")}},endTag:function(tagName,out){if(ignoring){ignoring=false;return}if(!html4.ELEMENTS.hasOwnProperty(tagName)){return}var eflags=html4.ELEMENTS[tagName];if(!(eflags&(html4.eflags["EMPTY"]|html4.eflags["FOLDABLE"]))){var index;if(eflags&html4.eflags["OPTIONAL_ENDTAG"]){for(index=stack.length;--index>=0;){var stackElOrigTag=stack[index].orig;if(stackElOrigTag===tagName){break}if(!(html4.ELEMENTS[stackElOrigTag]&html4.eflags["OPTIONAL_ENDTAG"])){return}}}else{for(index=stack.length;--index>=0;){if(stack[index].orig===tagName){break}}}if(index<0){return}for(var i=stack.length;--i>index;){var stackElRepTag=stack[i].rep;if(!(html4.ELEMENTS[stackElRepTag]&html4.eflags["OPTIONAL_ENDTAG"])){out.push("</",stackElRepTag,">")}}if(index<stack.length){tagName=stack[index].rep}stack.length=index;out.push("</",tagName,">")}},pcdata:emit,rcdata:emit,cdata:emit,endDoc:function(out){for(;stack.length;stack.length--){out.push("</",stack[stack.length-1].rep,">")}}})}var ALLOWED_URI_SCHEMES=/^(?:https?|mailto)$/i;function safeUri(uri,effect,ltype,hints,naiveUriRewriter){if(!naiveUriRewriter){return null}try{var parsed=URI.parse(""+uri);if(parsed){if(!parsed.hasScheme()||ALLOWED_URI_SCHEMES.test(parsed.getScheme())){var safe=naiveUriRewriter(parsed,effect,ltype,hints);return safe?safe.toString():null}}}catch(e){return null}return null}function log(logger,tagName,attribName,oldValue,newValue){if(!attribName){logger(tagName+" removed",{change:"removed",tagName:tagName})}if(oldValue!==newValue){var changed="changed";if(oldValue&&!newValue){changed="removed"
}else if(!oldValue&&newValue){changed="added"}logger(tagName+"."+attribName+" "+changed,{change:changed,tagName:tagName,attribName:attribName,oldValue:oldValue,newValue:newValue})}}function lookupAttribute(map,tagName,attribName){var attribKey;attribKey=tagName+"::"+attribName;if(map.hasOwnProperty(attribKey)){return map[attribKey]}attribKey="*::"+attribName;if(map.hasOwnProperty(attribKey)){return map[attribKey]}return void 0}function getAttributeType(tagName,attribName){return lookupAttribute(html4.ATTRIBS,tagName,attribName)}function getLoaderType(tagName,attribName){return lookupAttribute(html4.LOADERTYPES,tagName,attribName)}function getUriEffect(tagName,attribName){return lookupAttribute(html4.URIEFFECTS,tagName,attribName)}function sanitizeAttribs(tagName,attribs,opt_naiveUriRewriter,opt_nmTokenPolicy,opt_logger){for(var i=0;i<attribs.length;i+=2){var attribName=attribs[i];var value=attribs[i+1];var oldValue=value;var atype=null,attribKey;if((attribKey=tagName+"::"+attribName,html4.ATTRIBS.hasOwnProperty(attribKey))||(attribKey="*::"+attribName,html4.ATTRIBS.hasOwnProperty(attribKey))){atype=html4.ATTRIBS[attribKey]}if(atype!==null){switch(atype){case html4.atype["NONE"]:break;case html4.atype["SCRIPT"]:value=null;if(opt_logger){log(opt_logger,tagName,attribName,oldValue,value)}break;case html4.atype["STYLE"]:if("undefined"===typeof parseCssDeclarations){value=null;if(opt_logger){log(opt_logger,tagName,attribName,oldValue,value)}break}var sanitizedDeclarations=[];parseCssDeclarations(value,{declaration:function(property,tokens){var normProp=property.toLowerCase();sanitizeCssProperty(normProp,tokens,opt_naiveUriRewriter?function(url){return safeUri(url,html4.ueffects.SAME_DOCUMENT,html4.ltypes.SANDBOXED,{TYPE:"CSS",CSS_PROP:normProp},opt_naiveUriRewriter)}:null);if(tokens.length){sanitizedDeclarations.push(normProp+": "+tokens.join(" "))}}});value=sanitizedDeclarations.length>0?sanitizedDeclarations.join(" ; "):null;if(opt_logger){log(opt_logger,tagName,attribName,oldValue,value)}break;case html4.atype["ID"]:case html4.atype["IDREF"]:case html4.atype["IDREFS"]:case html4.atype["GLOBAL_NAME"]:case html4.atype["LOCAL_NAME"]:case html4.atype["CLASSES"]:value=opt_nmTokenPolicy?opt_nmTokenPolicy(value):value;if(opt_logger){log(opt_logger,tagName,attribName,oldValue,value)}break;case html4.atype["URI"]:value=safeUri(value,getUriEffect(tagName,attribName),getLoaderType(tagName,attribName),{TYPE:"MARKUP",XML_ATTR:attribName,XML_TAG:tagName},opt_naiveUriRewriter);if(opt_logger){log(opt_logger,tagName,attribName,oldValue,value)}break;case html4.atype["URI_FRAGMENT"]:if(value&&"#"===value.charAt(0)){value=value.substring(1);value=opt_nmTokenPolicy?opt_nmTokenPolicy(value):value;if(value!==null&&value!==void 0){value="#"+value}}else{value=null}if(opt_logger){log(opt_logger,tagName,attribName,oldValue,value)}break;default:value=null;if(opt_logger){log(opt_logger,tagName,attribName,oldValue,value)}break}}else{value=null;if(opt_logger){log(opt_logger,tagName,attribName,oldValue,value)}}attribs[i+1]=value}return attribs}function makeTagPolicy(opt_naiveUriRewriter,opt_nmTokenPolicy,opt_logger){return function(tagName,attribs){if(!(html4.ELEMENTS[tagName]&html4.eflags["UNSAFE"])){return{attribs:sanitizeAttribs(tagName,attribs,opt_naiveUriRewriter,opt_nmTokenPolicy,opt_logger)}}else{if(opt_logger){log(opt_logger,tagName,undefined,undefined,undefined)}}}}function sanitizeWithPolicy(inputHtml,tagPolicy){var outputArray=[];makeHtmlSanitizer(tagPolicy)(inputHtml,outputArray);return outputArray.join("")}function sanitize(inputHtml,opt_naiveUriRewriter,opt_nmTokenPolicy,opt_logger){var tagPolicy=makeTagPolicy(opt_naiveUriRewriter,opt_nmTokenPolicy,opt_logger);return sanitizeWithPolicy(inputHtml,tagPolicy)}var html={};html.escapeAttrib=html["escapeAttrib"]=escapeAttrib;html.makeHtmlSanitizer=html["makeHtmlSanitizer"]=makeHtmlSanitizer;html.makeSaxParser=html["makeSaxParser"]=makeSaxParser;html.makeTagPolicy=html["makeTagPolicy"]=makeTagPolicy;html.normalizeRCData=html["normalizeRCData"]=normalizeRCData;html.sanitize=html["sanitize"]=sanitize;html.sanitizeAttribs=html["sanitizeAttribs"]=sanitizeAttribs;html.sanitizeWithPolicy=html["sanitizeWithPolicy"]=sanitizeWithPolicy;html.unescapeEntities=html["unescapeEntities"]=unescapeEntities;return html}(html4);var html_sanitize=html["sanitize"];if(typeof window!=="undefined"){window["html"]=html;window["html_sanitize"]=html_sanitize}
/*! jQuery v2.2.4 | (c) jQuery Foundation | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=a.document,e=c.slice,f=c.concat,g=c.push,h=c.indexOf,i={},j=i.toString,k=i.hasOwnProperty,l={},m="2.2.4",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return e.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:e.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a){return n.each(this,a)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(e.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:g,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=a&&a.toString();return!n.isArray(a)&&b-parseFloat(b)+1>=0},isPlainObject:function(a){var b;if("object"!==n.type(a)||a.nodeType||n.isWindow(a))return!1;if(a.constructor&&!k.call(a,"constructor")&&!k.call(a.constructor.prototype||{},"isPrototypeOf"))return!1;for(b in a);return void 0===b||k.call(a,b)},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?i[j.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=d.createElement("script"),b.text=a,d.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(s(a)){for(c=a.length;c>d;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):g.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:h.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,g=0,h=[];if(s(a))for(d=a.length;d>g;g++)e=b(a[g],g,c),null!=e&&h.push(e);else for(g in a)e=b(a[g],g,c),null!=e&&h.push(e);return f.apply([],h)},guid:1,proxy:function(a,b){var c,d,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(d=e.call(arguments,2),f=function(){return a.apply(b||this,d.concat(e.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:l}),"function"==typeof Symbol&&(n.fn[Symbol.iterator]=c[Symbol.iterator]),n.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){i["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=!!a&&"length"in a&&a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ga(),z=ga(),A=ga(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+M+"))|)"+L+"*\\]",O=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+N+")*)|.*)\\)|)",P=new RegExp(L+"+","g"),Q=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),R=new RegExp("^"+L+"*,"+L+"*"),S=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),T=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),U=new RegExp(O),V=new RegExp("^"+M+"$"),W={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M+"|[*])"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},X=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,$=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,_=/[+~]/,aa=/'|\\/g,ba=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),ca=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},da=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(ea){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fa(a,b,d,e){var f,h,j,k,l,o,r,s,w=b&&b.ownerDocument,x=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==x&&9!==x&&11!==x)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==x&&(o=$.exec(a)))if(f=o[1]){if(9===x){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(w&&(j=w.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(o[2])return H.apply(d,b.getElementsByTagName(a)),d;if((f=o[3])&&c.getElementsByClassName&&b.getElementsByClassName)return H.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==x)w=b,s=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(aa,"\\$&"):b.setAttribute("id",k=u),r=g(a),h=r.length,l=V.test(k)?"#"+k:"[id='"+k+"']";while(h--)r[h]=l+" "+qa(r[h]);s=r.join(","),w=_.test(a)&&oa(b.parentNode)||b}if(s)try{return H.apply(d,w.querySelectorAll(s)),d}catch(y){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(Q,"$1"),b,d,e)}function ga(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ha(a){return a[u]=!0,a}function ia(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ja(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function ka(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function la(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function na(a){return ha(function(b){return b=+b,ha(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function oa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=fa.support={},f=fa.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fa.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ia(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ia(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Z.test(n.getElementsByClassName),c.getById=ia(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return"undefined"!=typeof b.getElementsByClassName&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=Z.test(n.querySelectorAll))&&(ia(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ia(function(a){var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Z.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ia(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",O)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Z.test(o.compareDocumentPosition),t=b||Z.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return ka(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?ka(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},fa.matches=function(a,b){return fa(a,null,null,b)},fa.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(T,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fa(b,n,null,[a]).length>0},fa.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fa.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fa.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fa.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fa.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fa.selectors={cacheLength:50,createPseudo:ha,match:W,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ba,ca),a[3]=(a[3]||a[4]||a[5]||"").replace(ba,ca),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fa.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fa.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return W.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&U.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ba,ca).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fa.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(P," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fa.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ha(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ha(function(a){var b=[],c=[],d=h(a.replace(Q,"$1"));return d[u]?ha(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ha(function(a){return function(b){return fa(a,b).length>0}}),contains:ha(function(a){return a=a.replace(ba,ca),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ha(function(a){return V.test(a||"")||fa.error("unsupported lang: "+a),a=a.replace(ba,ca).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Y.test(a.nodeName)},input:function(a){return X.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:na(function(){return[0]}),last:na(function(a,b){return[b-1]}),eq:na(function(a,b,c){return[0>c?c+b:c]}),even:na(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:na(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:na(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:na(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=la(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=ma(b);function pa(){}pa.prototype=d.filters=d.pseudos,d.setFilters=new pa,g=fa.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=R.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=S.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(Q," ")}),h=h.slice(c.length));for(g in d.filter)!(e=W[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fa.error(a):z(a,i).slice(0)};function qa(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function ra(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j,k=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(j=b[u]||(b[u]={}),i=j[b.uniqueID]||(j[b.uniqueID]={}),(h=i[d])&&h[0]===w&&h[1]===f)return k[2]=h[2];if(i[d]=k,k[2]=a(b,c,g))return!0}}}function sa(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ta(a,b,c){for(var d=0,e=b.length;e>d;d++)fa(a,b[d],c);return c}function ua(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function va(a,b,c,d,e,f){return d&&!d[u]&&(d=va(d)),e&&!e[u]&&(e=va(e,f)),ha(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ta(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ua(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ua(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ua(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function wa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ra(function(a){return a===b},h,!0),l=ra(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[ra(sa(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return va(i>1&&sa(m),i>1&&qa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(Q,"$1"),c,e>i&&wa(a.slice(i,e)),f>e&&wa(a=a.slice(e)),f>e&&qa(a))}m.push(c)}return sa(m)}function xa(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=F.call(i));u=ua(u)}H.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&fa.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ha(f):f}return h=fa.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xa(e,d)),f.selector=a}return f},i=fa.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ba,ca),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=W.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ba,ca),_.test(j[0].type)&&oa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qa(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,!b||_.test(a)&&oa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ia(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ia(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ja("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ia(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ja("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ia(function(a){return null==a.getAttribute("disabled")})||ja(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),fa}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.uniqueSort=n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},v=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},w=n.expr.match.needsContext,x=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,y=/^.[^:#\[\.,]*$/;function z(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(y.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return h.call(b,a)>-1!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(z(this,a||[],!1))},not:function(a){return this.pushStack(z(this,a||[],!0))},is:function(a){return!!z(this,"string"==typeof a&&w.test(a)?n(a):a||[],!1).length}});var A,B=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=n.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||A,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:B.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),x.test(e[1])&&n.isPlainObject(b))for(e in b)n.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&f.parentNode&&(this.length=1,this[0]=f),this.context=d,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?void 0!==c.ready?c.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};C.prototype=n.fn,A=n(d);var D=/^(?:parents|prev(?:Until|All))/,E={children:!0,contents:!0,next:!0,prev:!0};n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=w.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?h.call(n(a),this[0]):h.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.uniqueSort(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function F(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return u(a,"parentNode")},parentsUntil:function(a,b,c){return u(a,"parentNode",c)},next:function(a){return F(a,"nextSibling")},prev:function(a){return F(a,"previousSibling")},nextAll:function(a){return u(a,"nextSibling")},prevAll:function(a){return u(a,"previousSibling")},nextUntil:function(a,b,c){return u(a,"nextSibling",c)},prevUntil:function(a,b,c){return u(a,"previousSibling",c)},siblings:function(a){return v((a.parentNode||{}).firstChild,a)},children:function(a){return v(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(E[a]||n.uniqueSort(e),D.test(a)&&e.reverse()),this.pushStack(e)}});var G=/\S+/g;function H(a){var b={};return n.each(a.match(G)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?H(a):n.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){n.each(b,function(b,c){n.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==n.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return n.each(arguments,function(a,b){var c;while((c=n.inArray(b,f,c))>-1)f.splice(c,1),h>=c&&h--}),this},has:function(a){return a?n.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().progress(c.notify).done(c.resolve).fail(c.reject):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=e.call(arguments),d=c.length,f=1!==d||a&&n.isFunction(a.promise)?d:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(d){b[a]=this,c[a]=arguments.length>1?e.call(arguments):d,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(d>1)for(i=new Array(d),j=new Array(d),k=new Array(d);d>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().progress(h(b,j,i)).done(h(b,k,c)).fail(g.reject):--f;return f||g.resolveWith(k,c),g.promise()}});var I;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(I.resolveWith(d,[n]),n.fn.triggerHandler&&(n(d).triggerHandler("ready"),n(d).off("ready"))))}});function J(){d.removeEventListener("DOMContentLoaded",J),a.removeEventListener("load",J),n.ready()}n.ready.promise=function(b){return I||(I=n.Deferred(),"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(n.ready):(d.addEventListener("DOMContentLoaded",J),a.addEventListener("load",J))),I.promise(b)},n.ready.promise();var K=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)K(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},L=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function M(){this.expando=n.expando+M.uid++}M.uid=1,M.prototype={register:function(a,b){var c=b||{};return a.nodeType?a[this.expando]=c:Object.defineProperty(a,this.expando,{value:c,writable:!0,configurable:!0}),a[this.expando]},cache:function(a){if(!L(a))return{};var b=a[this.expando];return b||(b={},L(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[b]=c;else for(d in b)e[d]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=a[this.expando];if(void 0!==f){if(void 0===b)this.register(a);else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in f?d=[b,e]:(d=e,d=d in f?[d]:d.match(G)||[])),c=d.length;while(c--)delete f[d[c]]}(void 0===b||n.isEmptyObject(f))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!n.isEmptyObject(b)}};var N=new M,O=new M,P=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Q=/[A-Z]/g;function R(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Q,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:P.test(c)?n.parseJSON(c):c;
}catch(e){}O.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return O.hasData(a)||N.hasData(a)},data:function(a,b,c){return O.access(a,b,c)},removeData:function(a,b){O.remove(a,b)},_data:function(a,b,c){return N.access(a,b,c)},_removeData:function(a,b){N.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=O.get(f),1===f.nodeType&&!N.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),R(f,d,e[d])));N.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){O.set(this,a)}):K(this,function(b){var c,d;if(f&&void 0===b){if(c=O.get(f,a)||O.get(f,a.replace(Q,"-$&").toLowerCase()),void 0!==c)return c;if(d=n.camelCase(a),c=O.get(f,d),void 0!==c)return c;if(c=R(f,d,void 0),void 0!==c)return c}else d=n.camelCase(a),this.each(function(){var c=O.get(this,d);O.set(this,d,b),a.indexOf("-")>-1&&void 0!==c&&O.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){O.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=N.get(a,b),c&&(!d||n.isArray(c)?d=N.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return N.get(a,c)||N.access(a,c,{empty:n.Callbacks("once memory").add(function(){N.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=N.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var S=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=new RegExp("^(?:([+-])=|)("+S+")([a-z%]*)$","i"),U=["Top","Right","Bottom","Left"],V=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)};function W(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return n.css(a,b,"")},i=h(),j=c&&c[3]||(n.cssNumber[b]?"":"px"),k=(n.cssNumber[b]||"px"!==j&&+i)&&T.exec(n.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,n.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var X=/^(?:checkbox|radio)$/i,Y=/<([\w:-]+)/,Z=/^$|\/(?:java|ecma)script/i,$={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};$.optgroup=$.option,$.tbody=$.tfoot=$.colgroup=$.caption=$.thead,$.th=$.td;function _(a,b){var c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function aa(a,b){for(var c=0,d=a.length;d>c;c++)N.set(a[c],"globalEval",!b||N.get(b[c],"globalEval"))}var ba=/<|&#?\w+;/;function ca(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],o=0,p=a.length;p>o;o++)if(f=a[o],f||0===f)if("object"===n.type(f))n.merge(m,f.nodeType?[f]:f);else if(ba.test(f)){g=g||l.appendChild(b.createElement("div")),h=(Y.exec(f)||["",""])[1].toLowerCase(),i=$[h]||$._default,g.innerHTML=i[1]+n.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;n.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",o=0;while(f=m[o++])if(d&&n.inArray(f,d)>-1)e&&e.push(f);else if(j=n.contains(f.ownerDocument,f),g=_(l.appendChild(f),"script"),j&&aa(g),c){k=0;while(f=g[k++])Z.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),l.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",l.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var da=/^key/,ea=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,fa=/^([^.]*)(?:\.(.+)|)/;function ga(){return!0}function ha(){return!1}function ia(){try{return d.activeElement}catch(a){}}function ja(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)ja(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=ha;else if(!e)return a;return 1===f&&(g=e,e=function(a){return n().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=n.guid++)),a.each(function(){n.event.add(this,b,e,d,c)})}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=N.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return"undefined"!=typeof n&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(G)||[""],j=b.length;while(j--)h=fa.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=N.hasData(a)&&N.get(a);if(r&&(i=r.events)){b=(b||"").match(G)||[""],j=b.length;while(j--)if(h=fa.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&N.remove(a,"handle events")}},dispatch:function(a){a=n.event.fix(a);var b,c,d,f,g,h=[],i=e.call(arguments),j=(N.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())a.rnamespace&&!a.rnamespace.test(g.namespace)||(a.handleObj=g,a.data=g.data,d=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==d&&(a.result=d)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&("click"!==a.type||isNaN(a.button)||a.button<1))for(;i!==this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>-1:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,e,f,g=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||d,e=c.documentElement,f=c.body,a.pageX=b.clientX+(e&&e.scrollLeft||f&&f.scrollLeft||0)-(e&&e.clientLeft||f&&f.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||f&&f.scrollTop||0)-(e&&e.clientTop||f&&f.clientTop||0)),a.which||void 0===g||(a.which=1&g?1:2&g?3:4&g?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,e,f=a.type,g=a,h=this.fixHooks[f];h||(this.fixHooks[f]=h=ea.test(f)?this.mouseHooks:da.test(f)?this.keyHooks:{}),e=h.props?this.props.concat(h.props):this.props,a=new n.Event(g),b=e.length;while(b--)c=e[b],a[c]=g[c];return a.target||(a.target=d),3===a.target.nodeType&&(a.target=a.target.parentNode),h.filter?h.filter(a,g):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==ia()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===ia()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ga:ha):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={constructor:n.Event,isDefaultPrevented:ha,isPropagationStopped:ha,isImmediatePropagationStopped:ha,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ga,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ga,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ga,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||n.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),n.fn.extend({on:function(a,b,c,d){return ja(this,a,b,c,d)},one:function(a,b,c,d){return ja(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=ha),this.each(function(){n.event.remove(this,a,c,b)})}});var ka=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,la=/<script|<style|<link/i,ma=/checked\s*(?:[^=]|=\s*.checked.)/i,na=/^true\/(.*)/,oa=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function pa(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function qa(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function ra(a){var b=na.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function sa(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(N.hasData(a)&&(f=N.access(a),g=N.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}O.hasData(a)&&(h=O.access(a),i=n.extend({},h),O.set(b,i))}}function ta(a,b){var c=b.nodeName.toLowerCase();"input"===c&&X.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function ua(a,b,c,d){b=f.apply([],b);var e,g,h,i,j,k,m=0,o=a.length,p=o-1,q=b[0],r=n.isFunction(q);if(r||o>1&&"string"==typeof q&&!l.checkClone&&ma.test(q))return a.each(function(e){var f=a.eq(e);r&&(b[0]=q.call(this,e,f.html())),ua(f,b,c,d)});if(o&&(e=ca(b,a[0].ownerDocument,!1,a,d),g=e.firstChild,1===e.childNodes.length&&(e=g),g||d)){for(h=n.map(_(e,"script"),qa),i=h.length;o>m;m++)j=e,m!==p&&(j=n.clone(j,!0,!0),i&&n.merge(h,_(j,"script"))),c.call(a[m],j,m);if(i)for(k=h[h.length-1].ownerDocument,n.map(h,ra),m=0;i>m;m++)j=h[m],Z.test(j.type||"")&&!N.access(j,"globalEval")&&n.contains(k,j)&&(j.src?n._evalUrl&&n._evalUrl(j.src):n.globalEval(j.textContent.replace(oa,"")))}return a}function va(a,b,c){for(var d,e=b?n.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||n.cleanData(_(d)),d.parentNode&&(c&&n.contains(d.ownerDocument,d)&&aa(_(d,"script")),d.parentNode.removeChild(d));return a}n.extend({htmlPrefilter:function(a){return a.replace(ka,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(l.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=_(h),f=_(a),d=0,e=f.length;e>d;d++)ta(f[d],g[d]);if(b)if(c)for(f=f||_(a),g=g||_(h),d=0,e=f.length;e>d;d++)sa(f[d],g[d]);else sa(a,h);return g=_(h,"script"),g.length>0&&aa(g,!i&&_(a,"script")),h},cleanData:function(a){for(var b,c,d,e=n.event.special,f=0;void 0!==(c=a[f]);f++)if(L(c)){if(b=c[N.expando]){if(b.events)for(d in b.events)e[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);c[N.expando]=void 0}c[O.expando]&&(c[O.expando]=void 0)}}}),n.fn.extend({domManip:ua,detach:function(a){return va(this,a,!0)},remove:function(a){return va(this,a)},text:function(a){return K(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return ua(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=pa(this,a);b.appendChild(a)}})},prepend:function(){return ua(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=pa(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return ua(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return ua(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(_(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return K(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!la.test(a)&&!$[(Y.exec(a)||["",""])[1].toLowerCase()]){a=n.htmlPrefilter(a);try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(_(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return ua(this,arguments,function(b){var c=this.parentNode;n.inArray(this,a)<0&&(n.cleanData(_(this)),c&&c.replaceChild(b,this))},a)}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),f=e.length-1,h=0;f>=h;h++)c=h===f?this:this.clone(!0),n(e[h])[b](c),g.apply(d,c.get());return this.pushStack(d)}});var wa,xa={HTML:"block",BODY:"block"};function ya(a,b){var c=n(b.createElement(a)).appendTo(b.body),d=n.css(c[0],"display");return c.detach(),d}function za(a){var b=d,c=xa[a];return c||(c=ya(a,b),"none"!==c&&c||(wa=(wa||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=wa[0].contentDocument,b.write(),b.close(),c=ya(a,b),wa.detach()),xa[a]=c),c}var Aa=/^margin/,Ba=new RegExp("^("+S+")(?!px)[a-z%]+$","i"),Ca=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)},Da=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e},Ea=d.documentElement;!function(){var b,c,e,f,g=d.createElement("div"),h=d.createElement("div");if(h.style){h.style.backgroundClip="content-box",h.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===h.style.backgroundClip,g.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",g.appendChild(h);function i(){h.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",h.innerHTML="",Ea.appendChild(g);var d=a.getComputedStyle(h);b="1%"!==d.top,f="2px"===d.marginLeft,c="4px"===d.width,h.style.marginRight="50%",e="4px"===d.marginRight,Ea.removeChild(g)}n.extend(l,{pixelPosition:function(){return i(),b},boxSizingReliable:function(){return null==c&&i(),c},pixelMarginRight:function(){return null==c&&i(),e},reliableMarginLeft:function(){return null==c&&i(),f},reliableMarginRight:function(){var b,c=h.appendChild(d.createElement("div"));return c.style.cssText=h.style.cssText="-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",h.style.width="1px",Ea.appendChild(g),b=!parseFloat(a.getComputedStyle(c).marginRight),Ea.removeChild(g),h.removeChild(c),b}})}}();function Fa(a,b,c){var d,e,f,g,h=a.style;return c=c||Ca(a),g=c?c.getPropertyValue(b)||c[b]:void 0,""!==g&&void 0!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),c&&!l.pixelMarginRight()&&Ba.test(g)&&Aa.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f),void 0!==g?g+"":g}function Ga(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Ha=/^(none|table(?!-c[ea]).+)/,Ia={position:"absolute",visibility:"hidden",display:"block"},Ja={letterSpacing:"0",fontWeight:"400"},Ka=["Webkit","O","Moz","ms"],La=d.createElement("div").style;function Ma(a){if(a in La)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ka.length;while(c--)if(a=Ka[c]+b,a in La)return a}function Na(a,b,c){var d=T.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Oa(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+U[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+U[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+U[f]+"Width",!0,e))):(g+=n.css(a,"padding"+U[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+U[f]+"Width",!0,e)));return g}function Pa(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Ca(a),g="border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=Fa(a,b,f),(0>e||null==e)&&(e=a.style[b]),Ba.test(e))return e;d=g&&(l.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Oa(a,b,c||(g?"border":"content"),d,f)+"px"}function Qa(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=N.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&V(d)&&(f[g]=N.access(d,"olddisplay",za(d.nodeName)))):(e=V(d),"none"===c&&e||N.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Fa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Ma(h)||h),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=T.exec(c))&&e[1]&&(c=W(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(n.cssNumber[h]?"":"px")),l.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Ma(h)||h),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Fa(a,b,d)),"normal"===e&&b in Ja&&(e=Ja[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?Ha.test(n.css(a,"display"))&&0===a.offsetWidth?Da(a,Ia,function(){return Pa(a,b,d)}):Pa(a,b,d):void 0},set:function(a,c,d){var e,f=d&&Ca(a),g=d&&Oa(a,b,d,"border-box"===n.css(a,"boxSizing",!1,f),f);return g&&(e=T.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=n.css(a,b)),Na(a,c,g)}}}),n.cssHooks.marginLeft=Ga(l.reliableMarginLeft,function(a,b){return b?(parseFloat(Fa(a,"marginLeft"))||a.getBoundingClientRect().left-Da(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px":void 0}),n.cssHooks.marginRight=Ga(l.reliableMarginRight,function(a,b){return b?Da(a,{display:"inline-block"},Fa,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+U[d]+b]=f[d]||f[d-2]||f[0];return e}},Aa.test(a)||(n.cssHooks[a+b].set=Na)}),n.fn.extend({css:function(a,b){return K(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=Ca(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Qa(this,!0)},hide:function(){return Qa(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){V(this)?n(this).show():n(this).hide()})}});function Ra(a,b,c,d,e){return new Ra.prototype.init(a,b,c,d,e)}n.Tween=Ra,Ra.prototype={constructor:Ra,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||n.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Ra.propHooks[this.prop];return a&&a.get?a.get(this):Ra.propHooks._default.get(this)},run:function(a){var b,c=Ra.propHooks[this.prop];return this.options.duration?this.pos=b=n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Ra.propHooks._default.set(this),this}},Ra.prototype.init.prototype=Ra.prototype,Ra.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[n.cssProps[a.prop]]&&!n.cssHooks[a.prop]?a.elem[a.prop]=a.now:n.style(a.elem,a.prop,a.now+a.unit)}}},Ra.propHooks.scrollTop=Ra.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},n.fx=Ra.prototype.init,n.fx.step={};var Sa,Ta,Ua=/^(?:toggle|show|hide)$/,Va=/queueHooks$/;function Wa(){return a.setTimeout(function(){Sa=void 0}),Sa=n.now()}function Xa(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=U[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ya(a,b,c){for(var d,e=(_a.tweeners[b]||[]).concat(_a.tweeners["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Za(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&V(a),q=N.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?N.get(a,"olddisplay")||za(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Ua.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?za(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=N.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;N.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ya(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function $a(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function _a(a,b,c){var d,e,f=0,g=_a.prefilters.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Sa||Wa(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{},easing:n.easing._default},c),originalProperties:b,originalOptions:c,startTime:Sa||Wa(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for($a(k,j.opts.specialEasing);g>f;f++)if(d=_a.prefilters[f].call(j,a,k,j.opts))return n.isFunction(d.stop)&&(n._queueHooks(j.elem,j.opts.queue).stop=n.proxy(d.stop,d)),d;return n.map(k,Ya,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(_a,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return W(c.elem,a,T.exec(b),c),c}]},tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.match(G);for(var c,d=0,e=a.length;e>d;d++)c=a[d],_a.tweeners[c]=_a.tweeners[c]||[],_a.tweeners[c].unshift(b)},prefilters:[Za],prefilter:function(a,b){b?_a.prefilters.unshift(a):_a.prefilters.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,null!=d.queue&&d.queue!==!0||(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(V).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=_a(this,n.extend({},a),f);(e||N.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=N.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Va.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=N.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Xa(b,!0),a,d,e)}}),n.each({slideDown:Xa("show"),slideUp:Xa("hide"),slideToggle:Xa("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(Sa=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),Sa=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Ta||(Ta=a.setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){a.clearInterval(Ta),Ta=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(b,c){return b=n.fx?n.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",l.checkOn=""!==a.value,l.optSelected=c.selected,b.disabled=!0,l.optDisabled=!c.disabled,a=d.createElement("input"),a.value="t",a.type="radio",l.radioValue="t"===a.value}();var ab,bb=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return K(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),e=n.attrHooks[b]||(n.expr.match.bool.test(b)?ab:void 0)),void 0!==c?null===c?void n.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=n.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!l.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(G);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)}}),ab={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=bb[b]||n.find.attr;bb[b]=function(a,b,d){var e,f;return d||(f=bb[b],bb[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,bb[b]=f),e}});var cb=/^(?:input|select|textarea|button)$/i,db=/^(?:a|area)$/i;n.fn.extend({prop:function(a,b){return K(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&n.isXMLDoc(a)||(b=n.propFix[b]||b,e=n.propHooks[b]),
void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=n.find.attr(a,"tabindex");return b?parseInt(b,10):cb.test(a.nodeName)||db.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),l.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var eb=/[\t\r\n\f]/g;function fb(a){return a.getAttribute&&a.getAttribute("class")||""}n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,fb(this)))});if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=fb(c),d=1===c.nodeType&&(" "+e+" ").replace(eb," ")){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=n.trim(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,fb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=fb(c),d=1===c.nodeType&&(" "+e+" ").replace(eb," ")){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=n.trim(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):n.isFunction(a)?this.each(function(c){n(this).toggleClass(a.call(this,c,fb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=n(this),f=a.match(G)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=fb(this),b&&N.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":N.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+fb(c)+" ").replace(eb," ").indexOf(b)>-1)return!0;return!1}});var gb=/\r/g,hb=/[\x20\t\r\n\f]+/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(gb,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a)).replace(hb," ")}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],(c.selected||i===e)&&(l.optDisabled?!c.disabled:null===c.getAttribute("disabled"))&&(!c.parentNode.disabled||!n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(n.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>-1:void 0}},l.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var ib=/^(?:focusinfocus|focusoutblur)$/;n.extend(n.event,{trigger:function(b,c,e,f){var g,h,i,j,l,m,o,p=[e||d],q=k.call(b,"type")?b.type:b,r=k.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!ib.test(q+n.event.triggered)&&(q.indexOf(".")>-1&&(r=q.split("."),q=r.shift(),r.sort()),l=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=r.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},f||!o.trigger||o.trigger.apply(e,c)!==!1)){if(!f&&!o.noBubble&&!n.isWindow(e)){for(j=o.delegateType||q,ib.test(j+q)||(h=h.parentNode);h;h=h.parentNode)p.push(h),i=h;i===(e.ownerDocument||d)&&p.push(i.defaultView||i.parentWindow||a)}g=0;while((h=p[g++])&&!b.isPropagationStopped())b.type=g>1?j:o.bindType||q,m=(N.get(h,"events")||{})[b.type]&&N.get(h,"handle"),m&&m.apply(h,c),m=l&&h[l],m&&m.apply&&L(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=q,f||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!L(e)||l&&n.isFunction(e[q])&&!n.isWindow(e)&&(i=e[l],i&&(e[l]=null),n.event.triggered=q,e[q](),n.event.triggered=void 0,i&&(e[l]=i)),b.result}},simulate:function(a,b,c){var d=n.extend(new n.Event,c,{type:a,isSimulated:!0});n.event.trigger(d,null,b)}}),n.fn.extend({trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),l.focusin="onfocusin"in a,l.focusin||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a))};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=N.access(d,b);e||d.addEventListener(a,c,!0),N.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=N.access(d,b)-1;e?N.access(d,b,e):(d.removeEventListener(a,c,!0),N.remove(d,b))}}});var jb=a.location,kb=n.now(),lb=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||n.error("Invalid XML: "+b),c};var mb=/#.*$/,nb=/([?&])_=[^&]*/,ob=/^(.*?):[ \t]*([^\r\n]*)$/gm,pb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,qb=/^(?:GET|HEAD)$/,rb=/^\/\//,sb={},tb={},ub="*/".concat("*"),vb=d.createElement("a");vb.href=jb.href;function wb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(G)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function xb(a,b,c,d){var e={},f=a===tb;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function yb(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function zb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Ab(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:jb.href,type:"GET",isLocal:pb.test(jb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":ub,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?yb(yb(a,n.ajaxSettings),b):yb(n.ajaxSettings,a)},ajaxPrefilter:wb(sb),ajaxTransport:wb(tb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m=n.ajaxSetup({},c),o=m.context||m,p=m.context&&(o.nodeType||o.jquery)?n(o):n.event,q=n.Deferred(),r=n.Callbacks("once memory"),s=m.statusCode||{},t={},u={},v=0,w="canceled",x={readyState:0,getResponseHeader:function(a){var b;if(2===v){if(!h){h={};while(b=ob.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===v?g:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return v||(a=u[c]=u[c]||a,t[a]=b),this},overrideMimeType:function(a){return v||(m.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>v)for(b in a)s[b]=[s[b],a[b]];else x.always(a[x.status]);return this},abort:function(a){var b=a||w;return e&&e.abort(b),z(0,b),this}};if(q.promise(x).complete=r.add,x.success=x.done,x.error=x.fail,m.url=((b||m.url||jb.href)+"").replace(mb,"").replace(rb,jb.protocol+"//"),m.type=c.method||c.type||m.method||m.type,m.dataTypes=n.trim(m.dataType||"*").toLowerCase().match(G)||[""],null==m.crossDomain){j=d.createElement("a");try{j.href=m.url,j.href=j.href,m.crossDomain=vb.protocol+"//"+vb.host!=j.protocol+"//"+j.host}catch(y){m.crossDomain=!0}}if(m.data&&m.processData&&"string"!=typeof m.data&&(m.data=n.param(m.data,m.traditional)),xb(sb,m,c,x),2===v)return x;k=n.event&&m.global,k&&0===n.active++&&n.event.trigger("ajaxStart"),m.type=m.type.toUpperCase(),m.hasContent=!qb.test(m.type),f=m.url,m.hasContent||(m.data&&(f=m.url+=(lb.test(f)?"&":"?")+m.data,delete m.data),m.cache===!1&&(m.url=nb.test(f)?f.replace(nb,"$1_="+kb++):f+(lb.test(f)?"&":"?")+"_="+kb++)),m.ifModified&&(n.lastModified[f]&&x.setRequestHeader("If-Modified-Since",n.lastModified[f]),n.etag[f]&&x.setRequestHeader("If-None-Match",n.etag[f])),(m.data&&m.hasContent&&m.contentType!==!1||c.contentType)&&x.setRequestHeader("Content-Type",m.contentType),x.setRequestHeader("Accept",m.dataTypes[0]&&m.accepts[m.dataTypes[0]]?m.accepts[m.dataTypes[0]]+("*"!==m.dataTypes[0]?", "+ub+"; q=0.01":""):m.accepts["*"]);for(l in m.headers)x.setRequestHeader(l,m.headers[l]);if(m.beforeSend&&(m.beforeSend.call(o,x,m)===!1||2===v))return x.abort();w="abort";for(l in{success:1,error:1,complete:1})x[l](m[l]);if(e=xb(tb,m,c,x)){if(x.readyState=1,k&&p.trigger("ajaxSend",[x,m]),2===v)return x;m.async&&m.timeout>0&&(i=a.setTimeout(function(){x.abort("timeout")},m.timeout));try{v=1,e.send(t,z)}catch(y){if(!(2>v))throw y;z(-1,y)}}else z(-1,"No Transport");function z(b,c,d,h){var j,l,t,u,w,y=c;2!==v&&(v=2,i&&a.clearTimeout(i),e=void 0,g=h||"",x.readyState=b>0?4:0,j=b>=200&&300>b||304===b,d&&(u=zb(m,x,d)),u=Ab(m,u,x,j),j?(m.ifModified&&(w=x.getResponseHeader("Last-Modified"),w&&(n.lastModified[f]=w),w=x.getResponseHeader("etag"),w&&(n.etag[f]=w)),204===b||"HEAD"===m.type?y="nocontent":304===b?y="notmodified":(y=u.state,l=u.data,t=u.error,j=!t)):(t=y,!b&&y||(y="error",0>b&&(b=0))),x.status=b,x.statusText=(c||y)+"",j?q.resolveWith(o,[l,y,x]):q.rejectWith(o,[x,y,t]),x.statusCode(s),s=void 0,k&&p.trigger(j?"ajaxSuccess":"ajaxError",[x,m,j?l:t]),r.fireWith(o,[x,y]),k&&(p.trigger("ajaxComplete",[x,m]),--n.active||n.event.trigger("ajaxStop")))}return x},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax(n.extend({url:a,type:b,dataType:e,data:c,success:d},n.isPlainObject(a)&&a))}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return n.isFunction(a)?this.each(function(b){n(this).wrapInner(a.call(this,b))}):this.each(function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return!n.expr.filters.visible(a)},n.expr.filters.visible=function(a){return a.offsetWidth>0||a.offsetHeight>0||a.getClientRects().length>0};var Bb=/%20/g,Cb=/\[\]$/,Db=/\r?\n/g,Eb=/^(?:submit|button|image|reset|file)$/i,Fb=/^(?:input|select|textarea|keygen)/i;function Gb(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||Cb.test(a)?d(a,e):Gb(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Gb(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Gb(c,a[c],b,e);return d.join("&").replace(Bb,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&Fb.test(this.nodeName)&&!Eb.test(a)&&(this.checked||!X.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(Db,"\r\n")}}):{name:b.name,value:c.replace(Db,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Hb={0:200,1223:204},Ib=n.ajaxSettings.xhr();l.cors=!!Ib&&"withCredentials"in Ib,l.ajax=Ib=!!Ib,n.ajaxTransport(function(b){var c,d;return l.cors||Ib&&!b.crossDomain?{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Hb[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=n("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Jb=[],Kb=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Jb.pop()||n.expando+"_"+kb++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Kb.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Kb.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Kb,"$1"+e):b.jsonp!==!1&&(b.url+=(lb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?n(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Jb.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||d;var e=x.exec(a),f=!c&&[];return e?[b.createElement(e[1])]:(e=ca([a],b,f),f&&f.length&&n(f).remove(),n.merge([],e.childNodes))};var Lb=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Lb)return Lb.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};function Mb(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,n.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(e=d.getBoundingClientRect(),c=Mb(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Ea})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;n.fn[a]=function(d){return K(this,function(a,d,e){var f=Mb(a);return void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=Ga(l.pixelPosition,function(a,c){return c?(c=Fa(a,b),Ba.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return K(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)},size:function(){return this.length}}),n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var Nb=a.jQuery,Ob=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Ob),b&&a.jQuery===n&&(a.jQuery=Nb),n},b||(a.jQuery=a.$=n),n});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Domain;
(function (Domain) {
    Domain.TLD = ["abogado", "ac", "academy", "accountants", "active", "actor", "ad", "adult", "ae", "aero", "af", "ag", "agency", "ai", "airforce", "al", "allfinanz", "alsace", "am", "amsterdam", "an", "android", "ao", "apartments", "aq", "aquarelle", "ar", "archi", "army", "arpa", "as", "asia", "associates", "at", "attorney", "au", "auction", "audio", "autos", "aw", "ax", "axa", "az", "ba", "band", "bank", "bar", "barclaycard", "barclays", "bargains", "bayern", "bb", "bd", "be", "beer", "berlin", "best", "bf", "bg", "bh", "bi", "bid", "bike", "bingo", "bio", "biz", "bj", "black", "blackfriday", "bloomberg", "blue", "bm", "bmw", "bn", "bnpparibas", "bo", "boo", "boutique", "br", "brussels", "bs", "bt", "budapest", "build", "builders", "business", "buzz", "bv", "bw", "by", "bz", "bzh", "ca", "cab", "cal", "camera", "camp", "cancerresearch", "canon", "capetown", "capital", "caravan", "cards", "care", "career", "careers", "cartier", "casa", "cash", "cat", "catering", "cc", "cd", "center", "ceo", "cern", "cf", "cg", "ch", "channel", "chat", "cheap", "christmas", "chrome", "church", "ci", "citic", "city", "ck", "cl", "claims", "cleaning", "click", "clinic", "clothing", "club", "cm", "cn", "co", "coach", "codes", "coffee", "college", "cologne", "com", "community", "company", "computer", "condos", "construction", "consulting", "contractors", "cooking", "cool", "coop", "country", "cr", "credit", "creditcard", "cricket", "crs", "cruises", "cu", "cuisinella", "cv", "cw", "cx", "cy", "cymru", "cz", "dabur", "dad", "dance", "dating", "day", "dclk", "de", "deals", "degree", "delivery", "democrat", "dental", "dentist", "desi", "design", "dev", "diamonds", "diet", "digital", "direct", "directory", "discount", "dj", "dk", "dm", "dnp", "do", "docs", "domains", "doosan", "durban", "dvag", "dz", "eat", "ec", "edu", "education", "ee", "eg", "email", "emerck", "energy", "engineer", "engineering", "enterprises", "equipment", "er", "es", "esq", "estate", "et", "eu", "eurovision", "eus", "events", "everbank", "exchange", "expert", "exposed", "fail", "farm", "fashion", "feedback", "fi", "finance", "financial", "firmdale", "fish", "fishing", "fit", "fitness", "fj", "fk", "flights", "florist", "flowers", "flsmidth", "fly", "fm", "fo", "foo", "forsale", "foundation", "fr", "frl", "frogans", "fund", "furniture", "futbol", "ga", "gal", "gallery", "garden", "gb", "gbiz", "gd", "ge", "gent", "gf", "gg", "ggee", "gh", "gi", "gift", "gifts", "gives", "gl", "glass", "gle", "global", "globo", "gm", "gmail", "gmo", "gmx", "gn", "goog", "google", "gop", "gov", "gp", "gq", "gr", "graphics", "gratis", "green", "gripe", "gs", "gt", "gu", "guide", "guitars", "guru", "gw", "gy", "hamburg", "hangout", "haus", "healthcare", "help", "here", "hermes", "hiphop", "hiv", "hk", "hm", "hn", "holdings", "holiday", "homes", "horse", "host", "hosting", "house", "how", "hr", "ht", "hu", "ibm", "id", "ie", "ifm", "il", "im", "immo", "immobilien", "in", "industries", "info", "ing", "ink", "institute", "insure", "int", "international", "investments", "io", "iq", "ir", "irish", "is", "it", "iwc", "jcb", "je", "jetzt", "jm", "jo", "jobs", "joburg", "jp", "juegos", "kaufen", "kddi", "ke", "kg", "kh", "ki", "kim", "kitchen", "kiwi", "km", "kn", "koeln", "kp", "kr", "krd", "kred", "kw", "ky", "kyoto", "kz", "la", "lacaixa", "land", "lat", "latrobe", "lawyer", "lb", "lc", "lds", "lease", "legal", "lgbt", "li", "lidl", "life", "lighting", "limited", "limo", "link", "lk", "loans", "london", "lotte", "lotto", "lr", "ls", "lt", "ltda", "lu", "luxe", "luxury", "lv", "ly", "ma", "madrid", "maison", "management", "mango", "market", "marketing", "marriott", "mc", "md", "me", "media", "meet", "melbourne", "meme", "memorial", "menu", "mg", "mh", "miami", "mil", "mini", "mk", "ml", "mm", "mn", "mo", "mobi", "moda", "moe", "monash", "money", "mormon", "mortgage", "moscow", "motorcycles", "mov", "mp", "mq", "mr", "ms", "mt", "mu", "museum", "mv", "mw", "mx", "my", "mz", "na", "nagoya", "name", "navy", "nc", "ne", "net", "network", "neustar", "new", "nexus", "nf", "ng", "ngo", "nhk", "ni", "nico", "ninja", "nl", "no", "np", "nr", "nra", "nrw", "ntt", "nu", "nyc", "nz", "okinawa", "om", "one", "ong", "onl", "ooo", "org", "organic", "osaka", "otsuka", "ovh", "pa", "paris", "partners", "parts", "party", "pe", "pf", "pg", "ph", "pharmacy", "photo", "photography", "photos", "physio", "pics", "pictures", "pink", "pizza", "pk", "pl", "place", "plumbing", "pm", "pn", "pohl", "poker", "porn", "post", "pr", "praxi", "press", "pro", "prod", "productions", "prof", "properties", "property", "ps", "pt", "pub", "pw", "py", "qa", "qpon", "quebec", "re", "realtor", "recipes", "red", "rehab", "reise", "reisen", "reit", "ren", "rentals", "repair", "report", "republican", "rest", "restaurant", "reviews", "rich", "rio", "rip", "ro", "rocks", "rodeo", "rs", "rsvp", "ru", "ruhr", "rw", "ryukyu", "sa", "saarland", "sale", "samsung", "sarl", "saxo", "sb", "sc", "sca", "scb", "schmidt", "schule", "schwarz", "science", "scot", "sd", "se", "services", "sew", "sexy", "sg", "sh", "shiksha", "shoes", "shriram", "si", "singles", "sj", "sk", "sky", "sl", "sm", "sn", "so", "social", "software", "sohu", "solar", "solutions", "soy", "space", "spiegel", "sr", "st", "style", "su", "supplies", "supply", "support", "surf", "surgery", "suzuki", "sv", "sx", "sy", "sydney", "systems", "sz", "taipei", "tatar", "tattoo", "tax", "tc", "td", "technology", "tel", "temasek", "tennis", "tf", "tg", "th", "tienda", "tips", "tires", "tirol", "tj", "tk", "tl", "tm", "tn", "to", "today", "tokyo", "tools", "top", "toshiba", "town", "toys", "tp", "tr", "trade", "training", "travel", "trust", "tt", "tui", "tv", "tw", "tz", "ua", "ug", "uk", "university", "uno", "uol", "us", "uy", "uz", "va", "vacations", "vc", "ve", "vegas", "ventures", "versicherung", "vet", "vg", "vi", "viajes", "video", "villas", "vision", "vlaanderen", "vn", "vodka", "vote", "voting", "voto", "voyage", "vu", "wales", "wang", "watch", "webcam", "website", "wed", "wedding", "wf", "whoswho", "wien", "wiki", "williamhill", "wme", "work", "works", "world", "ws", "wtc", "wtf", "佛山", "集团", "在线", "한국", "ভারত", "八卦", "موقع", "公益", "公司", "移动", "我爱你", "москва", "қаз", "онлайн", "сайт", "срб", "淡马锡", "орг", "삼성", "சிங்கப்பூர்", "商标", "商店", "商城", "дети", "мкд", "中文网", "中信", "中国", "中國", "谷歌", "భారత్", "ලංකා", "ભારત", "भारत", "网店", "संगठन", "网络", "укр", "香港", "台湾", "台灣", "手机", "мон", "الجزائر", "عمان", "ایران", "امارات", "بازار", "الاردن", "بھارت", "المغرب", "السعودية", "مليسيا", "شبكة", "გე", "机构", "组织机构", "ไทย", "سورية", "рус", "рф", "تونس", "みんな", "グーグル", "世界", "ਭਾਰਤ", "网址", "游戏", "vermögensberater", "vermögensberatung", "企业", "مصر", "قطر", "广东", "இலங்கை", "இந்தியா", "新加坡", "فلسطين", "政务", "xxx", "xyz", "yachts", "yandex", "ye", "yoga", "yokohama", "youtube", "yt", "za", "zip", "zm", "zone", "zuerich", "zw"];
})(Domain || (Domain = {}));
var Emoji;
(function (Emoji) {
    Emoji.Config = {
        "00a9": ["\u00A9", ["copyright"]],
        "00ae": ["\u00AE", ["registered"]],
        "203c": ["\u203C", ["bangbang"]],
        "2049": ["\u2049", ["interrobang"]],
        "2122": ["\u2122", ["tm"]],
        "2139": ["\u2139", ["information_source"]],
        "2194": ["\u2194", ["left_right_arrow"]],
        "2195": ["\u2195", ["arrow_up_down"]],
        "2196": ["\u2196", ["arrow_upper_left"]],
        "2197": ["\u2197", ["arrow_upper_right"]],
        "2198": ["\u2198", ["arrow_lower_right"]],
        "2199": ["\u2199", ["arrow_lower_left"]],
        "21a9": ["\u21A9", ["leftwards_arrow_with_hook"]],
        "21aa": ["\u21AA", ["arrow_right_hook"]],
        "231a": ["\u231A", ["watch"]],
        "231b": ["\u231B", ["hourglass"]],
        "23e9": ["\u23E9", ["fast_forward"]],
        "23ea": ["\u23EA", ["rewind"]],
        "23eb": ["\u23EB", ["arrow_double_up"]],
        "23ec": ["\u23EC", ["arrow_double_down"]],
        "23f0": ["\u23F0", ["alarm_clock"]],
        "23f3": ["\u23F3", ["hourglass_flowing_sand"]],
        "24c2": ["\u24C2", ["m"]],
        "25aa": ["\u25AA", ["black_small_square"]],
        "25ab": ["\u25AB", ["white_small_square"]],
        "25b6": ["\u25B6", ["arrow_forward"]],
        "25c0": ["\u25C0", ["arrow_backward"]],
        "25fb": ["\u25FB", ["white_medium_square"]],
        "25fc": ["\u25FC", ["black_medium_square"]],
        "25fd": ["\u25FD", ["white_medium_small_square"]],
        "25fe": ["\u25FE", ["black_medium_small_square"]],
        "2600": ["\u2600", ["sunny"]],
        "2601": ["\u2601", ["cloud"]],
        "260e": ["\u260E", ["phone", "telephone"]],
        "2611": ["\u2611", ["ballot_box_with_check"]],
        "2614": ["\u2614", ["umbrella"]],
        "2615": ["\u2615", ["coffee"]],
        "261d": ["\u261D", ["point_up"]],
        "263a": ["\u263A", ["relaxed"]],
        "2648": ["\u2648", ["aries"]],
        "2649": ["\u2649", ["taurus"]],
        "264a": ["\u264A", ["gemini"]],
        "264b": ["\u264B", ["cancer"]],
        "264c": ["\u264C", ["leo"]],
        "264d": ["\u264D", ["virgo"]],
        "264e": ["\u264E", ["libra"]],
        "264f": ["\u264F", ["scorpius"]],
        "2650": ["\u2650", ["sagittarius"]],
        "2651": ["\u2651", ["capricorn"]],
        "2652": ["\u2652", ["aquarius"]],
        "2653": ["\u2653", ["pisces"]],
        "2660": ["\u2660", ["spades"]],
        "2663": ["\u2663", ["clubs"]],
        "2665": ["\u2665", ["hearts"]],
        "2666": ["\u2666", ["diamonds"]],
        "2668": ["\u2668", ["hotsprings"]],
        "267b": ["\u267B", ["recycle"]],
        "267f": ["\u267F", ["wheelchair"]],
        "2693": ["\u2693", ["anchor"]],
        "26a0": ["\u26A0", ["warning"]],
        "26a1": ["\u26A1", ["zap"]],
        "26aa": ["\u26AA", ["white_circle"]],
        "26ab": ["\u26AB", ["black_circle"]],
        "26bd": ["\u26BD", ["soccer"]],
        "26be": ["\u26BE", ["baseball"]],
        "26c4": ["\u26C4", ["snowman"]],
        "26c5": ["\u26C5", ["partly_sunny"]],
        "26ce": ["\u26CE", ["ophiuchus"]],
        "26d4": ["\u26D4", ["no_entry"]],
        "26ea": ["\u26EA", ["church"]],
        "26f2": ["\u26F2", ["fountain"]],
        "26f3": ["\u26F3", ["golf"]],
        "26f5": ["\u26F5", ["boat", "sailboat"]],
        "26fa": ["\u26FA", ["tent"]],
        "26fd": ["\u26FD", ["fuelpump"]],
        "2702": ["\u2702", ["scissors"]],
        "2705": ["\u2705", ["white_check_mark"]],
        "2708": ["\u2708", ["airplane"]],
        "2709": ["\u2709", ["email", "envelope"]],
        "270a": ["\u270A", ["fist"]],
        "270b": ["\u270B", ["hand", "raised_hand"]],
        "270c": ["\u270C", ["v"]],
        "270f": ["\u270F", ["pencil2"]],
        "2712": ["\u2712", ["black_nib"]],
        "2714": ["\u2714", ["heavy_check_mark"]],
        "2716": ["\u2716", ["heavy_multiplication_x"]],
        "2728": ["\u2728", ["sparkles"]],
        "2733": ["\u2733", ["eight_spoked_asterisk"]],
        "2734": ["\u2734", ["eight_pointed_black_star"]],
        "2744": ["\u2744", ["snowflake"]],
        "2747": ["\u2747", ["sparkle"]],
        "274c": ["\u274C", ["x"]],
        "274e": ["\u274E", ["negative_squared_cross_mark"]],
        "2753": ["\u2753", ["question"]],
        "2754": ["\u2754", ["grey_question"]],
        "2755": ["\u2755", ["grey_exclamation"]],
        "2757": ["\u2757", ["exclamation", "heavy_exclamation_mark"]],
        "2764": ["\u2764", ["heart"], "<3"],
        "2795": ["\u2795", ["heavy_plus_sign"]],
        "2796": ["\u2796", ["heavy_minus_sign"]],
        "2797": ["\u2797", ["heavy_division_sign"]],
        "27a1": ["\u27A1", ["arrow_right"]],
        "27b0": ["\u27B0", ["curly_loop"]],
        "27bf": ["\u27BF", ["loop"]],
        "2934": ["\u2934", ["arrow_heading_up"]],
        "2935": ["\u2935", ["arrow_heading_down"]],
        "2b05": ["\u2B05", ["arrow_left"]],
        "2b06": ["\u2B06", ["arrow_up"]],
        "2b07": ["\u2B07", ["arrow_down"]],
        "2b1b": ["\u2B1B", ["black_large_square"]],
        "2b1c": ["\u2B1C", ["white_large_square"]],
        "2b50": ["\u2B50", ["star"]],
        "2b55": ["\u2B55", ["o"]],
        "3030": ["\u3030", ["wavy_dash"]],
        "303d": ["\u303D", ["part_alternation_mark"]],
        "3297": ["\u3297", ["congratulations"]],
        "3299": ["\u3299", ["secret"]],
        "1f004": ["\uD83C\uDC04", ["mahjong"]],
        "1f0cf": ["\uD83C\uDCCF", ["black_joker"]],
        "1f170": ["\uD83C\uDD70", ["a"]],
        "1f171": ["\uD83C\uDD71", ["b"]],
        "1f17e": ["\uD83C\uDD7E", ["o2"]],
        "1f17f": ["\uD83C\uDD7F", ["parking"]],
        "1f18e": ["\uD83C\uDD8E", ["ab"]],
        "1f191": ["\uD83C\uDD91", ["cl"]],
        "1f192": ["\uD83C\uDD92", ["cool"]],
        "1f193": ["\uD83C\uDD93", ["free"]],
        "1f194": ["\uD83C\uDD94", ["id"]],
        "1f195": ["\uD83C\uDD95", ["new"]],
        "1f196": ["\uD83C\uDD96", ["ng"]],
        "1f197": ["\uD83C\uDD97", ["ok"]],
        "1f198": ["\uD83C\uDD98", ["sos"]],
        "1f199": ["\uD83C\uDD99", ["up"]],
        "1f19a": ["\uD83C\uDD9A", ["vs"]],
        "1f201": ["\uD83C\uDE01", ["koko"]],
        "1f202": ["\uD83C\uDE02", ["sa"]],
        "1f21a": ["\uD83C\uDE1A", ["u7121"]],
        "1f22f": ["\uD83C\uDE2F", ["u6307"]],
        "1f232": ["\uD83C\uDE32", ["u7981"]],
        "1f233": ["\uD83C\uDE33", ["u7a7a"]],
        "1f234": ["\uD83C\uDE34", ["u5408"]],
        "1f235": ["\uD83C\uDE35", ["u6e80"]],
        "1f236": ["\uD83C\uDE36", ["u6709"]],
        "1f237": ["\uD83C\uDE37", ["u6708"]],
        "1f238": ["\uD83C\uDE38", ["u7533"]],
        "1f239": ["\uD83C\uDE39", ["u5272"]],
        "1f23a": ["\uD83C\uDE3A", ["u55b6"]],
        "1f250": ["\uD83C\uDE50", ["ideograph_advantage"]],
        "1f251": ["\uD83C\uDE51", ["accept"]],
        "1f300": ["\uD83C\uDF00", ["cyclone"]],
        "1f301": ["\uD83C\uDF01", ["foggy"]],
        "1f302": ["\uD83C\uDF02", ["closed_umbrella"]],
        "1f303": ["\uD83C\uDF03", ["night_with_stars"]],
        "1f304": ["\uD83C\uDF04", ["sunrise_over_mountains"]],
        "1f305": ["\uD83C\uDF05", ["sunrise"]],
        "1f306": ["\uD83C\uDF06", ["city_sunset"]],
        "1f307": ["\uD83C\uDF07", ["city_sunrise"]],
        "1f308": ["\uD83C\uDF08", ["rainbow"]],
        "1f309": ["\uD83C\uDF09", ["bridge_at_night"]],
        "1f30a": ["\uD83C\uDF0A", ["ocean"]],
        "1f30b": ["\uD83C\uDF0B", ["volcano"]],
        "1f30c": ["\uD83C\uDF0C", ["milky_way"]],
        "1f30d": ["\uD83C\uDF0D", ["earth_africa"]],
        "1f30e": ["\uD83C\uDF0E", ["earth_americas"]],
        "1f30f": ["\uD83C\uDF0F", ["earth_asia"]],
        "1f310": ["\uD83C\uDF10", ["globe_with_meridians"]],
        "1f311": ["\uD83C\uDF11", ["new_moon"]],
        "1f312": ["\uD83C\uDF12", ["waxing_crescent_moon"]],
        "1f313": ["\uD83C\uDF13", ["first_quarter_moon"]],
        "1f314": ["\uD83C\uDF14", ["moon", "waxing_gibbous_moon"]],
        "1f315": ["\uD83C\uDF15", ["full_moon"]],
        "1f316": ["\uD83C\uDF16", ["waning_gibbous_moon"]],
        "1f317": ["\uD83C\uDF17", ["last_quarter_moon"]],
        "1f318": ["\uD83C\uDF18", ["waning_crescent_moon"]],
        "1f319": ["\uD83C\uDF19", ["crescent_moon"]],
        "1f320": ["\uD83C\uDF20", ["stars"]],
        "1f31a": ["\uD83C\uDF1A", ["new_moon_with_face"]],
        "1f31b": ["\uD83C\uDF1B", ["first_quarter_moon_with_face"]],
        "1f31c": ["\uD83C\uDF1C", ["last_quarter_moon_with_face"]],
        "1f31d": ["\uD83C\uDF1D", ["full_moon_with_face"]],
        "1f31e": ["\uD83C\uDF1E", ["sun_with_face"]],
        "1f31f": ["\uD83C\uDF1F", ["star2"]],
        "1f330": ["\uD83C\uDF30", ["chestnut"]],
        "1f331": ["\uD83C\uDF31", ["seedling"]],
        "1f332": ["\uD83C\uDF32", ["evergreen_tree"]],
        "1f333": ["\uD83C\uDF33", ["deciduous_tree"]],
        "1f334": ["\uD83C\uDF34", ["palm_tree"]],
        "1f335": ["\uD83C\uDF35", ["cactus"]],
        "1f337": ["\uD83C\uDF37", ["tulip"]],
        "1f338": ["\uD83C\uDF38", ["cherry_blossom"]],
        "1f339": ["\uD83C\uDF39", ["rose"]],
        "1f33a": ["\uD83C\uDF3A", ["hibiscus"]],
        "1f33b": ["\uD83C\uDF3B", ["sunflower"]],
        "1f33c": ["\uD83C\uDF3C", ["blossom"]],
        "1f33d": ["\uD83C\uDF3D", ["corn"]],
        "1f33e": ["\uD83C\uDF3E", ["ear_of_rice"]],
        "1f33f": ["\uD83C\uDF3F", ["herb"]],
        "1f340": ["\uD83C\uDF40", ["four_leaf_clover"]],
        "1f341": ["\uD83C\uDF41", ["maple_leaf"]],
        "1f342": ["\uD83C\uDF42", ["fallen_leaf"]],
        "1f343": ["\uD83C\uDF43", ["leaves"]],
        "1f344": ["\uD83C\uDF44", ["mushroom"]],
        "1f345": ["\uD83C\uDF45", ["tomato"]],
        "1f346": ["\uD83C\uDF46", ["eggplant"]],
        "1f347": ["\uD83C\uDF47", ["grapes"]],
        "1f348": ["\uD83C\uDF48", ["melon"]],
        "1f349": ["\uD83C\uDF49", ["watermelon"]],
        "1f34a": ["\uD83C\uDF4A", ["tangerine"]],
        "1f34b": ["\uD83C\uDF4B", ["lemon"]],
        "1f34c": ["\uD83C\uDF4C", ["banana"]],
        "1f34d": ["\uD83C\uDF4D", ["pineapple"]],
        "1f34e": ["\uD83C\uDF4E", ["apple"]],
        "1f34f": ["\uD83C\uDF4F", ["green_apple"]],
        "1f350": ["\uD83C\uDF50", ["pear"]],
        "1f351": ["\uD83C\uDF51", ["peach"]],
        "1f352": ["\uD83C\uDF52", ["cherries"]],
        "1f353": ["\uD83C\uDF53", ["strawberry"]],
        "1f354": ["\uD83C\uDF54", ["hamburger"]],
        "1f355": ["\uD83C\uDF55", ["pizza"]],
        "1f356": ["\uD83C\uDF56", ["meat_on_bone"]],
        "1f357": ["\uD83C\uDF57", ["poultry_leg"]],
        "1f358": ["\uD83C\uDF58", ["rice_cracker"]],
        "1f359": ["\uD83C\uDF59", ["rice_ball"]],
        "1f35a": ["\uD83C\uDF5A", ["rice"]],
        "1f35b": ["\uD83C\uDF5B", ["curry"]],
        "1f35c": ["\uD83C\uDF5C", ["ramen"]],
        "1f35d": ["\uD83C\uDF5D", ["spaghetti"]],
        "1f35e": ["\uD83C\uDF5E", ["bread"]],
        "1f35f": ["\uD83C\uDF5F", ["fries"]],
        "1f360": ["\uD83C\uDF60", ["sweet_potato"]],
        "1f361": ["\uD83C\uDF61", ["dango"]],
        "1f362": ["\uD83C\uDF62", ["oden"]],
        "1f363": ["\uD83C\uDF63", ["sushi"]],
        "1f364": ["\uD83C\uDF64", ["fried_shrimp"]],
        "1f365": ["\uD83C\uDF65", ["fish_cake"]],
        "1f366": ["\uD83C\uDF66", ["icecream"]],
        "1f367": ["\uD83C\uDF67", ["shaved_ice"]],
        "1f368": ["\uD83C\uDF68", ["ice_cream"]],
        "1f369": ["\uD83C\uDF69", ["doughnut"]],
        "1f36a": ["\uD83C\uDF6A", ["cookie"]],
        "1f36b": ["\uD83C\uDF6B", ["chocolate_bar"]],
        "1f36c": ["\uD83C\uDF6C", ["candy"]],
        "1f36d": ["\uD83C\uDF6D", ["lollipop"]],
        "1f36e": ["\uD83C\uDF6E", ["custard"]],
        "1f36f": ["\uD83C\uDF6F", ["honey_pot"]],
        "1f370": ["\uD83C\uDF70", ["cake"]],
        "1f371": ["\uD83C\uDF71", ["bento"]],
        "1f372": ["\uD83C\uDF72", ["stew"]],
        "1f373": ["\uD83C\uDF73", ["egg"]],
        "1f374": ["\uD83C\uDF74", ["fork_and_knife"]],
        "1f375": ["\uD83C\uDF75", ["tea"]],
        "1f376": ["\uD83C\uDF76", ["sake"]],
        "1f377": ["\uD83C\uDF77", ["wine_glass"]],
        "1f378": ["\uD83C\uDF78", ["cocktail"]],
        "1f379": ["\uD83C\uDF79", ["tropical_drink"]],
        "1f37a": ["\uD83C\uDF7A", ["beer"]],
        "1f37b": ["\uD83C\uDF7B", ["beers"]],
        "1f37c": ["\uD83C\uDF7C", ["baby_bottle"]],
        "1f380": ["\uD83C\uDF80", ["ribbon"]],
        "1f381": ["\uD83C\uDF81", ["gift"]],
        "1f382": ["\uD83C\uDF82", ["birthday"]],
        "1f383": ["\uD83C\uDF83", ["jack_o_lantern"]],
        "1f384": ["\uD83C\uDF84", ["christmas_tree"]],
        "1f385": ["\uD83C\uDF85", ["santa"]],
        "1f386": ["\uD83C\uDF86", ["fireworks"]],
        "1f387": ["\uD83C\uDF87", ["sparkler"]],
        "1f388": ["\uD83C\uDF88", ["balloon"]],
        "1f389": ["\uD83C\uDF89", ["tada"]],
        "1f38a": ["\uD83C\uDF8A", ["confetti_ball"]],
        "1f38b": ["\uD83C\uDF8B", ["tanabata_tree"]],
        "1f38c": ["\uD83C\uDF8C", ["crossed_flags"]],
        "1f38d": ["\uD83C\uDF8D", ["bamboo"]],
        "1f38e": ["\uD83C\uDF8E", ["dolls"]],
        "1f38f": ["\uD83C\uDF8F", ["flags"]],
        "1f390": ["\uD83C\uDF90", ["wind_chime"]],
        "1f391": ["\uD83C\uDF91", ["rice_scene"]],
        "1f392": ["\uD83C\uDF92", ["school_satchel"]],
        "1f393": ["\uD83C\uDF93", ["mortar_board"]],
        "1f3a0": ["\uD83C\uDFA0", ["carousel_horse"]],
        "1f3a1": ["\uD83C\uDFA1", ["ferris_wheel"]],
        "1f3a2": ["\uD83C\uDFA2", ["roller_coaster"]],
        "1f3a3": ["\uD83C\uDFA3", ["fishing_pole_and_fish"]],
        "1f3a4": ["\uD83C\uDFA4", ["microphone"]],
        "1f3a5": ["\uD83C\uDFA5", ["movie_camera"]],
        "1f3a6": ["\uD83C\uDFA6", ["cinema"]],
        "1f3a7": ["\uD83C\uDFA7", ["headphones"]],
        "1f3a8": ["\uD83C\uDFA8", ["art"]],
        "1f3a9": ["\uD83C\uDFA9", ["tophat"]],
        "1f3aa": ["\uD83C\uDFAA", ["circus_tent"]],
        "1f3ab": ["\uD83C\uDFAB", ["ticket"]],
        "1f3ac": ["\uD83C\uDFAC", ["clapper"]],
        "1f3ad": ["\uD83C\uDFAD", ["performing_arts"]],
        "1f3ae": ["\uD83C\uDFAE", ["video_game"]],
        "1f3af": ["\uD83C\uDFAF", ["dart"]],
        "1f3b0": ["\uD83C\uDFB0", ["slot_machine"]],
        "1f3b1": ["\uD83C\uDFB1", ["8ball"]],
        "1f3b2": ["\uD83C\uDFB2", ["game_die"]],
        "1f3b3": ["\uD83C\uDFB3", ["bowling"]],
        "1f3b4": ["\uD83C\uDFB4", ["flower_playing_cards"]],
        "1f3b5": ["\uD83C\uDFB5", ["musical_note"]],
        "1f3b6": ["\uD83C\uDFB6", ["notes"]],
        "1f3b7": ["\uD83C\uDFB7", ["saxophone"]],
        "1f3b8": ["\uD83C\uDFB8", ["guitar"]],
        "1f3b9": ["\uD83C\uDFB9", ["musical_keyboard"]],
        "1f3ba": ["\uD83C\uDFBA", ["trumpet"]],
        "1f3bb": ["\uD83C\uDFBB", ["violin"]],
        "1f3bc": ["\uD83C\uDFBC", ["musical_score"]],
        "1f3bd": ["\uD83C\uDFBD", ["running_shirt_with_sash"]],
        "1f3be": ["\uD83C\uDFBE", ["tennis"]],
        "1f3bf": ["\uD83C\uDFBF", ["ski"]],
        "1f3c0": ["\uD83C\uDFC0", ["basketball"]],
        "1f3c1": ["\uD83C\uDFC1", ["checkered_flag"]],
        "1f3c2": ["\uD83C\uDFC2", ["snowboarder"]],
        "1f3c3": ["\uD83C\uDFC3", ["runner", "running"]],
        "1f3c4": ["\uD83C\uDFC4", ["surfer"]],
        "1f3c6": ["\uD83C\uDFC6", ["trophy"]],
        "1f3c7": ["\uD83C\uDFC7", ["horse_racing"]],
        "1f3c8": ["\uD83C\uDFC8", ["football"]],
        "1f3c9": ["\uD83C\uDFC9", ["rugby_football"]],
        "1f3ca": ["\uD83C\uDFCA", ["swimmer"]],
        "1f3e0": ["\uD83C\uDFE0", ["house"]],
        "1f3e1": ["\uD83C\uDFE1", ["house_with_garden"]],
        "1f3e2": ["\uD83C\uDFE2", ["office"]],
        "1f3e3": ["\uD83C\uDFE3", ["post_office"]],
        "1f3e4": ["\uD83C\uDFE4", ["european_post_office"]],
        "1f3e5": ["\uD83C\uDFE5", ["hospital"]],
        "1f3e6": ["\uD83C\uDFE6", ["bank"]],
        "1f3e7": ["\uD83C\uDFE7", ["atm"]],
        "1f3e8": ["\uD83C\uDFE8", ["hotel"]],
        "1f3e9": ["\uD83C\uDFE9", ["love_hotel"]],
        "1f3ea": ["\uD83C\uDFEA", ["convenience_store"]],
        "1f3eb": ["\uD83C\uDFEB", ["school"]],
        "1f3ec": ["\uD83C\uDFEC", ["department_store"]],
        "1f3ed": ["\uD83C\uDFED", ["factory"]],
        "1f3ee": ["\uD83C\uDFEE", ["izakaya_lantern", "lantern"]],
        "1f3ef": ["\uD83C\uDFEF", ["japanese_castle"]],
        "1f3f0": ["\uD83C\uDFF0", ["european_castle"]],
        "1f400": ["\uD83D\uDC00", ["rat"]],
        "1f401": ["\uD83D\uDC01", ["mouse2"]],
        "1f402": ["\uD83D\uDC02", ["ox"]],
        "1f403": ["\uD83D\uDC03", ["water_buffalo"]],
        "1f404": ["\uD83D\uDC04", ["cow2"]],
        "1f405": ["\uD83D\uDC05", ["tiger2"]],
        "1f406": ["\uD83D\uDC06", ["leopard"]],
        "1f407": ["\uD83D\uDC07", ["rabbit2"]],
        "1f408": ["\uD83D\uDC08", ["cat2"]],
        "1f409": ["\uD83D\uDC09", ["dragon"]],
        "1f40a": ["\uD83D\uDC0A", ["crocodile"]],
        "1f40b": ["\uD83D\uDC0B", ["whale2"]],
        "1f40c": ["\uD83D\uDC0C", ["snail"]],
        "1f40d": ["\uD83D\uDC0D", ["snake"]],
        "1f40e": ["\uD83D\uDC0E", ["racehorse"]],
        "1f40f": ["\uD83D\uDC0F", ["ram"]],
        "1f410": ["\uD83D\uDC10", ["goat"]],
        "1f411": ["\uD83D\uDC11", ["sheep"]],
        "1f412": ["\uD83D\uDC12", ["monkey"]],
        "1f413": ["\uD83D\uDC13", ["rooster"]],
        "1f414": ["\uD83D\uDC14", ["chicken"]],
        "1f415": ["\uD83D\uDC15", ["dog2"]],
        "1f416": ["\uD83D\uDC16", ["pig2"]],
        "1f417": ["\uD83D\uDC17", ["boar"]],
        "1f418": ["\uD83D\uDC18", ["elephant"]],
        "1f419": ["\uD83D\uDC19", ["octopus"]],
        "1f41a": ["\uD83D\uDC1A", ["shell"]],
        "1f41b": ["\uD83D\uDC1B", ["bug"]],
        "1f41c": ["\uD83D\uDC1C", ["ant"]],
        "1f41d": ["\uD83D\uDC1D", ["bee", "honeybee"]],
        "1f41e": ["\uD83D\uDC1E", ["beetle"]],
        "1f41f": ["\uD83D\uDC1F", ["fish"]],
        "1f420": ["\uD83D\uDC20", ["tropical_fish"]],
        "1f421": ["\uD83D\uDC21", ["blowfish"]],
        "1f422": ["\uD83D\uDC22", ["turtle"]],
        "1f423": ["\uD83D\uDC23", ["hatching_chick"]],
        "1f424": ["\uD83D\uDC24", ["baby_chick"]],
        "1f425": ["\uD83D\uDC25", ["hatched_chick"]],
        "1f426": ["\uD83D\uDC26", ["bird"]],
        "1f427": ["\uD83D\uDC27", ["penguin"]],
        "1f428": ["\uD83D\uDC28", ["koala"]],
        "1f429": ["\uD83D\uDC29", ["poodle"]],
        "1f42a": ["\uD83D\uDC2A", ["dromedary_camel"]],
        "1f42b": ["\uD83D\uDC2B", ["camel"]],
        "1f42c": ["\uD83D\uDC2C", ["dolphin", "flipper"]],
        "1f42d": ["\uD83D\uDC2D", ["mouse"]],
        "1f42e": ["\uD83D\uDC2E", ["cow"]],
        "1f42f": ["\uD83D\uDC2F", ["tiger"]],
        "1f430": ["\uD83D\uDC30", ["rabbit"]],
        "1f431": ["\uD83D\uDC31", ["cat"]],
        "1f432": ["\uD83D\uDC32", ["dragon_face"]],
        "1f433": ["\uD83D\uDC33", ["whale"]],
        "1f434": ["\uD83D\uDC34", ["horse"]],
        "1f435": ["\uD83D\uDC35", ["monkey_face"]],
        "1f436": ["\uD83D\uDC36", ["dog"]],
        "1f437": ["\uD83D\uDC37", ["pig"]],
        "1f438": ["\uD83D\uDC38", ["frog"]],
        "1f439": ["\uD83D\uDC39", ["hamster"]],
        "1f43a": ["\uD83D\uDC3A", ["wolf"]],
        "1f43b": ["\uD83D\uDC3B", ["bear"]],
        "1f43c": ["\uD83D\uDC3C", ["panda_face"]],
        "1f43d": ["\uD83D\uDC3D", ["pig_nose"]],
        "1f43e": ["\uD83D\uDC3E", ["feet", "paw_prints"]],
        "1f440": ["\uD83D\uDC40", ["eyes"]],
        "1f442": ["\uD83D\uDC42", ["ear"]],
        "1f443": ["\uD83D\uDC43", ["nose"]],
        "1f444": ["\uD83D\uDC44", ["lips"]],
        "1f445": ["\uD83D\uDC45", ["tongue"]],
        "1f446": ["\uD83D\uDC46", ["point_up_2"]],
        "1f447": ["\uD83D\uDC47", ["point_down"]],
        "1f448": ["\uD83D\uDC48", ["point_left"]],
        "1f449": ["\uD83D\uDC49", ["point_right"]],
        "1f44a": ["\uD83D\uDC4A", ["facepunch", "punch"]],
        "1f44b": ["\uD83D\uDC4B", ["wave"]],
        "1f44c": ["\uD83D\uDC4C", ["ok_hand"]],
        "1f44d": ["\uD83D\uDC4D", ["+1", "thumbsup"]],
        "1f44e": ["\uD83D\uDC4E", ["-1", "thumbsdown"]],
        "1f44f": ["\uD83D\uDC4F", ["clap"]],
        "1f450": ["\uD83D\uDC50", ["open_hands"]],
        "1f451": ["\uD83D\uDC51", ["crown"]],
        "1f452": ["\uD83D\uDC52", ["womans_hat"]],
        "1f453": ["\uD83D\uDC53", ["eyeglasses"]],
        "1f454": ["\uD83D\uDC54", ["necktie"]],
        "1f455": ["\uD83D\uDC55", ["shirt", "tshirt"]],
        "1f456": ["\uD83D\uDC56", ["jeans"]],
        "1f457": ["\uD83D\uDC57", ["dress"]],
        "1f458": ["\uD83D\uDC58", ["kimono"]],
        "1f459": ["\uD83D\uDC59", ["bikini"]],
        "1f45a": ["\uD83D\uDC5A", ["womans_clothes"]],
        "1f45b": ["\uD83D\uDC5B", ["purse"]],
        "1f45c": ["\uD83D\uDC5C", ["handbag"]],
        "1f45d": ["\uD83D\uDC5D", ["pouch"]],
        "1f45e": ["\uD83D\uDC5E", ["mans_shoe", "shoe"]],
        "1f45f": ["\uD83D\uDC5F", ["athletic_shoe"]],
        "1f460": ["\uD83D\uDC60", ["high_heel"]],
        "1f461": ["\uD83D\uDC61", ["sandal"]],
        "1f462": ["\uD83D\uDC62", ["boot"]],
        "1f463": ["\uD83D\uDC63", ["footprints"]],
        "1f464": ["\uD83D\uDC64", ["bust_in_silhouette"]],
        "1f465": ["\uD83D\uDC65", ["busts_in_silhouette"]],
        "1f466": ["\uD83D\uDC66", ["boy"]],
        "1f467": ["\uD83D\uDC67", ["girl"]],
        "1f468": ["\uD83D\uDC68", ["man"]],
        "1f469": ["\uD83D\uDC69", ["woman"]],
        "1f46a": ["\uD83D\uDC6A", ["family"]],
        "1f46b": ["\uD83D\uDC6B", ["couple"]],
        "1f46c": ["\uD83D\uDC6C", ["two_men_holding_hands"]],
        "1f46d": ["\uD83D\uDC6D", ["two_women_holding_hands"]],
        "1f46e": ["\uD83D\uDC6E", ["cop"]],
        "1f46f": ["\uD83D\uDC6F", ["dancers"]],
        "1f470": ["\uD83D\uDC70", ["bride_with_veil"]],
        "1f471": ["\uD83D\uDC71", ["person_with_blond_hair"]],
        "1f472": ["\uD83D\uDC72", ["man_with_gua_pi_mao"]],
        "1f473": ["\uD83D\uDC73", ["man_with_turban"]],
        "1f474": ["\uD83D\uDC74", ["older_man"]],
        "1f475": ["\uD83D\uDC75", ["older_woman"]],
        "1f476": ["\uD83D\uDC76", ["baby"]],
        "1f477": ["\uD83D\uDC77", ["construction_worker"]],
        "1f478": ["\uD83D\uDC78", ["princess"]],
        "1f479": ["\uD83D\uDC79", ["japanese_ogre"]],
        "1f47a": ["\uD83D\uDC7A", ["japanese_goblin"]],
        "1f47b": ["\uD83D\uDC7B", ["ghost"]],
        "1f47c": ["\uD83D\uDC7C", ["angel"]],
        "1f47d": ["\uD83D\uDC7D", ["alien"]],
        "1f47e": ["\uD83D\uDC7E", ["space_invader"]],
        "1f47f": ["\uD83D\uDC7F", ["imp"]],
        "1f480": ["\uD83D\uDC80", ["skull"]],
        "1f481": ["\uD83D\uDC81", ["information_desk_person"]],
        "1f482": ["\uD83D\uDC82", ["guardsman"]],
        "1f483": ["\uD83D\uDC83", ["dancer"]],
        "1f484": ["\uD83D\uDC84", ["lipstick"]],
        "1f485": ["\uD83D\uDC85", ["nail_care"]],
        "1f486": ["\uD83D\uDC86", ["massage"]],
        "1f487": ["\uD83D\uDC87", ["haircut"]],
        "1f488": ["\uD83D\uDC88", ["barber"]],
        "1f489": ["\uD83D\uDC89", ["syringe"]],
        "1f48a": ["\uD83D\uDC8A", ["pill"]],
        "1f48b": ["\uD83D\uDC8B", ["kiss"]],
        "1f48c": ["\uD83D\uDC8C", ["love_letter"]],
        "1f48d": ["\uD83D\uDC8D", ["ring"]],
        "1f48e": ["\uD83D\uDC8E", ["gem"]],
        "1f48f": ["\uD83D\uDC8F", ["couplekiss"]],
        "1f490": ["\uD83D\uDC90", ["bouquet"]],
        "1f491": ["\uD83D\uDC91", ["couple_with_heart"]],
        "1f492": ["\uD83D\uDC92", ["wedding"]],
        "1f493": ["\uD83D\uDC93", ["heartbeat"]],
        "1f494": ["\uD83D\uDC94", ["broken_heart"], "<\/3"],
        "1f495": ["\uD83D\uDC95", ["two_hearts"]],
        "1f496": ["\uD83D\uDC96", ["sparkling_heart"]],
        "1f497": ["\uD83D\uDC97", ["heartpulse"]],
        "1f498": ["\uD83D\uDC98", ["cupid"]],
        "1f499": ["\uD83D\uDC99", ["blue_heart"], "<3"],
        "1f49a": ["\uD83D\uDC9A", ["green_heart"], "<3"],
        "1f49b": ["\uD83D\uDC9B", ["yellow_heart"], "<3"],
        "1f49c": ["\uD83D\uDC9C", ["purple_heart"], "<3"],
        "1f49d": ["\uD83D\uDC9D", ["gift_heart"]],
        "1f49e": ["\uD83D\uDC9E", ["revolving_hearts"]],
        "1f49f": ["\uD83D\uDC9F", ["heart_decoration"]],
        "1f4a0": ["\uD83D\uDCA0", ["diamond_shape_with_a_dot_inside"]],
        "1f4a1": ["\uD83D\uDCA1", ["bulb"]],
        "1f4a2": ["\uD83D\uDCA2", ["anger"]],
        "1f4a3": ["\uD83D\uDCA3", ["bomb"]],
        "1f4a4": ["\uD83D\uDCA4", ["zzz"]],
        "1f4a5": ["\uD83D\uDCA5", ["boom", "collision"]],
        "1f4a6": ["\uD83D\uDCA6", ["sweat_drops"]],
        "1f4a7": ["\uD83D\uDCA7", ["droplet"]],
        "1f4a8": ["\uD83D\uDCA8", ["dash"]],
        "1f4a9": ["\uD83D\uDCA9", ["hankey", "poop", "shit"]],
        "1f4aa": ["\uD83D\uDCAA", ["muscle"]],
        "1f4ab": ["\uD83D\uDCAB", ["dizzy"]],
        "1f4ac": ["\uD83D\uDCAC", ["speech_balloon"]],
        "1f4ad": ["\uD83D\uDCAD", ["thought_balloon"]],
        "1f4ae": ["\uD83D\uDCAE", ["white_flower"]],
        "1f4af": ["\uD83D\uDCAF", ["100"]],
        "1f4b0": ["\uD83D\uDCB0", ["moneybag"]],
        "1f4b1": ["\uD83D\uDCB1", ["currency_exchange"]],
        "1f4b2": ["\uD83D\uDCB2", ["heavy_dollar_sign"]],
        "1f4b3": ["\uD83D\uDCB3", ["credit_card"]],
        "1f4b4": ["\uD83D\uDCB4", ["yen"]],
        "1f4b5": ["\uD83D\uDCB5", ["dollar"]],
        "1f4b6": ["\uD83D\uDCB6", ["euro"]],
        "1f4b7": ["\uD83D\uDCB7", ["pound"]],
        "1f4b8": ["\uD83D\uDCB8", ["money_with_wings"]],
        "1f4b9": ["\uD83D\uDCB9", ["chart"]],
        "1f4ba": ["\uD83D\uDCBA", ["seat"]],
        "1f4bb": ["\uD83D\uDCBB", ["computer"]],
        "1f4bc": ["\uD83D\uDCBC", ["briefcase"]],
        "1f4bd": ["\uD83D\uDCBD", ["minidisc"]],
        "1f4be": ["\uD83D\uDCBE", ["floppy_disk"]],
        "1f4bf": ["\uD83D\uDCBF", ["cd"]],
        "1f4c0": ["\uD83D\uDCC0", ["dvd"]],
        "1f4c1": ["\uD83D\uDCC1", ["file_folder"]],
        "1f4c2": ["\uD83D\uDCC2", ["open_file_folder"]],
        "1f4c3": ["\uD83D\uDCC3", ["page_with_curl"]],
        "1f4c4": ["\uD83D\uDCC4", ["page_facing_up"]],
        "1f4c5": ["\uD83D\uDCC5", ["date"]],
        "1f4c6": ["\uD83D\uDCC6", ["calendar"]],
        "1f4c7": ["\uD83D\uDCC7", ["card_index"]],
        "1f4c8": ["\uD83D\uDCC8", ["chart_with_upwards_trend"]],
        "1f4c9": ["\uD83D\uDCC9", ["chart_with_downwards_trend"]],
        "1f4ca": ["\uD83D\uDCCA", ["bar_chart"]],
        "1f4cb": ["\uD83D\uDCCB", ["clipboard"]],
        "1f4cc": ["\uD83D\uDCCC", ["pushpin"]],
        "1f4cd": ["\uD83D\uDCCD", ["round_pushpin"]],
        "1f4ce": ["\uD83D\uDCCE", ["paperclip"]],
        "1f4cf": ["\uD83D\uDCCF", ["straight_ruler"]],
        "1f4d0": ["\uD83D\uDCD0", ["triangular_ruler"]],
        "1f4d1": ["\uD83D\uDCD1", ["bookmark_tabs"]],
        "1f4d2": ["\uD83D\uDCD2", ["ledger"]],
        "1f4d3": ["\uD83D\uDCD3", ["notebook"]],
        "1f4d4": ["\uD83D\uDCD4", ["notebook_with_decorative_cover"]],
        "1f4d5": ["\uD83D\uDCD5", ["closed_book"]],
        "1f4d6": ["\uD83D\uDCD6", ["book", "open_book"]],
        "1f4d7": ["\uD83D\uDCD7", ["green_book"]],
        "1f4d8": ["\uD83D\uDCD8", ["blue_book"]],
        "1f4d9": ["\uD83D\uDCD9", ["orange_book"]],
        "1f4da": ["\uD83D\uDCDA", ["books"]],
        "1f4db": ["\uD83D\uDCDB", ["name_badge"]],
        "1f4dc": ["\uD83D\uDCDC", ["scroll"]],
        "1f4dd": ["\uD83D\uDCDD", ["memo", "pencil"]],
        "1f4de": ["\uD83D\uDCDE", ["telephone_receiver"]],
        "1f4df": ["\uD83D\uDCDF", ["pager"]],
        "1f4e0": ["\uD83D\uDCE0", ["fax"]],
        "1f4e1": ["\uD83D\uDCE1", ["satellite"]],
        "1f4e2": ["\uD83D\uDCE2", ["loudspeaker"]],
        "1f4e3": ["\uD83D\uDCE3", ["mega"]],
        "1f4e4": ["\uD83D\uDCE4", ["outbox_tray"]],
        "1f4e5": ["\uD83D\uDCE5", ["inbox_tray"]],
        "1f4e6": ["\uD83D\uDCE6", ["package"]],
        "1f4e7": ["\uD83D\uDCE7", ["e-mail"]],
        "1f4e8": ["\uD83D\uDCE8", ["incoming_envelope"]],
        "1f4e9": ["\uD83D\uDCE9", ["envelope_with_arrow"]],
        "1f4ea": ["\uD83D\uDCEA", ["mailbox_closed"]],
        "1f4eb": ["\uD83D\uDCEB", ["mailbox"]],
        "1f4ec": ["\uD83D\uDCEC", ["mailbox_with_mail"]],
        "1f4ed": ["\uD83D\uDCED", ["mailbox_with_no_mail"]],
        "1f4ee": ["\uD83D\uDCEE", ["postbox"]],
        "1f4ef": ["\uD83D\uDCEF", ["postal_horn"]],
        "1f4f0": ["\uD83D\uDCF0", ["newspaper"]],
        "1f4f1": ["\uD83D\uDCF1", ["iphone"]],
        "1f4f2": ["\uD83D\uDCF2", ["calling"]],
        "1f4f3": ["\uD83D\uDCF3", ["vibration_mode"]],
        "1f4f4": ["\uD83D\uDCF4", ["mobile_phone_off"]],
        "1f4f5": ["\uD83D\uDCF5", ["no_mobile_phones"]],
        "1f4f6": ["\uD83D\uDCF6", ["signal_strength"]],
        "1f4f7": ["\uD83D\uDCF7", ["camera"]],
        "1f4f9": ["\uD83D\uDCF9", ["video_camera"]],
        "1f4fa": ["\uD83D\uDCFA", ["tv"]],
        "1f4fb": ["\uD83D\uDCFB", ["radio"]],
        "1f4fc": ["\uD83D\uDCFC", ["vhs"]],
        "1f500": ["\uD83D\uDD00", ["twisted_rightwards_arrows"]],
        "1f501": ["\uD83D\uDD01", ["repeat"]],
        "1f502": ["\uD83D\uDD02", ["repeat_one"]],
        "1f503": ["\uD83D\uDD03", ["arrows_clockwise"]],
        "1f504": ["\uD83D\uDD04", ["arrows_counterclockwise"]],
        "1f505": ["\uD83D\uDD05", ["low_brightness"]],
        "1f506": ["\uD83D\uDD06", ["high_brightness"]],
        "1f507": ["\uD83D\uDD07", ["mute"]],
        "1f508": ["\uD83D\uDD09", ["speaker"]],
        "1f509": ["\uD83D\uDD09", ["sound"]],
        "1f50a": ["\uD83D\uDD0A", ["loud_sound"]],
        "1f50b": ["\uD83D\uDD0B", ["battery"]],
        "1f50c": ["\uD83D\uDD0C", ["electric_plug"]],
        "1f50d": ["\uD83D\uDD0D", ["mag"]],
        "1f50e": ["\uD83D\uDD0E", ["mag_right"]],
        "1f50f": ["\uD83D\uDD0F", ["lock_with_ink_pen"]],
        "1f510": ["\uD83D\uDD10", ["closed_lock_with_key"]],
        "1f511": ["\uD83D\uDD11", ["key"]],
        "1f512": ["\uD83D\uDD12", ["lock"]],
        "1f513": ["\uD83D\uDD13", ["unlock"]],
        "1f514": ["\uD83D\uDD14", ["bell"]],
        "1f515": ["\uD83D\uDD15", ["no_bell"]],
        "1f516": ["\uD83D\uDD16", ["bookmark"]],
        "1f517": ["\uD83D\uDD17", ["link"]],
        "1f518": ["\uD83D\uDD18", ["radio_button"]],
        "1f519": ["\uD83D\uDD19", ["back"]],
        "1f51a": ["\uD83D\uDD1A", ["end"]],
        "1f51b": ["\uD83D\uDD1B", ["on"]],
        "1f51c": ["\uD83D\uDD1C", ["soon"]],
        "1f51d": ["\uD83D\uDD1D", ["top"]],
        "1f51e": ["\uD83D\uDD1E", ["underage"]],
        "1f51f": ["\uD83D\uDD1F", ["keycap_ten"]],
        "1f520": ["\uD83D\uDD20", ["capital_abcd"]],
        "1f521": ["\uD83D\uDD21", ["abcd"]],
        "1f522": ["\uD83D\uDD22", ["1234"]],
        "1f523": ["\uD83D\uDD23", ["symbols"]],
        "1f524": ["\uD83D\uDD24", ["abc"]],
        "1f525": ["\uD83D\uDD25", ["fire"]],
        "1f526": ["\uD83D\uDD26", ["flashlight"]],
        "1f527": ["\uD83D\uDD27", ["wrench"]],
        "1f528": ["\uD83D\uDD28", ["hammer"]],
        "1f529": ["\uD83D\uDD29", ["nut_and_bolt"]],
        "1f52a": ["\uD83D\uDD2A", ["hocho"]],
        "1f52b": ["\uD83D\uDD2B", ["gun"]],
        "1f52c": ["\uD83D\uDD2C", ["microscope"]],
        "1f52d": ["\uD83D\uDD2D", ["telescope"]],
        "1f52e": ["\uD83D\uDD2E", ["crystal_ball"]],
        "1f52f": ["\uD83D\uDD2F", ["six_pointed_star"]],
        "1f530": ["\uD83D\uDD30", ["beginner"]],
        "1f531": ["\uD83D\uDD31", ["trident"]],
        "1f532": ["\uD83D\uDD32", ["black_square_button"]],
        "1f533": ["\uD83D\uDD33", ["white_square_button"]],
        "1f534": ["\uD83D\uDD34", ["red_circle"]],
        "1f535": ["\uD83D\uDD35", ["large_blue_circle"]],
        "1f536": ["\uD83D\uDD36", ["large_orange_diamond"]],
        "1f537": ["\uD83D\uDD37", ["large_blue_diamond"]],
        "1f538": ["\uD83D\uDD38", ["small_orange_diamond"]],
        "1f539": ["\uD83D\uDD39", ["small_blue_diamond"]],
        "1f53a": ["\uD83D\uDD3A", ["small_red_triangle"]],
        "1f53b": ["\uD83D\uDD3B", ["small_red_triangle_down"]],
        "1f53c": ["\uD83D\uDD3C", ["arrow_up_small"]],
        "1f53d": ["\uD83D\uDD3D", ["arrow_down_small"]],
        "1f550": ["\uD83D\uDD50", ["clock1"]],
        "1f551": ["\uD83D\uDD51", ["clock2"]],
        "1f552": ["\uD83D\uDD52", ["clock3"]],
        "1f553": ["\uD83D\uDD53", ["clock4"]],
        "1f554": ["\uD83D\uDD54", ["clock5"]],
        "1f555": ["\uD83D\uDD55", ["clock6"]],
        "1f556": ["\uD83D\uDD56", ["clock7"]],
        "1f557": ["\uD83D\uDD57", ["clock8"]],
        "1f558": ["\uD83D\uDD58", ["clock9"]],
        "1f559": ["\uD83D\uDD59", ["clock10"]],
        "1f55a": ["\uD83D\uDD5A", ["clock11"]],
        "1f55b": ["\uD83D\uDD5B", ["clock12"]],
        "1f55c": ["\uD83D\uDD5C", ["clock130"]],
        "1f55d": ["\uD83D\uDD5D", ["clock230"]],
        "1f55e": ["\uD83D\uDD5E", ["clock330"]],
        "1f55f": ["\uD83D\uDD5F", ["clock430"]],
        "1f560": ["\uD83D\uDD60", ["clock530"]],
        "1f561": ["\uD83D\uDD61", ["clock630"]],
        "1f562": ["\uD83D\uDD62", ["clock730"]],
        "1f563": ["\uD83D\uDD63", ["clock830"]],
        "1f564": ["\uD83D\uDD64", ["clock930"]],
        "1f565": ["\uD83D\uDD65", ["clock1030"]],
        "1f566": ["\uD83D\uDD66", ["clock1130"]],
        "1f567": ["\uD83D\uDD67", ["clock1230"]],
        "1f5fb": ["\uD83D\uDDFB", ["mount_fuji"]],
        "1f5fc": ["\uD83D\uDDFC", ["tokyo_tower"]],
        "1f5fd": ["\uD83D\uDDFD", ["statue_of_liberty"]],
        "1f5fe": ["\uD83D\uDDFE", ["japan"]],
        "1f5ff": ["\uD83D\uDDFF", ["moyai"]],
        "1f600": ["\uD83D\uDE00", ["grinning"]],
        "1f601": ["\uD83D\uDE01", ["grin"]],
        "1f602": ["\uD83D\uDE02", ["joy"]],
        "1f603": ["\uD83D\uDE03", ["smiley"], ":)"],
        "1f604": ["\uD83D\uDE04", ["smile"], ":)"],
        "1f605": ["\uD83D\uDE05", ["sweat_smile"]],
        "1f606": ["\uD83D\uDE06", ["laughing", "satisfied"]],
        "1f607": ["\uD83D\uDE07", ["innocent"]],
        "1f608": ["\uD83D\uDE08", ["smiling_imp"]],
        "1f609": ["\uD83D\uDE09", ["wink"], ";)"],
        "1f60a": ["\uD83D\uDE0A", ["blush"]],
        "1f60b": ["\uD83D\uDE0B", ["yum"]],
        "1f60c": ["\uD83D\uDE0C", ["relieved"]],
        "1f60d": ["\uD83D\uDE0D", ["heart_eyes"]],
        "1f60e": ["\uD83D\uDE0E", ["sunglasses"]],
        "1f60f": ["\uD83D\uDE0F", ["smirk"]],
        "1f610": ["\uD83D\uDE10", ["neutral_face"]],
        "1f611": ["\uD83D\uDE11", ["expressionless"]],
        "1f612": ["\uD83D\uDE12", ["unamused"]],
        "1f613": ["\uD83D\uDE13", ["sweat"]],
        "1f614": ["\uD83D\uDE14", ["pensive"]],
        "1f615": ["\uD83D\uDE15", ["confused"]],
        "1f616": ["\uD83D\uDE16", ["confounded"]],
        "1f617": ["\uD83D\uDE17", ["kissing"]],
        "1f618": ["\uD83D\uDE18", ["kissing_heart"]],
        "1f619": ["\uD83D\uDE19", ["kissing_smiling_eyes"]],
        "1f61a": ["\uD83D\uDE1A", ["kissing_closed_eyes"]],
        "1f61b": ["\uD83D\uDE1B", ["stuck_out_tongue"]],
        "1f61c": ["\uD83D\uDE1C", ["stuck_out_tongue_winking_eye"], ";p"],
        "1f61d": ["\uD83D\uDE1D", ["stuck_out_tongue_closed_eyes"]],
        "1f61e": ["\uD83D\uDE1E", ["disappointed"], ":("],
        "1f61f": ["\uD83D\uDE1F", ["worried"]],
        "1f620": ["\uD83D\uDE20", ["angry"]],
        "1f621": ["\uD83D\uDE21", ["rage"]],
        "1f622": ["\uD83D\uDE22", ["cry"], ":'("],
        "1f623": ["\uD83D\uDE23", ["persevere"]],
        "1f624": ["\uD83D\uDE24", ["triumph"]],
        "1f625": ["\uD83D\uDE25", ["disappointed_relieved"]],
        "1f626": ["\uD83D\uDE26", ["frowning"]],
        "1f627": ["\uD83D\uDE27", ["anguished"]],
        "1f628": ["\uD83D\uDE28", ["fearful"]],
        "1f629": ["\uD83D\uDE29", ["weary"]],
        "1f62a": ["\uD83D\uDE2A", ["sleepy"]],
        "1f62b": ["\uD83D\uDE2B", ["tired_face"]],
        "1f62c": ["\uD83D\uDE2C", ["grimacing"]],
        "1f62d": ["\uD83D\uDE2D", ["sob"], ":'("],
        "1f62e": ["\uD83D\uDE2E", ["open_mouth"]],
        "1f62f": ["\uD83D\uDE2F", ["hushed"]],
        "1f630": ["\uD83D\uDE30", ["cold_sweat"]],
        "1f631": ["\uD83D\uDE31", ["scream"]],
        "1f632": ["\uD83D\uDE32", ["astonished"]],
        "1f633": ["\uD83D\uDE33", ["flushed"]],
        "1f634": ["\uD83D\uDE34", ["sleeping"]],
        "1f635": ["\uD83D\uDE35", ["dizzy_face"]],
        "1f636": ["\uD83D\uDE36", ["no_mouth"]],
        "1f637": ["\uD83D\uDE37", ["mask"]],
        "1f638": ["\uD83D\uDE38", ["smile_cat"]],
        "1f639": ["\uD83D\uDE39", ["joy_cat"]],
        "1f63a": ["\uD83D\uDE3A", ["smiley_cat"]],
        "1f63b": ["\uD83D\uDE3B", ["heart_eyes_cat"]],
        "1f63c": ["\uD83D\uDE3C", ["smirk_cat"]],
        "1f63d": ["\uD83D\uDE3D", ["kissing_cat"]],
        "1f63e": ["\uD83D\uDE3E", ["pouting_cat"]],
        "1f63f": ["\uD83D\uDE3F", ["crying_cat_face"]],
        "1f640": ["\uD83D\uDE40", ["scream_cat"]],
        "1f645": ["\uD83D\uDE45", ["no_good"]],
        "1f646": ["\uD83D\uDE46", ["ok_woman"]],
        "1f647": ["\uD83D\uDE47", ["bow"]],
        "1f648": ["\uD83D\uDE48", ["see_no_evil"]],
        "1f649": ["\uD83D\uDE49", ["hear_no_evil"]],
        "1f64a": ["\uD83D\uDE4A", ["speak_no_evil"]],
        "1f64b": ["\uD83D\uDE4B", ["raising_hand"]],
        "1f64c": ["\uD83D\uDE4C", ["raised_hands"]],
        "1f64d": ["\uD83D\uDE4D", ["person_frowning"]],
        "1f64e": ["\uD83D\uDE4E", ["person_with_pouting_face"]],
        "1f64f": ["\uD83D\uDE4F", ["pray"]],
        "1f680": ["\uD83D\uDE80", ["rocket"]],
        "1f681": ["\uD83D\uDE81", ["helicopter"]],
        "1f682": ["\uD83D\uDE82", ["steam_locomotive"]],
        "1f683": ["\uD83D\uDE83", ["railway_car"]],
        "1f68b": ["\uD83D\uDE8B", ["train"]],
        "1f684": ["\uD83D\uDE84", ["bullettrain_side"]],
        "1f685": ["\uD83D\uDE85", ["bullettrain_front"]],
        "1f686": ["\uD83D\uDE86", ["train2"]],
        "1f687": ["\uD83D\uDE87", ["metro"]],
        "1f688": ["\uD83D\uDE88", ["light_rail"]],
        "1f689": ["\uD83D\uDE89", ["station"]],
        "1f68a": ["\uD83D\uDE8A", ["tram"]],
        "1f68c": ["\uD83D\uDE8C", ["bus"]],
        "1f68d": ["\uD83D\uDE8D", ["oncoming_bus"]],
        "1f68e": ["\uD83D\uDE8E", ["trolleybus"]],
        "1f68f": ["\uD83D\uDE8F", ["busstop"]],
        "1f690": ["\uD83D\uDE90", ["minibus"]],
        "1f691": ["\uD83D\uDE91", ["ambulance"]],
        "1f692": ["\uD83D\uDE92", ["fire_engine"]],
        "1f693": ["\uD83D\uDE93", ["police_car"]],
        "1f694": ["\uD83D\uDE94", ["oncoming_police_car"]],
        "1f695": ["\uD83D\uDE95", ["taxi"]],
        "1f696": ["\uD83D\uDE96", ["oncoming_taxi"]],
        "1f697": ["\uD83D\uDE97", ["car", "red_car"]],
        "1f698": ["\uD83D\uDE98", ["oncoming_automobile"]],
        "1f699": ["\uD83D\uDE99", ["blue_car"]],
        "1f69a": ["\uD83D\uDE9A", ["truck"]],
        "1f69b": ["\uD83D\uDE9B", ["articulated_lorry"]],
        "1f69c": ["\uD83D\uDE9C", ["tractor"]],
        "1f69d": ["\uD83D\uDE9D", ["monorail"]],
        "1f69e": ["\uD83D\uDE9E", ["mountain_railway"]],
        "1f69f": ["\uD83D\uDE9F", ["suspension_railway"]],
        "1f6a0": ["\uD83D\uDEA0", ["mountain_cableway"]],
        "1f6a1": ["\uD83D\uDEA1", ["aerial_tramway"]],
        "1f6a2": ["\uD83D\uDEA2", ["ship"]],
        "1f6a3": ["\uD83D\uDEA3", ["rowboat"]],
        "1f6a4": ["\uD83D\uDEA4", ["speedboat"]],
        "1f6a5": ["\uD83D\uDEA5", ["traffic_light"]],
        "1f6a6": ["\uD83D\uDEA6", ["vertical_traffic_light"]],
        "1f6a7": ["\uD83D\uDEA7", ["construction"]],
        "1f6a8": ["\uD83D\uDEA8", ["rotating_light"]],
        "1f6a9": ["\uD83D\uDEA9", ["triangular_flag_on_post"]],
        "1f6aa": ["\uD83D\uDEAA", ["door"]],
        "1f6ab": ["\uD83D\uDEAB", ["no_entry_sign"]],
        "1f6ac": ["\uD83D\uDEAC", ["smoking"]],
        "1f6ad": ["\uD83D\uDEAD", ["no_smoking"]],
        "1f6ae": ["\uD83D\uDEAE", ["put_litter_in_its_place"]],
        "1f6af": ["\uD83D\uDEAF", ["do_not_litter"]],
        "1f6b0": ["\uD83D\uDEB0", ["potable_water"]],
        "1f6b1": ["\uD83D\uDEB1", ["non-potable_water"]],
        "1f6b2": ["\uD83D\uDEB2", ["bike"]],
        "1f6b3": ["\uD83D\uDEB3", ["no_bicycles"]],
        "1f6b4": ["\uD83D\uDEB4", ["bicyclist"]],
        "1f6b5": ["\uD83D\uDEB5", ["mountain_bicyclist"]],
        "1f6b6": ["\uD83D\uDEB6", ["walking"]],
        "1f6b7": ["\uD83D\uDEB7", ["no_pedestrians"]],
        "1f6b8": ["\uD83D\uDEB8", ["children_crossing"]],
        "1f6b9": ["\uD83D\uDEB9", ["mens"]],
        "1f6ba": ["\uD83D\uDEBA", ["womens"]],
        "1f6bb": ["\uD83D\uDEBB", ["restroom"]],
        "1f6bc": ["\uD83D\uDEBC", ["baby_symbol"]],
        "1f6bd": ["\uD83D\uDEBD", ["toilet"]],
        "1f6be": ["\uD83D\uDEBE", ["wc"]],
        "1f6bf": ["\uD83D\uDEBF", ["shower"]],
        "1f6c0": ["\uD83D\uDEC0", ["bath"]],
        "1f6c1": ["\uD83D\uDEC1", ["bathtub"]],
        "1f6c2": ["\uD83D\uDEC2", ["passport_control"]],
        "1f6c3": ["\uD83D\uDEC3", ["customs"]],
        "1f6c4": ["\uD83D\uDEC4", ["baggage_claim"]],
        "1f6c5": ["\uD83D\uDEC5", ["left_luggage"]],
        "0023": ["\u0023\u20E3", ["hash"]],
        "0030": ["\u0030\u20E3", ["zero"]],
        "0031": ["\u0031\u20E3", ["one"]],
        "0032": ["\u0032\u20E3", ["two"]],
        "0033": ["\u0033\u20E3", ["three"]],
        "0034": ["\u0034\u20E3", ["four"]],
        "0035": ["\u0035\u20E3", ["five"]],
        "0036": ["\u0036\u20E3", ["six"]],
        "0037": ["\u0037\u20E3", ["seven"]],
        "0038": ["\u0038\u20E3", ["eight"]],
        "0039": ["\u0039\u20E3", ["nine"]],
        "1f1e8-1f1f3": ["\uD83C\uDDE8\uD83C\uDDF3", ["cn"]],
        "1f1e9-1f1ea": ["\uD83C\uDDE9\uD83C\uDDEA", ["de"]],
        "1f1ea-1f1f8": ["\uD83C\uDDEA\uD83C\uDDF8", ["es"]],
        "1f1eb-1f1f7": ["\uD83C\uDDEB\uD83C\uDDF7", ["fr"]],
        "1f1ec-1f1e7": ["\uD83C\uDDEC\uD83C\uDDE7", ["gb", "uk"]],
        "1f1ee-1f1f9": ["\uD83C\uDDEE\uD83C\uDDF9", ["it"]],
        "1f1ef-1f1f5": ["\uD83C\uDDEF\uD83C\uDDF5", ["jp"]],
        "1f1f0-1f1f7": ["\uD83C\uDDF0\uD83C\uDDF7", ["kr"]],
        "1f1f7-1f1fa": ["\uD83C\uDDF7\uD83C\uDDFA", ["ru"]],
        "1f1fa-1f1f8": ["\uD83C\uDDFA\uD83C\uDDF8", ["us"]]
    };
    Emoji.Categories = [["1f604", "1f603", "1f600", "1f60a", "263a", "1f609", "1f60d", "1f618", "1f61a", "1f617", "1f619", "1f61c", "1f61d", "1f61b", "1f633", "1f601", "1f614", "1f60c", "1f612", "1f61e", "1f623", "1f622", "1f602", "1f62d", "1f62a", "1f625", "1f630", "1f605", "1f613", "1f629", "1f62b", "1f628", "1f631", "1f620", "1f621", "1f624", "1f616", "1f606", "1f60b", "1f637", "1f60e", "1f634", "1f635", "1f632", "1f61f", "1f626", "1f627", "1f608", "1f47f", "1f62e", "1f62c", "1f610", "1f615", "1f62f", "1f636", "1f607", "1f60f", "1f611", "1f472", "1f473", "1f46e", "1f477", "1f482", "1f476", "1f466", "1f467", "1f468", "1f469", "1f474", "1f475", "1f471", "1f47c", "1f478", "1f63a", "1f638", "1f63b", "1f63d", "1f63c", "1f640", "1f63f", "1f639", "1f63e", "1f479", "1f47a", "1f648", "1f649", "1f64a", "1f480", "1f47d", "1f4a9", "1f525", "2728", "1f31f", "1f4ab", "1f4a5", "1f4a2", "1f4a6", "1f4a7", "1f4a4", "1f4a8", "1f442", "1f440", "1f443", "1f445", "1f444", "1f44d", "1f44e", "1f44c", "1f44a", "270a", "270c", "1f44b", "270b", "1f450", "1f446", "1f447", "1f449", "1f448", "1f64c", "1f64f", "261d", "1f44f", "1f4aa", "1f6b6", "1f3c3", "1f483", "1f46b", "1f46a", "1f46c", "1f46d", "1f48f", "1f491", "1f46f", "1f646", "1f645", "1f481", "1f64b", "1f486", "1f487", "1f485", "1f470", "1f64e", "1f64d", "1f647", "1f3a9", "1f451", "1f452", "1f45f", "1f45e", "1f461", "1f460", "1f462", "1f455", "1f454", "1f45a", "1f457", "1f3bd", "1f456", "1f458", "1f459", "1f4bc", "1f45c", "1f45d", "1f45b", "1f453", "1f380", "1f302", "1f484", "1f49b", "1f499", "1f49c", "1f49a", "2764", "1f494", "1f497", "1f493", "1f495", "1f496", "1f49e", "1f498", "1f48c", "1f48b", "1f48d", "1f48e", "1f464", "1f465", "1f4ac", "1f463", "1f4ad"], ["1f436", "1f43a", "1f431", "1f42d", "1f439", "1f430", "1f438", "1f42f", "1f428", "1f43b", "1f437", "1f43d", "1f42e", "1f417", "1f435", "1f412", "1f434", "1f411", "1f418", "1f43c", "1f427", "1f426", "1f424", "1f425", "1f423", "1f414", "1f40d", "1f422", "1f41b", "1f41d", "1f41c", "1f41e", "1f40c", "1f419", "1f41a", "1f420", "1f41f", "1f42c", "1f433", "1f40b", "1f404", "1f40f", "1f400", "1f403", "1f405", "1f407", "1f409", "1f40e", "1f410", "1f413", "1f415", "1f416", "1f401", "1f402", "1f432", "1f421", "1f40a", "1f42b", "1f42a", "1f406", "1f408", "1f429", "1f43e", "1f490", "1f338", "1f337", "1f340", "1f339", "1f33b", "1f33a", "1f341", "1f343", "1f342", "1f33f", "1f33e", "1f344", "1f335", "1f334", "1f332", "1f333", "1f330", "1f331", "1f33c", "1f310", "1f31e", "1f31d", "1f31a", "1f311", "1f312", "1f313", "1f314", "1f315", "1f316", "1f317", "1f318", "1f31c", "1f31b", "1f319", "1f30d", "1f30e", "1f30f", "1f30b", "1f30c", "1f320", "2b50", "2600", "26c5", "2601", "26a1", "2614", "2744", "26c4", "1f300", "1f301", "1f308", "1f30a"], ["1f38d", "1f49d", "1f38e", "1f392", "1f393", "1f38f", "1f386", "1f387", "1f390", "1f391", "1f383", "1f47b", "1f385", "1f384", "1f381", "1f38b", "1f389", "1f38a", "1f388", "1f38c", "1f52e", "1f3a5", "1f4f7", "1f4f9", "1f4fc", "1f4bf", "1f4c0", "1f4bd", "1f4be", "1f4bb", "1f4f1", "260e", "1f4de", "1f4df", "1f4e0", "1f4e1", "1f4fa", "1f4fb", "1f50a", "1f509", "1f508", "1f507", "1f514", "1f515", "1f4e3", "1f4e2", "23f3", "231b", "23f0", "231a", "1f513", "1f512", "1f50f", "1f510", "1f511", "1f50e", "1f4a1", "1f526", "1f506", "1f505", "1f50c", "1f50b", "1f50d", "1f6c0", "1f6c1", "1f6bf", "1f6bd", "1f527", "1f529", "1f528", "1f6aa", "1f6ac", "1f4a3", "1f52b", "1f52a", "1f48a", "1f489", "1f4b0", "1f4b4", "1f4b5", "1f4b7", "1f4b6", "1f4b3", "1f4b8", "1f4f2", "1f4e7", "1f4e5", "1f4e4", "2709", "1f4e9", "1f4e8", "1f4ef", "1f4eb", "1f4ea", "1f4ec", "1f4ed", "1f4ee", "1f4e6", "1f4dd", "1f4c4", "1f4c3", "1f4d1", "1f4ca", "1f4c8", "1f4c9", "1f4dc", "1f4cb", "1f4c5", "1f4c6", "1f4c7", "1f4c1", "1f4c2", "2702", "1f4cc", "1f4ce", "2712", "270f", "1f4cf", "1f4d0", "1f4d5", "1f4d7", "1f4d8", "1f4d9", "1f4d3", "1f4d4", "1f4d2", "1f4da", "1f4d6", "1f516", "1f4db", "1f52c", "1f52d", "1f4f0", "1f3a8", "1f3ac", "1f3a4", "1f3a7", "1f3bc", "1f3b5", "1f3b6", "1f3b9", "1f3bb", "1f3ba", "1f3b7", "1f3b8", "1f47e", "1f3ae", "1f0cf", "1f3b4", "1f004", "1f3b2", "1f3af", "1f3c8", "1f3c0", "26bd", "26be", "1f3be", "1f3b1", "1f3c9", "1f3b3", "26f3", "1f6b5", "1f6b4", "1f3c1", "1f3c7", "1f3c6", "1f3bf", "1f3c2", "1f3ca", "1f3c4", "1f3a3", "2615", "1f375", "1f376", "1f37c", "1f37a", "1f37b", "1f378", "1f379", "1f377", "1f374", "1f355", "1f354", "1f35f", "1f357", "1f356", "1f35d", "1f35b", "1f364", "1f371", "1f363", "1f365", "1f359", "1f358", "1f35a", "1f35c", "1f372", "1f362", "1f361", "1f373", "1f35e", "1f369", "1f36e", "1f366", "1f368", "1f367", "1f382", "1f370", "1f36a", "1f36b", "1f36c", "1f36d", "1f36f", "1f34e", "1f34f", "1f34a", "1f34b", "1f352", "1f347", "1f349", "1f353", "1f351", "1f348", "1f34c", "1f350", "1f34d", "1f360", "1f346", "1f345", "1f33d"], ["1f3e0", "1f3e1", "1f3eb", "1f3e2", "1f3e3", "1f3e5", "1f3e6", "1f3ea", "1f3e9", "1f3e8", "1f492", "26ea", "1f3ec", "1f3e4", "1f307", "1f306", "1f3ef", "1f3f0", "26fa", "1f3ed", "1f5fc", "1f5fe", "1f5fb", "1f304", "1f305", "1f303", "1f5fd", "1f309", "1f3a0", "1f3a1", "26f2", "1f3a2", "1f6a2", "26f5", "1f6a4", "1f6a3", "2693", "1f680", "2708", "1f4ba", "1f681", "1f682", "1f68a", "1f689", "1f69e", "1f686", "1f684", "1f685", "1f688", "1f687", "1f69d", "1f683", "1f68b", "1f68e", "1f68c", "1f68d", "1f699", "1f698", "1f697", "1f695", "1f696", "1f69b", "1f69a", "1f6a8", "1f693", "1f694", "1f692", "1f691", "1f690", "1f6b2", "1f6a1", "1f69f", "1f6a0", "1f69c", "1f488", "1f68f", "1f3ab", "1f6a6", "1f6a5", "26a0", "1f6a7", "1f530", "26fd", "1f3ee", "1f3b0", "2668", "1f5ff", "1f3aa", "1f3ad", "1f4cd", "1f6a9", "1f1ef-1f1f5", "1f1f0-1f1f7", "1f1e9-1f1ea", "1f1e8-1f1f3", "1f1fa-1f1f8", "1f1eb-1f1f7", "1f1ea-1f1f8", "1f1ee-1f1f9", "1f1f7-1f1fa", "1f1ec-1f1e7"], ["0031", "0032", "0033", "0034", "0035", "0036", "0037", "0038", "0039", "0030", "1f51f", "1f522", "0023", "1f523", "2b06", "2b07", "2b05", "27a1", "1f520", "1f521", "1f524", "2197", "2196", "2198", "2199", "2194", "2195", "1f504", "25c0", "25b6", "1f53c", "1f53d", "21a9", "21aa", "2139", "23ea", "23e9", "23eb", "23ec", "2935", "2934", "1f197", "1f500", "1f501", "1f502", "1f195", "1f199", "1f192", "1f193", "1f196", "1f4f6", "1f3a6", "1f201", "1f22f", "1f233", "1f235", "1f234", "1f232", "1f250", "1f239", "1f23a", "1f236", "1f21a", "1f6bb", "1f6b9", "1f6ba", "1f6bc", "1f6be", "1f6b0", "1f6ae", "1f17f", "267f", "1f6ad", "1f237", "1f238", "1f202", "24c2", "1f6c2", "1f6c4", "1f6c5", "1f6c3", "1f251", "3299", "3297", "1f191", "1f198", "1f194", "1f6ab", "1f51e", "1f4f5", "1f6af", "1f6b1", "1f6b3", "1f6b7", "1f6b8", "26d4", "2733", "2747", "274e", "2705", "2734", "1f49f", "1f19a", "1f4f3", "1f4f4", "1f170", "1f171", "1f18e", "1f17e", "1f4a0", "27bf", "267b", "2648", "2649", "264a", "264b", "264c", "264d", "264e", "264f", "2650", "2651", "2652", "2653", "26ce", "1f52f", "1f3e7", "1f4b9", "1f4b2", "1f4b1", "00a9", "00ae", "2122", "274c", "203c", "2049", "2757", "2753", "2755", "2754", "2b55", "1f51d", "1f51a", "1f519", "1f51b", "1f51c", "1f503", "1f55b", "1f567", "1f550", "1f55c", "1f551", "1f55d", "1f552", "1f55e", "1f553", "1f55f", "1f554", "1f560", "1f555", "1f556", "1f557", "1f558", "1f559", "1f55a", "1f561", "1f562", "1f563", "1f564", "1f565", "1f566", "2716", "2795", "2796", "2797", "2660", "2665", "2663", "2666", "1f4ae", "1f4af", "2714", "2611", "1f518", "1f517", "27b0", "3030", "303d", "1f531", "25fc", "25fb", "25fe", "25fd", "25aa", "25ab", "1f53a", "1f532", "1f533", "26ab", "26aa", "1f534", "1f535", "1f53b", "2b1c", "2b1b", "1f536", "1f537", "1f538", "1f539"]];
    Emoji.CategorySpritesheetDimens = [[7, 27], [4, 29], [7, 33], [3, 34], [7, 34]];
})(Emoji || (Emoji = {}));
var WhatsHelp;
(function (WhatsHelp) {
    var RichTextProcessorClass = (function () {
        function RichTextProcessorClass() {
            this.emojiMap = {};
            this.emojiData = Emoji.Config;
            this.emojiIconSize = 18;
            this.emojiSupported = navigator.userAgent.search(/OS X|iPhone|iPad|iOS|Android/i) !== -1;
            this.emojiRegExp = "\\u0023\\u20E3|\\u00a9|\\u00ae|\\u203c|\\u2049|\\u2139|[\\u2194-\\u2199]|\\u21a9|\\u21aa|\\u231a|\\u231b|\\u23e9|[\\u23ea-\\u23ec]|\\u23f0|\\u24c2|\\u25aa|\\u25ab|\\u25b6|\\u2611|\\u2614|\\u26fd|\\u2705|\\u2709|[\\u2795-\\u2797]|\\u27a1|\\u27b0|\\u27bf|\\u2934|\\u2935|[\\u2b05-\\u2b07]|\\u2b1b|\\u2b1c|\\u2b50|\\u2b55|\\u3030|\\u303d|\\u3297|\\u3299|[\\uE000-\\uF8FF\\u270A-\\u2764\\u2122\\u25C0\\u25FB-\\u25FE\\u2615\\u263a\\u2648-\\u2653\\u2660-\\u2668\\u267B\\u267F\\u2693\\u261d\\u26A0-\\u26FA\\u2708\\u2702\\u2601\\u260E]|[\\u2600\\u26C4\\u26BE\\u23F3\\u2764]|\\uD83D[\\uDC00-\\uDFFF]|\\uD83C[\\uDDE8-\\uDDFA\uDDEC]\\uD83C[\\uDDEA-\\uDDFA\uDDE7]|[0-9]\\u20e3|\\uD83C[\\uDC00-\\uDFFF]";
            this.alphaCharsRegExp = "a-z" +
                "\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u00ff" +
                "\\u0100-\\u024f" +
                "\\u0253\\u0254\\u0256\\u0257\\u0259\\u025b\\u0263\\u0268\\u026f\\u0272\\u0289\\u028b" +
                "\\u02bb" +
                "\\u0300-\\u036f" +
                "\\u1e00-\\u1eff" +
                "\\u0400-\\u04ff\\u0500-\\u0527" +
                "\\u2de0-\\u2dff\\ua640-\\ua69f" +
                "\\u0591-\\u05bf\\u05c1-\\u05c2\\u05c4-\\u05c5\\u05c7" +
                "\\u05d0-\\u05ea\\u05f0-\\u05f4" +
                "\\ufb1d-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40-\\ufb41" +
                "\\ufb43-\\ufb44\\ufb46-\\ufb4f" +
                "\\u0610-\\u061a\\u0620-\\u065f\\u066e-\\u06d3\\u06d5-\\u06dc" +
                "\\u06de-\\u06e8\\u06ea-\\u06ef\\u06fa-\\u06fc\\u06ff" +
                "\\u0750-\\u077f\\u08a0\\u08a2-\\u08ac\\u08e4-\\u08fe" +
                "\\ufb50-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb" +
                "\\ufe70-\\ufe74\\ufe76-\\ufefc" +
                "\\u200c" +
                "\\u0e01-\\u0e3a\\u0e40-\\u0e4e" +
                "\\u1100-\\u11ff\\u3130-\\u3185\\uA960-\\uA97F\\uAC00-\\uD7AF\\uD7B0-\\uD7FF" +
                "\\u3003\\u3005\\u303b" +
                "\\uff21-\\uff3a\\uff41-\\uff5a" +
                "\\uff66-\\uff9f" +
                "\\uffa1-\\uffdc";
            this.alphaNumericRegExp = "0-9\_" + this.alphaCharsRegExp;
            this.urlRegExp = "((?:https?|ftp)://|mailto:)?" +
                "(?:\\S{1,64}(?::\\S{0,64})?@)?" +
                "(?:" +
                "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}" +
                "|" +
                "[" + this.alphaCharsRegExp + "0-9][" + this.alphaCharsRegExp + "0-9\-]{0,64}" +
                "(?:\\.[" + this.alphaCharsRegExp + "0-9][" + this.alphaCharsRegExp + "0-9\-]{0,64}){0,10}" +
                "(?:\\.(xn--[0-9a-z]{2,16}|[" + this.alphaCharsRegExp + "]{2,24}))" +
                ")" +
                "(?::\\d{2,5})?" +
                "(?:/(?:\\S{0,255}[^\\s.;,(\\[\\]{}<>\"'])?)?";
            this.usernameRegExp = "[a-zA-Z\\d_]{5,32}";
            this.botCommandRegExp = "\\/([a-zA-Z\\d_]{1,32})(?:@(" + this.usernameRegExp + "))?(\\b|$)";
            this.fullRegExp = new RegExp('(^| )(@)(' + this.usernameRegExp + ')|(' + this.urlRegExp + ')|(\\n)|(' + this.emojiRegExp + ')|(^|\\s)(#[' + this.alphaNumericRegExp + ']{2,64})|(^|\\s)' + this.botCommandRegExp, 'i');
            this.emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            this.youtubeRegExp = /^(?:https?:\/\/)?(?:www\.)?youtu(?:|\.be|be\.com|\.b)(?:\/v\/|\/watch\\?v=|e\/|(?:\/\??#)?\/watch(?:.+)v=)(.{11})(?:\&[^\s]*)?/;
            this.vimeoRegExp = /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/;
            this.instagramRegExp = /^https?:\/\/(?:instagr\.am\/p\/|instagram\.com\/p\/)([a-zA-Z0-9\-\_]+)/i;
            this.vineRegExp = /^https?:\/\/vine\.co\/v\/([a-zA-Z0-9\-\_]+)/i;
            this.twitterRegExp = /^https?:\/\/twitter\.com\/.+?\/status\/\d+/i;
            this.facebookRegExp = /^https?:\/\/(?:www\.|m\.)?facebook\.com\/(?:.+?\/posts\/\d+|(?:story\.php|permalink\.php)\?story_fbid=(\d+)(?:&substory_index=\d+)?&id=(\d+))/i;
            this.gplusRegExp = /^https?:\/\/plus\.google\.com\/\d+\/posts\/[a-zA-Z0-9\-\_]+/i;
            this.soundcloudRegExp = /^https?:\/\/(?:soundcloud\.com|snd\.sc)\/([a-zA-Z0-9%\-\_]+)\/([a-zA-Z0-9%\-\_]+)/i;
            this.spotifyRegExp = /(https?:\/\/(open\.spotify\.com|play\.spotify\.com|spoti\.fi)\/(.+)|spotify:(.+))/i;
            this.markdownRegExp = /(^|\s)(````?)([\s\S]+?)(````?)|(^|\s)`([^\n]+?)`/;
            this.siteHashtags = {
                'Twitter': 'https://twitter.com/hashtag/{1}',
                'Instagram': 'https://instagram.com/explore/tags/{1}/',
                'Google Plus': 'https://plus.google.com/explore/{1}'
            };
            this.siteMentions = {
                'Twitter': 'https://twitter.com/{1}',
                'Instagram': 'https://instagram.com/{1}/',
                'GitHub': 'https://github.com/{1}'
            };
            for (this.emojiCode in this.emojiData) {
                this.emojiMap[this.emojiData[this.emojiCode][0]] = this.emojiCode;
            }
        }
        RichTextProcessorClass.getInstance = function () {
            if (null === RichTextProcessorClass.instance) {
                RichTextProcessorClass.instance = new RichTextProcessorClass();
            }
            return RichTextProcessorClass.instance;
        };
        RichTextProcessorClass.prototype.wrapRichText = function (text, options) {
            if (options === void 0) { options = null; }
            if (!text || !text.length) {
                return '';
            }
            options = options || {};
            var entities = options.entities, contextSite = options.contextSite || 'Telegram', contextExternal = contextSite != 'Telegram', emojiFound = false;
            if (entities === undefined) {
                entities = this.parseEntities(text, options);
            }
            var i = 0;
            var len = entities.length;
            var entity;
            var entityText;
            var skipEntity;
            var url;
            var html = [];
            var lastOffset = 0;
            for (i = 0; i < len; i++) {
                entity = entities[i];
                if (entity.offset > lastOffset) {
                    html.push(this.encodeEntities(text.substr(lastOffset, entity.offset - lastOffset)));
                }
                else if (entity.offset < lastOffset) {
                    continue;
                }
                skipEntity = false;
                entityText = text.substr(entity.offset, entity.length);
                switch (entity._) {
                    case 'messageEntityMention':
                        var contextUrl = !options.noLinks && this.siteMentions[contextSite];
                        if (!contextUrl) {
                            skipEntity = true;
                            break;
                        }
                        var username = entityText.substr(1);
                        var attr = '';
                        if (options.highlightUsername &&
                            options.highlightUsername.toLowerCase() == username.toLowerCase()) {
                            attr = 'class="im_message_mymention"';
                        }
                        html.push('<a ', attr, contextExternal ? ' target="_BLANK" ' : '', ' href="', contextUrl.replace('{1}', encodeURIComponent(username)), '">', this.encodeEntities(entityText), '</a>');
                        break;
                    case 'messageEntityHashtag':
                        var contextUrl = !options.noLinks && this.siteHashtags[contextSite];
                        if (!contextUrl) {
                            html.push(this.wrapRichNestedText(entityText, entity.nested, options));
                            break;
                        }
                        var hashtag = entityText.substr(1);
                        html.push('<a ', contextExternal ? ' target="_BLANK" ' : '', 'href="', contextUrl.replace('{1}', encodeURIComponent(hashtag)), '">', this.encodeEntities(entityText), '</a>');
                        break;
                    case 'messageEntityEmail':
                        if (options.noLinks) {
                            skipEntity = true;
                            break;
                        }
                        html.push('<a href="', this.encodeEntities('mailto:' + entityText), '" target="_BLANK">', this.encodeEntities(entityText), '</a>');
                        break;
                    case 'messageEntityUrl':
                    case 'messageEntityTextUrl':
                        if (options.noLinks) {
                            skipEntity = true;
                            break;
                        }
                        var url = entity.url || entityText;
                        if (!url.match(/^https?:\/\//i)) {
                            url = 'http://' + url;
                        }
                        var tgMeMatch;
                        if ((tgMeMatch = url.match(/^https?:\/\/telegram\.me\/(.+)/))) {
                            var path = tgMeMatch[1].split('/');
                            switch (path[0]) {
                                case 'joinchat':
                                    url = 'tg://join?invite=' + path[1];
                                    break;
                                case 'addstickers':
                                    url = 'tg://addstickers?set=' + path[1];
                                    break;
                                default:
                                    var domainQuery = path[0].split('?');
                                    url = 'tg://resolve?domain=' + domainQuery[0] + (domainQuery[1] ? '&' + domainQuery[1] : '');
                            }
                        }
                        html.push('<a href="', this.encodeEntities(url), '" target="_BLANK">', this.wrapRichNestedText(entityText, entity.nested, options), '</a>');
                        break;
                    case 'messageEntityLinebreak':
                        html.push(options.noLinebreaks ? ' ' : '<br/>');
                        break;
                    case 'messageEntityEmoji':
                        html.push('<span class="emoji emoji-', entity.coords.category, '-', (this.emojiIconSize * entity.coords.column), '-', (this.emojiIconSize * entity.coords.row), '" ', 'title="', entity.title, '">', ':', entity.title, ':</span>');
                        emojiFound = true;
                        break;
                    case 'messageEntityBotCommand':
                        if (options.noLinks || options.noCommands || contextExternal) {
                            skipEntity = true;
                            break;
                        }
                        var command = entityText.substr(1);
                        var bot, atPos;
                        if ((atPos = command.indexOf('@')) != -1) {
                            bot = command.substr(atPos);
                            command = command.substr(0, atPos);
                        }
                        else {
                            bot = options.fromBot;
                        }
                        html.push('<a href="', this.encodeEntities('tg://bot_command?command=' + encodeURIComponent(command) + (bot ? '&bot=' + encodeURIComponent(bot) : '')), '">', this.encodeEntities(entityText), '</a>');
                        break;
                    case 'messageEntityBold':
                        html.push('<strong>', this.wrapRichNestedText(entityText, entity.nested, options), '</strong>');
                        break;
                    case 'messageEntityItalic':
                        html.push('<em>', this.wrapRichNestedText(entityText, entity.nested, options), '</em>');
                        break;
                    case 'messageEntityCode':
                        html.push('<code>', this.encodeEntities(entityText), '</code>');
                        break;
                    case 'messageEntityPre':
                        html.push('<pre><code', (entity.language ? ' class="language-' + this.encodeEntities(entity.language) + '"' : ''), '>', this.encodeEntities(entityText), '</code></pre>');
                        break;
                    default:
                        skipEntity = true;
                }
                if (!skipEntity) {
                    lastOffset = entity.offset + entity.length;
                }
            }
            html.push(this.encodeEntities(text.substr(lastOffset)));
            text = this.sanitize(html.join(''), this.urlTransformer);
            if (emojiFound && !options.nested) {
                text = text.replace(/\ufe0f|&#65039;|&#65533;|&#8205;/g, '', text);
                text = text.replace(/<span class="emoji emoji-(\d)-(\d+)-(\d+)"(.+?)<\/span>/g, '<span class="emoji emoji-spritesheet-$1" style="background-position: -$2px -$3px;" $4</span>');
            }
            return text;
        };
        RichTextProcessorClass.prototype.urlTransformer = function (url) {
            return url;
        };
        RichTextProcessorClass.prototype.parseEntities = function (text, options) {
            options = options || {};
            var match, raw = text, entities = [], emojiCode, emojiCoords, matchIndex, rawOffset = 0;
            while ((match = raw.match(this.fullRegExp))) {
                matchIndex = rawOffset + match.index;
                if (match[3]) {
                    entities.push({
                        _: 'messageEntityMention',
                        offset: matchIndex + match[1].length,
                        length: match[2].length + match[3].length
                    });
                }
                else if (match[4]) {
                    if (this.emailRegExp.test(match[4])) {
                        entities.push({
                            _: 'messageEntityEmail',
                            offset: matchIndex,
                            length: match[4].length
                        });
                    }
                    else {
                        var url = '', protocol = match[5], tld = match[6], excluded = '';
                        if (tld) {
                            if (!protocol && (tld.substr(0, 4) === 'xn--' || Domain.TLD.indexOf(tld.toLowerCase()) !== -1)) {
                                protocol = 'http://';
                            }
                            if (protocol) {
                                var balanced = this.checkBrackets(match[4]);
                                if (balanced.length !== match[4].length) {
                                    excluded = match[4].substring(balanced.length);
                                    match[4] = balanced;
                                }
                                url = (match[5] ? '' : protocol) + match[4];
                            }
                            var tgMeMatch;
                            if (tld == 'me' &&
                                (tgMeMatch = url.match(/^https?:\/\/telegram\.me\/(.+)/))) {
                                var path = tgMeMatch[1].split('/');
                                switch (path[0]) {
                                    case 'joinchat':
                                        url = 'tg://join?invite=' + path[1];
                                        break;
                                    case 'addstickers':
                                        url = 'tg://addstickers?set=' + path[1];
                                        break;
                                    default:
                                        var domainQuery = path[0].split('?');
                                        url = 'tg://resolve?domain=' + domainQuery[0] + (domainQuery[1] ? '&' + domainQuery[1] : '');
                                }
                            }
                        }
                        else {
                            url = (match[5] ? '' : 'http://') + match[4];
                        }
                        if (url) {
                            entities.push({
                                _: 'messageEntityUrl',
                                offset: matchIndex,
                                length: match[4].length
                            });
                        }
                    }
                }
                else if (match[7]) {
                    entities.push({
                        _: 'messageEntityLinebreak',
                        offset: matchIndex,
                        length: 1
                    });
                }
                else if (match[8]) {
                    if ((emojiCode = this.emojiMap[match[8]]) &&
                        (emojiCoords = this.getEmojiSpritesheetCoords(emojiCode))) {
                        entities.push({
                            _: 'messageEntityEmoji',
                            offset: matchIndex,
                            length: match[0].length,
                            coords: emojiCoords,
                            title: this.emojiData[emojiCode][1][0]
                        });
                    }
                }
                else if (match[10]) {
                    entities.push({
                        _: 'messageEntityHashtag',
                        offset: matchIndex + match[9].length,
                        length: match[10].length
                    });
                }
                else if (match[12]) {
                    entities.push({
                        _: 'messageEntityBotCommand',
                        offset: matchIndex + match[11].length,
                        length: 1 + match[12].length + (match[13] ? 1 + match[13].length : 0)
                    });
                }
                raw = raw.substr(match.index + match[0].length);
                rawOffset += match.index + match[0].length;
            }
            return entities;
        };
        RichTextProcessorClass.prototype.checkBrackets = function (url) {
            var urlLength = url.length, urlOpenBrackets = url.split('(').length - 1, urlCloseBrackets = url.split(')').length - 1;
            while (urlCloseBrackets > urlOpenBrackets &&
                url.charAt(urlLength - 1) === ')') {
                url = url.substr(0, urlLength - 1);
                urlCloseBrackets--;
                urlLength--;
            }
            if (urlOpenBrackets > urlCloseBrackets) {
                url = url.replace(/\)+$/, '');
            }
            return url;
        };
        RichTextProcessorClass.prototype.getEmojiSpritesheetCoords = function (emojiCode) {
            var i, row, column, totalColumns;
            for (var cat = 0; cat < Emoji.Categories.length; cat++) {
                totalColumns = Emoji.CategorySpritesheetDimens[cat][1];
                i = Emoji.Categories[cat].indexOf(emojiCode);
                if (i > -1) {
                    row = Math.floor(i / totalColumns);
                    column = (i % totalColumns);
                    return { category: cat, row: row, column: column };
                }
            }
            console.error('emoji not found in spritesheet', emojiCode);
            return null;
        };
        RichTextProcessorClass.prototype.encodeEntities = function (value) {
            return value.
                replace(/&/g, '&amp;').
                replace(/([^\#-~| |!])/g, function (value) {
                return '&#' + value.charCodeAt(0) + ';';
            }).
                replace(/</g, '&lt;').
                replace(/>/g, '&gt;');
        };
        RichTextProcessorClass.prototype.wrapRichNestedText = function (text, nested, options) {
            if (nested === undefined) {
                return this.encodeEntities(text);
            }
            return this.wrapRichText(text, { entities: nested, nested: true });
        };
        RichTextProcessorClass.prototype.sanitize = function (text, urlTransformer) {
            var result = window.html_sanitize(text, urlTransformer);
            if (urlTransformer && result.indexOf('href') !== -1) {
                result = result.replace(/<a href=/g, '<a target="_blank" href=');
            }
            return result;
        };
        RichTextProcessorClass.prototype.clearProtocol = function (url) {
            return url.replace(/https?:\/\//, '//');
        };
        RichTextProcessorClass.instance = null;
        return RichTextProcessorClass;
    }());
    WhatsHelp.RichTextProcessorClass = RichTextProcessorClass;
})(WhatsHelp || (WhatsHelp = {}));
var BaseSubHeader = (function () {
    function BaseSubHeader(text) {
        var richTextProcessor = new WhatsHelp.RichTextProcessorClass();
        var wrappedText = richTextProcessor.wrapRichText(text);
        for (var _i = 0, _a = this.getDivIds(); _i < _a.length; _i++) {
            var id = _a[_i];
            var wrapDiv = $('#' + id);
            wrapDiv.find(' > div:first-child').append(wrappedText);
            wrapDiv.removeClass(BaseSubHeader.HIDE_CLASS);
        }
    }
    BaseSubHeader.HIDE_CLASS = 'wh-hide';
    return BaseSubHeader;
}());
function resizeYoutubeIframe($) {
    var $iframe = $('div.wh-landing-video iframe');
    $iframe.css({ height: Math.round($iframe.width() * 337 / 600) + 'px' });
}
var HttpClient = (function () {
    function HttpClient(asJson) {
        if (asJson === void 0) { asJson = false; }
        this.asJson = false;
        if (!$) {
            throw new Error('JQuery is not defined or included');
        }
        this.asJson = asJson;
    }
    ;
    HttpClient.prototype.get = function (url, data, otherOptions) {
        if (data === void 0) { data = {}; }
        if (otherOptions === void 0) { otherOptions = {}; }
        var options = {
            type: HttpClient.GET_REQUEST_TYPE,
            url: url,
            data: data,
            dataType: 'json'
        };
        if (this.asJson) {
            options['contentType'] = 'application/json; charset=utf-8';
        }
        return $.ajax($.extend({}, options, otherOptions));
    };
    HttpClient.prototype.post = function (url, data, otherOptions) {
        if (data === void 0) { data = {}; }
        if (otherOptions === void 0) { otherOptions = {}; }
        var options = {
            type: HttpClient.POST_REQUEST_TYPE,
            url: url,
            data: this.asJson ? JSON.stringify(data) : data,
            dataType: 'json'
        };
        if (this.asJson) {
            options['contentType'] = 'application/json; charset=utf-8';
        }
        return $.ajax($.extend({}, options, otherOptions));
    };
    HttpClient.POST_REQUEST_TYPE = 'POST';
    HttpClient.GET_REQUEST_TYPE = 'GET';
    return HttpClient;
}());
function sendLandingView(options) {
    options.id = options.id || options.landing;
    var httpClient = new HttpClient();
    httpClient.post('/mini/view-event', options);
}
var FbPixel = (function () {
    function FbPixel() {
    }
    FbPixel.prototype.trackLead = function (data, callback) {
        if (callback === void 0) { callback = null; }
        if (!fbq) {
            this.callFunction(callback, 'fbq is not installed');
            return;
        }
        this.track(FbPixel.EVENT_LEAD, data, callback);
    };
    FbPixel.prototype.track = function (event, data, callback) {
        var _this = this;
        if (callback === void 0) { callback = null; }
        var result = fbq('track', event, data);
        if (result === undefined) {
            this.callFunction(callback);
            return;
        }
        setTimeout(function () {
            _this.callFunction(callback);
        }, 300);
    };
    FbPixel.prototype.callFunction = function (callback, errorResult, successResule) {
        if (callback === void 0) { callback = null; }
        if (errorResult === void 0) { errorResult = null; }
        if (successResule === void 0) { successResule = null; }
        if (callback) {
            callback(errorResult, successResule);
        }
    };
    FbPixel.EVENT_LEAD = 'Lead';
    return FbPixel;
}());
var VkPixel = (function () {
    function VkPixel() {
    }
    VkPixel.prototype.trackLead = function (callback) {
        if (callback === void 0) { callback = null; }
        if (!VK) {
            this.callFunction(callback, 'VK is not installed');
            return;
        }
        this.track(VkPixel.EVENT_LEAD, callback);
    };
    VkPixel.prototype.track = function (event, callback) {
        var _this = this;
        if (callback === void 0) { callback = null; }
        var result = VK.Retargeting.Event(event);
        setTimeout(function () {
            _this.callFunction(callback);
        }, 300);
    };
    VkPixel.prototype.callFunction = function (callback, errorResult, successResule) {
        if (callback === void 0) { callback = null; }
        if (errorResult === void 0) { errorResult = null; }
        if (successResule === void 0) { successResule = null; }
        if (callback) {
            callback(errorResult, successResule);
        }
    };
    VkPixel.EVENT_LEAD = 'Lead';
    return VkPixel;
}());
var YAMetrika = (function () {
    function YAMetrika(counter) {
        this.yametrikaObject = null;
        this.counter = +counter;
        this.yametrikaObjectName = 'yaCounter' + this.counter.toString();
    }
    YAMetrika.prototype.getYAObject = function () {
        if (null === this.yametrikaObject) {
            if (window.hasOwnProperty(this.yametrikaObjectName)) {
                this.yametrikaObject = window[this.yametrikaObjectName];
            }
        }
        return this.yametrikaObject;
    };
    YAMetrika.prototype.reachGoal = function (target, cb) {
        if (cb === void 0) { cb = null; }
        if (null === this.getYAObject()) {
            console.log('reachGoal - ya-object is empty');
            if (null !== cb) {
                cb(new Error('ya-object is empty for `' + this.yametrikaObjectName + '`'));
            }
            return;
        }
        try {
            if (null === cb) {
                this.getYAObject().reachGoal(target);
            }
            else {
                this.getYAObject().reachGoal(target, {}, cb);
            }
        }
        catch (err) {
            console.log('yametrika reachGoal error', err);
            if (null !== cb) {
                cb(err);
            }
        }
    };
    return YAMetrika;
}());
var GoogleAnalytics = (function () {
    function GoogleAnalytics() {
        this.gaObject = null;
    }
    GoogleAnalytics.prototype.getGAObject = function () {
        if (null === this.gaObject) {
            if (window.hasOwnProperty('ga')) {
                this.gaObject = window['ga'];
            }
        }
        return this.gaObject;
    };
    GoogleAnalytics.prototype.sendEvent = function (options, cb) {
        if (cb === void 0) { cb = null; }
        if (null === this.getGAObject()) {
            console.log('sendEvent - ga-object is empty');
            if (null !== cb) {
                cb(new Error('ga-object is empty'));
            }
            return;
        }
        try {
            var tmpOptions = {
                hitType: GoogleAnalytics.HIT_EVENT_TYPE,
                eventCategory: options.eventCategory,
                eventAction: options.eventAction,
            };
            if (options.hasOwnProperty('eventLabel')) {
                tmpOptions['eventLabel'] = options.eventLabel;
            }
            if (null !== cb) {
                tmpOptions['hitCallback'] = cb;
            }
            this.gaObject('send', tmpOptions);
        }
        catch (err) {
            console.log('ga sendEvent error', err);
            if (null !== cb) {
                cb(err);
            }
        }
    };
    GoogleAnalytics.HIT_EVENT_TYPE = 'event';
    return GoogleAnalytics;
}());
var MetriksManager = (function () {
    function MetriksManager(options) {
        if (options === void 0) { options = {}; }
        this.yms = {};
        this.ga = null;
        if (options.hasOwnProperty('ym')) {
            for (var _i = 0, _a = options.ym; _i < _a.length; _i++) {
                var yaCounter = _a[_i];
                this.yms[yaCounter.toString()] = new YAMetrika(+yaCounter);
            }
        }
        if (options.ga) {
            this.ga = new GoogleAnalytics();
        }
    }
    Object.defineProperty(MetriksManager.prototype, "yaMetriks", {
        get: function () {
            return this.yms;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetriksManager.prototype, "googleAnalytics", {
        get: function () {
            return this.ga;
        },
        enumerable: true,
        configurable: true
    });
    MetriksManager.prototype.getYaMetrika = function (counter) {
        var tmp = counter.toString();
        return this.yms.hasOwnProperty(tmp) ? this.yms[tmp] : null;
    };
    MetriksManager.prototype._foreachYA = function (method, data, wait) {
        if (wait === void 0) { wait = false; }
        if ('reachGoal' !== method) {
            return $.Deferred().reject(new Error('Incorrect method')).promise();
        }
        var promises = [];
        var _loop_1 = function (counter) {
            if (!this_1.yms.hasOwnProperty(counter)) {
                return "continue";
            }
            if (!wait) {
                this_1.yms[counter].reachGoal(data);
            }
            else {
                var tmpDeferrd_1 = $.Deferred();
                promises.push(tmpDeferrd_1.promise());
                this_1.yms[counter].reachGoal(data, function (result) {
                    if (result instanceof Error) {
                        tmpDeferrd_1.reject(result);
                        return;
                    }
                    tmpDeferrd_1.resolve(result);
                });
            }
        };
        var this_1 = this;
        for (var counter in this.yms) {
            _loop_1(counter);
        }
        if (promises.length === 0) {
            return $.Deferred().resolve().promise();
        }
        return $.when.apply(this, promises);
    };
    MetriksManager.prototype._sendGAEvent = function (options, wait) {
        if (wait === void 0) { wait = false; }
        if (null === this.ga) {
            return $.Deferred().resolve().promise();
        }
        if (wait) {
            var tmpDeferrd_2 = $.Deferred();
            this.ga.sendEvent(options, function (result) {
                if (result instanceof Error) {
                    tmpDeferrd_2.reject(result);
                    return;
                }
                tmpDeferrd_2.resolve(result);
            });
            return tmpDeferrd_2.promise();
        }
        this.ga.sendEvent(options);
        return $.Deferred().resolve().promise();
    };
    MetriksManager.prototype.sendEventWithPromise = function (options, wait) {
        if (wait === void 0) { wait = false; }
        var ymPromise = options.hasOwnProperty('ym')
            ? this._foreachYA('reachGoal', options.ym.goal, wait)
            : $.Deferred().resolve().promise();
        var gaPromise = options.hasOwnProperty('ga')
            ? this._sendGAEvent(options.ga, wait)
            : $.Deferred().resolve().promise();
        return $.when(ymPromise, gaPromise);
    };
    MetriksManager.prototype.sendEvent = function (options, cb) {
        if (cb === void 0) { cb = null; }
        this.sendEventWithPromise(options, null !== cb)
            .done(function () {
            if (null !== cb) {
                cb(null, null);
            }
        })
            .fail(function (error) {
            if (null !== cb) {
                cb(error, null);
            }
        });
    };
    return MetriksManager;
}());
var Subheader = (function (_super) {
    __extends(Subheader, _super);
    function Subheader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Subheader.prototype.getDivIds = function () {
        return Subheader.SUBHEADER_DIV_IDS;
    };
    Subheader.SUBHEADER_DIV_IDS = ['wh-landing-subheader1', 'wh-landing-subheader2'];
    return Subheader;
}(BaseSubHeader));
var MiniLandingSubmitHandler = (function () {
    function MiniLandingSubmitHandler($jq, sessionId) {
        var _this = this;
        this.$jq = $jq;
        this.sessionId = sessionId;
        this.clickInProgress = false;
        this.clickTracked = false;
        this.metriksManagerOptions = {};
        if (pageOptions.ymKey) {
            this.metriksManagerOptions.ym = [pageOptions.ymKey];
        }
        if (pageOptions.gaKey) {
            this.metriksManagerOptions.ga = true;
        }
        this.metriksManager = new MetriksManager(this.metriksManagerOptions);
        if (pageOptions.fbPixelId) {
            this.fbPixel = new FbPixel();
        }
        if (pageOptions.vkPixelId) {
            this.vkPixel = new VkPixel();
        }
        $jq('.wh-landing-button').on('click', function (ev) { return _this.onClick(ev); });
        this.$userDataForm = $jq('form#wh-user-data-form');
        this.$userDataForm.on('keypress', function (ev) {
            var code = ev.keyCode || ev.which;
            if (13 === code) {
                ev.preventDefault();
                return false;
            }
        });
    }
    MiniLandingSubmitHandler.prototype.isValid = function () {
        if (this.$userDataForm[0]) {
            this.$userDataForm.find('input').each(function (i, input) {
                $(input).val($(input).val().replace(/\s/g, ''));
            });
            if (this.$userDataForm[0].checkValidity) {
                return this.$userDataForm[0].checkValidity();
            }
        }
        return true;
    };
    MiniLandingSubmitHandler.prototype.showError = function () {
        this.$userDataForm.addClass('was-validated');
    };
    MiniLandingSubmitHandler.prototype.hideError = function () {
        this.$userDataForm.removeClass('was-validated');
    };
    MiniLandingSubmitHandler.prototype.onClick = function (ev) {
        var _this = this;
        if (!this.isValid()) {
            this.showError();
            return false;
        }
        this.hideError();
        if (this.clickInProgress) {
            return false;
        }
        this.clickInProgress = true;
        var linkElem = $('.btn', ev.currentTarget);
        if (linkElem && linkElem[0]) {
            var data = {
                domain: pageOptions.domain,
                landing: pageOptions.landing,
                button: ''
            };
            var classes = ev.currentTarget.classList;
            for (var i = 0; i < classes.length; i++) {
                if (0 === classes[i].indexOf('wh-landing-button-')) {
                    data.button = classes[i].replace('wh-landing-button-', '');
                    break;
                }
            }
            var userData = this.getUserData();
            if (userData !== null) {
                if (userData.sessionId) {
                    data.sessionId = userData.sessionId;
                }
                if (userData.email) {
                    data.email = userData.email;
                }
                if (userData.phone) {
                    data.phone = userData.phone;
                }
            }
            var promises = [];
            if (!this.clickTracked) {
                this.clickTracked = true;
                promises.push(this.$jq.ajax({
                    url: location.protocol + '//' + location.host + '/mini/click?t=' + +(new Date()),
                    method: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(data)
                }));
                if (this.fbPixel) {
                    var fbPromise_1 = this.$jq.Deferred();
                    this.fbPixel.trackLead({
                        content_name: pageOptions.header,
                        content_category: pageOptions.domain + '_ml_' + pageOptions.landing,
                        referrer: window.location.href
                    }, function (error, result) {
                        fbPromise_1.resolve();
                    });
                    promises.push(fbPromise_1.promise());
                }
                if (this.vkPixel) {
                    var vkPromise = this.$jq.Deferred();
                    this.vkPixel.trackLead();
                    promises.push(vkPromise.promise());
                }
                var goalMetrika = 'subscription_ml_' + pageOptions.landing;
                promises.push(this.metriksManager.sendEventWithPromise({
                    ym: { goal: goalMetrika },
                    ga: { eventCategory: 'whatshelp', eventAction: goalMetrika }
                }, true));
            }
            this.$jq.when.apply(null, promises)
                .always(function () {
                var href = linkElem.attr('href') || linkElem.attr('data-href');
                if (0 === href.indexOf('http')
                    || 0 === href.indexOf('viber:')
                    || 0 === href.indexOf('vk:')
                    || 0 === href.indexOf('tg:')) {
                    document.location.assign(href);
                }
                _this.clickInProgress = false;
            });
        }
        return false;
    };
    MiniLandingSubmitHandler.prototype.getUserData = function () {
        if (!this.$userDataForm[0]) {
            return null;
        }
        var data = {
            sessionId: this.sessionId
        };
        var $phone = this.$userDataForm.find('input[name="phone"]');
        if ($phone.val()) {
            data['phone'] = $phone.val();
        }
        var $email = this.$userDataForm.find('input[name="email"]');
        if ($email.val()) {
            data['email'] = $email.val();
        }
        return data;
    };
    return MiniLandingSubmitHandler;
}());
