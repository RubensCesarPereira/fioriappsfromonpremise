/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.ses.approve.util.QuickView");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");

ui.s2p.mm.ses.approve.util.QuickView = { 
		
		setCreatedByModel : function(oView, oObject) {
			
			var sBusinessCardUserId = oView.getBindingContext().getObject().CreatedByID;
			var sSAPOrigin =  oView.getBindingContext().getObject().SAP__Origin;
			if ( oObject ) {
				if ( oObject.__metadata.type === "MM_SES_APPROVE.Note" ) {
                    // the obect is a Note
					sBusinessCardUserId = oObject.CreatedByUser;
				    sSAPOrigin          = oObject.SAP__Origin;
				}
			}
			// define the model for the business card 
			oView.setModel(oView.getModel(), "createdBy");
			var contextPath = "/BusinessCards(";
			contextPath += "SAP__Origin='" +sSAPOrigin + "',"; 
			contextPath += "UserID='" + sBusinessCardUserId + "')";
			oView.bindElement("createdBy>" + contextPath);

		},
		
		EmployeeLaunch : function(oControl, oThis, sModelName) {
		var creator =   oThis.getView().getBindingContext(sModelName).getObject();	
		
	   	var fCallbackNavPara = function( oQvView ) {
			//callback function for providing external navigation parameters
			var oNavConfig = {};
			oNavConfig.target = {};
			oNavConfig.target.semanticObject = "Quickoverview";
			oNavConfig.target.action = "Target5";
			oNavConfig.params = { Employee : "277" };

			return oNavConfig;
		};

		var fCallbackNavParaComp = function( oQvView ) {
			//callback function for providing external navigation parameters
			var oNavConfig = {};
			oNavConfig.target = {};
			oNavConfig.target.semanticObject = "Quickoverview";
			oNavConfig.target.action = "Target5";
			oNavConfig.params = { Company : "4577" };

			return oNavConfig;
		};
		
		// employee data - use exact attribute names
		var oEmpConfig = {
			title :  oThis.getView().getModel("i18n").getResourceBundle().getText("BUSINESS_CARD_EMPLOYEE_TITLE"),
			name : creator.FullName,  //"Frank Schulze",
			imgurl : creator.ImageURL,
			department : creator.Department,
			contactmobile : creator.MobilePhone,
			contactphone : creator.WorkPhone,
			contactemail : creator.Email,
			contactemailsubj : creator.EmailSubjec,
			companyname : creator.CompanyName,
			companyaddress : creator.CompanyAddress,

			//optional: if the following callback function is provided a Cross App navigation link from the 'card header'
			//will be provided - application configures the target in the callback
			//beforeExtNav : fCallbackNavPara,

			//optional: if the following attributes are provided - a link to company card is available
/*
			companycard : {
				title : "Account",
				imgurl : sImgPathC,
				companyphone : "4536654564",
				maincontactname : "Frank Schulze",
				maincontactmobile : "01718484845",
				maincontactphone : "06222 854568484",
				maincontactemail : "Frank.S@company.com",
				maincontactemailsubj : "for you maincontact",
				//optional: if the following callback function is provided a Cross App navigation link from the 'card header'
				//will be provided - application configures the target in the callback
				beforeExtNav : fCallbackNavParaComp,
			}
*/
		};

		// call 'Business Card' reuse component
		var oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(
				oEmpConfig);
		oEmployeeLaunch.openBy(oControl);
	}		
		
		
};