/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.requisition.approve.util.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.QuantityFormat");
jQuery.sap.require("sap.ca.ui.model.format.FormatHelper");
jQuery.sap.require("sap.ca.ui.model.format.FormattingLibrary");

ui.s2p.mm.requisition.approve.util.Conversions =
		{

			// Approval Date Formatting
			ApprovalDateFormatter : function(sDate) {
				return ui.s2p.mm.requisition.approve.util.Conversions.formatDaysAgo(sDate);
			},

			// ID and Description Formatting
			commonIDFormatter : function(sDescription, sID) {
				if (sID) {
					if (sDescription) {
						var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
						return oBundle.getText("Formatting.DescriptionAndId", [ sDescription, sID ]);
					}
					return sID;
				}
				if (sDescription) {
					return sDescription;
				}
				return "";
			},

			salesOrderIDFormatter : function(sSalesOrder, sSalesOrderItem, sSalesOrderScheduleLine) {
				var sResult;
				sResult = sSalesOrder;
				if (sSalesOrderItem) {
					sResult = sResult + "/" + sSalesOrderItem;
				}
				if (sSalesOrderScheduleLine) {
					sResult = sResult + "/" + sSalesOrderScheduleLine;
				}
				return sResult;
			},

			assetIDFormatter : function(sDescription, sAsset, sAssetSubNumber) {
				var sAssetNumber = sAsset;
				if (sAssetSubNumber) {
					sAssetNumber = sAssetNumber + "/" + sAssetSubNumber;
				}

				if (sAssetNumber) {
					if (sDescription) {
						var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
						return oBundle.getText("Formatting.DescriptionAndId", [ sDescription, sAssetNumber ]);
					}
					return sAssetNumber;
				}
				if (sDescription) {
					return sDescription;
				}
				return "";
			},

			accountAssignmentPercentageFormatter : function(percentage) {
				// "%" shall be shown, only if there is a percentage given.
				if (percentage == null || percentage == "") {
					return "";
				} else {
					return "%";
				}
			},

			serviceInformationVisibilityTrigger : function(sServiceID, sLongDescription) {
				var f = ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger;
				return f(sServiceID) || f(sLongDescription);
			},

			lazyRoundNumber : function(sNum) {
				var result = 0;
				var formatter;
				if (sNum) {
					if (!isNaN(parseFloat(sNum)) && isFinite(sNum)) {
						if (Math.abs(sNum) < 1e6) {
							formatter = sap.ca.ui.model.format.NumberFormat.getInstance({
								style : 'standard'
							});
						} else {
							formatter = sap.ca.ui.model.format.NumberFormat.getInstance({
								style : 'short',
								shortDecimals: 2
							});
						}
						result = formatter.format(sNum);
					}
				}
				return result;
			},

			formatAttachmentIcon : function(sMimeType) {
				return sap.ca.ui.model.format.FormattingLibrary.formatAttachmentIcon(sMimeType);
			},

			headerAccountingFormatter : function(oHeaderAcc) {
				if (!oHeaderAcc) {
					return;
				}
				;
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var sMultiAccounting = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.multiAccounting") : "";
				var sNoAccounting = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.placeholder") : "";
				var sGlAccountLabel = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.account") : "";
				var sUnknown = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.unknown") : "";
				if (oHeaderAcc.CumulatedAccountingTypeCode == '2') {
					return sMultiAccounting;
				} else if (oHeaderAcc.CumulatedAccountingTypeCode == '0') {
					return sNoAccounting;
				} else if (oHeaderAcc.CumulatedAccountingTypeCode == '3') {
					return sUnknown;
				}
				;

				// old logic
				if ((oHeaderAcc.CostCentre === "" || oHeaderAcc.CostCentre === undefined) && (oHeaderAcc.WBSElement === "" || oHeaderAcc.WBSElement === undefined) && (oHeaderAcc.Network === "" || oHeaderAcc.Network === undefined)
						&& (oHeaderAcc.Order === "" || oHeaderAcc.Order === undefined) && (oHeaderAcc.SalesOrder === "" || oHeaderAcc.SalesOrder === undefined) && (oHeaderAcc.Asset === "" || oHeaderAcc.Asset === undefined) &&
						(oHeaderAcc.ProfitCenter === "" || oHeaderAcc.ProfitCenter === undefined)) {

					var sResult1 = ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.AccountDescription, oHeaderAcc.AccountNumber);
					var sResult2 = ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.GlAccountDescription, oHeaderAcc.GlAccountNumber);
					return oHeaderAcc.AccountCategoryDescription + ' ' + sResult1 + '\n' + sGlAccountLabel + ' ' + sResult2;
				}

				// new logic
				else {
					var sResult = "";
					if (oHeaderAcc.CostCentre != "") {
						var sCostCentreLabel = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.accountAssignmentCostCentre") : "";
						sResult = sCostCentreLabel + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.CostCentreDescription, oHeaderAcc.CostCentre);
					}
					if (oHeaderAcc.WBSElement != "") {
						if (sResult !== "") {
							sResult = sResult + '\n';
						}
						;
						var sWBSElement = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.accountAssignmentWBSElement") : "";
						sResult = sResult + sWBSElement + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.WBSElementDescription, oHeaderAcc.WBSElement);
					}
					if (oHeaderAcc.Network != "") {
						if (sResult !== "") {
							sResult = sResult + '\n';
						}
						;
						var sNetwork = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.accountAssignmentNetwork") : "";
						sResult = sResult + sNetwork + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.NetworkDescription, oHeaderAcc.Network);
					}
					if (oHeaderAcc.Order != "") {
						if (sResult !== "") {
							sResult = sResult + '\n';
						}
						;
						var sOrder = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.accountAssignmentOrder") : "";
						sResult = sResult + sOrder + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.OrderDescription, oHeaderAcc.Order);
					}
					if (oHeaderAcc.SalesOrder != "") {
						if (sResult !== "") {
							sResult = sResult + '\n';
						}
						;
						var sSalesOrder = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.accountAssignmentSalesOrder") : "";
						sResult = sResult + sSalesOrder + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.salesOrderIDFormatter(oHeaderAcc.SalesOrder, oHeaderAcc.SalesOrderItem, oHeaderAcc.SalesOrderScheduleLine);
					}
					if (oHeaderAcc.Asset != "") {
						if (sResult !== "") {
							sResult = sResult + '\n';
						}
						;
						var sAsset = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.accountAssignmentAsset") : "";
						sResult = sResult + sAsset + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.assetIDFormatter(oHeaderAcc.AssetDescription, oHeaderAcc.Asset, oHeaderAcc.AssetSubnumber);
					}
					//######################################### ProfitCenter implemented with SP8 note
					if (oHeaderAcc.ProfitCenter != "") {
						if (sResult !== "") {sResult = sResult + '\n';};
						var sProfitCenter = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.ProfitCenter") : "";
						sResult = sResult + sProfitCenter + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.ProfitCenterDescription, oHeaderAcc.ProfitCenter);
					}
					//#########################################
					if (oHeaderAcc.GlAccountNumber != "") {
						if (sResult !== "") {
							sResult = sResult + '\n';
						}
						;
						var sGlAccount = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.account") : "";
						sResult = sResult + sGlAccount + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.commonIDFormatter(oHeaderAcc.GlAccountDescription, oHeaderAcc.GlAccountNumber);
					}
					return sResult;
				}
			},

			headerAccountingVisibilityTrigger : function(sCumulatedAccountingTypeCode) {
				if (sCumulatedAccountingTypeCode == '0') {
					return false;
				} else {
					return true;
				}
			},

			noteDateFormatter : function(bNoteIsApproverNote, sDate) {
				if (bNoteIsApproverNote) {
					return ui.s2p.mm.requisition.approve.util.Conversions.formatDaysAgo(sDate);
				} else {
					return '';
				}
				;
			},

			attachmentDateFormatter : function(sDate) {
				return ui.s2p.mm.requisition.approve.util.Conversions.formatLongDate(sDate, true);
			},

			approverNoteValueFormatter : function(bNoteIsApproverNote, sValue) {
				if (bNoteIsApproverNote) {
					return sValue;
				} else {
					return '';
				}
				;
			},

			priceFieldVisibilityTrigger : function(sValue, sItemType) {
				if (sItemType == '2') {
					return false;
				} else {
					return ui.s2p.mm.requisition.approve.util.Conversions.commonFieldVisibilityTrigger(sValue);
				}
			},

			commonFieldVisibilityTrigger : function(sValue) {
				if (sValue == '' || sValue == null) {
					return false;
				} else {
					return true;
				}
				;
			},

			customerNameFormatter : function(sCustomerName, sCustomerID) {
				if (sCustomerID !== '' && sCustomerID !== undefined && sCustomerID !== null) {
					return sCustomerName + ' (' + sCustomerID + ')';
				} else {
					return sCustomerName;
				}
				;
			},

			plantVisibilityTrigger : function(plantName, customerName, customerID, sItemType) {
				if ((plantName !== '' || plantName !== null) && (customerName === '' || customerName === null || customerName === undefined) && (customerID === '' || customerID === null || customerID === undefined) && sItemType !== "5") {
					return true;
				} else {
					return false;
				}
				;
			},

			customerNameVisibilityTrigger : function(sCustomerName, sCustomerID) {
				// visibility trigger for showing label "Customer"
				// visibility is true, if sCustomerName and sCustomerID is set
				if (sCustomerName !== '' && sCustomerName !== undefined && sCustomerName !== null && sCustomerID !== '' && sCustomerID !== undefined && sCustomerID !== null) {
					return true;
				} else {
					return false;
				}
			},

			freestyleNameVisibilityTrigger : function(sCustomerName, sCustomerID) {
				// visibility trigger for showing label "Name"
				// visibility is true, if sCustomerName is set and sCustomerID is empty
				if (sCustomerName !== '' && sCustomerName !== undefined && sCustomerName !== null && (sCustomerID === '' || sCustomerID === undefined || sCustomerID === null)) {
					return true;
				} else {
					return false;
				}
			},

			// TODO check whether this method is used otherwise remove it
			commonDescriptionAndIDVisibilityTrigger : function(sDescription, sID) {
				if (sDescription == '' || sDescription == null || sID == '' || sID == null) {
					return false;
				} else {
					return true;
				}
				;
			},

			deliveryHeaderFormatter : function(sDeliveryDate, sAlsoLater) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var prefix = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.deliveryOn") : "";
				return prefix + ' ' + ui.s2p.mm.requisition.approve.util.Conversions.deliveryDateFormatter(sDeliveryDate, sAlsoLater);
			},

			valueLimitFormatter : function(sValue, sUnlimited, sCurrency) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.limitValue") : "";
				sResult += ': ' + ui.s2p.mm.requisition.approve.util.Conversions.valueLimitWithoutLabelFormatter(sValue, sUnlimited, sCurrency);
				return sResult;
			},

			valueLimitWithoutLabelFormatter : function(sValue, sUnlimited, sCurrency) {
				var sResult = "";
				if (sUnlimited === '' || sUnlimited === null || sUnlimited === undefined) {
					sResult += ui.s2p.mm.requisition.approve.util.Conversions.formatAmount(sValue) + ' ' + sCurrency;
				} else {
					var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
					sResult += ((oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.unlimitedLimit") : "");
				}
				return sResult;
			},

			expectedValueFormatter : function(sValue, sCurrency) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.expValue") : "";
				sResult += ': ' + ui.s2p.mm.requisition.approve.util.Conversions.formatAmount(sValue) + ' ' + sCurrency;
				return sResult;
			},

			itemQuantityFormatter : function(sQuantity, sUnit, sType) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				if (sType == 'S') {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.service") : "";
				} else {
					return ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatter(sQuantity, sUnit);
				}
				;
			},

			quantityFormatterWithoutUnit : function(sQuantity, sUnit) {

				var numberFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({}, sap.ui.getCore().getConfiguration().getLocale());

				// var oFormatter =
				// sap.ca.ui.model.format.QuantityFormat.getInstance({sValue: sQuantity,
				// unitCode: sUnit}, sap.ui.getCore().getConfiguration().getLocale());
				return numberFormatter.format(sQuantity);
			},

			quantityFormatter : function(sQuantity, sUnit) {
				return ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatterWithoutUnit(sQuantity, sUnit) + ' ' + sUnit;
			},

			quantityPerUnitItemCategory : function(sQuantity, sUnit, sPrice, sCurrency, sItemCategory) {
				if (sItemCategory === "2") {
					ui.s2p.mm.requisition.approve.util.Conversions.quantityPerUnitFormatter("", "", "", "");
				} else {
					ui.s2p.mm.requisition.approve.util.Conversions.quantityPerUnitFormatter(sQuantity, sUnit, sPrice, sCurrency);
				}
			},

			quantityPerUnitFormatter : function(sQuantity, sUnit, sPrice, sCurrency) {
				var sPrice = ui.s2p.mm.requisition.approve.util.Conversions.formatAmount(sPrice);
				var sQuantity = ui.s2p.mm.requisition.approve.util.Conversions.quantityFormatterWithoutUnit(sQuantity, sUnit);
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();

				return oBundle.getText("view.PurchaseRequisition.priceQty", [ sPrice, sCurrency, sQuantity, sUnit ]);
			},

			serviceLinesNumFormatter : function(sItemsCount) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();

				return oBundle.getText("view.DetailItemServiceView.serviceLinesNum", [ sItemsCount ]);
			},

			totalPriceFormatter : function(sPrice, sCurrency) {
				var sPrice = ui.s2p.mm.requisition.approve.util.Conversions.formatAmount(sPrice);
				return sPrice + ' ' + sCurrency;
			},

			componentVisibilityTrigger : function(iItemCategory) {
				if (iItemCategory === "3") {
					return true;
				} else {
					return false;
				}
			},

			itemCategoryFormatter : function(sItemCategoryDescription, sItemType) {
				if (sItemCategoryDescription && sItemCategoryDescription !== "") {
					return sItemCategoryDescription;
				} else {
					var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
					if (sItemType == 'S') {
						return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.service") : "";
					} else if (sItemType == 'L') {
						return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.limit") : "";
					} else if (sItemType == 'M') {
						return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.standard") : "";
					} else if (sItemType == '2') {
						return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.consignment") : "";
					} else if (sItemType == '3') {
						return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.subcontracting") : "";
					} else if (sItemType == '5') {
						return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.thirdParty") : "";
					}
					;
				}
			},

			notesVisibilityTrigger : function(oNumberOfNotes) {
				if (oNumberOfNotes == '' || oNumberOfNotes == null || oNumberOfNotes == "0" || oNumberOfNotes == 0) {
					return false;
				} else {
					return true;
				}
				;
			},

			attachmentsVisibilityTrigger : function(oNumberOfAttachments) {
				if (oNumberOfAttachments == '' || oNumberOfAttachments == null || oNumberOfAttachments == "0" || oNumberOfAttachments == 0) {
					return false;
				} else {
					return true;
				}
				;
			},

			// create a function that converts Strings into Dates
			fConvert : function(sDate) {
				var oDate = sDate;
				if (typeof sDate === "string") {
					// Handle the format /Date(miliseconds)/
					if (sDate.indexOf("Date") != -1) {
						sDate = sDate.substring(sDate.indexOf("(") + 1, sDate.indexOf(")"));
						sDate = new Number(sDate);
					}
					oDate = new Date(sDate);
				} else if (typeof sDate !== "object" || sDate === null) {
					oDate = "";
				}
				return oDate;
			},

			formatLongDate : function(oDate, bUTC) {
				var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
					style : "medium"
				}, sap.ui.getCore().getConfiguration().getLocale());

				oDate = ui.s2p.mm.requisition.approve.util.Conversions.fConvert(oDate);
				if (oDate === "") {
					return "";
				}
				return formatter.format(oDate, bUTC);
			},

			deliveryDateFormatter : function(sDeliveryDate, sAlsoLater) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var oLater = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.DeliveryAlsoLater") : "";

				var oDate = ui.s2p.mm.requisition.approve.util.Conversions.formatLongDate(sDeliveryDate, true);

				if (sAlsoLater == null || sAlsoLater == "") {
					return oDate;
				} else {
					return oDate + ' ' + oLater;
				}
			},

			itemsTableHeader : function(sItemsCount) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				if (sItemsCount === undefined || sItemsCount === null || parseInt(sItemsCount) == 0) {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.noItem") : "";
				} else {
					return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.multipleItems", [ parseInt(sItemsCount) ]) : "";
				}
				;
			},

			serviceLinesTableHeader : function(sItemsCount) {
				if (sItemsCount === undefined || sItemsCount === null || parseInt(sItemsCount) == 0) {
					return '';
				} else {
					var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
					return (oBundle !== undefined) ? oBundle.getText("view.DetailItemServiceView.serviceLinesNum", [ parseInt(sItemsCount) ]) : "";
				}
				;
			},

			commonCountVisibilityTrigger : function(sCount) {
				if (sCount !== null && sCount !== undefined && sCount != '0') {
					return true;
				} else {
					return false;
				}
				;
			},

			materialVisibilityTrigger : function(sProductLineType) {
				if (sProductLineType !== "L" && sProductLineType !== "S") {
					return true;
				}
				return false;
			},

			serviceVisibilityTrigger : function(sProductLineType) {
				if (sProductLineType == "S") {
					return true;
				}
				return false;
			},

			ItemServiceLineVisibilityTrigger : function(sNumberSLine) {
				if (sNumberSLine == '' || sNumberSLine == null || sNumberSLine == "0") {
					return false;
				} else {
					return true;
				}
				;
			},

			ItemLimitVisibilityTrigger : function(sNumberSLine) {
				if (sNumberSLine == '' || sNumberSLine == null || sNumberSLine == "0") {
					return false;
				} else {
					return true;
				}
				;
			},

			ItemAccountAssignmentVisibilityTrigger : function(oAccounting) {
				if (oAccounting !== null && oAccounting !== undefined && oAccounting.length !== 0) {
					return true;
				} else {
					return false;
				}
				;
			},

			GetAccountAssignmentVisibility : function(oAccounting, oObj) {
				if (!oAccounting) {
					return true;
				}
				if (!oAccounting[0]) {
					return true;
				}

				var sPath = oAccounting[0];
				if (!oObj.getModel) {
					return true;
				}
				var oModel = oObj.getModel();
				if (!oModel) {
					return true;
				}
				if (!oModel.oData) {
					return true;
				}
				var oFirstAccountingLine = oModel.oData[sPath];
				if (!oFirstAccountingLine) {
					return true;
				}

				if ((oFirstAccountingLine.CostCentre === "" || oFirstAccountingLine.CostCentre === undefined) && (oFirstAccountingLine.WBSElement === "" || oFirstAccountingLine.WBSElement === undefined)
						&& (oFirstAccountingLine.Network === "" || oFirstAccountingLine.Network === undefined) && (oFirstAccountingLine.Order === "" || oFirstAccountingLine.Order === undefined)
						&& (oFirstAccountingLine.SalesOrder === "" || oFirstAccountingLine.SalesOrder === undefined) && (oFirstAccountingLine.Asset === "" || oFirstAccountingLine.Asset === undefined)) {
					return true;
				}
				return false;
			},

			OldAccountAssignmentVisibilityTrigger : function(oAccounting) {
				var that = this;
				return ui.s2p.mm.requisition.approve.util.Conversions.GetAccountAssignmentVisibility(oAccounting, that);
			},

			NewAccountAssignmentVisibilityTrigger : function(oAccounting) {
				var that = this;
				var bResult = ui.s2p.mm.requisition.approve.util.Conversions.GetAccountAssignmentVisibility(oAccounting, that);
				if (bResult === true) {
					return false;
				}
				return true;
			},

			serviceLinesFormatter : function(sNumberSLine) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var sSLine = (oBundle !== undefined) ? oBundle.getText("view.DetailItemServiceView.serviceLines") : "";
				if (sNumberSLine == '' || sNumberSLine == null || sNumberSLine == "0") {
					return '0' + ' ' + sSLine;
				} else {
					return sNumberSLine + ' ' + sSLine;
				}
				;
			},

			ItemNoteVisibilityTrigger : function(oNumberOfNotes) {
				if (oNumberOfNotes == '' || oNumberOfNotes == null || oNumberOfNotes == "0" || oNumberOfNotes == 0) {
					return false;
				} else {
					return true;
				}
				;
			},

			formatAttachmentSize : function(sFileSize) {
				var formatter = sap.ca.ui.model.format.FileSizeFormat.getInstance();
				return formatter.format(sFileSize);
			},

			formatAttachmentDesc : function(sDescription, sMimeType) {
				if (sDescription) {
					return sDescription;
				}
				return sMimeType;
			},

			ItemAttachmentVisibilityTrigger : function(oNumberOfAttachments) {
				if (oNumberOfAttachments == '' || oNumberOfAttachments == null || oNumberOfAttachments == "0" || oNumberOfAttachments == 0) {
					return false;
				} else {
					return true;
				}
				;
			},

			forwardedBy : function(sReassignByName) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.Forwarded") : "";

				if (sReassignByName === null || sReassignByName == "") {
					return '';
				} else {
					return sResult + ' ' + sReassignByName;
				}
				;
			},

			substitutedBy : function(sSubstitutingForName) {
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.Substitute") : "";
				if (sSubstitutingForName === null || sSubstitutingForName == "") {
					return '';
				} else {
					return sResult + ' ' + sSubstitutingForName;
				}
				;
			},

			materialGroupFormatter : function(sMaterialGroup, sMaterialGroupDescription) {
				if (sMaterialGroup !== '' && sMaterialGroup !== undefined && sMaterialGroup !== null) {
					return sMaterialGroupDescription + ' (' + sMaterialGroup + ')';
				} else {
					return sMaterialGroupDescription;
				}
				;
			},

			materialIDVisibilityTrigger : function(sMaterialID) {
				if (sMaterialID !== '' && sMaterialID !== undefined && sMaterialID !== null) {
					return true;
				} else {
					return false;
				}
				;
			},

			// Expects a date in the browsers current timezone
			formatDaysAgo : function(oDate) {
				if (oDate == null || oDate == "" || oDate === undefined) {
					return "";
				} else {
					var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
						style : "daysAgo"
					}, sap.ui.getCore().getConfiguration().getLocale());
					var oFormatDate = formatter.format(oDate, true);
					return oFormatDate;
				}
			},

			getFormatOptions : function(options, lazy) {
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

			roundNumber : function(number, options) {
				return sap.ca.ui.model.format.FormatHelper.roundNumber(number, options);
			},

			hasRounding : function(options) {
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

			formatNumberItemType : function(nNum, sItemType) {
				if (sItemType === '2') {
					return "";
				} else {
					return ui.s2p.mm.requisition.approve.util.Conversions.formatAmount(nNum);
				}
			},

			formatNumberUnitItemType : function(sItemType, sCurrency) {
				if (sItemType === '2') {
					return "";
				} else {
					return sCurrency;
				}
			},

			formatAmount : function(number) {
				var formatter = sap.ui.core.format.NumberFormat.getCurrencyInstance({
					showMeasure : false
				});
				return formatter.format(number);
			},

			formatNumber : function(number, options) {
				var numValue = ui.s2p.mm.requisition.approve.util.Conversions.toNumeric(number);
				if (!isFinite(numValue)) {
					return "";
				}
				var formatOptions = ui.s2p.mm.requisition.approve.util.Conversions.getFormatOptions(options);
				var numberFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({}, formatOptions.locale);
				if (ui.s2p.mm.requisition.approve.util.Conversions.hasRounding(options)) {
					numValue = ui.s2p.mm.requisition.approve.util.Conversions.roundNumber(numValue, formatOptions);
					return numberFormatter.format(numValue);
				} else {
					return numberFormatter.format(number);
				}
			},

			formatAccountingPercentage : function(nNum) {
				var nNum1 = ui.s2p.mm.requisition.approve.util.Conversions.toNumeric(nNum);
				var result = ui.s2p.mm.requisition.approve.util.Conversions.formatNumber(nNum1);
				return result;
			},

			toNumeric : function(obj) {
				return sap.ca.ui.model.format.FormatHelper.toNumeric(obj);
			},

			getNumberFormatOptions : function(options, lazy) {
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

			getMagnitude : function(number) {
				var getmag = sap.ca.ui.model.format.FormatHelper.getMagnitude(number);
				return getmag;
			},

			businessCardImg : function(sMimeType, sImgUrl) {
				if (sMimeType) {
					return sImgUrl;
				} else {
					return null;
				}
			},

			onAttachment : function(oEvent) {

				var oContext = oEvent.getSource().getBindingContext();
				var sMediaSrc = oContext.getProperty().__metadata.media_src;

				var sUrl = "";
				if (sMediaSrc && typeof sMediaSrc === "string") {
					// ########## change absolute to relative url
					var oLink = document.createElement("a");
					oLink.href = sMediaSrc;
					sUrl = (oLink.pathname.charAt(0) === "/") ? oLink.pathname : "/" + oLink.pathname; // InternetExplorer needs a "/" at the beginning
					// ##########

//					if (sap.ui.Device.system.phone || sap.ui.Device.system.tablet) {
						sap.m.URLHelper.redirect(sUrl, true);
//					} else {
//						sap.m.URLHelper.redirect(sUrl, false);
//					}

				}
			}
		};