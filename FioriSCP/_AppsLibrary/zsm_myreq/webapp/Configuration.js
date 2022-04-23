/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("zsm.itsm.myreq.cust.Configuration");jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");jQuery.sap.require("sap.ca.scfld.md.app.Application");sap.ca.scfld.md.ConfigurationBase.extend("zsm.itsm.myreq.cust.Configuration",{oServiceParams:{serviceList:[{name:"ZAI_CRM_GW_MYREQUIREMENTS_SRV",masterCollection:"MessageResultSet",serviceUrl:"/sap/opu/odata/sap/ZAI_CRM_GW_MYREQUIREMENTS_SRV/",isDefault:true,useBatch:true}]},getServiceParams:function(){return this.oServiceParams;},getServiceList:function(){return this.getServiceParams().serviceList;},getMasterKeyAttributes:function(){return["id"];}});
