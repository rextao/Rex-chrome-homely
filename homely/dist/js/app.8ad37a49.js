(function(t){function e(e){for(var n,c,i=e[0],l=e[1],s=e[2],p=0,f=[];p<i.length;p++)c=i[p],Object.prototype.hasOwnProperty.call(r,c)&&r[c]&&f.push(r[c][0]),r[c]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(t[n]=l[n]);u&&u(e);while(f.length)f.shift()();return o.push.apply(o,s||[]),a()}function a(){for(var t,e=0;e<o.length;e++){for(var a=o[e],n=!0,i=1;i<a.length;i++){var l=a[i];0!==r[l]&&(n=!1)}n&&(o.splice(e--,1),t=c(c.s=a[0]))}return t}var n={},r={app:0},o=[];function c(e){if(n[e])return n[e].exports;var a=n[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,c),a.l=!0,a.exports}c.m=t,c.c=n,c.d=function(t,e,a){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(c.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)c.d(a,n,function(e){return t[e]}.bind(null,n));return a},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],l=i.push.bind(i);i.push=e,i=i.slice();for(var s=0;s<i.length;s++)e(i[s]);var u=l;o.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},"034f":function(t,e,a){"use strict";var n=a("85ec"),r=a.n(n);r.a},"4ff0":function(t,e,a){"use strict";var n=a("9571"),r=a.n(n);r.a},"54de":function(t,e,a){},"56d7":function(t,e,a){"use strict";a.r(e);a("e260"),a("e6cf"),a("cca6"),a("a79d");var n=a("2b0e"),r=a("5c96"),o=a.n(r),c=(a("0fae"),function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("div",[a("h1",[t._v("快速生成service与const中的代码")]),a("create-service-form")],1),a("div",[a("h1",[t._v("path => routerName转换")]),a("path-router-form")],1)])}),i=[],l=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"form-wrapper"},[a("div",t._l(t.textData,(function(e,n){return a("el-input",{key:n,staticClass:"textarea_width",attrs:{type:"textarea",rows:15,cols:10,placeholder:e.placeholder},model:{value:t.textData[n].data,callback:function(e){t.$set(t.textData[n],"data",e)},expression:"textData[index].data"}})})),1),a("div",[a("div",[a("p",[t._v("const的大写key前缀")]),a("p",[a("el-input",{model:{value:t.pre,callback:function(e){t.pre=e},expression:"pre"}})],1)]),a("div",[a("p",[t._v("action前缀")]),a("p",[a("el-input",{model:{value:t.actionPre,callback:function(e){t.actionPre=e},expression:"actionPre"}})],1)]),a("el-button",{attrs:{type:"warning"},on:{click:t.handleCreateClick}},[t._v("生成")])],1)]),a("div",[t._l(t.list,(function(e,n){return a("div",{key:n,staticClass:"tag_wrapper"},[a("el-tag",{attrs:{type:"success"}},[t._v(t._s(e.actionPre))]),t._v("："+t._s(e.pre||"空")+" "),a("i",{staticClass:"el-icon-circle-close",on:{click:function(e){return t.handleDelete(n)}}}),a("i",{staticClass:"el-icon-circle-plus-outline",on:{click:function(a){return t.handleAdd(e)}}})],1)})),a("el-button",{attrs:{type:"warning"},on:{click:t.handleSaveList}},[t._v("保存")])],2)])},s=[],u=(a("99af"),a("7db0"),a("4160"),a("baa5"),a("a434"),a("4d63"),a("ac1f"),a("25f0"),a("466d"),a("5319"),a("1276"),a("498a"),a("159b"),a("3835")),p=[{data:"",placeholder:"原始接口"},{data:"",placeholder:"const下的文件"},{data:"",placeholder:"service文件"}],f={NORMAL_API:1,MOCK_API:2},d={TYPE_CHOICE:[{label:"普通接口",value:f.NORMAL_API},{label:"mock平台",value:f.MOCK_API}]},h={CHINESE:"[一-龥]"},v={name:"create-service-form",data:function(){return{textData:p,actionPre:"/v4/operation/",pre:"",list:[]}},created:function(){var t=this;this.OPTIONS=d,window.chrome.storage.local.get("service-form-list",(function(e){t.list=e["service-form-list"]||[]})),console.log("创建onMessage监听");var e=this;window.chrome.runtime.onMessage.addListener((function(t){e.getReceiveData(t)}))},methods:{handleCreateClick:function(){this.setActionPreDefault(),this.generatorData(),this.addItemToList()},getReceiveData:function(t){var e=t.data;console.log("接收到的数据：",t);var a=this.textData[0].data,n="";try{var r=JSON.parse(e);console.log("解析数据： ",r),r.forEach((function(t){var e=t.method,a=t.api,r=t.text;n+="".concat(e,"@@").concat(a," ").concat(r,"\n")}))}catch(o){console.log(o)}this.textData[0].data="".concat(a,"\n").concat(n)},addItemToList:function(){var t=this.pre,e=this.actionPre,a=this.list.find((function(a){return a.pre===t&&a.actionPre===e}));a||this.list.push({actionPre:e,pre:t})},handleDelete:function(t){this.list.splice(t,1)},handleAdd:function(t){var e=t.actionPre,a=t.pre;Object.assign(this,{actionPre:e,pre:a})},handleSaveList:function(){window.chrome.storage.local.set({"service-form-list":this.list})},generatorData:function(){var t=this,e=Object(u["a"])(this.textData,3),a=e[0],n=e[1],r=e[2],o=this.getArray(a.data),c=this.actionPre.length,i="",l="";o.forEach((function(e){if(""!==e){var a=e.split("@@"),n=e,r="post";a.length>1&&(r=a[0],n=a[1]);var o=t.parseOriginItem(n),s=o.transformUrl,u=o.originUrl,p=o.chinese,f=s.lastIndexOf("/"),d=s.substr(f+1),h=s.substr(c).replace(/\//g,"_"),v=t.toLine(h),m=t.pre?"".concat(t.pre,"_"):"",g="".concat(m).concat(v).replace(/_\S/g,(function(t){return t.replace("_","").toUpperCase()}));i+="export const ".concat(g," = ").concat(r.toUpperCase(),"() `").concat(u,"`;  // ").concat(p," \n"),l+=t.getFunc(d,g,p,r)}})),r.data=l,n.data=i},setActionPreDefault:function(){var t=this.actionPre;"/"!==this.actionPre[t.length-1]&&(this.actionPre="".concat(t,"/"))},parseOriginItem:function(t){var e=new RegExp("".concat(h.CHINESE,".*"),"g"),a=t.match(e),n=t.replace(e,"").replace(/[\s，,]*/g,""),r=n.replace(/-/g,"_");return{originUrl:n,transformUrl:r,chinese:a&&a[0]||""}},getFunc:function(t,e,a,n){var r=e.trim().replace(/'/g,""),o=a?"// ".concat(a,"\n"):"",c=n.toLowerCase();return"get"===c?"".concat(o," export function ").concat(t,"(payload) {\n                    return http.").concat(c,"(URL_API.").concat(r,", {\n                        params: payload\n                    });\n                }\n"):"".concat(o," export function ").concat(t,"(payload) {\n                    return http.").concat(c,"(URL_API.").concat(r,", payload);\n                }\n")},getArray:function(t){return t.split("\n")},toLine:function(t){return t.replace(/([A-Z])/g,"_$1").toLowerCase()}}},m=v,g=(a("59fc"),a("2877")),_=Object(g["a"])(m,l,s,!1,null,"7a2fe884",null),b=_.exports,x=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"form-wrapper"},[a("el-input",{staticClass:"textarea_width",attrs:{type:"textarea",rows:5,cols:10},on:{blur:t.getHumpValue},model:{value:t.formData,callback:function(e){t.formData=e},expression:"formData"}}),a("el-input",{staticClass:"textarea_width",attrs:{type:"textarea",rows:5,cols:10,placeholder:"- 转驼峰（用于components）"},model:{value:t.humpValue,callback:function(e){t.humpValue=e},expression:"humpValue"}}),a("el-input",{staticClass:"textarea_width",attrs:{type:"textarea",rows:5,cols:10,placeholder:"path转驼峰（用于components）"},model:{value:t.humpValue2,callback:function(e){t.humpValue2=e},expression:"humpValue2"}})],1)])},w=[],y={name:"index",data:function(){return{formData:"",humpValue:""}},methods:{toHump:function(t){return t.replace(/-(\w)/g,(function(t,e){return e.toUpperCase()}))},getHumpValue:function(){this.humpValue=this.formData.replace(/^[a-z]/,(function(t){return t.toUpperCase()})).replace(/-(\w)/g,(function(t,e){return e.toUpperCase()})),this.humpValue2=this.formData.replace(/\/(\w)/g,(function(t,e){return e.toUpperCase()}))}}},P=y,C=(a("4ff0"),Object(g["a"])(P,x,w,!1,null,"88427700",null)),O=C.exports,D={name:"App",components:{CreateServiceForm:b,PathRouterForm:O},data:function(){return{textarea:""}}},k=D,A=(a("034f"),Object(g["a"])(k,c,i,!1,null,null,null)),I=A.exports;n["default"].use(o.a),n["default"].config.productionTip=!1,new n["default"]({render:function(t){return t(I)}}).$mount("#app")},"59fc":function(t,e,a){"use strict";var n=a("54de"),r=a.n(n);r.a},"85ec":function(t,e,a){},9571:function(t,e,a){}});