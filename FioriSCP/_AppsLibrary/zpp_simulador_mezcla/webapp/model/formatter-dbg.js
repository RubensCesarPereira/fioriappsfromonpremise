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

				var number = oNumberFormat.format(input);
				/*
					var num = Number(input.trim());
					var number = "";
					if (!isNaN(num)) {
						//number = number.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.");
						//number = number.split("").reverse().join("").replace(/^[\.]/, "");
						number = num.toString();
					} else {
						jQuery.sap.log.setLevel((jQuery.sap.log.Level.INFO));
						jQuery.sap.log.info("El valor no es númerico.");
					}
					*/
				return number;
			}
			return input;
		},

		removeChar: function (sInput) {
			if (sInput !== "undefined" && sInput) {
				return sInput.replace(/[^0-9\.]+/g, "");
			}
			return sInput;
		},

		indicator: function (eEvt) {
			var sValue = this.byId("CodigoMezcla");
			if (sValue <= 50) {
				this.removeStyleClass("yellow");
				this.removeStyleClass("green");
				this.addStyleClass("red");
			} else if (sValue <= 75) {
				this.removeStyleClass("yellow");
				this.removeStyleClass("red");
				this.addStyleClass("green");
			} else {
				this.removeStyleClass("red");
				this.removeStyleClass("yellow");
				this.addStyleClass("green");
			}
			return sValue + " %";
		},

		addDot: function (sValue) {
			var aAux = sValue.split("");
			var aAux2 = [];
			aAux.forEach(function (entity) {
				switch (entity) {
				case ".":
					break;
				case " ":
					break;
				default:
					aAux2.push(entity);
					break;
				}
			});
			var vInput = aAux2.join("");
			var entrada = vInput.split('.').join('');
			entrada = entrada.split(',');
			var entrada2 = entrada[0].split('').reverse();
			var salida = [];
			var aux = '';
			var paginador = Math.ceil(entrada2.length / 3);
			for (var i = 0; i < paginador; i++) {
				for (var j = 0; j < 3; j++) {
					if (entrada2[j + (i * 3)] !== undefined) {
						aux += entrada2[j + (i * 3)];
					}
				}
				salida.push(aux);
				aux = '';

			}
			return salida.join('.').split("").reverse().join('');
		}

		/*
		formatNumber: function (sValue) {
		var aAux = sValue.split("");
		var aAux2 = [];
		aAux.forEach(function (entity) {
			switch (entity) {
			case ".":
				break;
			case " ":
				break;
			default:
				aAux2.push(entity);
				break;
			}
			});
		var vInput = aAux2.join("");
		var entrada = vInput.split('.').join(''); entrada = entrada.split(',');
		var entrada2 = entrada[0].split('').reverse();
		var salida = [];
		var aux = '';
		var paginador = Math.ceil(entrada2.length / 3);
		for (var i = 0; i < paginador; i++) {
			for (var j = 0; j < 3; j++) {
				if (entrada2[j + (i * 3)] !== undefined) {
					aux += entrada2[j + (i * 3)];
				}
			}
			salida.push(aux);
			aux = '';

		}
		return salida.join('.').split("").reverse().join('');
		}
		*/

	};
});