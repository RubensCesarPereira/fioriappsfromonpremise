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

		removeZero: function (sNumero) {
			return Number(sNumero).toString();
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
				/*if ((entity) {
						cases ".":
							braak;
					} !== " ") {
					aAux2.push(entity);
				}*/
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
	};

});