/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.purchorder.approve.util.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.QuantityFormat");
jQuery.sap.require("sap.ca.ui.model.format.FormatHelper");
jQuery.sap.require("sap.ca.ui.model.format.FormattingLibrary");
jQuery.sap.require("sap.ui.core.format.NumberFormat");

ui.s2p.mm.purchorder.approve.util.Conversions = {

	stringVisibilityTrigger : function(sString){
		if (sString == null || sString == "") {
			return false;
		} else {
			return true;
		}
	},	
	
	stringFormatterInterop : function(sString){
		if (sString != null && sString != "") {
			return sString;
		}else{
			return "";
		}
	},
	
		
	// ID and Description Formatting
	commonIDFormatter: function(sDescription, sID) {
		if (sID){
			if (sDescription){
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
				return oBundle.getText("Formatting.DescriptionAndId", [sDescription, sID]);
			}
			return sID;
		}
		if (sDescription){
		  return sDescription;
		}
		return "";
	},

	salesOrderIDFormatter: function(sSalesOrder, sSalesOrderItem, sSalesOrderScheduleLine) {
		var sResult;
		sResult = sSalesOrder;
		if (sSalesOrderItem){
			sResult = sResult + "/" + sSalesOrderItem;
		}
		if (sSalesOrderScheduleLine){
			sResult = sResult + "/" + sSalesOrderScheduleLine;
		}
		return sResult;
	},
	
	assetIDFormatter: function(sDescription, sAsset, sAssetSubNumber) {
		var sAssetNumber = sAsset;
		if (sAssetSubNumber){
			sAssetNumber = sAssetNumber + "/" + sAssetSubNumber;
		}

		if (sAssetNumber){
			if (sDescription){
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
				return oBundle.getText("Formatting.DescriptionAndId", [sDescription, sAssetNumber]);
			}
			return sAssetNumber;
		}
		if (sDescription){
		  return sDescription;
		}
		return "";
	},

	accountAssignmentPercentageFormatter: function (percentage) {
	//  "%" shall be shown, only if there is a percentage given.	
		if (percentage == null || percentage == "") {
			return "";
		} else {
			return "%";
		}
	},

	incoTermsFormatter: function(sIncoterm, sIncotermLocation, sIncotermDescription) {
		var sResult = ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(sIncotermDescription, sIncoterm);

		if (sIncotermLocation != '') {
			sResult += ', ' + sIncotermLocation;
		}
		return sResult;
	},

	incoTermsVisibilityTrigger: function(sIncoterm, sIncotermLocation, sIncotermDescription) {
		var f = ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger;
		return f(sIncoterm) && f(sIncotermDescription);
	},

	serviceInformationVisibilityTrigger: function( sServiceID, sLongDescription ) {
		var f = ui.s2p.mm.purchorder.approve.util.Conversions.commonFieldVisibilityTrigger;
		return f(sServiceID) || f(sLongDescription);
	},
	
	componentVisibilityTrigger: function(iItemCategory) {
		if(iItemCategory === "3") {
			return true;
		}else{
			return false;
		}
	},

	PriceConditionsVisibilityTriggerItemType: function(sPricingConditions) {
		if (sPricingConditions === null || sPricingConditions === "" ||sPricingConditions.length === 0 || sPricingConditions === undefined ) {
			return false;
		} else {
			return true;
		}
	},

	itemCategoryFormatter: function(sItemCategoryDescription, sItemType) {
		if (sItemCategoryDescription && sItemCategoryDescription !== 'return-item') {
			if (sItemCategoryDescription && sItemCategoryDescription !== "") {
				return sItemCategoryDescription;
			} else  {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				if (sItemType == 'S') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.serviceLineIdLabel") : "";
				} else if (sItemType == 'L') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.limit") : "";
				} else if (sItemType == 'M') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.standard") : "";
				} else if (sItemType == '2') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.consignment") : "";
				} else if (sItemType == '3') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.subcontracting") : "";
				} else if (sItemType == '5') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.thirdParty") : "";
				}; 
			};	
		} else {
			var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
			if (sItemType == 'S') {
				var sItemCategoryDescription = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.serviceLineIdLabel") : "";
			} else if (sItemType == 'L') {
				var sItemCategoryDescription = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.limit") : "";
			} else if (sItemType == 'M') {
				var sItemCategoryDescription = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.standard") : "";
			} else if (sItemType == '2') {
				var sItemCategoryDescription = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.consignment") : "";
			} else if (sItemType == '3') {
				var sItemCategoryDescription = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.subcontracting") : "";
			} else if (sItemType == '5') {
				var sItemCategoryDescription = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.thirdParty") : "";
			}
			var sReturnItem = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.return") : "";
			var sResult = sItemCategoryDescription + ' / ' + sReturnItem;
			return sResult ; 
		};	
 	},

	IDFormatter: function(sDescription, sID) {
		return ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(sDescription, sID);
	},

	companyCodeFormatter: function(sCode, sCodeDescr) {
		return ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(sCodeDescr, sCode);
	},
	
	lazyRoundNumber: function(sNum) {
		var result = 0;
		var formatter;
		if (sNum) {
			if (!isNaN(parseFloat(sNum)) && isFinite(sNum)) {
				if (Math.abs(sNum) < 1e6) {
					formatter = sap.ui.core.format.NumberFormat.getInstance({style:'standard'}); 
				} else {
					formatter = sap.ui.core.format.NumberFormat.getInstance({style:'short'});
				}
				result = formatter.format(sNum);
			}
		}
		return result;
	},

	getNumberFormatOptions: function(options, lazy) {
		var formatOptions = {};
		var t = typeof options;
		switch (t) {
		case "number":
			if (lazy) {
				formatOptions.lazyDecimals = options;
			} else {
				formatOptions.decimals = options;
			}
			break;
		case "object":
			if (typeof options.locale == "string") {
				formatOptions.locale = new sap.ui.core.Locale(options.locale);
			} else {
				formatOptions.locale = options.locale;
			}
			formatOptions.decimals = options.decimals;
	        formatOptions.rounding = options.rounding;
	        formatOptions.lazy = options.lazy;
	        formatOptions.lazyDecimals = options.lazyDecimals;
	        formatOptions.lazyRounding = options.lazyRounding;
	        break;
	    default:
	    	break;
		}
		if (lazy != undefined) {
			formatOptions.lazy = lazy;
		}
		if (!formatOptions.locale) {
			if (sap.ui.getCore().getConfiguration().getLanguage() == "ZH") {
				formatOptions.locale = new sap.ui.core.Locale("zh_CN");
			} else {
				formatOptions.locale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
			}
		}
		return formatOptions;
	},

	accountingFormatter: function(oHeaderInfo) {
		if (!oHeaderInfo) {return;};
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sMultiAccounting = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.multiAccounting") : "";
		var sNoAccounting = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.placeholder") : "";
		var sUnknown = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.unknown") : "";
		var sGlAccountLabel = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.account") : "";
		if (oHeaderInfo.CumulatedAccountingTypeCode == '2') {
			return sMultiAccounting;
		} else if (oHeaderInfo.CumulatedAccountingTypeCode == '3') {
			return sUnknown; 
		} else if (oHeaderInfo.CumulatedAccountingTypeCode == '0') {
			return sNoAccounting;
		};		

		// old logic
		if ( (oHeaderInfo.CostCentre === "" || oHeaderInfo.CostCentre === undefined) &&
			 (oHeaderInfo.WBSElement === "" || oHeaderInfo.WBSElement === undefined) &&
			 (oHeaderInfo.Network === ""    || oHeaderInfo.Network === undefined) &&
			 (oHeaderInfo.Order === ""      || oHeaderInfo.Order === undefined) &&
			 (oHeaderInfo.SalesOrder === "" || oHeaderInfo.SalesOrder === undefined) &&
			 (oHeaderInfo.Asset === ""      || oHeaderInfo.Asset === undefined) &&
			 (oHeaderInfo.ProfitCenter === "" || oHeaderInfo.ProfitCenter === undefined)) {

			var sResult1 = ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.AccountDescription, oHeaderInfo.AccountNumber);
			var sResult2 = ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.GlAccountDescription, oHeaderInfo.GlAccountNumber);
			return oHeaderInfo.AccountCategoryDescription + ' ' + sResult1 + '\n' + sGlAccountLabel + ' ' + sResult2;	
		} 

		// new logic
		else {
			var sResult = "";
			if (oHeaderInfo.CostCentre != "") {
				var sCostCentreLabel = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.accountAssignmentCostCentre") : "";
				sResult = sCostCentreLabel + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.CostCentreDescription, oHeaderInfo.CostCentre);
			}
			if (oHeaderInfo.WBSElement != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sWBSElement = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.accountAssignmentWBSElement") : "";
				sResult = sResult + sWBSElement + ' ' +  ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.WBSElementDescription, oHeaderInfo.WBSElement);
			}
			if (oHeaderInfo.Network != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sNetwork = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.accountAssignmentNetwork") : "";
				sResult = sResult + sNetwork + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.NetworkDescription, oHeaderInfo.Network);
			}
			if (oHeaderInfo.Order != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sOrder = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.accountAssignmentOrder") : "";
				sResult = sResult + sOrder + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.OrderDescription, oHeaderInfo.Order);
			}
			if (oHeaderInfo.SalesOrder != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sSalesOrder = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.accountAssignmentSalesOrder") : "";
				sResult = sResult + sSalesOrder + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.salesOrderIDFormatter(oHeaderInfo.SalesOrder, oHeaderInfo.SalesOrderItem, oHeaderInfo.SalesOrderScheduleLine);
			}
			if (oHeaderInfo.Asset != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sAsset = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.accountAssignmentAsset") : "";
				sResult = sResult + sAsset + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.assetIDFormatter(oHeaderInfo.AssetDescription, oHeaderInfo.Asset, oHeaderInfo.AssetSubnumber);
			}
			//######################################### ProfitCenter implemented with SP8 note
			if (oHeaderInfo.ProfitCenter != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sProfitCenter = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.ProfitCenter") : "";
				sResult = sResult + sProfitCenter + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.ProfitCenterDescription, oHeaderInfo.ProfitCenter);
			}
			//#########################################
			if (oHeaderInfo.GlAccountNumber != "") {
				if (sResult !== "") {sResult = sResult + '\n';};
				var sGlAccount = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.account") : "";
				sResult = sResult + sGlAccount + ' ' + ui.s2p.mm.purchorder.approve.util.Conversions.commonIDFormatter(oHeaderInfo.GlAccountDescription, oHeaderInfo.GlAccountNumber);
			}
			return sResult;
		}
	},

	noteDateFormatter: function(bNoteIsApproverNote, sDate) {
		if (bNoteIsApproverNote) {
			return ui.s2p.mm.purchorder.approve.util.Conversions.formatDaysAgo(sDate);
		} else {
			return '';
		};
	},

	approverNoteValueFormatter: function(bNoteIsApproverNote, sValue) {
		if (bNoteIsApproverNote) {
			return sValue;
		} else {
			return '';
		};
	},

	companyCodeVisibilityTrigger: function(sCode, sCodeDescr) {
		if ((sCode == '' || sCode == null) && (sCodeDescr == '' || sCodeDescr == null)) {
			return false;
		} else {
			return true;
		};
	},

	commonFieldVisibilityTrigger: function(sValue) {
		if (sValue == '' || sValue == null) {
			return false;
		} else {
			return true;
		};
	},

	deliveryAddressFormatter: function(sStreet, sPoBox, sCity, sCountry) {
		return sStreet + "," + " " + sPoBox + " " + sCity + "," + " " + sCountry;
	},

	valueLimitFormatter: function(sValue, sUnlimited, sCurrency) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.valueLimit") : "";
		sResult += ': '
				+ ui.s2p.mm.purchorder.approve.util.Conversions.valueLimitWithoutLabelFormatter(sValue, sUnlimited,
						sCurrency);
		return sResult;
	},

	valueLimitWithoutLabelFormatter: function(sValue, sUnlimited, sCurrency) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sResult = "";
		if (sUnlimited === '' || sUnlimited === null || sUnlimited === undefined) {
			sResult += ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount(sValue) + ' ' + sCurrency;
		} else {
			sResult += ((oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.unlimitedLimit") : "");
		}
		return sResult;
	},

	expectedValueFormatter: function(sValue, sCurrency) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.expectedValue") : "";
		sResult += ': ' + ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount(sValue) + ' ' + sCurrency;
		return sResult;
	},

	itemQuantityFormatter: function(sQuantity, sUnit, sValueLimit, sUnlimitFlag, sCurrency, sType) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		if (sType == 'S') {
			return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.serviceLineIdLabel") : "";
		} else if (sType == 'L') {
			return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.limit") : "";
			// return sap.mm.purchaseorder.approve.util.Conversions.valueLimitFormatter(sValueLimit, sUnlimitFlag,
			// sCurrency);
		} else {
			return ui.s2p.mm.purchorder.approve.util.Conversions.quantityFormatter(sQuantity, sUnit);
		};
	},

	quantityFormatter: function(sQuantity, sUnit) {
		
		return ui.s2p.mm.purchorder.approve.util.Conversions.formatQuantityWithoutUnit(sQuantity, sUnit) + ' ' + sUnit;
		
	},

	formatQuantityWithoutUnit: function(sQuantity, sUnit) {
		var numberFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({}, sap.ui.getCore().getConfiguration().getLocale());

		return numberFormatter.format(sQuantity);
	},	

	quantityPerUnitItemCategory: function(sQuantity, sUnit, sPrice, sCurrency,sItemCategory){
		if (sItemCategory === "2"){
		return ui.s2p.mm.purchorder.approve.util.Conversions.quantityPerUnitFormatter("", "", "", "", "");
		}
		else{
		return	ui.s2p.mm.purchorder.approve.util.Conversions.quantityPerUnitFormatter(sQuantity, sUnit, sPrice, sCurrency, sItemCategory);
		}
	},

	quantityPerUnitFormatter: function(sQuantity, sUnit, sPrice, sCurrency) {
		var sPrice = ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount(sPrice);
		var sQuantity = ui.s2p.mm.purchorder.approve.util.Conversions.formatQuantityWithoutUnit(sQuantity, sUnit);
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		
		return oBundle.getText("view.PurchaseOrder.priceQty", [sPrice, sCurrency, sQuantity, sUnit]);
	},

	totalPriceFormatter: function(sPrice, sCurrency) {
		return sPrice + ' ' + sCurrency;
	},

	notesVisibilityTrigger: function(oNotes) {
		if (oNotes !== null && oNotes !== undefined && oNotes.length !== 0) {
			return true;
		} else {
			return false;
		};
	},

	attachmentsVisibilityTrigger: function(oAttachments) {
		if (oAttachments !== null && oAttachments !== undefined && oAttachments.length !== 0) {
			return true;
		} else {
			return false;
		};
	},

	createdByFormatter: function(sId, sName) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.by") : "";
		if (sName !== undefined && sName !== '') {
			sResult += ' ' + sName;
		} else {
			sResult += ' ' + sId;
		}
		return sResult;
	},

	deliveryDateFormatter: function(sDeliveryDate, sAlsoLater) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		var oLater = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.DeliveryAlsoLater") : "";

		var oDate = ui.s2p.mm.purchorder.approve.util.Conversions.formatLongDate(sDeliveryDate, true);

		if (sAlsoLater == null || sAlsoLater == "") {
			return oDate;
		} else if ( sap.ui.getCore().getConfiguration().getLanguage() == "zh-Hans") {
			return oDate + oLater;
		} else {
			return oDate + ' ' + oLater;
		}
	},

	// create a function that converts Strings into Dates
	fConvert : function(sDate) {
		var oDate = sDate;
		if (typeof sDate === "string") {
			// Handle the format /Date(miliseconds)/
			if (sDate.indexOf("Date") != -1) {
				sDate = sDate.substring(sDate.indexOf("(") + 1, sDate
						.indexOf(")"));
				sDate = new Number(sDate);
			}
			oDate = new Date(sDate);
		} else if (typeof sDate !== "object" || sDate === null) {
			// console.warn("DateTimeFormatter:: Neither a Date Object nor a
			// String was passed. Unable to format " + typeof sDate);
			oDate = "";
		}
		return oDate;
	},

	formatLongDate : function(oDate, bUTC) {
		var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "medium"}, sap.ui.getCore().getConfiguration().getLocale());

		oDate = ui.s2p.mm.purchorder.approve.util.Conversions.fConvert(oDate);
		if (oDate === "") {
			return "";
		}
		return formatter.format(oDate, bUTC);
	},

	deliveryHeaderFormatter: function(sDeliveryDate, sAlsoLater) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		var prefix = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.deliveryOn") : "";
		return prefix + ' '
				+ ui.s2p.mm.purchorder.approve.util.Conversions.deliveryDateFormatter(sDeliveryDate, sAlsoLater);
	},

	itemsTableHeader: function(sItemsCount) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		if (sItemsCount === undefined || sItemsCount === null || parseInt(sItemsCount) == 0) {
			return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.noItem") : "";
		} else {
			return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.multipleItems", [parseInt(sItemsCount)]) : "";
		};
	},

	serviceLinesTableHeader: function(sItemsCount) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		if (sItemsCount === undefined || sItemsCount === null || parseInt(sItemsCount) == 0) {
			return '';
		} else {
			return (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.multipleLines", [parseInt(sItemsCount)]) : "";
		};
	},

	commonCountVisibilityTrigger: function(sCount) {
		if (sCount !== null && sCount !== undefined && sCount != '0') {
			return true;
		} else {
			return false;
		};
	},

	materialVisibilityTrigger: function(sProductLineType) {
		if (sProductLineType !== "L" && sProductLineType !== "S") {
			return true;
		}
		return false;
	},

	serviceVisibilityTrigger: function(sProductLineType) {
		if (sProductLineType == "S") {
			return true;
		}
		return false;
	},

	limitVisibilityTrigger: function(sProductLineType) {
		if (sProductLineType == "L") {
			return true;
		}
		return false;
	},

	ItemServiceLineVisibilityTrigger: function(sNumberSLine) {
		if (sNumberSLine == '' || sNumberSLine == null || sNumberSLine == "0") {
			return false;
		} else {
			return true;
		}
	},

	ItemLimitVisibilityTrigger: function(sLimitVal, sExpectedVal, sCategory) {
		if (sCategory == "S" && ((sLimitVal && parseFloat(sLimitVal) > 0) || (sExpectedVal && parseFloat(sExpectedVal) > 0))) {
			return true;
		} else {
			return false;
		}
	},

	ItemAccountAssignmentVisibilityTrigger: function(oAccounting) {
   		if (oAccounting !== null && oAccounting !== undefined && oAccounting.length !== 0) {
			return true;
		} else {
			return false;
		}
	},

	GetAccountAssignmentVisibility: function(oAccounting, oObj) {
		if (!oAccounting) {return true;}
		if (!oAccounting[0]) {return true;}

		var sPath = oAccounting[0];
		if (!oObj.getModel) {return true;}
		var oModel = oObj.getModel();
		if (!oModel) {return true;}
		if (!oModel.oData) {return true;}
		var oFirstAccountingLine = oModel.oData[sPath];
		if (!oFirstAccountingLine) {return true;}

		if ( (oFirstAccountingLine.CostCentre === "" || oFirstAccountingLine.CostCentre === undefined) &&
			 (oFirstAccountingLine.WBSElement === "" || oFirstAccountingLine.WBSElement === undefined) &&
			 (oFirstAccountingLine.Network === ""    || oFirstAccountingLine.Network === undefined) &&
			 (oFirstAccountingLine.Order === ""      || oFirstAccountingLine.Order === undefined) &&
			 (oFirstAccountingLine.SalesOrder === "" || oFirstAccountingLine.SalesOrder === undefined) &&
			 (oFirstAccountingLine.Asset === ""      || oFirstAccountingLine.Asset === undefined) ) {
			return true;
		} 
		return false;
	},

	OldAccountAssignmentVisibilityTrigger: function(oAccounting) {
		var that = this;
		return ui.s2p.mm.purchorder.approve.util.Conversions.GetAccountAssignmentVisibility(oAccounting, that);
	},

	NewAccountAssignmentVisibilityTrigger: function(oAccounting) {
		var that = this;
		var bResult = ui.s2p.mm.purchorder.approve.util.Conversions.GetAccountAssignmentVisibility(oAccounting, that);
		if (bResult === true) {
			return false;
		}
		return true;
	},

	ItemNoteVisibilityTrigger: function(oNumberOfNotes) {
		if (oNumberOfNotes == '' || oNumberOfNotes == null || oNumberOfNotes == "0" || oNumberOfNotes == 0) {
			return false;
		} else {
			return true;
		};
	},
	
	formatAttachmentIcon: function(sMimeType) {
		return sap.ca.ui.model.format.FormattingLibrary.formatAttachmentIcon(sMimeType);
	},
	
	formatAttachmentSize: function(sFileSize) {
		var formatter = sap.ca.ui.model.format.FileSizeFormat.getInstance();
		return formatter.format(sFileSize);
	},

	formatAttachmentDesc: function(sDescription, sMimeType) {
		if (sDescription) {
			return sDescription;
		}
		return sMimeType;
	},

	ItemAttachmentVisibilityTrigger: function(oNumberOfAttachments) {
		if (oNumberOfAttachments == '' || oNumberOfAttachments == null || oNumberOfAttachments == "0"
				|| oNumberOfAttachments == 0) {
			return false;
		} else {
			return true;
		};
	},

	forwardedBy: function(sReassignByName) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.forwarded") : "";

		if (sReassignByName === null || sReassignByName == ""){
			return '';
		} else {
		return sResult + ' ' + sReassignByName;
		};
	},

	substitutedBy: function(sSubstitutingForName) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseOrder.substituted") : "";
		if (sSubstitutingForName === null || sSubstitutingForName == ""){
			return '';
		} else {
			return sResult + ' ' + sSubstitutingForName;
		};
	},

	
	customerNameFormatter : function(sCustomerName, sCustomerID){
		if (sCustomerID !== '' && sCustomerID !== undefined && sCustomerID !== null) {
			return sCustomerName + ' (' + sCustomerID + ')';
		} else {
			return sCustomerName;
		};
	},	
	
	plantVisibilityTrigger : function(plantName, customerName, customerID, sItemType){
		if ((plantName !== '' || plantName !== null) && 
				(customerName === '' || customerName === null || customerName === undefined) &&
				(customerID === '' || customerID === null || customerID === undefined) && sItemType !== "5"	) {
			return true;
		} else {
			return false;
		};
	},
	
	customerNameVisibilityTrigger : function (sCustomerName, sCustomerID){
		//visibility trigger for showing label "Customer"
		//visibility is true, if  sCustomerName and sCustomerID is set
		if (sCustomerName !== '' && sCustomerName !== undefined && sCustomerName !== null &&
				sCustomerID !== '' && sCustomerID !== undefined && sCustomerID !== null){
			return true;
		}else{
			return false;
		}
	},
	
	freestyleNameVisibilityTrigger : function (sCustomerName, sCustomerID){
		//visibility trigger for showing label "Name"
		//visibility is true, if  sCustomerName is set and sCustomerID is empty
		if (sCustomerName !== '' && sCustomerName !== undefined && sCustomerName !== null &&
				(sCustomerID === '' || sCustomerID === undefined || sCustomerID === null)){
			return true;
		}else{
			return false;
		}
	},
	
	materialGroupFormatter: function(sMaterialGroup, sMaterialGroupDescription) {
		if (sMaterialGroup !== '' && sMaterialGroup !== undefined && sMaterialGroup !== null) {
			return sMaterialGroupDescription + ' (' + sMaterialGroup + ')';
		} else {
			return sMaterialGroupDescription;
		};
	},

	materialGroupVisibilityTrigger: function(sMaterialGroup, sMaterialGroupDescription) {
		if ((sMaterialGroup == '' || sMaterialGroup == null) && (sMaterialGroupDescription == '' || sMaterialGroupDescription == null)) {
			return false;
		} else {
			return true;
		};
	},

	materialIDVisibilityTrigger: function(sMaterialID)  {
		if (sMaterialID !== '' && sMaterialID !== undefined && sMaterialID !== null) {
			return true;
		} else {
			return false;
		};
	},

	// Expects a date in the browsers current timezone
	formatDaysAgo : function(oDate) {
		if (oDate == null || oDate == "") {
			return "";
		} else {
			var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "daysAgo"}, sap.ui.getCore().getConfiguration().getLocale());
			var oFormatDate = formatter.format(oDate, true);
			return oFormatDate;
		}
	},
	
	formatNumberItemType: function(sValue, sItemType) {
		if (sItemType =='2') {
			return "";
		} else {
			return ui.s2p.mm.purchorder.approve.util.Conversions.formatAmount(sValue);
		}
	},
	
	formatNumberUnitItemType:function(sItemType, sCurrency) {
		if (sItemType === '2') {
			return "";
		} else {
			return sCurrency;	
		}
	},
	
	formatAmount: function(number){
		var formatter = sap.ui.core.format.NumberFormat.getCurrencyInstance({showMeasure: false});
		return formatter.format(number);
		
	},
	
	formatNumber: function (number, options) {
		var numValue  = ui.s2p.mm.purchorder.approve.util.Conversions.toNumeric(number);
		if (!isFinite(numValue)) {
			return "";
		}
		var formatOptions = ui.s2p.mm.purchorder.approve.util.Conversions.getFormatOptions(options);
		var numberFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({}, formatOptions.locale);
		if (ui.s2p.mm.purchorder.approve.util.Conversions.hasRounding(options)) {
			numValue = ui.s2p.mm.purchorder.approve.util.Conversions.roundNumber(numValue, formatOptions);
			return numberFormatter.format(numValue);
		} else {
			return numberFormatter.format(number);
		}
	},

	toNumeric: function(obj) {
		return sap.ca.ui.model.format.FormatHelper.toNumeric(obj);
	},

	getFormatOptions: function(options, lazy) {
		var formatOptions = {};
		var t = typeof options;
		switch (t) {
		case "number":
			if (lazy) {
				formatOptions.lazyDecimals = options;
			} else {
				formatOptions.decimals = options;
			}
			break;
		case "object":
			if (typeof options.locale === "string") {
				formatOptions.locale = new sap.ui.core.Locale(options.locale);
			} else {
				formatOptions.locale = options.locale;
			}
			formatOptions.decimals = options.decimals;
	        formatOptions.rounding = options.rounding;
	        formatOptions.lazy = options.lazy;
	        formatOptions.lazyDecimals = options.lazyDecimals;
	        formatOptions.lazyRounding = options.lazyRounding;
	        break;
		default:
	    	break;
		}
		if (lazy !== undefined) {
			formatOptions.lazy = lazy;
		}
		if (!formatOptions.locale) {
			if (sap.ui.getCore().getConfiguration().getLanguage() == "ZH") {
				formatOptions.locale = new sap.ui.core.Locale("zh_CN");
			} else {
				formatOptions.locale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
			}
		}
		return formatOptions;
	},

	roundNumber: function(number, options) {
		return sap.ca.ui.model.format.FormatHelper.roundNumber(number, options);
	},

	hasRounding: function(options) {
		var rounding;
		if (options !== undefined) {
			if (typeof options === "number") {
				rounding = true;
			} else {
				if (options.lazy) {
					rounding = (options.lazyDecimals !== undefined) || (options.lazyRounding !== undefined);
				} else {
					rounding = (options.decimals !== undefined) || (options.rounding !== undefined);
				}
			}
		} else {
			rounding = false;
		}
		return rounding;
	},

	businessCardImg: function(sMimeType, sImgUrl) {
		if (sMimeType) {
			return sImgUrl;
		} else {
			return null;
		}
	},
	
	onAttachment: function(oEvent) {
    
    	var oContext = oEvent.getSource().getBindingContext();
		var sMediaSrc = oContext.getProperty().__metadata.media_src;
		
		var sUrl = "";
	    if (sMediaSrc && typeof sMediaSrc === "string") {
	    	//########## change absolute to relative url
	        var oLink = document.createElement("a");
	        oLink.href = sMediaSrc;	        
	        sUrl = (oLink.pathname.charAt(0) === "/") ? oLink.pathname : "/" + oLink.pathname;	//InternetExplorer needs a "/" at the beginning
	        //##########
	        
//	          if (sap.ui.Device.system.phone || sap.ui.Device.system.tablet) {
	        	sap.m.URLHelper.redirect(sUrl, true);
//	        } else {
//	             sap.m.URLHelper.redirect(sUrl, false);
//	        }
	        
	    }
	}
};