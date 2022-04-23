/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/util/MockServer","zsm/itsm/myreq/cust/util/Formatter"],function(M,F){"use strict";var m,_="zsm/itsm/myreq/cust/",a=_+"localService/mockdata";return{init:function(){var u=jQuery.sap.getUriParameters(),j=jQuery.sap.getModulePath(a),s=jQuery.sap.getModulePath(_+"manifest",".json"),e="MessageResultSet",E=u.get("errorType"),i=E==="badRequest"?400:500,o=jQuery.sap.syncGetJSON(s).data,b=o["sap.app"].dataSources.mainService,c=jQuery.sap.getModulePath(_+b.settings.localUri.replace(".xml",""),".xml"),d=/.*\/$/.test(b.uri)?b.uri:b.uri+"/";m=new M({rootUri:d});M.config({autoRespond:true,autoRespondAfter:(u.get("serverDelay")||1000)});m.simulate(c,{sMockdataBaseUrl:j,bGenerateMissingMockData:true});var r=m.getRequests(),R=function(f,g,h){h.response=function(x){x.respond(f,{"Content-Type":"text/plain;charset=utf-8"},g);};};r.push({method:"GET",path:new RegExp("getDefaultPriority?(.*)"),response:function(x,U){jQuery.sap.log.debug("Incoming request for getDefaultPrio");x.respondJSON(200,{},JSON.stringify({d:{getDefaultPriority:{defaultPrio:"3"}}}));}});r.push({method:"POST",path:new RegExp(M.prototype._escapeStringForRegExp("MessageResultSet(guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c512')/TextSet")),response:function(x,U){jQuery.sap.log.debug("Incoming request for Text Post and locked Incident");x.respondJSON(400,{},JSON.stringify({"error":{"code":"CRM_ORDER/013","message":{"lang":"en","value":"Transaction 8000141797 is being processed by user SPENNEBERGA"},"innererror":{"application":{"component_id":"SV-SMG-SUP","service_namespace":"/SAP/","service_id":"ZAI_CRM_GW_MYREQUIREMENTS_SRV","service_version":"0001"},"transactionid":"80B157A6EB784F83A1F0196AC8840859","timestamp":"20170421073243.8683680","Error_Resolution":{"SAP_Transaction":"Run transaction /IWFND/ERROR_LOG on SAP Gateway hub system and search for entries with the timestamp above for more details","SAP_Note":"See SAP Note 1797736 ","Batch_SAP_Note":"See SAP Note 1869434 for details about working with $batch"},"errordetails":[{"code":"CRM_ORDER/013","message":"Transaction 8000141797 is being processed by user SPENNEBERGA","propertyref":"","severity":"error","target":"TEXT"}]}}}));}});r.push({method:"GET",path:new RegExp("withdrawIncident?(.*)"),response:function(x,U){jQuery.sap.log.debug("Incoming request for withdraw");x.respondJSON(200,{},JSON.stringify({"d":{"withdrawIncident":{"__metadata":{"type":"ZAI_CRM_GW_MYREQUIREMENTS_SRV.BAPIRET"},"Type":"E","Id":"CRM_ORDER_MISC","Number":"104","MessageV1":"","MessageV2":"","MessageV3":"","MessageV4":""}}}));}});r.push({method:"GET",path:RegExp(M.prototype._escapeStringForRegExp("withdrawIncident?Guid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c512'")+"?(.*)"),response:function(x,U){jQuery.sap.log.debug("Incoming request for withdraw");x.respondJSON(400,{},JSON.stringify({"error":{"code":"CRM_ORDER/013","message":{"lang":"en","value":"Transaction 8000141797 is being processed by user SPENNEBERGA"},"innererror":{"application":{"component_id":"SV-SMG-SUP","service_namespace":"/SAP/","service_id":"ZAI_CRM_GW_MYREQUIREMENTS_SRV","service_version":"0001"},"transactionid":"80B157A6EB784F83A1F0196AC8840859","timestamp":"20170421073243.8683680","Error_Resolution":{"SAP_Transaction":"Run transaction /IWFND/ERROR_LOG on SAP Gateway hub system and search for entries with the timestamp above for more details","SAP_Note":"See SAP Note 1797736 ","Batch_SAP_Note":"See SAP Note 1869434 for details about working with $batch"},"errordetails":[{"code":"CRM_ORDER/013","message":"Transaction 8000141797 is being processed by user SPENNEBERGA","propertyref":"","severity":"error","target":"TEXT"}]}}}));}});r.push({method:"GET",path:new RegExp("confirmIncident?(.*)"),response:function(x,U){jQuery.sap.log.debug("Incoming request for withdraw");x.respondJSON(200,{},JSON.stringify({"d":{"withdrawIncident":{"__metadata":{"type":"ZAI_CRM_GW_MYREQUIREMENTS_SRV.BAPIRET"},"Type":"E","Id":"CRM_ORDER_MISC","Number":"104","MessageV1":"","MessageV2":"","MessageV3":"","MessageV4":""}}}));}});r.push({method:"GET",path:RegExp(M.prototype._escapeStringForRegExp("confirmIncident?Guid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c512'")+"?(.*)"),response:function(x,U){jQuery.sap.log.debug("Incoming request for withdraw");x.respondJSON(400,{},JSON.stringify({"error":{"code":"CRM_ORDER/013","message":{"lang":"en","value":"Transaction 8000141797 is being processed by user SPENNEBERGA"},"innererror":{"application":{"component_id":"SV-SMG-SUP","service_namespace":"/SAP/","service_id":"ZAI_CRM_GW_MYREQUIREMENTS_SRV","service_version":"0001"},"transactionid":"80B157A6EB784F83A1F0196AC8840859","timestamp":"20170421073243.8683680","Error_Resolution":{"SAP_Transaction":"Run transaction /IWFND/ERROR_LOG on SAP Gateway hub system and search for entries with the timestamp above for more details","SAP_Note":"See SAP Note 1797736 ","Batch_SAP_Note":"See SAP Note 1869434 for details about working with $batch"},"errordetails":[{"code":"CRM_ORDER/013","message":"Transaction 8000141797 is being processed by user SPENNEBERGA","propertyref":"","severity":"error","target":"TEXT"}]}}}));}});m.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.POST,this.afterPost);m.attachBefore(sap.ui.core.util.MockServer.HTTPMETHOD.POST,this.beforePost);m.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.GET,this.afterGet,"MessageResultSet");m.attachBefore(sap.ui.core.util.MockServer.HTTPMETHOD.GET,this.beforeGet,"MessageResultSet");m.setRequests(r);if(u.get("metadataError")){r.forEach(function(f){if(f.path.toString().indexOf("$metadata")>-1){R(500,"metadata Error",f);}});}if(E){r.forEach(function(f){if(f.path.toString().indexOf(e)>-1){R(i,E,f);}});}m.start();jQuery.sap.log.info("Running the app with mock data");},getMockServer:function(){return m;},regExpEscape:function(l){return l.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g,"\\$&");},afterPost:function(e){if(e.getParameter("oEntity").__metadata.type==="ZAI_CRM_GW_MYREQUIREMENTS_SRV.Text"){e.getParameter("oEntity").DateTimeText=F.dateTime(new Date());e.getParameter("oEntity").TdfuserText="Max Mock";e.getParameter("oEntity").Tdid="SU01";e.getParameter("oEntity").TdidTxt="Reply";e.getParameter("oEntity").Tdobject="CRM_ORDERH";e.getParameter("oEntity").Email="max.mock@sap.com";e.getParameter("oEntity").Emailsubject="Emailsubject 2";e.getParameter("oEntity").Department="Abteilung Mock Data";e.getParameter("oEntity").Company="SAP SE";e.getParameter("oEntity").CompanyAdress="SAP Allee 12";e.getParameter("oEntity").Contactmobile="+49 1234 12341";e.getParameter("oEntity").Contactphone="+49 7222 12312";}else if(e.getParameter("oEntity").__metadata.type==="ZAI_CRM_GW_MYREQUIREMENTS_SRV.Attachment"){}},beforePost:function(e,s,n){if(e.getParameter("sNavName")==="AttachmentSet"){if(e.getParameter("oXhr").requestBody){var f=e.getParameter("oXhr").requestBody;var k=e.getParameter("sKeys").split("'");var r=k[1];var b={"refGuid":r,"language":"E","uploadDate":"/Date("+new Date().getTime()+")/","userName":"JACK","contributor":"Max Mock","document":"01110011010100111111111010011111","thumbnailUrl":"thumbnailUrl 1","fileName":f.name,"fileSize":f.size,"mimeType":f.type,"enableEdit":false,"enableDelete":true,"visibleDelete":true,"visibleEdit":false};var c=JSON.stringify(b);}e.getParameter("oXhr").requestBody=c;}},beforeGet:function(e,d){},afterGet:function(e,d){var b=[];var c=function(s,g){var D=e.getSource().getEntitySetData(g);D.forEach(function findStatus(h,i,j){if(h.Concatstatuser===s){b.push(h);}});};var f=new RegExp("filter=Concatstatuser");if(f.test(e.getParameter("oXhr").url)){var u=(e.getParameter("oXhr").url).split("filter=Concatstatuser");if(new RegExp("NEW").test(u[1])){c("New","MessageResultSet");}if(new RegExp("IN_PROC").test(u[1])){c("In Process","MessageResultSet");}if(new RegExp("CUSTACTION").test(u[1])){c("Customer Action","MessageResultSet");}if(new RegExp("PROP_SOL").test(u[1])){c("Solution Provided","MessageResultSet");}if(new RegExp("WITHDRAWN").test(u[1])){c("Withdrawn","MessageResultSet");}if(new RegExp("CONFIRMED").test(u[1])){c("Closed","MessageResultSet");}}else{}if(b.length>=1){e.getParameter("oFilteredData").results=b;}}};});
