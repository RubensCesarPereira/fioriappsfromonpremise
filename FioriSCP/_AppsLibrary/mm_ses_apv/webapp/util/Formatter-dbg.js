/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.ses.approve.util.Formatter");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.QuantityFormat");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");

ui.s2p.mm.ses.approve.util.Formatter = {

		//methods for date formatting
		parseDate : function(sDate) {
			if (sDate == null) {
				return null;
			}
			if (sDate instanceof Date) {
				return sDate;
			} else {
				var year = sDate.substring(0, 4);
				var month = sDate.substring(4, 6) - 1;
				var day = sDate.substring(6, 8);
				var oDate = new Date(year, month, day);
				var sDateOutput = oDate.toString().substring(0, 15);
				return sDateOutput;
			}
		},
		
		getPeriodText: function(sNoPeriod,fromDate, toDate) {
			if (fromDate && toDate) {
				var fromDateFormatted = sap.ca.ui.model.format.DateFormat.getDateInstance({style: "medium"}, sap.ui.getCore().getConfiguration().getLocale()).format(fromDate);
				var toDateFormatted   = sap.ca.ui.model.format.DateFormat.getDateInstance({style: "medium"}, sap.ui.getCore().getConfiguration().getLocale()).format(toDate);
				return fromDateFormatted + " - " + toDateFormatted;
			} else {
				return sNoPeriod;
			}
		},
		
		getCreatedOnText: function(sLabelCreatedOn, sLabelCreated, oDate){
			if (oDate == null || oDate == "") {
				return "";
			} else {			
				var sDateTypeDaysAgo = sap.ca.ui.model.format.DateFormat.getDateInstance({style: "daysAgo"}, sap.ui.getCore().getConfiguration().getLocale()).format(oDate, true),
			    	sDateTypeMedium  = sap.ca.ui.model.format.DateFormat.getDateInstance({style: "medium"}, sap.ui.getCore().getConfiguration().getLocale()).format(oDate, true);

				if (sDateTypeDaysAgo === sDateTypeMedium ) {
					return ( sLabelCreatedOn + " " + sDateTypeDaysAgo);
				} else {
					return ( sLabelCreated + " " + sDateTypeDaysAgo);
				}
			}
		},		
		
		//methods for quantity formatting
		formatQuantityWithLabel: function( sLabel, nQuantity, sQuantityUnit, sQuantityUnitDescription ) {
			var nQuantityFormatted = ui.s2p.mm.ses.approve.util.Formatter.formatNumberQuantity(nQuantity);
			if (sQuantityUnitDescription) 
			{ return sLabel + ": " + nQuantityFormatted + " " + sQuantityUnitDescription + "("+ sQuantityUnit +")"; }
			else
			{ return sLabel + ": " + nQuantityFormatted + " " + sQuantityUnit; }
		},

		getQuantityWithDescritption: function( nQuantity, sQuantityUnit, sQuantityUnitDescription ) {
			var nQuantityFormatted = ui.s2p.mm.ses.approve.util.Formatter.formatNumberQuantity(nQuantity);
			if (sQuantityUnitDescription) 
			{ return  nQuantityFormatted + " " + sQuantityUnitDescription + "("+ sQuantityUnit +")"; }
			else
			{ return  nQuantityFormatted + " " + sQuantityUnit; }
		},

		
		//methods for currency formatting
		calculateProgressPercentageValue: function(actualValue, plannedValue) {
			if (actualValue && plannedValue )
				{ return( actualValue/plannedValue);}
			else
			    {return(0.0);}			
		},

		getProgressPercentageValue: function(actualValue, plannedValue) {
			var sValue = ui.s2p.mm.ses.approve.util.Formatter.calculateProgressPercentageValue(actualValue, plannedValue);
			if (sValue > 1)
				{return(100.0);}
			else
				{return( sValue*100);}
		},

		getProgressPercentageText: function(actualValue, plannedValue) {
			var fValue = ui.s2p.mm.ses.approve.util.Formatter.calculateProgressPercentageValue(actualValue, plannedValue)*100;
			var iValue;  
			if (fValue<0) 
			  { iValue = 0; }
			else
			  { iValue = Math.round(fValue); }
			return ( " " + iValue + " %" );
		},
		
		getAmountWithCurrency: function(value, currency, noValueText){ 
			if (value && currency){
				var sAmountValue = ui.s2p.mm.ses.approve.util.Formatter.formatCurrencyAmountStandard( value, currency);
				return ( sAmountValue + " " + currency);
			} else {
				return noValueText;
			}		
		},


		//methods for the status of a service line
		formatStatus: function(sStatus) {
			var lStatusText = "";
			//var oBundle = this.oView.oModels.i18n.getResourceBundle();
			
			switch(sStatus){
			case "4":
				lStatusText = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("STATUS_SERVICE_UNPLANNED");
				//lStatusText = oBundle.getText("STATUS_SERVICE_UNPLANNED");
				break;
			case "3":
				lStatusText = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("STATUS_SERVICE_NO_DEVIATION");
				//lStatusText = oBundle.getText("STATUS_SERVICE_NO_DEVIATION");
				break;
			case "2":
				lStatusText = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("STATUS_SERVICE_OVERFULFILLMENT");
				//lStatusText = oBundle.getText("STATUS_SERVICE_OVERFULFILLMENT");
				break;
			case "1":
				lStatusText = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("STATUS_SERVICE_UNDERFULFILLMENT");
				//lStatusText = oBundle.getText("STATUS_SERVICE_OVERFULFILLMENT");
				break;
			}
			
			return lStatusText;
		},

		formatStatusWithLabel: function(sLabel, sStatus) {
			var sStatusText = ui.s2p.mm.ses.approve.util.Formatter.formatStatus(sStatus);
			return ( sLabel + ": " + sStatusText);
		},
		
		//methods for visibility		
		getVisibility: function(sIdentifier){
			if (sIdentifier){ 
			    return (true);
			} else { 
			    return(false);
			}
		},
		
		getVisibilityByNumString: function(sIdentifier){
			if (!sIdentifier){ 
                return (false);
			} else if (sIdentifier === '00' ){ 
                return(false);
			} else {
                return(true);
			}
		},

		//methods for concatenation of text1 and text2		
		getConcatenatedText: function(sText1, sText2){
			return ( sText1 + " " + sText2);
		},

		getConcatenatedTextWithSlash: function(sText1, sText2){
			return ( sText1 + "/" + sText2);
		},

		//methods for code and description		
		getCodeAndDescription: function(code, sCodeDescription){
			if(code && sCodeDescription) {
				return ( sCodeDescription + " (" + code + ")");
			} else if (code && !sCodeDescription) {
				return code;
			} else if (!code && sCodeDescription) {
				return sCodeDescription;				
			} else {
				return "";
			}
		},
		
		getCodeAndDescriptionWithNoData: function(sNoData, code, sCodeDescription){
			if(code && sCodeDescription) {
				return ui.s2p.mm.ses.approve.util.Formatter.getCodeAndDescription(code,sCodeDescription);
			} else if (code && !sCodeDescription) {
				return code;
			} else if (!code && sCodeDescription) {
				return sCodeDescription;				
			} else {
				return sNoData;
			}
		},
		
		//methods for  attachments
    	isAttachmentsVisible: function(oAttachments) {
    		if (oAttachments !== null && oAttachments !== undefined && oAttachments.length !== 0) {
    			this.setCount(oAttachments.length);
    			return true;
    		} else {
    			if (this.getParent().getSelectedKey() === "contentAttachments" ){
    			    this.getParent().getSelectedKey("");
    			}
    			return false;
    		}
    	},		

    	//methods for notes
    	isNotesVisible: function(oNotes) {
    		if (oNotes !== null && oNotes !== undefined && oNotes.length !== 0) {
    			this.setCount(oNotes.length);
    			return true;
    		} else {
    			if (this.getParent().getSelectedKey() === "contentNotes" ){
    			    this.getParent().getSelectedKey("");
    			}
    			return false;
    		}
    	},		

    	formatNoteDateTime: function(sDate) {
		    if (sDate == null || sDate == "") {
		      return "";
		    } else {
		      return sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
		        style: "medium"
		      }).format(sDate);
		    }
		},

		// Expects a date in the browsers current timezone
		formatDaysAgo : function(oDate) {
			if (oDate == null || oDate == "") {
				return "";
			} else {
				var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "daysAgo"}, sap.ui.getCore().getConfiguration().getLocale());
				return formatter.format(oDate);
			}
		},    
		
		formatCurrencyAmountShort: function(sAmount, sCurrency) {
            var oFormatter;
            var oFormatOptions;
            
            if (sAmount) {
                if (!isNaN(parseFloat(sAmount)) && isFinite(sAmount)) {
                    if (Math.abs(sAmount) < 1e6) {
                        oFormatOptions = {  style:      "standard",
                                                showMeasure: false};
                        oFormatter = sap.ui.core.format.NumberFormat.getCurrencyInstance(oFormatOptions);
                    } else {
                        oFormatOptions = {  style:      "short",
                                                showMeasure: false};
                        oFormatter = sap.ui.core.format.NumberFormat.getCurrencyInstance(oFormatOptions);
                    }
                }
            }
            return (sAmount) ? oFormatter.format(parseFloat(sAmount), sCurrency) : sAmount;
		},		
		
		formatCurrencyAmountStandard: function(sAmount, sCurrency) {
			var oFormatOptions = { style:      "standard",
                                   showMeasure: false};

			var oCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance(oFormatOptions);

			return (sAmount) ? oCurrencyFormat.format(parseFloat(sAmount), sCurrency) : sAmount;
		},		
		
		formatNumberPercentage: function(sValue) {
			var oFormatOptions = { maxFractionDigits: 1,
				  	               minFractionDigits: 1,
				  	               groupingEnabled: false};	
			
			var oPercentageFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions,sap.ui.getCore().getConfiguration().getLocale());
			
			return (sValue) ? oPercentageFormat.format(parseFloat(sValue)) : sValue;
		},
		
		formatNumberQuantity: function(sQuantity) {
			var oQuantityFormat = sap.ui.core.format.NumberFormat.getInstance({},sap.ui.getCore().getConfiguration().getLocale());	
			return (sQuantity) ? oQuantityFormat.format(parseFloat(sQuantity)) : sQuantity;
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
    	
    	getAccountAssignmentVisibility: function(oAccounting, oObj) {
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
    
    	getOldAccountAssignmentVisibility: function(oAccounting) {
    		var that = this;
    		return ui.s2p.mm.ses.approve.util.Formatter.getAccountAssignmentVisibility(oAccounting, that);
    	},
    
    	getNewAccountAssignmentVisibility: function(oAccounting) {
    		var that = this;
    		var bResult = ui.s2p.mm.ses.approve.util.Formatter.getAccountAssignmentVisibility(oAccounting, that);
    		if (bResult === true) {
    			return false;
    		}
    		return true;
    	},
    	
    	getAccountingObjectS3Format: function(sAccountingObjectText, sCode, sDescription) {
    	    if(sDescription) {
    	        return sAccountingObjectText + " " + sDescription + " (" + sCode +")";
    	    } else {
    	        return sAccountingObjectText + " " + sCode;
    	    }
    	}
};