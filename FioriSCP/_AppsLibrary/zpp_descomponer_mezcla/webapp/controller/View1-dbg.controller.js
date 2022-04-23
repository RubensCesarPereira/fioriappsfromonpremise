sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	'sap/ui/model/json/JSONModel',
	"sap/m/MessageBox",
	"cl/conchaytoro/zpp_descomponer_mezcla/model/formatter"
], function (Controller, History, JSONModel, MessageBox, formatter) {
	"use strict";

	return Controller.extend("cl.conchaytoro.zpp_descomponer_mezcla.controller.View1", {

		formatter: formatter,

		onInit: function () {

		},

		_inputMaterial: function (oEvt, oData) {
			var cCen = this.getView().byId("centro");
			var vCen = cCen.getSelectedKey();
			var cMaterial = this.getView().byId("codMezcla");
			var vMaterial = cMaterial.getValue();
			if (vCen === '') {
				sap.m.MessageBox.warning("¡Favor seleccione Bodega!", {
					title: "Advertencia", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});
				if (oData.Matnr === "") {
					sap.m.MessageBox.warning("¡Material No Existe en Bodega Seleccionada!", {
						title: "Advertencia", // default
						onClose: null, // default
						styleClass: "", // default
						initialFocus: null, // default
						textDirection: sap.ui.core.TextDirection.Inherit // default
					});
				}
				vMaterial.setValue('');
			} else {
				if (/^(M?\d{4}-?\d{4})|\d{6}$/.test(vMaterial)) {
					this.handleValidationSuccess2(oEvt);
				} else {
					this.handleValidationError2(oEvt);
				}
			}

			//this.activeButton();

		},

		_inputCompo: function (oEvt) {
			var cCompo = this.getView().byId("codCompo");
			var vCompo = cCompo.getValue();
			var cCen = this.getView().byId("centro");
			var vCen = cCen.getSelectedKey();
			if (vCen === '') {
				sap.m.MessageBox.warning("¡Favor seleccione Bodega!", {
					title: "Advertencia", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});
				if (oData.Matnr === "") {
					sap.m.MessageBox.warning("¡Material No Existe en Bodega Seleccionada!", {
						title: "Advertencia", // default
						onClose: null, // default
						styleClass: "", // default
						initialFocus: null, // default
						textDirection: sap.ui.core.TextDirection.Inherit // default
					});
				}
				vCompo.setValue('');
			} else {
				if (/^(M?\d{4}-?\d{4})|\d{6}$/.test(vCompo)) {
					oEvt.getSource().setValueState(sap.ui.core.ValueState.Success);
				} else {
					oEvt.getSource().setValueState(sap.ui.core.ValueState.Error);
					this.clearCells();
				}
			}
		},

		handleValidationSuccess2: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
			this._inputDescript(oEvent);
		},

		handleValidationError2: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			var cDes = this.getView().byId("descripcion");
			cDes.setValue('');
			var cCompo = this.getView().byId("codCompo");
			cCompo.setValue('');
			cCompo.setValueState(sap.ui.core.ValueState.Error);
			this.clearCells();
		},

		_inputDescript: function (oEvent) {
			var cMaterial = this.getView().byId("codMezcla");
			var vMaterial = cMaterial.getValue();
			var centro = this.getView().byId("centro").getSelectedKey();
			var cDes = this.getView().byId("descripcion");
			var sResult = "Sin Descripción";
			var oMod = this.getOwnerComponent().getModel();
			oMod.read("/MaterialSet(Matnr='" + vMaterial + "',Werks='" + centro + "')", {
				success: function (oData) {
					if (oData.Matnr === "") {
						sap.m.MessageBox.warning("¡Material No Existe en Bodega Seleccionada!", {
							title: "Advertencia", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					} else {
						sResult = oData.Maktx;
						cDes.setValue(sResult);
					}
				}.bind(this),
				error: function (oError) {
					var x = "hola";
					return x;
				}
			});
		},

		clearCells: function (oEvent) {
			var table = this.getView().byId("tablaMezcla");
			table.removeAllItems();
		},

		_clearMatnr: function () {
			this.getView().byId("descripcion").setValue("");
			this.getView().byId("codMezcla").setValue("");
			this.getView().byId("codCompo").setValue("");
			this.getView().byId("codMezcla").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("codCompo").setValueState(sap.ui.core.ValueState.None);
			this.clearCells();

		},

		buscaMezclas: function () {
			var oTable = this.getView().byId("tablaMezcla");
			var oModel = this.getOwnerComponent().getModel("dos");
			var cMezcla = this.getView().byId("codMezcla"); //
			var cCentro = this.getView().byId("centro"); //
			var cCompo = this.getView().byId("codCompo"); //

			var vMezcla = cMezcla.getValue();
			var vCentro = cCentro.getSelectedKey();
			var vCompo = cCompo.getValue();

			if (cMezcla.getValue() === "" || cMezcla.getValueState() !== sap.ui.core.ValueState.Success || cCentro.getSelectedKey() === "" ||
				cCompo.getValue() === "" || cCompo.getValueState() !== sap.ui.core.ValueState.Success) {
				sap.m.MessageBox.error("¡Favor Completar Campos Vacíos!", {
					title: "Error",
					onClose: null,
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
			} else {
				var Filters = [];
				var filter = new sap.ui.model.Filter("Codigo", sap.ui.model.FilterOperator.EQ, vMezcla);
				Filters.push(filter);
				filter = new sap.ui.model.Filter("Codigo2", sap.ui.model.FilterOperator.EQ, vCompo);
				Filters.push(filter);
				filter = new sap.ui.model.Filter("Bodega", sap.ui.model.FilterOperator.EQ, vCentro);
				Filters.push(filter);
				sap.ui.core.BusyIndicator.show();
				oModel.read("/DescomponerSet", {
					filters: Filters,
					success: function (oData) {
						sap.ui.core.BusyIndicator.hide();
						oTable.setModel(new JSONModel(oData.results), "mezclas");
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						oTable.setModel(new JSONModel([]), "mezclas");
						sap.m.MessageBox.error("Error en El Servicio", {
							title: "Error",
							onClose: null,
							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});
					}

				});
			}

		},

		/*activeButton: function () {
			var btnBuscar = this.getView().byId("btnBuscar");
			var cDesc = this.getView().byId("descripcion");
			if (cDesc.getValue() === "") {
				btnBuscar.setEnabled(false);
			} else {
				btnBuscar.setEnabled(true);
			}
		},*/

		onPress: function (oEvent) {
			var iOrden = oEvent.getSource().getCells()[6].getTitle();
			var iCantidad = oEvent.getSource().getCells()[0].getText();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Materiales", {
				Orden: iOrden,
				Cantidad: iCantidad
			});

		}

	});
});