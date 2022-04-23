sap.ui.define(function() {
	"use strict";
 
	var Formatter = {
 
		weightState :  function (fValue) {
			try {
				fValue = parseFloat(fValue);
				if (fValue < 0) {
					return "None";
				} else if (fValue < 1000) {
					return "Success";
				} else if (fValue < 2000) {
					return "Warning";
				} else {
					return "Error";
				}
			} catch (err) {
				return "None";
			}
		},
		
		testImpr : function (value){
			console.log(value);
			return value;
		},
		
		formatMoneda : function (value){
		  value = value.split(".").join("");      	
		  return value;
		},
				

		formatMoneda2 : function (value){
			 // value = value.split(".").join("");      	
			  return value;
			},
		
		
		verIcon : function (value){
			
			if(null == value || "" == value){
				return;
			}
			
			if (value.length > 20){
				return "sap-icon://show"
			}else{
				"";
			}
			
		},
		
		
		verTextBtn : function (value) {
			
			return false;
			
			if (parseInt(value.length) > 16){
				false;
			}else{
				true;
			}
			
			
			
		},
		
		
		verBtnText : function (value) {
			
			if (value.length > 16){
				true;
			}else{
				false;
			}
			
		}
	};
 
	return Formatter;
 
}, /* bExport= */ true);