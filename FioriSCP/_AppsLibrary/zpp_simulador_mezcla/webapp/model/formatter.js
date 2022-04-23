sap.ui.define([],function(){"use strict";return{currencyValue:function(e){if(!e){return""}return parseFloat(e).toFixed(2)},ltrimAll:function(e,r){r=r||"\\s";return e.replace(new RegExp("^["+r+"]+","g"),"")},ltrim:function(e){e=e||"\\s";return e.replace(new RegExp("^[0]+","g"),"")},formatNumber:function(e){if(e!==undefined&&e!==""){jQuery.sap.require("sap.ui.core.format.NumberFormat");var r=sap.ui.core.format.NumberFormat.getFloatInstance({maxFractionDigits:3,groupingEnabled:true,groupingSeparator:".",decimalSeparator:","});var t=r.format(e);return t}return e},removeChar:function(e){if(e!=="undefined"&&e){return e.replace(/[^0-9\.]+/g,"")}return e},indicator:function(e){var r=this.byId("CodigoMezcla");if(r<=50){this.removeStyleClass("yellow");this.removeStyleClass("green");this.addStyleClass("red")}else if(r<=75){this.removeStyleClass("yellow");this.removeStyleClass("red");this.addStyleClass("green")}else{this.removeStyleClass("red");this.removeStyleClass("yellow");this.addStyleClass("green")}return r+" %"},addDot:function(e){var r=e.split("");var t=[];r.forEach(function(e){switch(e){case".":break;case" ":break;default:t.push(e);break}});var a=t.join("");var i=a.split(".").join("");i=i.split(",");var n=i[0].split("").reverse();var s=[];var l="";var o=Math.ceil(n.length/3);for(var u=0;u<o;u++){for(var c=0;c<3;c++){if(n[c+u*3]!==undefined){l+=n[c+u*3]}}s.push(l);l=""}return s.join(".").split("").reverse().join("")}}});