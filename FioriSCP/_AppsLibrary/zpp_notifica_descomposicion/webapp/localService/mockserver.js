sap.ui.define(["sap/ui/core/util/MockServer"],function(e){"use strict";var t,a="cl/conchaytoro/zpp_notifica_descomposicion/",r=a+"localService/mockdata";return{init:function(){var o=jQuery.sap.getUriParameters(),i=jQuery.sap.getModulePath(r),n=jQuery.sap.getModulePath(a+"manifest",".json"),s="NotificaSet",u=o.get("errorType"),c=u==="badRequest"?400:500,p=jQuery.sap.syncGetJSON(n).data,f=p["sap.app"].dataSources.mainService,d=jQuery.sap.getModulePath(a+f.settings.localUri.replace(".xml",""),".xml"),l=/.*\/$/.test(f.uri)?f.uri:f.uri+"/";t=new e({rootUri:l});e.config({autoRespond:true,autoRespondAfter:o.get("serverDelay")||1e3});t.simulate(d,{sMockdataBaseUrl:i,bGenerateMissingMockData:true});var g=t.getRequests(),m=function(e,t,a){a.response=function(a){a.respond(e,{"Content-Type":"text/plain;charset=utf-8"},t)}};if(o.get("metadataError")){g.forEach(function(e){if(e.path.toString().indexOf("$metadata")>-1){m(500,"metadata Error",e)}})}if(u){g.forEach(function(e){if(e.path.toString().indexOf(s)>-1){m(c,u,e)}})}t.setRequests(g);t.start();jQuery.sap.log.info("Running the app with mock data")},getMockServer:function(){return t}}});