sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue: function (sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},

		ltrimAll: function (str, chars) {
			chars = chars || "\\s";
			return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
		},

		ltrim: function (str) {
			str = str || "\\s";
			return str.replace(new RegExp("^[0]+", "g"), "");
		},

		formatNumber: function (input) {
			if (input !== undefined && input !== "") {
				jQuery.sap.require("sap.ui.core.format.NumberFormat");
				//var oNumberFormat = this.numberFormat.getFloatInstance({
				var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				  maxFractionDigits: 3,
				  groupingEnabled: true,
				  groupingSeparator: ".",
				  decimalSeparator: ","
				}); //Returns a NumberFormat instance for float
				var number = oNumberFormat.format(input.trim()); 
				return number;
			}
			return input;
		},
		
		removeChar : function(sInput) {
			if (sInput !== "undefined" && sInput ) {
				return sInput.replace(/[^0-9\.]+/g, "");
			}
			return sInput;
		},
		
		/*
		 * @public
		 * @param {string} sValue The value to be formatted
		 * @returns {int} The formatted delivery status value for the
		 * InfoLabel colorScheme
		 */
		deliveryStatus: function (sValue) {
			switch (sValue) {
			case "New":
				return 5;
			case "In Progress":
				return 1;
			case "Canceled":
				return 3;
			case "Closed":
				return 7;
			default:
				return 7;
			}
		}		

	};
});