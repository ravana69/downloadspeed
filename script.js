var downloadSimulator=null;window.onload=function(){calculateButton.onclick=calc;var hasFlash=function(){if(typeof navigator.plugins=="undefined"||navigator.plugins.length==0){try{return!!(new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))}
catch(e){return undefined}}
else{return navigator.plugins["Shockwave Flash"]}};if(!hasFlash()){speedtest.style.display='none';speedtestLink.innerHTML="Test my internet speed";document.querySelector('.idkSpeed').classList.add("mobile")}
downloadSimulator=new Downloader(document.getElementById('downloadSimulatorWindow'));if(window.location.hash){var uri=window.location.hash;internetSpeed.value=uri.match(/speed=([\d.]+)x(\d+\^\d+)/)[1];internetSpeedBase.value=uri.match(/speed=([\d.]+)x(\d+\^\d+)/)[2];internetOverhead.value=uri.match(/overhead=([\d.]+)/)[1];fileSize.value=uri.match(/file=([\d.]+)x(\d+\^\d+)/)[1];fileSizeBase.value=uri.match(/file=([\d.]+)x(\d+\^\d+)/)[2];calc()}
else if(window.localStorage){if(window.localStorage.getItem('downloadtime.speed')){internetSpeed.value=window.localStorage.getItem('downloadtime.speed');internetSpeedBase.value=window.localStorage.getItem('downloadtime.speedBase');internetOverhead.value=window.localStorage.getItem('downloadtime.overhead');fileSize.value=window.localStorage.getItem('downloadtime.file');fileSizeBase.value=window.localStorage.getItem('downloadtime.fileBase')}
else defaults()}
else defaults()};function defaults(){internetSpeed.value="10";internetSpeedBase.value="10^6";internetOverhead.value="0.9";fileSize.value="1";fileSizeBase.value="2^30"}
function calc(){var internet={speed:internetSpeed.value,factor:internetSpeedBase.value,overhead:internetOverhead.value,}
internet.speed=parseFloat(internet.speed);internet.overhead=parseFloat(internet.overhead);internet.factor={base:internet.factor.match(/(\d+)\^(\d+)/)[1],power:internet.factor.match(/(\d+)\^(\d+)/)[2]}
internet.bitsPerSec=internet.speed*Math.pow(internet.factor.base,internet.factor.power);internet.bytesPerSec=internet.bitsPerSec/8;var file={size:fileSize.value,factor:fileSizeBase.value,}
file.size=parseFloat(file.size);file.factor={base:file.factor.match(/(\d+)\^(\d+)/)[1],power:file.factor.match(/(\d+)\^(\d+)/)[2]}
file.bytes=file.size*Math.pow(file.factor.base,file.factor.power);internet.effectiveBytesPerSec=internet.bytesPerSec*internet.overhead;var transferTime_ms=(file.bytes/internet.effectiveBytesPerSec)*1000;document.querySelector("#results .time").innerHTML=moment.preciseDiff(0,transferTime_ms);document.querySelector("#results .size").innerHTML=prefixByteLong(file.bytes);document.querySelector("#results .speed").innerHTML=prefixByte(internet.effectiveBytesPerSec);document.getElementById("results").style.visibility="visible";document.getElementById("downloadSimulatorWindow").style.visibility="visible";downloadSimulator.start(file.bytes,internet.effectiveBytesPerSec,"Simulation");if(window.location){var uri=[];uri.push("file="+fileSize.value+"x"+fileSizeBase.value);uri.push("speed="+internetSpeed.value+"x"+internetSpeedBase.value);uri.push("overhead="+internetOverhead.value);window.location.hash=uri.join("&")}
if(window.localStorage){window.localStorage.setItem('downloadtime.speed',internetSpeed.value);window.localStorage.setItem('downloadtime.speedBase',internetSpeedBase.value);window.localStorage.setItem('downloadtime.overhead',internetOverhead.value);window.localStorage.setItem('downloadtime.file',fileSize.value);window.localStorage.setItem('downloadtime.fileBase',fileSizeBase.value)}}
function msToTime(ms){debugger;var t={};t.ms=ms%1000;ms=(ms-t.ms)/1000;t.seconds=ms%60;ms=(ms-t.seconds)/60;t.minutes=ms%60;ms=(ms-t.minutes)/60;t.hours=ms%60;ms=(ms-t.hours)/60;t.days=ms%24;ms=(ms-t.days)/24;t.weeks=ms%7;ms=(ms-t.weeks)/7;t.months=ms%((365/12)/7);ms=(ms-t.months)/((365/12)/7);t.years=ms%(365/12);ms=(ms-t.years)/(365/12);console.log(JSON.stringify(t));return t}(function(moment){var STRINGS={nodiff:'',year:'year',years:'years',month:'month',months:'months',day:'day',days:'days',hour:'hour',hours:'hours',minute:'minute',minutes:'minutes',second:'second',seconds:'seconds',delimiter:' '};moment.fn.preciseDiff=function(d2){return moment.preciseDiff(this,d2)};moment.preciseDiff=function(d1,d2){var m1=moment(d1),m2=moment(d2);if(m1.isSame(m2)){return STRINGS.nodiff}
if(m1.isAfter(m2)){var tmp=m1;m1=m2;m2=tmp}
var yDiff=m2.year()-m1.year();var mDiff=m2.month()-m1.month();var dDiff=m2.date()-m1.date();var hourDiff=m2.hour()-m1.hour();var minDiff=m2.minute()-m1.minute();var secDiff=m2.second()-m1.second();if(secDiff<0){secDiff=60+secDiff;minDiff--}
if(minDiff<0){minDiff=60+minDiff;hourDiff--}
if(hourDiff<0){hourDiff=24+hourDiff;dDiff--}
if(dDiff<0){var daysInLastFullMonth=moment(m2.year()+'-'+(m2.month()+1),"YYYY-MM").subtract('months',1).daysInMonth();if(daysInLastFullMonth<m1.date()){dDiff=daysInLastFullMonth+dDiff+(m1.date()-daysInLastFullMonth)}else{dDiff=daysInLastFullMonth+dDiff}
mDiff--}
if(mDiff<0){mDiff=12+mDiff;yDiff--}
function pluralize(num,word){return num+' '+STRINGS[word+(num===1?'':'s')]}
var result=[];if(yDiff){result.push(pluralize(yDiff,'year'))}
if(mDiff){result.push(pluralize(mDiff,'month'))}
if(dDiff){result.push(pluralize(dDiff,'day'))}
if(hourDiff){result.push(pluralize(hourDiff,'hour'))}
if(minDiff){result.push(pluralize(minDiff,'minute'))}
if(secDiff){result.push(pluralize(secDiff,'second'))}
return result.join(STRINGS.delimiter)}}(moment));function Downloader(elm){var self=this;this.fileSize;this.speed;this.DOM={progress:elm.querySelector('progress'),percent:elm.querySelector('.percent'),downloaded:elm.querySelector('.downloaded'),details:elm.querySelector('.details'),size:elm.querySelector('.size'),speed:elm.querySelector('.speed'),remaining:elm.querySelector('.remaining'),filename:elm.querySelector('.filename')}
var _transferTime;var _startTime;var _elapsedTime;var _remainingTime;var _downloaded;var _percent;var _timer;this.start=function(fileSize,speed,filename){this.DOM.filename.innerHTML=filename;clearInterval(_timer);_startTime=Date.now();_downloaded=0;_percent=0;self.fileSize=fileSize;self.speed=speed;_transferTime=(fileSize/speed)*1000;this.DOM.details.style.display="";self.update();_timer=setInterval(function(){self.update()},500)}
this.update=function(){var now=Date.now();_elapsedTime=now-_startTime;_remainingTime=_transferTime-_elapsedTime;_percent=(_elapsedTime/_transferTime)*100;_downloaded=this.fileSize*(_elapsedTime/_transferTime);this.DOM.progress.value=_percent;this.DOM.percent.innerHTML=(_percent<<0)+"%";this.DOM.downloaded.innerHTML=prefixByte(_downloaded);this.DOM.size.innerHTML=prefixByte(this.fileSize);this.DOM.speed.innerHTML=prefixByte(this.speed);this.DOM.remaining.innerHTML=moment.duration(_remainingTime).humanize();if(_elapsedTime>=_transferTime){this.stop()}}
this.stop=function(){clearInterval(_timer);_elapsedTime=-1;_remainingTime=0;_percent=100;_downloaded=this.fileSize;this.DOM.progress.value=100;this.DOM.percent.innerHTML="100%";this.DOM.downloaded.innerHTML=prefixByte(this.fileSize);this.DOM.size.innerHTML=prefixByte(this.fileSize);this.DOM.speed.innerHTML=prefixByte(this.speed);this.DOM.remaining.innerHTML="0";this.DOM.details.style.display="none"}}
function Prefixer(unit,prefix,format){for(var i=0;i<prefix.length;i++){prefix[i][4]=Math.pow(prefix[i][0],prefix[i][1])}
return function(x){x=parseFloat(x);var r,n=x<0?-1:1;x=x*n;for(var i=0;i<prefix.length;i++){if(x>=prefix[i][4]-1){r=prefix[i]}
else break}
x=x*n;x=(x/r[4]);var obj={value:x,symbol:r[2],prefix:r[3],base:r[0],factor:r[1],plural:x!=1?true:!1,s:x!=1?"s":"",unit:unit,units:x!=1?unit+"s":unit};return format?format.apply(obj):obj}}
var prefixByte=new Prefixer("B",[[2,0,'',''],[2,10,'K','Kilo'],[2,20,'M','Mega'],[2,30,'G','Giga'],[2,40,'T','Tera'],[2,50,'P','Peta'],[2,60,'E','Exa'],[2,70,'Z','Zetta'],[2,80,'Y','Yotta']],function(){return parseFloat(this.value.toFixed(2))+" "+this.symbol+this.unit});var prefixByteLong=new Prefixer("byte",[[2,0,'',''],[2,10,'K','Kilo'],[2,20,'M','Mega'],[2,30,'G','Giga'],[2,40,'T','Tera'],[2,50,'P','Peta'],[2,60,'E','Exa'],[2,70,'Z','Zetta'],[2,80,'Y','Yotta']],function(){return parseFloat(this.value.toFixed(2))+" "+this.prefix+this.units});var prefixBit=new Prefixer("bit",[[10,0,'',''],[10,3,'K','Kilo'],[10,6,'M','Mega'],[10,9,'G','Giga'],[10,12,'T','Tera'],[10,15,'P','Peta'],[10,18,'E','Exa'],[10,21,'Z','Zetta'],[10,24,'Y','Yotta']],function(){return this.value+" "+this.symbol+this.unit});var prefixBitLong=new Prefixer("bit",[[10,0,'',''],[10,3,'K','Kilo'],[10,6,'M','Mega'],[10,9,'G','Giga'],[10,12,'T','Tera'],[10,15,'P','Peta'],[10,18,'E','Exa'],[10,21,'Z','Zetta'],[10,24,'Y','Yotta']],function(){return this.value+" "+this.prefix+this.units})