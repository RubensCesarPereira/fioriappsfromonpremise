/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.ses.approve.util.QuickView");jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");ui.s2p.mm.ses.approve.util.QuickView={setCreatedByModel:function(v,o){var b=v.getBindingContext().getObject().CreatedByID;var s=v.getBindingContext().getObject().SAP__Origin;if(o){if(o.__metadata.type==="MM_SES_APPROVE.Note"){b=o.CreatedByUser;s=o.SAP__Origin}}v.setModel(v.getModel(),"createdBy");var c="/BusinessCards(";c+="SAP__Origin='"+s+"',";c+="UserID='"+b+"')";v.bindElement("createdBy>"+c)},EmployeeLaunch:function(c,t,m){var a=t.getView().getBindingContext(m).getObject();var C=function(q){var n={};n.target={};n.target.semanticObject="Quickoverview";n.target.action="Target5";n.params={Employee:"277"};return n};var f=function(q){var n={};n.target={};n.target.semanticObject="Quickoverview";n.target.action="Target5";n.params={Company:"4577"};return n};var e={title:t.getView().getModel("i18n").getResourceBundle().getText("BUSINESS_CARD_EMPLOYEE_TITLE"),name:a.FullName,imgurl:a.ImageURL,department:a.Department,contactmobile:a.MobilePhone,contactphone:a.WorkPhone,contactemail:a.Email,contactemailsubj:a.EmailSubjec,companyname:a.CompanyName,companyaddress:a.CompanyAddress,};var E=new sap.ca.ui.quickoverview.EmployeeLaunch(e);E.openBy(c)}};
