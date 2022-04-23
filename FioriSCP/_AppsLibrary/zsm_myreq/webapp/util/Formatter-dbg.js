/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"zsm/itsm/myreq/cust/util/Util",
	"sap/ui/core/format/FileSizeFormat",
	"sap/ui/core/format/DateFormat",
	"zsm/itsm/myreq/cust/util/Formatter"
], function(Util, FileSizeFormat, DateFormat, formatter) {
	"use strict";

	return {
		
		formatter:formatter,

		init: function(oModel) {
			var that = this;
			this.oModel = oModel;

			this.jamModel = new sap.ui.model.odata.ODataModel("/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData", true);
			this.isJamSupported = true;

			this.jamModel.attachMetadataFailed(function() {
				that.isJamSupported = false;
			});

			this.picBuffer = [];

		},
		// getModel: function() {
		// 	return this.oModel;
		// },
		
		dateShort: function(oDate) {
			var oDateParam = (oDate instanceof Date) ? oDate : new Date(oDate);
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy"
			});
			return dateFormat.format(oDateParam);
		},

		dateTime: function(oDate) {
			var oDateParam = (oDate instanceof Date) ? oDate : new Date(oDate);
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd.MM.yyyy HH:mm"
			});
			return dateFormat.format(oDateParam);
		},

		getPicture: function(id) {
			
		 
			
			if (!this.formatter) {
				  this.formatter = this;
			}
			
			var that = this;

			if (id === "") {
				return "";
			}

			var fURL = "";
			var buffered = false;

		 
			
			if (this.formatter.isJamSupported === false) {
				return "";
			}

			$.each(this.formatter.picBuffer, function(index, value) {
				if (value.id === id) {
					fURL = value.url;
					buffered = true;
				}
			});

			if (buffered === true) {
				return fURL;
			}

			if (fURL === "") {

				var serviceUrl = "/Members_Autocomplete?Query=%27" + id + "%27&$expand=ThumbnailImage";

				this.formatter.jamModel.read(serviceUrl, null, null, false, function(oData) {

					if (oData.results[0]) {
						var url = oData.results[0].ThumbnailImage.__metadata.media_src;

						fURL = "/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData/" + url;

						var oPicBuffer = {
							id: id,
							url: fURL

						};
						that.formatter.picBuffer.push(oPicBuffer);
					}
				}, function() {

				});

			}

			return fURL;
		},


		formatFileSizeAttribute: function(sValue) {
		 
			if (jQuery.isNumeric(sValue)) {
				return FileSizeFormat.getInstance({
					binaryFilesize: false,
					maxFractionDigits: 1,
					maxIntegerDigits: 3
				}).format(sValue);
			} else {
				return sValue;
			}
		}

	};

});