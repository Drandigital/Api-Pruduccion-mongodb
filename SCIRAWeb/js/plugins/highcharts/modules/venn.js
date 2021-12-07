/*
 Highcharts JS v7.1.2 (2019-06-03)

 (c) 2017-2019 Highsoft AS
 Authors: Jon Arild Nygard

 License: www./license
*/
(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/modules/venn",["highcharts"],function(m){a(m);a.Highcharts=m;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function m(a,g,k,l){a.hasOwnProperty(g)||(a[g]=l.apply(null,k))}a=a?a._modules:{};m(a,"mixins/draw-point.js",[],function(){var a=function(g){var a=this,l=a.graphic,r=g.animatableAttribs,w=g.onComplete,m=g.css,x=g.renderer;
if(a.shouldDraw())l||(a.graphic=l=x[g.shapeType](g.shapeArgs).add(g.group)),l.css(m).attr(g.attribs).animate(r,g.isNew?!1:void 0,w);else if(l){var u=function(){a.graphic=l=l.destroy();"function"===typeof w&&w()};Object.keys(r).length?l.animate(r,void 0,function(){u()}):u()}};return function(g){(g.attribs=g.attribs||{})["class"]=this.getClassName();a.call(this,g)}});m(a,"mixins/geometry.js",[],function(){return{getAngleBetweenPoints:function(a,g){return Math.atan2(g.x-a.x,g.y-a.y)},getCenterOfPoints:function(a){var g=
a.reduce(function(a,g){a.x+=g.x;a.y+=g.y;return a},{x:0,y:0});return{x:g.x/a.length,y:g.y/a.length}},getDistanceBetweenPoints:function(a,g){return Math.sqrt(Math.pow(g.x-a.x,2)+Math.pow(g.y-a.y,2))}}});m(a,"mixins/geometry-circles.js",[a["mixins/geometry.js"]],function(a){var g=a.getAngleBetweenPoints,k=a.getCenterOfPoints,l=a.getDistanceBetweenPoints,m=function(a,d){d=Math.pow(10,d);return Math.round(a*d)/d},w=function(a){if(0>=a)throw Error("radius of circle must be a positive number.");return Math.PI*
a*a},r=function(a,d){return a*a*Math.acos(1-d/a)-(a-d)*Math.sqrt(d*(2*a-d))},x=function(a,d){var h=l(a,d),g=a.r,q=d.r,v=[];if(h<g+q&&h>Math.abs(g-q)){var g=g*g,t=(g-q*q+h*h)/(2*h),q=Math.sqrt(g-t*t),g=a.x,v=d.x;a=a.y;var k=d.y;d=g+t*(v-g)/h;t=a+t*(k-a)/h;a=q/h*-(k-a);h=q/h*-(v-g);v=[{x:m(d+a,14),y:m(t-h,14)},{x:m(d-a,14),y:m(t+h,14)}]}return v},u=function(a){return a.reduce(function(a,g,q,l){l=l.slice(q+1).reduce(function(a,d,h){var l=[q,h+q+1];return a.concat(x(g,d).map(function(a){a.indexes=l;return a}))},
[]);return a.concat(l)},[])},A=function(a,d){return l(a,d)<=d.r+1e-10},y=function(a,d){return!d.some(function(d){return!A(a,d)})};return{getAreaOfCircle:w,getAreaOfIntersectionBetweenCircles:function(a){var d=u(a).filter(function(d){return y(d,a)}),h;if(1<d.length){var q=k(d),d=d.map(function(a){a.angle=g(q,a);return a}).sort(function(a,d){return d.angle-a.angle}),m=d[d.length-1],d=d.reduce(function(d,h){var q=d.startPoint,m=k([q,h]),p=h.indexes.filter(function(a){return-1<q.indexes.indexOf(a)}).reduce(function(d,
p){p=a[p];var k=g(p,h),r=g(p,q),k=r-(r-k+(r<k?2*Math.PI:0))/2,k=l(m,{x:p.x+p.r*Math.sin(k),y:p.y+p.r*Math.cos(k)});p=p.r;k>2*p&&(k=2*p);if(!d||d.width>k)d={r:p,largeArc:k>p?1:0,width:k,x:h.x,y:h.y};return d},null);if(p){var r=p.r;d.arcs.push(["A",r,r,0,p.largeArc,1,p.x,p.y]);d.startPoint=h}return d},{startPoint:m,arcs:[]}).arcs;0!==d.length&&1!==d.length&&(d.unshift(["M",m.x,m.y]),h={center:q,d:d})}return h},getCircleCircleIntersection:x,getCirclesIntersectionPoints:u,getCircularSegmentArea:r,getOverlapBetweenCircles:function(a,
d,g){var h=0;g<a+d&&(g<=Math.abs(d-a)?h=w(a<d?a:d):(h=(a*a-d*d+g*g)/(2*g),g-=h,h=r(a,a-h)+r(d,d-g)),h=m(h,14));return h},isPointInsideCircle:A,isPointInsideAllCircles:y,isPointOutsideAllCircles:function(a,d){return!d.some(function(d){return A(a,d)})},round:m}});m(a,"modules/venn.src.js",[a["mixins/draw-point.js"],a["mixins/geometry.js"],a["mixins/geometry-circles.js"],a["parts/Globals.js"]],function(a,g,k,l){var m=l.Color,r=l.extend,L=k.getAreaOfCircle,x=k.getAreaOfIntersectionBetweenCircles,u=k.getCircleCircleIntersection,
A=g.getCenterOfPoints,y=g.getDistanceBetweenPoints,q=k.getOverlapBetweenCircles,d=l.isArray,h=l.isNumber,p=l.isObject,M=k.isPointInsideAllCircles,v=k.isPointOutsideAllCircles,t=l.isString,N=l.merge,O=l.seriesType,P=function(a){return Object.keys(a).map(function(f){return a[f]})},R=function(a){var f=0;2===a.length&&(f=a[0],a=a[1],f=q(f.r,a.r,y(f,a)));return f},E=function(a,b){return b.reduce(function(f,b){var c=0;1<b.sets.length&&(c=b.value,b=R(b.sets.map(function(c){return a[c]})),b=c-b,c=Math.round(b*
b*1E11)/1E11);return f+c},0)},Q=function(a,b,e,d,c){var f=a(b),z=a(e);c=c||100;d=d||1e-10;var g=e-b,h=1,n,l;if(b>=e)throw Error("a must be smaller than b.");if(0<f*z)throw Error("f(a) and f(b) must have opposite signs.");if(0===f)n=b;else if(0===z)n=e;else for(;h++<=c&&0!==l&&g>d;)g=(e-b)/2,n=b+g,l=a(n),0<f*l?b=n:e=n;return n},D=function(a,b,e){var f=a+b;return 0>=e?f:L(a<b?a:b)<=e?0:Q(function(c){c=q(a,b,c);return e-c},0,f)},B=function(a){return d(a.sets)&&1===a.sets.length},S=function(a,b){var f=
function(a,c){return a.fx-c.fx},d=function(a,c,b,f){return c.map(function(c,e){return a*c+b*f[e]})},c=function(c,b){b.fx=a(b);c[c.length-1]=b;return c},g=function(c){var b=c[0];return c.map(function(c){c=d(.5,b,.5,c);c.fx=a(c);return c})},h=function(a){for(var c=a.slice(0,-1).length,b=[],f=function(a,c){a.sum+=c[a.i];return a},e=0;e<c;e++)b[e]=a.reduce(f,{sum:0,i:e}).sum/c;return b},C=function(c,b,f,e){c=d(f,c,e,b);c.fx=a(c);return c};b=function(c){var b=c.length,f=Array(b+1);f[0]=c;f[0].fx=a(c);
for(var e=0;e<b;++e){var d=c.slice();d[e]=d[e]?1.05*d[e]:.001;d.fx=a(d);f[e+1]=d}return f}(b);for(var l=0;100>l;l++){b.sort(f);var n=b[b.length-1],k=h(b),m=C(k,n,2,-1);m.fx<b[0].fx?(n=C(k,n,3,-2),b=c(b,n.fx<m.fx?n:m)):m.fx>=b[b.length-2].fx?m.fx>n.fx?(k=C(k,n,.5,.5),b=k.fx<n.fx?c(b,k):g(b)):(k=C(k,n,1.5,-.5),b=k.fx<m.fx?c(b,k):g(b)):b=c(b,m)}return b[0]},F=function(a,b,e){b=b.reduce(function(b,c){c=c.r-y(a,c);return c<=b?c:b},Number.MAX_VALUE);return b=e.reduce(function(b,c){c=y(a,c)-c.r;return c<=
b?c:b},b)},T=function(a,b){var e=a.reduce(function(e,c){var f=c.r/2;return[{x:c.x,y:c.y},{x:c.x+f,y:c.y},{x:c.x-f,y:c.y},{x:c.x,y:c.y+f},{x:c.x,y:c.y-f}].reduce(function(c,e){var f=F(e,a,b);c.margin<f&&(c.point=e,c.margin=f);return c},e)},{point:void 0,margin:-Number.MAX_VALUE}).point,e=S(function(e){return-F({x:e[0],y:e[1]},a,b)},[e.x,e.y]),e={x:e[0],y:e[1]};M(e,a)&&v(e,b)||(e=A(a));return e},U=function(a){var b=a.filter(B);return a.reduce(function(a,f){if(f.value){var c=f.sets;f=c.join();var e=
b.reduce(function(a,b){var e=-1<c.indexOf(b.sets[0]);a[e?"internal":"external"].push(b.circle);return a},{internal:[],external:[]});a[f]=T(e.internal,e.external)}return a},{})},G=function(a){var b=a.filter(function(a){return 2===a.sets.length}).reduce(function(a,b){b.sets.forEach(function(c,e,f){p(a[c])||(a[c]={overlapping:{},totalOverlap:0});a[c].totalOverlap+=b.value;a[c].overlapping[f[1-e]]=b.value});return a},{});a.filter(B).forEach(function(a){r(a,b[a.sets[0]])});return a},H=function(a,b){return b.totalOverlap-
a.totalOverlap},I=function(a){var b=[],e={};a.filter(function(a){return 1===a.sets.length}).forEach(function(a){e[a.sets[0]]=a.circle={x:Number.MAX_VALUE,y:Number.MAX_VALUE,r:Math.sqrt(a.value/Math.PI)}});var f=function(a,c){var e=a.circle;e.x=c.x;e.y=c.y;b.push(a)};G(a);var c=a.filter(B).sort(H);f(c.shift(),{x:0,y:0});var d=a.filter(function(a){return 2===a.sets.length});c.forEach(function(a){var c=a.circle,g=c.r,h=a.overlapping,z=b.reduce(function(a,f,z){var n=f.circle,k=D(g,n.r,h[f.sets[0]]),l=
[{x:n.x+k,y:n.y},{x:n.x-k,y:n.y},{x:n.x,y:n.y+k},{x:n.x,y:n.y-k}];b.slice(z+1).forEach(function(a){var c=a.circle;a=D(g,c.r,h[a.sets[0]]);l=l.concat(u({x:n.x,y:n.y,r:k},{x:c.x,y:c.y,r:a}))});l.forEach(function(b){c.x=b.x;c.y=b.y;var f=E(e,d);f<a.loss&&(a.loss=f,a.coordinates=b)});return a},{loss:Number.MAX_VALUE,coordinates:void 0});f(a,z.coordinates)});return e},V=function(a){var b={};0<a.length&&(b=I(a),a.filter(function(a){return!B(a)}).forEach(function(a){var f=a.sets;a=f.join();f=f.map(function(a){return b[a]});
b[a]=x(f)}));return b},J=function(a){var b={};return p(a)&&h(a.value)&&-1<a.value&&d(a.sets)&&0<a.sets.length&&!a.sets.some(function(a){var f=!1;!b[a]&&t(a)?b[a]=!0:f=!0;return f})},K=function(a){a=d(a)?a:[];var b=a.reduce(function(a,c){J(c)&&B(c)&&0<c.value&&-1===a.indexOf(c.sets[0])&&a.push(c.sets[0]);return a},[]).sort(),e=a.reduce(function(a,c){J(c)&&!c.sets.some(function(a){return-1===b.indexOf(a)})&&(a[c.sets.sort().join()]=c);return a},{});b.reduce(function(a,c,b,e){e.slice(b+1).forEach(function(b){a.push(c+
","+b)});return a},[]).forEach(function(a){if(!e[a]){var c={sets:a.split(","),value:0};e[a]=c}});return P(e)},W=function(a,b,e){var d=e.bottom-e.top,c=e.right-e.left,d=Math.min(0<c?1/c*a:1,0<d?1/d*b:1);return{scale:d,centerX:a/2-(e.right+e.left)/2*d,centerY:b/2-(e.top+e.bottom)/2*d}};O("venn","scatter",{borderColor:"#cccccc",borderDashStyle:"solid",borderWidth:1,brighten:0,clip:!1,colorByPoint:!0,dataLabels:{enabled:!0,formatter:function(){return this.point.name}},marker:!1,opacity:.75,showInLegend:!1,
states:{hover:{opacity:1,halo:!1,borderColor:"#333333"},select:{color:"#cccccc",borderColor:"#000000",animation:!1}},tooltip:{pointFormat:"{point.name}: {point.value}"}},{isCartesian:!1,axisTypes:[],directTouch:!0,pointArrayMap:["value"],translate:function(){var a=this.chart;this.processedXData=this.xData;this.generatePoints();var b=K(this.options.data),e=V(b),g=U(b),b=Object.keys(e).filter(function(a){return(a=e[a])&&h(a.r)}).reduce(function(a,c){var b=e[c];c=b.x-b.r;var d=b.x+b.r,f=b.y+b.r,b=b.y-
b.r;if(!h(a.left)||a.left>c)a.left=c;if(!h(a.right)||a.right<d)a.right=d;if(!h(a.top)||a.top>b)a.top=b;if(!h(a.bottom)||a.bottom<f)a.bottom=f;return a},{top:0,bottom:0,left:0,right:0}),a=W(a.plotWidth,a.plotHeight,b),c=a.scale,k=a.centerX,l=a.centerY;this.points.forEach(function(a){var b=d(a.sets)?a.sets:[],f=b.join(),h=e[f],m,f=g[f];h&&(h.r?m={x:k+h.x*c,y:l+h.y*c,r:h.r*c}:h.d&&(m={d:h.d.reduce(function(a,b){"M"===b[0]?(b[1]=k+b[1]*c,b[2]=l+b[2]*c):"A"===b[0]&&(b[1]*=c,b[2]*=c,b[6]=k+b[6]*c,b[7]=
l+b[7]*c);return a.concat(b)},[]).join(" ")}),f?(f.x=k+f.x*c,f.y=l+f.y*c):f={});a.shapeArgs=m;f&&m&&(a.plotX=f.x,a.plotY=f.y);a.name=a.options.name||b.join("\u2229")})},drawPoints:function(){var a=this,b=a.chart,e=a.group,g=b.renderer;(a.points||[]).forEach(function(c){var f={zIndex:d(c.sets)?c.sets.length:0},h=c.shapeArgs;b.styledMode||r(f,a.pointAttribs(c,c.state));c.draw({isNew:!c.graphic,animatableAttribs:h,attribs:f,group:e,renderer:g,shapeType:h&&h.d?"path":"circle"})})},pointAttribs:function(a,
b){var d=this.options||{};a=N(d,{color:a&&a.color},a&&a.options||{},b&&d.states[b]||{});return{fill:m(a.color).setOpacity(a.opacity).brighten(a.brightness).get(),stroke:a.borderColor,"stroke-width":a.borderWidth,dashstyle:a.borderDashStyle}},animate:function(a){if(!a){var b=l.animObject(this.options.animation);this.points.forEach(function(a){var d=a.shapeArgs;if(a.graphic&&d){var c={},e={};d.d?c.opacity=.001:(c.r=0,e.r=d.r);a.graphic.attr(c).animate(e,b);d.d&&setTimeout(function(){a&&a.graphic&&a.graphic.animate({opacity:1})},
b.duration)}},this);this.animate=null}},utils:{addOverlapToSets:G,geometry:g,geometryCircles:k,getDistanceBetweenCirclesByOverlap:D,layoutGreedyVenn:I,loss:E,processVennData:K,sortByTotalOverlap:H}},{draw:a,shouldDraw:function(){return!!this.shapeArgs},isValid:function(){return h(this.value)}})});m(a,"masters/modules/venn.src.js",[],function(){})});
//# sourceMappingURL=venn.js.map
