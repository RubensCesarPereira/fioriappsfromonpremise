sap.ui.define([
	"./BaseController",
	"sap/ui/core/syncStyleClass",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, syncStyleClass, JSONModel, formatter, Fragment, MessageBox, MessageToast, Filter, FilterOperator) {
	"use strict";
	var gThis = null;

	return BaseController.extend("cl.conchaytoro.zpp_simulador_mezcla.controller.View1", {
		formatter: formatter,
		_oThis: this,

		onInit: function () {
			$.sap.aMosto = ["488000", "488010", "488510", "497010", "497310", "489510"];
			$.sap.Adicion = ["11016449", "11016626", "11003526", "11013396"];
			$.sap.Cooler = ["M1246-2019", "M2288-2019", "M2289-2019",
				"M2288-0000", "M2289-0000",
				"000000000011013396", "000000000011016626", "000000000011016449"
			];
			gThis = this;
			this._totalPrecio = 0;
			this._sinMosto = 0;

			var boton = gThis.getView().byId("btnCalcular");
			var botonA = this.getView().byId("btnAnalisis");
			boton.setEnabled(false);
			botonA.setEnabled(false);

			//var oThis = this;
			this._wizard = this.byId("SimuladorWizard");
			this._oNavContainer = this.byId("wizardNavContainer");
			this._oWizardContentPage = this.byId("wizardContentPage");

			Fragment.load({
				name: "cl.conchaytoro.zpp_simulador_mezcla.view.ReviewPage",
				controller: this
			}).then(function (oWizardReviewPage) {
				this._oWizardReviewPage = oWizardReviewPage;
				this._oNavContainer.addPage(this._oWizardReviewPage);
			}.bind(this));

			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data

			// set error values
			var oViewModel = new JSONModel({
				stepValidated: false,
				codigoMezclaState: "Error",
				descripcionState: "Error",
				nmezclaState: "Error",
				cantidadState: "Error",
				centroState: "Error",
				// ----------------
				cosechaState: "Error",
				calidadState: "Error",
				familiaState: "Error",
				colorState: "Error",
				doState: "Error",
				gradoState: "Error",
				azucarState: "Error",
				// ----------------
				busy: false,
				navApiEnabled: true,
				delay: 0
			});
			this.setModel(oViewModel, "ViewModel");

			/////////////////////////////PPPPP
			Fragment.load({
				name: "cl.conchaytoro.zpp_simulador_mezcla.view.Resultados",
				controller: this
			}).then(function (oWizardResultado) {
				this._oWizardResultado = oWizardResultado;
				this._oNavContainer.addPage(this._oWizardResultado);
			}.bind(this));

			var oData = {
				"bodega": [{
					value: "Seleccionar Todos",
					name: "Todo"
				}, {
					value: "Planta Productiva Pirque",
					name: "1011"
				}, {
					value: "Planta Productiva Lontue",
					name: "1021"
				}, {
					value: "Bodega Curicó",
					name: "1024"
				}, {
					value: "Bodega Los Castaños",
					name: "1025"
				}, {
					value: "Bodega Teno",
					name: "1029"
				}, {
					value: "Bodega Puente Alto",
					name: "1031"
				}, {
					value: "Bodega Don Melchor",
					name: "1032"
				}, {
					value: "Bod. Las Mercedes Lolol",
					name: "1033"
				}, {
					value: "Bodega Nueva Aurora",
					name: "1035"
				}, {
					value: "Bodega Limarí",
					name: "1036"
				}, {
					value: "Bodega Cachapoal",
					name: "1041"
				}, {
					value: "Bodega Vino Productores",
					name: "1044"
				}, {
					value: "Bodega Hormazabal",
					name: "1045"
				}, {
					value: "Bodega Chimbarongo (CYT)",
					name: "1051"
				}, {
					value: "Bodega Lourdes",
					name: "1061"
				}, {
					value: "Bodega San Javier",
					name: "1071"
				}, {
					value: "Bodega Loncomilla",
					name: "1072"
				}, {
					value: "Bodega Peralillo",
					name: "1083"
				}, {
					value: "Bodega Hernán Garcés",
					name: "1084"
				}, {
					value: "Lourdes- Microvinificación",
					name: "1088"
				}, {
					value: "Bodega Cocharcas",
					name: "1089"
				}, {
					value: "Planta Vespucio",
					name: "1103"
				}, {
					value: "VCS Agr Bodega Santa Elisa",
					name: "3800"
				}, {
					value: "VCS Agr Bodega Concha y Toro",
					name: "3805"
				}]
			};
			var oModelo = new JSONModel(oData);
			this.getView().setModel(oModelo, "rr");

			var oDate = {
				"cosecha": [{
					value: "Seleccionar Todos",
					name: "Todo"
				}, {
					value: "2020",
					name: "2020"
				}, {
					value: "2019",
					name: "2019"
				}, {
					value: "2018",
					name: "2018"
				}, {
					value: "2017",
					name: "2017"
				}, {
					value: "2016",
					name: "2016"
				}, {
					value: "2015",
					name: "2015"
				}, {
					value: "2014",
					name: "2014"
				}, {
					value: "2013",
					name: "2013"
				}, {
					value: "2012",
					name: "2012"
				}, {
					value: "2011",
					name: "2011"
				}, {
					value: "2010",
					name: "2010"
				}]
			};
			var oModel = new JSONModel(oDate);
			this.getView().setModel(oModel, "cc");

			this._oGlobalFilter = null;
			this._oGlobalFilter1 = null;

		},

		_filter: function () {
			this.byId("selectAptitud").getBinding("items").filter(this._oGlobalFilter, sap.ui.model.FilterType.Application);
		},

		_filter1: function () {
			this.byId("selectAptitud").getBinding("items").filter(this._oGlobalFilter1, sap.ui.model.FilterType.Application);
		},

		filterGlobally: function (sQuery) {

			if (sQuery) {
				this._oGlobalFilter = new Filter([
					new Filter("Bodega", FilterOperator.EQ, sQuery)
				], false);
			}

			this._filter();
		},

		filterGlobally1: function (sQuery) {

			if (sQuery) {
				this._oGlobalFilter1 = new Filter([
					new Filter("Cosecha", FilterOperator.EQ, sQuery)
				], false);
			}

			this._filter1();
		},

		handleSelectionChange: function (oEvent) {
			this._oGlobalFilter = [];
			var oList = oEvent.getParameters().changedItem.getParent().getItems();
			var sKey = oEvent.getParameters().changedItem.getKey();

			var isSelected = oEvent.getParameter("selected");
			var state = "Selected";
			if (!isSelected) {
				state = "Deselected";
			}
			//Check if "Selected All is selected
			if (sKey === "Todo") {
				var oName, res;

				//If it is Selected
				if (state === "Selected") {

					for (var x = 0; x < oList.length; x++) {
						if (x === 0) {
							oName = oList[x].getKey();
						} else {
							oName = oName + ',' + oList[x].getKey();
						} //If i == 0									
					} //End of For Loop

					res = oName.split(",");
					oEvent.getSource().setSelectedKeys(res);

				} else {
					res = null;
					oEvent.getSource().setSelectedKeys(res);
				}
			}
			var oListSelected = oEvent.getParameters().changedItem.getParent().getSelectedItems();
			for (var i = 0; i < oListSelected.length; i++) {
				if (oListSelected[i].getText() !== "Todo")
					this._oGlobalFilter.unshift(
						new sap.ui.model.Filter({
							path: "Bodega",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: oListSelected[i].getText()
						})
					);
			}
			this._filter();
		},

		handleSelectionFinish: function (oEvent) {
			/*var x = {
				"componentes": []
			};
			var mModel = null;
			var that = this;
			if (oEvent.getParameters("selectedItems").selectedItems.length >= 1) {
				oEvent.getParameters("selectedItems").selectedItems.forEach(function (o) {
					Array.prototype.push.apply(x.componentes, that.gOdataTable.componentes.filter(function (e) {
						return e.Bodega === o.getText();
					}));
				});
				mModel = new JSONModel(x);
				this.getView().setModel(mModel, "mm");
			} else {
				mModel = new JSONModel(this.gOdataTable);
				this.getView().setModel(mModel, "mm");
			}*/
			var selectedItems = oEvent.getParameter("selectedItems");
			for (var i = 0; i < selectedItems.length; i++) {
				this._oGlobalFilter.unshift(
					new sap.ui.model.Filter({
						path: "Bodega",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: selectedItems[i].getText()
					})
				);
			}
			this._filter();
		},

		///COSECHA///
		handleSelectionChange1: function (oEvent) {
			this._oGlobalFilter1 = [];

			var oList = oEvent.getParameters().changedItem.getParent().getItems();
			var sKey = oEvent.getParameters().changedItem.getKey();

			var isSelected = oEvent.getParameter("selected");
			var state = "Selected";
			if (!isSelected) {
				state = "Deselected";
			}
			//Check if "Selected All is selected
			if (sKey === "Todo") {
				var oName, res;

				//If it is Selected
				if (state === "Selected") {

					for (var x = 0; x < oList.length; x++) {
						if (x === 0) {
							oName = oList[x].getKey();
						} else {
							oName = oName + ',' + oList[x].getKey();
						} //If i == 0									
					} //End of For Loop

					res = oName.split(",");
					oEvent.getSource().setSelectedKeys(res);

				} else {
					res = null;
					oEvent.getSource().setSelectedKeys(res);
				}
				var oListSelected = oEvent.getParameters().changedItem.getParent().getSelectedItems();
				for (var i = 0; i < oListSelected.length; i++) {
					if (oListSelected[i].getText() !== "Todo")
						this._oGlobalFilter1.unshift(
							new sap.ui.model.Filter({
								path: "Cosecha",
								operator: sap.ui.model.FilterOperator.EQ,
								value1: oListSelected[i].getText()
							})
						);
				}
				this._filter1();
			}

		},

		handleSelectionFinish1: function (oEvent) {
			var selectedItems = oEvent.getParameter("selectedItems");
			for (var i = 0; i < selectedItems.length; i++) {
				this._oGlobalFilter1.unshift(
					new sap.ui.model.Filter({
						path: "Cosecha",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: selectedItems[i].getText()
					})
				);
			}
			this._filter1();

			/*var x = {
				"componentes": []
			};
			var mModel = null;
			var that = this;
			if (oEvent.getParameters("selectedItems").selectedItems.length >= 1) {
				oEvent.getParameters("selectedItems").selectedItems.forEach(function (o) {
					Array.prototype.push.apply(x.componentes, that.gOdataTable.componentes.filter(function (e) {
						return e.Cosecha === o.getKey();
					}));
				});
				mModel = new JSONModel(x);
				this.getView().setModel(mModel, "mm");
			} else {
				mModel = new JSONModel(this.gOdataTable);
				this.getView().setModel(mModel, "mm");
			}*/

		},

		getLoadOrigen: function (material) {
			var that = this;
			var oTable = sap.ui.getCore().byId("denomOrigen");
			var oModel = this.getModel("cinco");
			var Filters = [];
			var filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, material);
			Filters.push(filter);
			oTable.setBusy(true);
			oModel.read("/AsociacionVinoBaseSet", {
				filters: Filters,
				success: function (oData) {
					oTable.setBusy(false);
					that.getView().setModel(new JSONModel(oData.results), "origen");
				},
				error: function (oError) {
					oTable.setBusy(false);
					that.getView().setModel(new JSONModel([]), "origen");
				}

			});
		},

		getLoadVariedad: function (material) {
			var that = this;
			var oTable = sap.ui.getCore().byId("variedadTable");
			var oModel = this.getModel("cinco");
			var Filters = [];
			var filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, material);
			Filters.push(filter);
			oTable.setBusy(true);
			oModel.read("/AsociacionVinoBaseSet", {
				filters: Filters,
				success: function (oData) {
					oTable.setBusy(false);
					var a = [];
					var b = [];
					var c = [];
					oData.results.forEach(function (i) {
						if (a.indexOf(i.Cepa) !== -1) {
							b[a.indexOf(i.Cepa)] += Number(i.Porcentaje);
						} else {
							a.push(i.Cepa);
							b.push(Number(i.Porcentaje));
						}
					});
					for (var i = 0; i < a.length; i++) {
						c.push({
							Cepa: a[i],
							Porcentaje: b[i]
						});
					}
					that.getView().setModel(new JSONModel(c), "variedad");
				},
				error: function (oError) {
					oTable.setBusy(false);
					that.getView().setModel(new JSONModel([]), "variedad");
				}

			});

		},

		getLoadCosecha: function (material) {
			var that = this;
			var oTable = sap.ui.getCore().byId("cosechaTable");
			var oModel = this.getModel("cinco");
			var Filters = [];
			var filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, material);
			Filters.push(filter);
			oTable.setBusy(true);
			oModel.read("/AsociacionVinoBaseSet", {
				filters: Filters,
				success: function (oData) {
					oTable.setBusy(false);
					var a = [];
					var b = [];
					var c = [];
					oData.results.forEach(function (i) {
						if (a.indexOf(i.Cosecha) !== -1) {
							b[a.indexOf(i.Cosecha)] += Number(i.Porcentaje);
						} else {
							a.push(i.Cosecha);
							b.push(Number(i.Porcentaje));
						}
					});
					for (var i = 0; i < a.length; i++) {
						c.push({
							Cosecha: a[i],
							Porcentaje: b[i]
						});
					}
					that.getView().setModel(new JSONModel(c), "cosecha");
				},
				error: function (oError) {
					oTable.setBusy(false);
					that.getView().setModel(new JSONModel([]), "cosecha");
				}

			});
		},

		handleWizardSubmit: function (oEvent) {
			this._oNavContainer.to(this._oWizardResultado);
		},

		codigoValidate: function (oInput) {
			var material = oInput.getValue();
			var flag = false;
			//var oViewModel = this.getModel("ViewModel");
			//var oForm = oInput.getSource().getParent().getParent().getParent();
			if (/^(M\d{4}-?\d{4})$/.test(material)) {
				flag = true;
				//this.getDescription(oInput);
			} else {
				flag = false;
			}
			return flag;
		},

		cantidadValidate: function (oInput) {
			var flag = false;
			if (/^[\d]+(\.[\d]{3,})*(\,[\d]{1,3})?$/.test(oInput.getValue())) {
				//oInput.setValueState(sap.ui.core.ValueState.Success);	
				flag = this.convertNumber(oInput);
			} else {
				oInput.setValue(oInput.getValue());
				//oInput.setValueState(sap.ui.core.ValueState.Error);
				flag = false;
			}
			return flag;
		},

		convertNumber: function (oInput) {
			var number = oInput.getValue();
			if (oInput !== "undefined" && !isNaN(number)) {
				number = number.toLocaleString().replace(".", "");
			}
			if (!/^[\d]+(\.[\d]{3,})*(\,[\d]{1,3})?$/.test(number)) {
				return false;
			}
			var vInput = oInput.getValue();
			var entrada = vInput.split(".").join("");
			entrada = entrada.split(",");
			var entrada2 = entrada[0].split("").reverse();
			var salida = [];
			var aux = "";
			var paginador = Math.ceil(entrada2.length / 3);
			for (var i = 0; i < paginador; i++) {
				for (var j = 0; j < 3; j++) {
					if (entrada2[j + (i * 3)] !== undefined) {
						aux += entrada2[j + (i * 3)];
					}
				}
				salida.push(aux);
				aux = "";
				if (entrada[1] !== undefined)
					vInput = salida.join(".").split("").reverse().join("") + "," + entrada[1];
				else
					vInput = salida.join(".").split("").reverse().join("");
			}
			oInput.setValue(vInput);
			return true;
		},

		descripcionValidate: function (oInput) {
			var desc = oInput.getValue();
			var flag = false;
			if (desc !== "undefined" && desc !== "") {
				flag = true;
			}
			return flag;
		},

		centroValidate: function (oInput) {
			var centro = oInput.getSelectedKey();
			var flag = false;
			if (centro !== "undefined" && centro !== "") {
				flag = true;
				//oInput.setValue(centro);
				//oInput.setValueState(sap.ui.core.ValueState.Error);
			} else {
				//oInput.setValueState(sap.ui.core.ValueState.Success);	
				flag = true;
			}
			return flag;
		},

		/*
		 * Busca datos adicionales del material
		 */

		getAditionalData: function (oEvent) {
			//var material = oEvent.getSource().getValue();
			var material = this.byId("CodigoMezcla").getValue();
			if (material) {
				material = encodeURIComponent(material);
			}
			var cosecha = material.substr(material.length - 4);

			var oViewModel = this.getModel("ViewModel");
			// var descripcion = this.byId("Descripcion");
			// var cantidad = this.byId("Cantidad");
			var oModel = this.getModel();
			var oModelo = this.getModel("cuatro");
			var oThis = this;
			//sap.ui.core.BusyIndicator.show();
			oModel.read("/CaracterAdicionalesSet('" + material + "')", {
				success: function (oData) {
					oModelo.read("/CalidadVinoSet('" + material + "')", {
						success: function (mData) {
							//sap.ui.core.BusyIndicator.hide();
							if (oData.Matnr !== "undefined" && oData.Matnr !== "") {
								oThis.byId("Cosecha").setValue(cosecha);
								oViewModel.setProperty("/cosechaState", sap.ui.core.ValueState.None);
								oThis.byId("Calidad").setValue(mData.ESelecomp);
								oViewModel.setProperty("/calidadState", sap.ui.core.ValueState.None);
								/*oThis.byId("Familia").setValue(oData.FamiliaTecnica);
								oViewModel.setProperty("/familiaState", sap.ui.core.ValueState.None);*/
								oThis.byId("Color").setValue(oData.Color);
								oViewModel.setProperty("/colorState", sap.ui.core.ValueState.None);
								oThis.byId("DO").setValue(oData.DO);
								oViewModel.setProperty("/doState", sap.ui.core.ValueState.None);
								oThis.byId("Grado").setValue(oData.GradoAlcoholico);
								oViewModel.setProperty("/gradoState", sap.ui.core.ValueState.None);
								oThis.byId("Azucar").setValue(oData.NivelAzucar);
								oViewModel.setProperty("/azucarState", sap.ui.core.ValueState.None);
								oThis.datosMezclaValidation(oEvent);
							} else {
								MessageBox.error("¡Material No Existe en el Dato Maestro!", {
									title: "Advertencia", // default
									onClose: null, // default
									styleClass: "", // default
									initialFocus: null, // default
									textDirection: sap.ui.core.TextDirection.Inherit // default
								});
							}
						},
						error: function (oError) {
							//sap.ui.core.BusyIndicator.hide();
							MessageBox.error(oError.message, {
								title: "Error",
								onClose: null,
								styleClass: "",
								initialFocus: null,
								textDirection: sap.ui.core.TextDirection.Inherit
							});
						}

					});

				},
				error: function (oError) {
					//sap.ui.core.BusyIndicator.hide();
					//oViewModel.setProperty("/codigoMezclaState", sap.ui.core.ValueState.Error);
					//oViewModel.setProperty("/descripcionState", sap.ui.core.ValueState.Error);
					//oViewModel.setProperty("/descripcion", "");
					MessageBox.error(oError.message, {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}
			});
		},

		/*
		 * Obtiene la descripcion del material
		 */
		getDescription: function (oEvent) {
			//var material = oEvent.getSource().getValue();

			var material = this.byId("CodigoMezcla").getValue();
			if (material) {
				material = encodeURIComponent(material);
			}
			if (!/^(M\d{4}-?\d{4})$/.test(material)) {
				sap.m.MessageBox.error("¡Favor ingresar Código con 'M'!", {
					title: "Error", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});
				return;
			}
			var oViewModel = this.getModel("ViewModel");
			var descripcion = this.byId("Descripcion");
			//var cantidad = this.byId("Cantidad");
			var oModel = this.getModel();
			var oThis = this;
			sap.ui.core.BusyIndicator.show();
			oModel.read("/MaterialSet(Matnr='" + material + "',Werks='')", {
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					if (oData.Matnr !== "undefined" && oData.Matnr !== "") {
						descripcion.setValue(oData.Maktx);
						oViewModel.setProperty("/descripcion", oData.Maktx);
						//oThis.byId("Descripcion").setValueState(sap.ui.core.ValueState.None);
						oViewModel.setProperty("/codigoMezclaState", sap.ui.core.ValueState.None);
						oViewModel.setProperty("/descripcionState", sap.ui.core.ValueState.None);
						//oThis.datosMezclaValidation(oEvent);			
						////cantidad.focus();
						oThis.getAditionalData(oEvent);
						oThis.getLoadRestrictions(material);
						oThis.getLoadValle(material);
						oThis.getLoadCepa(material);
						oThis.getLoadAptitud(material);
					} else {
						MessageBox.error("¡Material No Existe en el Dato Maestro!", {
							title: "Advertencia", // default
							onClose: function (oAction) {
								if (descripcion.getValue() === "") {
									//oThis.byId("CodigoMezcla").setValueState(sap.ui.core.ValueState.Error);
									//oThis.byId("Descripcion").setValueState(sap.ui.core.ValueState.Error);
									oViewModel.setProperty("/descripcion", "");
									//this.byId("Descripcion").setValueState(sap.ui.core.ValueState.None);
									oViewModel.setProperty("/codigoMezclaState", sap.ui.core.ValueState.None);
									oViewModel.setProperty("/descripcionState", sap.ui.core.ValueState.None);
									//oThis.datosMezclaValidation(oEvent);			
								}
							}, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					oViewModel.setProperty("/codigoMezclaState", sap.ui.core.ValueState.Error);
					oViewModel.setProperty("/descripcionState", sap.ui.core.ValueState.Error);
					oViewModel.setProperty("/descripcion", "");
					MessageBox.error(oError.message, {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
					//oThis.byId("CodigoMezcla").setValueState(sap.ui.core.ValueState.Error);
					//oThis.byId("Descripcion").setValueState(sap.ui.core.ValueState.Error);
				}
			});
		},

		datosMezclaValidation: function (oEvt) {
			var flag = true;
			var codigo = this.byId("CodigoMezcla");
			var desc = this.byId("Descripcion");
			var cantidad = this.byId("Cantidad");
			var NMezcla = this.byId("NMezcla");
			//var cantidad = parseInt(this.byId("Cantidad").getValue(), 10);
			var centro = this.byId("Centro");
			var oViewModel = this.getModel("ViewModel");

			if (codigo.getValue() === "") {
				oViewModel.setProperty("/codigoMezclaState", "Error");
				//codigo.setValueState("Error");
				flag = false;
			} else {
				flag = flag && true; //this.codigoValidate(codigo);
				oViewModel.setProperty("/codigoMezclaState", "None");
			}

			if (desc.getValue() === "") {
				oViewModel.setProperty("/descripcionState", "Error");
				//desc.setValueState("Error");
				flag = false;
			} else {
				flag = flag && this.descripcionValidate(desc);
				oViewModel.setProperty("/descripcionState", "None");
			}

			//if (cantidad.getValue() === "") {
			if (cantidad.getValue() === "") {
				oViewModel.setProperty("/cantidadState", "Error");
				//cantidad.setValueState("Error");
				flag = false;
			} else {
				//flag = flag && this.cantidadValidate(cantidad);
				oViewModel.setProperty("/cantidadState", "None");
			}

			if (centro.getSelectedKey() === "") {
				oViewModel.setProperty("/centroState", "Error");
				//centro.setValueState("Error");
				flag = false;
			} else {
				flag = flag && this.centroValidate(centro);
				oViewModel.setProperty("/centroState", "None");
			}
			if (NMezcla.getValue() === "") {
				oViewModel.setProperty("/nmezclaState", "Error");
				//cantidad.setValueState("Error");
				flag = false;
			} else {
				//flag = flag && this.cantidadValidate(cantidad);
				oViewModel.setProperty("/nmezclaState", "None");
			}

			//oViewModel.setProperty("/stepValidated", flag);
			if (flag) {
				this._wizard.validateStep(this.byId("DatosMezclaStep"));
			} else {
				this._wizard.invalidateStep(this.byId("DatosMezclaStep"));
			}

			//if (oStep !== undefined && oStep === 1)
			//	this._wizard.validateStep(this.byId("DatosMezclaStep"));
		},

		getCostos: function () {
			var material = gThis.getView().byId("CodigoMezcla").getValue();
			var centro = gThis.getView().byId("Centro").getSelectedKey();
			var oModel = this.getOwnerComponent().getModel("cuatro");
			oModel.read("/CostoMezclaSet(IMatnr='" + material + "',IWerks='" + centro + "')", {
				success: function (oResult) {
					var oTeorico = oResult.Zplp1;
					var oAnterior = oResult.Vmver;
					var inputCosTeorico = sap.ui.getCore().byId("rteorico");
					var inputMezAnterior = sap.ui.getCore().byId("rmezcla");
					inputCosTeorico.setValue(oTeorico);
					inputMezAnterior.setValue(oAnterior);
				}.bind(this),
				error: function (oError) {
					this.onBusyManager(false);
					this.onErrorBuilder("No es posible continuar, Hubo un error en el servicio.");
				}.bind(this)
			});
		},

		wizardCompletedHandler: function () {
			var material = gThis.getView().byId("CodigoMezcla").getValue();
			var centro = gThis.getView().byId("Centro").getSelectedKey();
			var oModel = this.getOwnerComponent().getModel("cuatro");
			oModel.read("/CostoMezclaSet(IMatnr='" + material + "',IWerks='" + centro + "')", {
				success: function (oResult) {
					var oTeorico = oResult.Zplp1;
					var oAnterior = oResult.Vmver;
					var inputCosTeorico = sap.ui.getCore().byId("rteorico");
					var inputMezAnterior = sap.ui.getCore().byId("rmezcla");
					inputCosTeorico.setValue(oTeorico);
					inputMezAnterior.setValue(oAnterior);
				}.bind(this),
				error: function (oError) {
					this.onBusyManager(false);
					this.onErrorBuilder("No es posible continuar, Hubo un error en el servicio.");
				}.bind(this)
			});
			//this._oNavContainer.to(this._oWizardReviewPage);
			this._oNavContainer.to(this._oWizardResultado);
			var inputPonderado = sap.ui.getCore().byId("rponderado");
			var inputPondMosto = sap.ui.getCore().byId("rmosto");
			inputPonderado.setValue(Intl.NumberFormat('de-DE').format(this.calPondSinMosto()));
			inputPondMosto.setValue(Intl.NumberFormat('de-DE').format(this.calPondConMosto()));

			//this.calPondSinMosto();
			//this.onReviewComponentes();
			//this.onReviewAnalisis();
			this.bValidaCumple = true;
			this.resultVariedad();
			this.resultCosecha();
			this.resultOrigen();
			this.resultCalidad();
			//this.disableCreate();
			//CARGA TABLAS SAP
			//this.getLoadOrigen(material);
			//this.getLoadVariedad(material);
			//this.getLoadCosecha(material);

			//Consume Tabla Cepa
			var oModel1 = this.getModel();
			var Filters = [];
			var filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, material);
			Filters.push(filter);
			oModel1.read("/CaracteristicaCepaSet", {
				filters: Filters,
				parameters: {
					select: "ValueChar,Value"
				},
				success: function (oData) {
					$.cepa = oData.results;
				},
				error: function (oError) {
					$.cepa = [];
				}

			});

			//Consume tabla valle
			Filters = [];
			filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, material);
			Filters.push(filter);
			oModel1.read("/CaracteristicaValleSet", {
				filters: Filters,
				parameters: {
					select: "ValueChar,Value"
				},
				success: function (oData) {
					$.valle = oData.results;
				},
				error: function (oError) {
					$.valle = [];
				}

			});

			//Consume tabla Restricciones
			Filters = [];
			filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, material);
			Filters.push(filter);
			oModel1.read("/RestriccionesSet", {
				filters: Filters,
				parameters: {
					select: "ValueChar,Value"
				},
				success: function (oData) {
					$.restric = oData.results;
				},
				error: function (oError) {
					$.restric = [];
				}

			});

		},

		bValidaCumple: true,

		backToWizardContent: function () {
			this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		},

		editStepOne: function () {
			this._handleNavigationToStep(0);
			var form1 = sap.ui.getCore().byId("rvariedadForm");
			form1.destroyContent();
			var form2 = sap.ui.getCore().byId("rcosechaForm");
			form2.destroyContent();
			var form3 = sap.ui.getCore().byId("rorigenForm");
			form3.destroyContent();
			var form4 = sap.ui.getCore().byId("rcalidadForm");
			form4.destroyContent();
		},

		editStepTwo: function () {
			this._handleNavigationToStep(1);
		},

		editStepThree: function () {
			this._handleNavigationToStep(2);
		},

		editStepFour: function () {
			this._handleNavigationToStep(3);
		},

		_handleNavigationToStep: function (iStepNumber) {
			var fnAfterNavigate = function () {
				this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
				this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}.bind(this);

			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this.backToWizardContent();
		},

		onCompleteHandler: function (oEvent) {
			var wdStep = oEvent.getSource();
			wdStep.setVisible(false);
		},

		setDatos: function (evt) {
			var datosMezcla = evt.getSource().getTitle();
			this.getModel().setProperty("/productType", datosMezcla);
			//this.byId("ProductStepChosenType").setText("Chosen product type: " + datosMezcla);
			//this._wizard.validateStep(this.byId("DatosMezclaStep"));
		},

		/*
		 * Obtiene del servicio OData las caracteristicas adicionales del material.
		 */
		getLoadTable: function (oMatnr, oTableName) {
			var oTable = sap.ui.getCore().byId(oTableName);
			oTable.destroyItems();
			oTable.setEnableBusyIndicator(true);
			var oModel = this.getModel();
			var Filters = [];
			var filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, oMatnr);
			Filters.push(filter);
			var serviceName = "";
			if (oTableName.toString().indexOf("valle", 0) !== -1)
				serviceName = "CaracteristicaValleSet";
			else if (oTableName.toString().indexOf("cepa", 0) !== -1)
				serviceName = "CaracteristicaCepaSet";
			// jQuery.sap.require("sap.ui.core.format.NumberFormat");
			// var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
			//   maxFractionDigits: 2,
			//   groupingEnabled: true,
			//   groupingSeparator: ".",
			//   decimalSeparator: ","
			// });
			oModel.read("/" + serviceName, {
				filters: Filters,
				parameters: {
					select: 'ValueChar,Value'
				},
				success: function (oData) {
					if (oData.results.length !== 0) {
						oTable.setEnableBusyIndicator(false);
						oData.results.forEach(function (entity) {
							var oItem = new sap.m.ColumnListItem({
								cells: [
									new sap.m.Text({
										text: entity.ValueChar
									}),
									new sap.m.Text({
										text: entity.Value
									})
									//,
									// new sap.m.ObjectStatus({
									// 	state: "= $line.Value <= 50,0 ? 'Information' : 'Success'}",
									// 	text: entity.Value									
									// })
								]
							});
							oTable.addItem(oItem);
						});
					} else {
						oTable.setEnableBusyIndicator(false);
						sap.m.MessageBox.warning("¡Sin Caracteristicas!", {
							title: "Advertencia", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					}
				},
				error: function (oError) {
					oTable.setEnableBusyIndicator(false);
					sap.m.MessageBox.error("Error: " + oError.message, {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}

			});
		},

		/*
		 * Obtiene del servicio OData las caracteristicas adicionales del material.
		 */
		/*getLoadRestrictions: function (oMatnr, oTableName) {
			var oTable = sap.ui.getCore().byId(oTableName);
			oTable.destroyItems();
			oTable.setEnableBusyIndicator(true);
			var oModel = this.getModel();
			var Filters = [];
			var filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, oMatnr);
			Filters.push(filter);
			oModel.read("/RestriccionesSet", {
				filters: Filters,
				parameters: {
					select: "ValueChar,Value"
				},
				success: function (oData) {
					if (oData.results.length !== 0) {
						oTable.setEnableBusyIndicator(false);
						oData.results.forEach(function (entity) {
							var oItem = new sap.m.ColumnListItem({
								cells: [
									new sap.m.Text({
										text: entity.CharactDescr
									}),
									new sap.m.Text({
										text: entity.ValueChar
									})
									.bindProperty("text", "value", function (cellValue) {
										// remove styles else it will overwrite
										this.removeStyleClass("green");
										this.removeStyleClass("yellow");
										this.removeStyleClass("red");
										// Set style Conditionally
										if (cellValue === "X") {
											this.addStyleClass("green");
											// } else if(cellValue < 1500 && cellValue > 1000) {
											//     this.addStyleClass("yellow");
										} else {
											this.addStyleClass("yellow");
											// this.addStyleClass("red");            
										}
										return cellValue;
									})
									//,
									// new sap.m.ObjectStatus({
									// 	state: "= $line.Value <= 50,0 ? 'Information' : 'Success'}",
									// 	text: entity.Value									
									// })
								]
							});
							oTable.addItem(oItem);
						});
					} else {
						oTable.setEnableBusyIndicator(false);
						sap.m.MessageBox.warning("¡Sin Características!", {
							title: "Advertencia", // default
							onClose: null, // default
							styleClass: "", // default
							initialFocus: null, // default
							textDirection: sap.ui.core.TextDirection.Inherit // default
						});
					}
				},
				error: function (oError) {
					oTable.setEnableBusyIndicator(false);
					sap.m.MessageBox.error("Error: " + oError.message, {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}

			});
		},*/

		////////////////////VALLE//////////////////////////////
		openViewValle: function (oEvent) {
			var material = this.byId("CodigoMezcla").getValue();
			if (material === "") {
				sap.m.MessageToast.show("¡Debe ingresar Material!");
				return;
			}
			if (!this._oValleDialog) {
				this._oValleDialog = sap.ui.xmlfragment("cl.conchaytoro.zpp_simulador_mezcla.view.Valle", this);
				this.getView().addDependent(this._oValleDialog);
			}
			//this.getLoadTable(material, "valleTableList");
			this._oValleDialog.open();
		},

		onCloseViewValle: function (oEvt) {
			if (this._oValleDialog) {
				this._oValleDialog.close();
			}
		},

		getLoadValle: function (material) {
			var that = this;
			var oModel = this.getModel();
			var Filters = [];
			var filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, material);
			Filters.push(filter);
			oModel.read("/CaracteristicaValleSet", {
				filters: Filters,
				parameters: {
					select: "ValueChar,Value"
				},
				success: function (oData) {
					that.getView().setModel(new JSONModel(oData.results), "valle");
				},
				error: function (oError) {
					that.getView().setModel(new JSONModel([]), "valle");
				}

			});
		},

		//////////////////////CEPA///////////////////////////////
		openViewCepa: function (oEvent) {
			var material = this.byId("CodigoMezcla").getValue();
			if (material === "") {
				sap.m.MessageToast.show("Debe ingresar el material!");
				return;
			}
			if (!this._oCepaDialog) {
				this._oCepaDialog = sap.ui.xmlfragment("cl.conchaytoro.zpp_simulador_mezcla.view.Cepa", this);
				this.getView().addDependent(this._oCepaDialog);
			}
			//this.getLoadTable(material, "cepaTableList");
			this._oCepaDialog.open();
		},

		onCloseViewCepa: function (oEvt) {
			if (this._oCepaDialog) {
				this._oCepaDialog.close();
			}
		},

		getLoadCepa: function (material) {
			var that = this;
			var oModel = this.getModel();
			var Filters = [];
			var filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, material);
			Filters.push(filter);
			oModel.read("/CaracteristicaCepaSet", {
				filters: Filters,
				parameters: {
					select: "ValueChar,Value"
				},
				success: function (oData) {
					that.getView().setModel(new JSONModel(oData.results), "cepa");
				},
				error: function (oError) {
					that.getView().setModel(new JSONModel([]), "cepa");
				}

			});
		},

		////////////////RESTRICCIONES/////////////////////////
		openViewRest: function (oEvent) {
			var material = this.byId("CodigoMezcla").getValue();
			if (material === "") {
				sap.m.MessageToast.show("¡Debe ingresar Material!");
				return;
			}
			if (!this._oRestDialog) {
				this._oRestDialog = sap.ui.xmlfragment("cl.conchaytoro.zpp_simulador_mezcla.view.Restric", this);
				this.getView().addDependent(this._oRestDialog);
			}
			//this.getLoadRestrictions(material, "restTableList");
			this._oRestDialog.open();
		},

		onCloseViewRest: function (oEvt) {
			if (this._oRestDialog) {
				this._oRestDialog.close();
			}
		},

		getLoadRestrictions: function (material) {
			var that = this;
			var oModel = this.getModel();
			var Filters = [];
			var filter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, material);
			Filters.push(filter);
			oModel.read("/RestriccionesSet", {
				filters: Filters,
				parameters: {
					select: "ValueChar,Value"
				},
				success: function (oData) {
					that.getView().setModel(new JSONModel(oData.results), "rest");
				},
				error: function (oError) {
					that.getView().setModel(new JSONModel([]), "rest");
					/*sap.m.MessageBox.error("Error: " + oError.message, {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});*/
				}

			});
		},

		/////////////////COMPONENTES/////////////////////////////
		openComponentes: function (oEvent) {
			var oView = this.getView();
			if (!this.byId("compPage")) {
				Fragment.load({
					id: oView.getId(),
					name: "cl.conchaytoro.zpp_simulador_mezcla.view.Componentes",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("compPage").open();
			}

		},

		onCloseDialog: function (oEvt) {
			this.byId("compPage").close();
		},

		//////////////ORIGEN//////////////////////////////////
		openOrigen: function (oEvent) {
			var oView = this.getView();
			if (!this.byId("origenPage")) {
				Fragment.load({
					id: oView.getId(),
					name: "cl.conchaytoro.zpp_simulador_mezcla.view.Origen",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("origenPage").open();
			}

		},

		onCloseDialogO: function (oEvt) {
			this.byId("origenPage").close();
		},

		getLoadAptitud: function (material, centro) {
			var that = this;
			var oModel = this.getModel("cinco");
			var Filters = [];
			var filter = new sap.ui.model.Filter("Codigo", sap.ui.model.FilterOperator.EQ, material);
			Filters.push(filter);
			/*
						filter = new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, centro);
						Filters.push(filter);*/
			oModel.read("/AptitudSet", {
				filters: Filters,
				success: function (oData) {
					that.getView().setModel(new JSONModel(oData.results), "componentes");
				},
				error: function (oError) {
					that.getView().setModel(new JSONModel([]), "componentes");
				}

			});
		},

		dialogAfterclose: function (oEvent) {
			//this.byId("compPage").destroy();
		},

		/**
		 * Updates the item count within the line item table's header
		 * @param {object} oEvent an event containing the total number of items in the list
		 * @private
		 */
		onValleListUpdateFinished: function (oEvent) {
			/*
			var sTitle,
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView");
			// only update the counter if the length is final
			if (this.byId("valleItemsList").getBinding("items").isLengthFinal()) {
				if (iTotalItems) {
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
				} else {
					//Display 'Line Items' instead of 'Line items (0)'
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
				}
				oViewModel.setProperty("/lineItemListTitle", sTitle);
			}
			*/
		},

		_validaCamposTabla: function () {
			var oTable = gThis.getView().byId('componentes');
			var bError = true;
			oTable.getItems().forEach(function (fila) {
				if (!bError) {
					return;
				}
			});
			/*var sType = oTable.getMetadata().getName();
			if (oTable.getItems().length === 0) return true;
			var bError = true;
			oTable.getItems().forEach(function (fila) {
				if (!bError) {
					return;
				}
				if (fila.getCells()[0].getMetadata().getName() === "sap.m.Input") {
					if (fila.getCells()[0].getValue() === "" ||
						fila.getCells()[1].getValue() === "" ||
						fila.getCells()[2].getSelectedKey() === "" ||
						fila.getCells()[3].getValueState() !== sap.ui.core.ValueState.Success ||
						fila.getCells()[3].getValue() === "" ||
						fila.getCells()[4].getText() === "" ||
						fila.getCells()[8].getValue() === "" ||
						fila.getCells()[9].getValue() === "" ||
						fila.getCells()[9].getValueState() !== sap.ui.core.ValueState.Success
						||
						fila.getCells()[9].getText() === "" ||
						fila.getCells()[10].getText() === ""
					) {

						bError = false;
						return;
					}
				}

			});
			if (!bError)
				sap.m.MessageBox.error("¡Campos Vacíos o con Datos Erróneos! Favor actualizar Campos", {
					title: "Error en Campos", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});*/

			oTable.getItems().forEach(function (fila) {
				if (fila.getCells()[0].getMetadata().getName() === "sap.m.Text") {
					//fila.getCells()[13].firePress();
					//DELETE
					fila.destroy();
					return;
				}

				if (fila.getCells()[0].getMetadata().getName() === "sap.m.Input") {
					fila.getCells()[11].setText("");
				}
			});

			if (this.getView().byId("componentes").getItems() > 1) {
				if (this.getView().byId("componentes").getItems()[this.getView().byId("componentes").getItems().length - 1].getCells()[0].getMetadata()
					.getName() === "sap.m.Text") {
					this.getView().byId("componentes").getItems()[this.getView().byId("componentes").getItems().length - 1].getCells()[11].firePress();
				}
			}

			if (this.getView().byId("componentes").getItems() > 2) {
				if (this.getView().byId("componentes").getItems()[this.getView().byId("componentes").getItems().length - 2].getCells()[0].getMetadata()
					.getName() === "sap.m.Text") {
					this.getView().byId("componentes").getItems()[this.getView().byId("componentes").getItems().length - 2].getCells()[11].firePress();
				}
			}

			return bError;
		},

		validaInput: function (oEvt) {
			var centroD = oEvt.getSource().getParent().getCells()[1].getText();
			var cantidad = oEvt.getSource().getParent().getCells()[8];
			if (centroD === '') {
				sap.m.MessageBox.warning("¡Favor, seleccionar Bodega!", {
					title: "Advertencia", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});
				cantidad.setValue('');
			} else {
				gThis.addDot(oEvt);
			}
		},

		addDot: function (oEvt) {
			var boton = gThis.getView().byId("btnCalcular");
			if (!/^[\d]+(\.[\d]{3,})*(\,[\d]{1,3})?$/.test(oEvt.getParameter('value'))) {
				oEvt.getSource().setValue(oEvt.getParameter('value'));
				oEvt.getSource().setValueState(sap.ui.core.ValueState.Error);
				boton.setEnabled(false);
				return;
			}
			oEvt.getSource().setValueState(sap.ui.core.ValueState.Success);
			boton.setEnabled(true);
			var vInput = oEvt.getParameter('value');
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
				if (entrada[1] !== undefined)
					oEvt.getSource().setValue(salida.join('.').split("").reverse().join('') + "," + entrada[1]);
				else
					oEvt.getSource().setValue(salida.join('.').split("").reverse().join(''));
			}
		},

		addDot1: function (oEvt) {
			var botonA = gThis.getView().byId("btnAnalisis");
			if (!/^[\d]+(\.[\d]{3,})*(\,[\d]{1,3})?$/.test(oEvt.getParameter('value'))) {
				oEvt.getSource().setValue(oEvt.getParameter('value'));
				oEvt.getSource().setValueState(sap.ui.core.ValueState.Error);
				botonA.setEnabled(false);
				return;
			}

			oEvt.getSource().setValueState(sap.ui.core.ValueState.Success);
			botonA.setEnabled(true);
			var vInput = oEvt.getParameter('value');
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
				if (entrada[1] !== undefined)
					oEvt.getSource().setValue(salida.join('.').split("").reverse().join('') + "," + entrada[1]);
				else
					oEvt.getSource().setValue(salida.join('.').split("").reverse().join(''));
			}
		},

		//Función para agregar línea de adicionales
		onAddAdicionales: function (vDatos) {
			if (!this._validaCamposTabla()) {
				return;
			}
			/*var cMezcla = gThis.getView().byId("CodigoMezcla");
			var cCantidad = gThis.getView().byId("Cantidad");
			var cCentro = gThis.getView().byId("Centro");

			var vMezcla = cMezcla.getValue();
			var vCantidad = cCantidad.getValue();
			var vCentro = cCentro.getSelectedKey();

			if (vMezcla === '' || vCantidad === '' || vCentro === '') {
				sap.m.MessageBox.warning("¡Favor completar todos los Datos de Mezcla!", {
					title: "Advertencia", // default
					onClose: null, // default
					styleClass: "", // default
					initialFocus: null, // default
					textDirection: sap.ui.core.TextDirection.Inherit // default
				});
				return;
			}*/

			var oItem = new sap.m.ColumnListItem({
				cells: [
					//Cuba
					new sap.m.Input({
						maxLength: 4,
						type: sap.m.Input.Number,
						placeholder: "",
						editable: true
					}),

					//Bodega
					new sap.m.ComboBox({
						required: true,
						showSecondaryValues: true,
						filterSecondaryValues: true,
						items: {
							path: '/CentroSet',
							sorter: {
								path: 'Werks'
							},
							template: new sap.ui.core.ListItem({
								key: "{Werks}",
								text: "{Name1}",
								additionalText: "{Werks}"
							})
						},
						editable: true
					}),

					//Código Vino 
					new sap.m.Input({
						maxLength: 12,
						liveChange: function (oEvt) {
							var centroD = oEvt.getSource().getParent().getCells()[1].getSelectedKey();
							var material = oEvt.getSource().getParent().getCells()[2];
							//material = encodeURIComponent(material);
							if (centroD === '') {
								sap.m.MessageBox.warning("¡Favor, seleccionar Bodega!", {
									title: "Advertencia", // default
									onClose: null, // default
									styleClass: "", // default
									initialFocus: null, // default
									textDirection: sap.ui.core.TextDirection.Inherit // default
								});
								material.setValue('');
							} else {
								if (/^(M?\d{4}-?\d{4})|\d{6}$/.test(material.getValue())) {
									gThis.handleValidationSuccess(oEvt);
								} else {
									gThis.handleValidationError(oEvt);
								}
							}
						},
						placeholder: "Ej: 303880",
						editable: true
					}),

					//Descripción
					new sap.m.Text({}),

					//Calidad
					new sap.m.Text({}),

					//Variedad
					new sap.m.Text({}),

					//D.O
					new sap.m.Text({}),

					//Cosecha
					new sap.m.Input({
						maxLength: 4,
						type: sap.m.Input.Number,
						placeholder: "Ej: 2019",
						editable: true
					}),

					//Cantidad Requerida
					new sap.m.Input({
						required: true,
						maxLength: 12,
						type: sap.m.Input.Currency,
						liveChange: gThis.validaInput,
						placeholder: "Ej: 5.000",
						editable: true

					}),

					//Precio
					new sap.m.Text({}),

					//Stock
					new sap.m.Text({}),

					//%
					new sap.m.Text({}),

					//Origen
					new sap.m.Input({
						maxLength: 4,
						type: sap.m.Input.Number,
						editable: true
					}),

					//Boton
					new sap.m.Button({
						icon: "sap-icon://decline",
						width: "3em",
						press: [this.remove, this]
					})
				]
			});

			var oTable = this.getView().byId('componentes');
			oTable.addItem(oItem);

		},

		remove: function (oEvent) {
			var oTable = oEvent.getSource().getParent().getParent();
			//var oTable = this.getView().byId('componentes');
			oTable.removeItem(oEvent.getSource().getParent());

			var w = gThis.getView().byId("SimuladorWizard");
			if (w.getCurrentStep() !== gThis.getView().byId("ComponentesStep").getId()) {
				w.setCurrentStep(gThis.getView().byId("ComponentesStep").getId());
			}
			gThis.onCalcular();

		},

		//Descripción del Material
		_descript: function (oEvent) {
			var material = oEvent.getSource().getParent().getCells()[2].getValue();
			material = encodeURIComponent(material);
			var centro = oEvent.getSource().getParent().getCells()[1].getSelectedKey();
			var descript = oEvent.getSource().getParent().getCells()[3]; //sap.ui.getCore().byId("descrip");
			//var unidad = oEvent.getSource().getParent().getCells()[3];
			var sResult = "Sin Descripción";
			var oMod = this.getOwnerComponent().getModel();
			oMod.read("/MaterialSet(Matnr='" + material + "',Werks='" + centro + "')", {
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
						//gUnidad = oData.Meins;
						descript.setProperty('text', sResult);
						//unidad.setProperty('text', gUnidad);
					}
				}.bind(this),
				error: function (oError) {
					var x = "hola";
					return x;
				}

			});

			gThis._caracAdic(oEvent);
			gThis._caraComponentes(oEvent);

		},

		_caracAdic: function (oEvent) {
			var material = oEvent.getSource().getParent().getCells()[2].getValue();
			material = encodeURIComponent(material);
			//var calidad = oEvent.getSource().getParent().getCells()[5];
			//var denOrigen = oEvent.getSource().getParent().getCells()[6];
			var cosecha = oEvent.getSource().getParent().getCells()[7];
			//var sResult1 = "Sin Descripción";
			//var sResult2 = "Sin Descripción";
			var sResult3 = "Sin Descripción";
			var oModel = this.getOwnerComponent().getModel();
			oModel.read("/CaracterAdicionalesSet('" + material + "')", {
				success: function (oData) {
					//sResult1 = oData.Calidad;
					//sResult2 = oData.DO;
					//sResult3 = oData.Cosecha;
					//calidad.setProperty('text', sResult1);
					//denOrigen.setProperty('text', sResult2);
					//cosecha.setProperty('text', sResult3);

				}.bind(this),
				error: function (oError) {
					var x = "hola";
					return x;
				}

			});

		},

		_caraComponentes: function (oEvent) {
			var material = oEvent.getSource().getParent().getCells()[2].getValue();
			material = encodeURIComponent(material);
			var centro = oEvent.getSource().getParent().getCells()[1].getSelectedKey();

			var calidad = oEvent.getSource().getParent().getCells()[4];
			var variedad = oEvent.getSource().getParent().getCells()[5];
			var denominacion = oEvent.getSource().getParent().getCells()[6];
			var precio = oEvent.getSource().getParent().getCells()[9];
			var stock = oEvent.getSource().getParent().getCells()[10];

			var sResult1 = "Sin Calidad";
			var sResult2 = "Sin Variedad";
			var sResult3 = "Sin Denominacion";
			var sResult4 = "Sin Precio";
			var sResult5 = "Sin Stock";

			var oMod = this.getOwnerComponent().getModel();
			oMod.read("/ComponentesSet(Matnr='" + material + "',Werks='" + centro + "')", {
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
						sResult1 = oData.Prdha;
						calidad.setProperty('text', sResult1);

						sResult2 = oData.Prdha1;
						variedad.setProperty('text', sResult2);

						sResult3 = oData.Prdha2;
						denominacion.setProperty('text', sResult3);

						sResult4 = oData.Stprs;
						precio.setProperty('text', sResult4);

						sResult5 = oData.Labst;
						stock.setProperty('text', sResult5);
					}
				}.bind(this),
				error: function (oError) {
					var x = "hola";
					return x;
				}

			});
		},

		handleValidationError: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			var descript = oEvent.getSource().getParent().getCells()[4];
			//var unidad = oEvent.getSource().getParent().getCells()[6];
			descript.setProperty('text', '');
			//unidad.setProperty('text', '');

		},

		handleValidationSuccess: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
			gThis._descript(oEvent);

		},

		onCalcular: function (oEvent) {
			gThis.porcentajeComponentes();
			var x = gThis.sumaComponentes(this);
			gThis.calculaPonderado();
			//gThis.calPrecioPond();
			this._wizard.validateStep(this.byId("ComponentesStep"));
			//this._wizard.invalidateStep(this.byId("AnalisisStep"));
		},

		sumaComponentes: function (that) {
			var cantidad = gThis.getView().byId("Cantidad");
			var codigo = gThis.getView().byId("CodigoMezcla").getValue();
			var totalCantidad = 0;
			//var totalPrecio = 0;
			var totalStock = 0;
			var totalPorcen = 0;

			//SI ES COOLER SE INCLYE AGUA Y AZUCAR EN PORCENTAJE Y TOTAL LITROS
			if ($.sap.Cooler.indexOf(codigo) > -1) {
				this.getView().byId("componentes").getItems().forEach(function (entry) {
					if (entry.getCells()[0].getMetadata().getName() === "sap.m.Input") {
						totalCantidad = totalCantidad + Number(entry.getCells()[8].getValue().split(".").join(""));
						totalPorcen = totalPorcen + Number(entry.getCells()[11].getText());
						totalStock = totalStock + Number(entry.getCells()[10].getText().split(".").join("").split(",").join("."));
					}
				});
			} else { //SI NO ES COOLER:
				this.getView().byId("componentes").getItems().forEach(function (entry) {
					if (entry.getCells()[0].getMetadata().getName() === "sap.m.Input") {
						//AGUA Y AZUCAR SE EXCLUYE DE LITROS TOTAL
						if ($.sap.Adicion.indexOf(entry.getCells()[2].getText()) === -1) {
							totalCantidad = totalCantidad + Number(entry.getCells()[8].getValue().split(".").join(""));
						}
						//STOCK SE SUMATODO
						totalStock = totalStock + Number(entry.getCells()[10].getText().split(".").join("").split(",").join("."));
						//MOSTO SE EXCLUYE DE PORCENTAJE
						if ($.sap.aMosto.indexOf(entry.getCells()[2].getText()) === -1 && $.sap.Adicion.indexOf(entry.getCells()[2].getText()) === -1) {
							totalPorcen = totalPorcen + Number(entry.getCells()[11].getText());
						}
					}
				});
			}

			var lTable = this.getView().byId("componentes").getItems().length;
			var less = 2;
			if (lTable <= 1) {
				less = 1;
			}
			////////////////////////////////CON 2 o MAS
			if (this.getView().byId("componentes").getItems()[lTable - less].getCells()[0].getMetadata()
				.getName() === "sap.m.Text") {
				this.getView().byId("componentes").getItems()[lTable - less].getCells()[8].setText(
					Intl.NumberFormat('de-DE').format(totalCantidad));
				/*this.getView().byId("componentes").getItems()[this.getView().byId("componentes").getItems().length - 2].getCells()[9].setText(
					Intl.NumberFormat('de-DE').format(
						totalPrecio));*/
				this.getView().byId("componentes").getItems()[lTable - less].getCells()[10].setText(
					Intl.NumberFormat('de-DE').format(
						totalStock));
				this.getView().byId("componentes").getItems()[lTable - less].getCells()[11].setText(
					Intl.NumberFormat('de-DE').format(
						totalPorcen));
			} else {
				var oItem1 = new sap.m.ColumnListItem({
					cells: [
						//Cuba
						new sap.m.Text({
							text: "Total:"
						}),

						//Bodega
						new sap.m.Text({}),

						//Código Vino 
						new sap.m.Text({}),

						//Descripción
						new sap.m.Text({}),

						//Calidad
						new sap.m.Text({}),

						//Variedad
						new sap.m.Text({}),

						//D.O
						new sap.m.Text({}),

						//Cosecha
						new sap.m.Text({}),

						//Total Cantidad
						new sap.m.Text({
							text: Intl.NumberFormat('de-DE').format(totalCantidad)
						}),

						//Total Precio
						new sap.m.Text({
							//text: Intl.NumberFormat('de-DE').format(totalPrecio)
						}),

						//Total Stock
						new sap.m.Text({
							text: Intl.NumberFormat('de-DE').format(totalStock)
						}),

						//% Componente
						new sap.m.Text({
							text: Intl.NumberFormat('de-DE').format(totalPorcen)
						}),

						//Origen
						new sap.m.Text({}),

						new sap.m.Button({
							icon: "sap-icon://sys-minus",
							width: "3em",
							visible: false,
							press: [this.remove, this]
						})
					]
				});

				var oTable1 = this.getView().byId('componentes');
				oTable1.addItem(oItem1);
			}

			/*if (this.getView().byId("componentes").getItems()[this.getView().byId("componentes").getItems().length - 1].getCells()[0].getMetadata()
				.getName() === "sap.m.Input") {
				for (var x = this.getView().byId("componentes").getItems().length - 2; x >= 0; x--) {
					totalCantidad = totalCantidad + Number(this.getView().byId("componentes").getItems()[x].getCells()[9].getValue().split(".").join(
						""));
				}
				this.getView().byId("componentes").getItems()[this.getView().byId("componentes").getItems().length - 1].getCells()[9].setText(
					totalCantidad);
			} else {

				this.getView().byId("componentes").getItems().forEach(function (entry) {
					//entry.getCells()[8].getValue();
					totalCantidad = totalCantidad + Number(entry.getCells()[9].getValue().split(".").join(""));
					totalPrecio = totalPrecio + Number(entry.getCells()[10].getText().split(".").join(""));
					totalStock = totalStock + Number(entry.getCells()[11].getText().split(".").join(""));
					totalPorcen = totalPorcen + Number(entry.getCells()[12].getText());
				});
				
			}*/
			//that._totalPrecio = totalPrecio;
			cantidad.setValue(totalCantidad);
			cantidad.setEnabled(false);
			return totalCantidad;
		},

		calculaPonderado: function () {
			var codigo = gThis.getView().byId("CodigoMezcla");
			var totalCantidad = 0;
			var Tabla_1 = gThis.getView().byId("componentes");
			var precioPonderado = 0;
			var entry;
			var lTable = this.getView().byId("componentes").getItems().length;
			var less = 2;
			if (lTable <= 1) {
				less = 1;
			}
			//////CON 2 o MAS
			if (this.getView().byId("componentes").getItems()[lTable - less].getCells()[0].getMetadata()
				.getName() === "sap.m.Text") {

				entry = this.getView().byId("componentes").getItems()[lTable - less];
				totalCantidad = Number(entry.getCells()[8].getText().split(".").join(""));

				Tabla_1.getItems().forEach(function (fila) {
					if (fila.getCells()[0].getMetadata().getName() === "sap.m.Input") {

						if ($.sap.aMosto.indexOf(fila.getCells()[2].getText()) === -1) {
							precioPonderado = precioPonderado + (Number(fila.getCells()[8].getValue().split(".").join("")) * Number(fila.getCells()[9].getText()
								.split(".").join(""))) / totalCantidad;
						}
					}
				});
				this.getView().byId("componentes").getItems()[this.getView().byId("componentes").getItems().length - 1].getCells()[9].setText(
					Intl.NumberFormat('de-DE').format(precioPonderado));
			} else {
				entry = this.getView().byId("componentes").getItems()[this.getView().byId("componentes").getItems().length - 1];
				totalCantidad = Number(entry.getCells()[8].getText().split(".").join(""));
				Tabla_1.getItems().forEach(function (fila) {
					if (fila.getCells()[0].getMetadata().getName() === "sap.m.Input") {

						if ($.sap.Cooler.indexOf(codigo) > -1) {
							if ($.sap.Adicion.indexOf(fila.getCells()[2].getText()) > -1) {
								precioPonderado = precioPonderado + (Number(fila.getCells()[8].getValue().split(".").join("")) * Number(fila.getCells()[9].getText()
									.split(".").join(
										""))) / totalCantidad;
							}
						} else {
							if ($.sap.aMosto.indexOf(fila.getCells()[2].getText()) === -1) {
								precioPonderado = precioPonderado + (Number(fila.getCells()[8].getValue().split(".").join("")) * Number(fila.getCells()[9].getText()
									.split(".").join(
										""))) / totalCantidad;
							}
						}

					}
				});
				/*totalPrecio = Number(entry.getCells()[9].getText().split(".").join(""));
				cantProducir = Number(gThis.getView().byId("Cantidad").getValue().split(".").join(""));
				ponderado = (totalCantidad * totalPrecio) / cantProducir;*/

				var oItem1 = new sap.m.ColumnListItem({
					cells: [
						//Cuba
						new sap.m.Text({
							text: "Ponderado:"
						}),

						//Bodega
						new sap.m.Text({}),

						//Código Vino 
						new sap.m.Text({}),

						//Descripción
						new sap.m.Text({}),

						//Calidad
						new sap.m.Text({}),

						//Variedad
						new sap.m.Text({}),

						//D.O
						new sap.m.Text({}),

						//Cosecha
						new sap.m.Text({}),

						//Total Cantidad
						new sap.m.Text({
							//text: Intl.NumberFormat('de-DE').format(ponderado)
						}),

						//Precio
						new sap.m.Text({
							text: Intl.NumberFormat('de-DE').format(precioPonderado)
						}),

						//Stock
						new sap.m.Text({}),

						//% Componente
						new sap.m.Text({}),

						//Origen
						new sap.m.Text({}),

						new sap.m.Button({
							icon: "sap-icon://sys-minus",
							width: "3em",
							visible: false,
							press: [this.remove, this]
						})
					]
				});

				var oTable1 = this.getView().byId("componentes");
				oTable1.addItem(oItem1);
			}

			//}
			/*else {
				for (var x = this.getView().byId("componentes").getItems().length - 2; x >= 0; x--) {
					totalCantidad = totalCantidad + Number(this.getView().byId("componentes").getItems()[x].getCells()[8].getValue().split(".").join(
						""));
				}
				this.getView().byId("componentes").getItems()[this.getView().byId("componentes").getItems().length - 1].getCells()[8].setText(
					ponderado);
			}*/
		},

		calPondSinMosto: function () {
			var Tabla_1 = gThis.getView().byId("componentes");
			var sinMostoA = 0;

			// Ponderado
			Tabla_1.getItems().forEach(function (fila) {
				if (fila.getCells()[8].getMetadata().getName() === "sap.m.Input") {

					if ($.sap.aMosto.indexOf(fila.getCells()[2].getText()) === -1) {
						sinMostoA = sinMostoA + (fila.getCells()[9].getText().split(".").join("").split(",").join(".") * fila.getCells()[
								8].getValue()
							.split(".").join("").replace(",",
								"."));
					}

				}
			});
			var totalCantidad = Tabla_1.getItems()[Tabla_1.getItems().length - 2].getCells()[8].getText();
			var sinMosto = Math.round(sinMostoA / Number(totalCantidad.split(".").join("")));
			this._sinMosto = sinMosto;
			return sinMosto;
		},

		calPondConMosto: function () {
			//var that = this;
			var precioMosto = 0;
			var litroMosto = 0;
			var totalCantidad = 0;
			var conMosto = 0;

			this.getView().byId("componentes").getItems().forEach(function (entry) {
				if (entry.getCells()[0].getMetadata().getName() === "sap.m.Input") {
					if ($.sap.aMosto.indexOf(entry.getCells()[2].getText()) > -1) {
						precioMosto = Number(entry.getCells()[9].getText().split(".").join(""));
						litroMosto = Number(entry.getCells()[8].getValue().split(".").join(""));
						/*precioMosto = precioMosto + Number(entry.getCells()[9].getText().split(".").join(""));
						litroMosto = litroMosto + Number(entry.getCells()[8].getValue().split(".").join(""));*/
					}

					if ($.sap.Adicion.indexOf(entry.getCells()[2].getText()) === -1) {
						totalCantidad = totalCantidad + Number(entry.getCells()[8].getValue().split(".").join(""));
					}
					conMosto = Math.round((precioMosto * litroMosto) / totalCantidad);
				}

			});
			//conMosto = that._sinMosto + precioMosto;
			return conMosto;

		},

		porcentajeComponentes: function () {
			var codigo = gThis.getView().byId("CodigoMezcla").getValue();
			var totalCantidad = 0;

			if ($.sap.Cooler.indexOf(codigo) > -1) {
				this.getView().byId("componentes").getItems().forEach(function (entry) {
					if (entry.getCells()[0].getMetadata().getName() !== "sap.m.Text") {
						if ($.sap.aMosto.indexOf(entry.getCells()[2].getText()) === -1) {
							totalCantidad = totalCantidad + Number(entry.getCells()[8].getValue().split(".").join(""));
						}
					}

				});
			} else {
				this.getView().byId("componentes").getItems().forEach(function (entry) {
					if (entry.getCells()[0].getMetadata().getName() !== "sap.m.Text") {
						if ($.sap.aMosto.indexOf(entry.getCells()[2].getText()) === -1 && $.sap.Adicion.indexOf(entry.getCells()[2].getText()) === -1) { //igual a -1 es Mosto
							totalCantidad = totalCantidad + Number(entry.getCells()[8].getValue().split(".").join(""));
						}
					}

				});
			}

			var porcentaje = 0;
			var cantReq = 0;

			var oTable = gThis.getView().byId('componentes');
			oTable.getItems().forEach(function (fila) {
				if (fila.getCells()[0].getMetadata().getName() === "sap.m.Input") {
					cantReq = Number(fila.getCells()[8].getValue().split(".").join(""));
					porcentaje = (cantReq / totalCantidad) * 100;
					fila.getCells()[11].setText(porcentaje.toFixed(1));
				}

			});
		},

		onAddAnalisis: function (vDatos) {
			//var btnAdd = gThis.getView().byId("btnCompo");
			//btnAdd.setEnabled(false);

			/*this.getView().byId("componentes").getItems().forEach(function (entry) {
				if (entry.getCells()[0].getMetadata().getName() === "sap.m.Input") {
					entry.getCells()[13].setEnabled(false);
				}
			});*/

			var oTable1 = gThis.getView().byId('componentes');
			var oTable2 = gThis.getView().byId('analisis');
			oTable2.destroyItems();

			oTable1.getItems().forEach(function (fila) {
				if (fila.getCells()[0].getMetadata().getName() === "sap.m.Input") {
					var oItem = new sap.m.ColumnListItem({
						cells: [
							//Bodega
							new sap.m.Text({
								text: fila.getCells()[1].getText()
							}),

							//Cuba
							new sap.m.Text({
								text: fila.getCells()[0].getValue()
							}),

							//Componente
							new sap.m.Text({
								text: fila.getCells()[2].getText()
							}),

							//A
							new sap.m.Input({
								required: true,
								maxLength: 12,
								type: sap.m.Input.Currency,
								liveChange: gThis.addDot1,
								placeholder: "",
								editable: true

							}),

							//AT
							new sap.m.Input({
								required: true,
								maxLength: 12,
								type: sap.m.Input.Currency,
								liveChange: gThis.addDot1,
								placeholder: "",
								editable: true

							}),

							//AV
							new sap.m.Input({
								required: true,
								maxLength: 12,
								type: sap.m.Input.Currency,
								liveChange: gThis.addDot1,
								placeholder: "",
								editable: true

							}),

							//SO2L
							new sap.m.Input({
								required: true,
								maxLength: 12,
								type: sap.m.Input.Currency,
								liveChange: gThis.addDot1,
								placeholder: "",
								editable: true

							}),

							//SO2T
							new sap.m.Input({
								required: true,
								maxLength: 12,
								type: sap.m.Input.Currency,
								liveChange: gThis.addDot1,
								placeholder: "",
								editable: true

							}),

							//MR
							new sap.m.Input({
								required: true,
								maxLength: 12,
								type: sap.m.Input.Currency,
								liveChange: gThis.addDot1,
								placeholder: "",
								editable: true

							}),

							//PH
							new sap.m.Input({
								required: true,
								maxLength: 12,
								type: sap.m.Input.Currency,
								liveChange: gThis.addDot1,
								placeholder: "",
								editable: true

							}),

							//Color
							new sap.m.Input({
								required: true,
								maxLength: 12,
								type: sap.m.Input.Currency,
								liveChange: gThis.addDot1,
								placeholder: "",
								editable: true

							}),

							new sap.m.Text({
								text: fila.getCells()[7].getText()
							})

						]
					});

					oTable2.addItem(oItem);
				}

			});
		},

		onSumaAnalisis: function () {
			var Tabla_1 = gThis.getView().byId("componentes");
			var Tabla_2 = gThis.getView().byId("analisis");

			var totalAA = 0;
			var totalAAT = 0;
			var totalAAV = 0;
			var totalSSO2L = 0;
			var totalSSO2T = 0;
			var totalMMR = 0;
			var totalPPH = 0;
			var totalCColor = 0;

			// Total A
			for (var i = 0; i < Tabla_1.getItems().length; i++) {
				if (Tabla_1.getItems()[i].getCells()[8].getMetadata().getName() === "sap.m.Input")
					totalAA = totalAA + (Tabla_1.getItems()[i].getCells()[8].getValue().split(".").join("") * Tabla_2.getItems()[i].getCells()[3].getValue()
						.split(".").join("").replace(",",
							"."));
			}
			var totalCantidad = Tabla_1.getItems()[Tabla_1.getItems().length - 2].getCells()[8].getText();
			var totalA = totalAA / totalCantidad.split(".").join("");

			// Total AT
			for (var i = 0; i < Tabla_1.getItems().length; i++) {
				if (Tabla_1.getItems()[i].getCells()[8].getMetadata().getName() === "sap.m.Input")
					totalAAT = totalAAT + (Tabla_1.getItems()[i].getCells()[8].getValue().split(".").join("") * Tabla_2.getItems()[i].getCells()[4]
						.getValue()
						.split(
							".").join("").replace(
							",", "."));
			}
			var totalAT = totalAAT / totalCantidad.split(".").join("");

			// Total AV
			for (var i = 0; i < Tabla_1.getItems().length; i++) {
				if (Tabla_1.getItems()[i].getCells()[8].getMetadata().getName() === "sap.m.Input")
					totalAAV = totalAAV + (Tabla_1.getItems()[i].getCells()[8].getValue().split(".").join("") * Tabla_2.getItems()[i].getCells()[5]
						.getValue()
						.split(".").join("").replace(
							",", "."));
			}
			var totalAV = totalAAV / totalCantidad.split(".").join("");

			// Total SO2L
			for (var i = 0; i < Tabla_1.getItems().length; i++) {
				if (Tabla_1.getItems()[i].getCells()[8].getMetadata().getName() === "sap.m.Input")
					totalSSO2L = totalSSO2L + (Tabla_1.getItems()[i].getCells()[8].getValue().split(".").join("") * Tabla_2.getItems()[i].getCells()[
						6].getValue().split(".").join("").replace(
						",", "."));
			}
			var totalSO2L = totalSSO2L / totalCantidad.split(".").join("");

			// Total SO2T
			for (var i = 0; i < Tabla_1.getItems().length; i++) {
				if (Tabla_1.getItems()[i].getCells()[8].getMetadata().getName() === "sap.m.Input")
					totalSSO2T = totalSSO2T + (Tabla_1.getItems()[i].getCells()[8].getValue().split(".").join("") * Tabla_2.getItems()[i].getCells()[
						7].getValue().split(".").join("").replace(
						",", "."));
			}
			var totalSO2T = totalSSO2T / totalCantidad.split(".").join("");

			//Total MR
			for (var i = 0; i < Tabla_1.getItems().length; i++) {
				if (Tabla_1.getItems()[i].getCells()[8].getMetadata().getName() === "sap.m.Input")
					totalMMR = totalMMR + (Tabla_1.getItems()[i].getCells()[8].getValue().split(".").join("") * Tabla_2.getItems()[i].getCells()[8]
						.getValue()
						.split(".").join("").replace(
							",", "."));
			}
			var totalMR = totalMMR / totalCantidad.split(".").join("");

			//Total PH
			for (var i = 0; i < Tabla_1.getItems().length; i++) {
				if (Tabla_1.getItems()[i].getCells()[8].getMetadata().getName() === "sap.m.Input")
					totalPPH = totalPPH + (Tabla_1.getItems()[i].getCells()[8].getValue().split(".").join("") * Tabla_2.getItems()[i].getCells()[9]
						.getValue()
						.split(".").join("").replace(
							",", "."));
			}
			var totalPH = totalPPH / totalCantidad.split(".").join("");

			//Total Color
			for (var i = 0; i < Tabla_1.getItems().length; i++) {
				if (Tabla_1.getItems()[i].getCells()[8].getMetadata().getName() === "sap.m.Input")
					totalCColor = totalCColor + (Tabla_1.getItems()[i].getCells()[8].getValue().split(".").join("") * Tabla_2.getItems()[i].getCells()[
						10].getValue().split(".").join("").replace(
						",",
						"."));
			}
			var totalColor = totalCColor / totalCantidad.split(".").join("");

			if (this.getView().byId("analisis").getItems()[this.getView().byId("analisis").getItems().length - 1].getCells()[3].getMetadata()
				.getName() !== "sap.m.Input") {
				//
				this.getView().byId("analisis").getItems()[this.getView().byId("analisis").getItems().length - 1].getCells()[3].setText(
					totalA.toFixed(1));
				this.getView().byId("analisis").getItems()[this.getView().byId("analisis").getItems().length - 1].getCells()[4].setText(
					totalAT.toFixed(2));
				this.getView().byId("analisis").getItems()[this.getView().byId("analisis").getItems().length - 1].getCells()[5].setText(
					totalAV.toFixed(2));
				this.getView().byId("analisis").getItems()[this.getView().byId("analisis").getItems().length - 1].getCells()[6].setText(
					totalSO2L.toFixed(3));
				this.getView().byId("analisis").getItems()[this.getView().byId("analisis").getItems().length - 1].getCells()[7].setText(
					totalSO2T.toFixed(3));
				this.getView().byId("analisis").getItems()[this.getView().byId("analisis").getItems().length - 1].getCells()[8].setText(
					totalMR.toFixed(1));
				this.getView().byId("analisis").getItems()[this.getView().byId("analisis").getItems().length - 1].getCells()[9].setText(
					totalPH.toFixed(2));
				this.getView().byId("analisis").getItems()[this.getView().byId("analisis").getItems().length - 1].getCells()[10].setText(
					totalColor.toFixed(1));

			} else {
				var oItem = new sap.m.ColumnListItem({
					cells: [
						//Bodega
						new sap.m.Text({
							text: "Promedio Ponderado:"
						}),

						//Cuba
						new sap.m.Text({}),

						//Componente
						new sap.m.Text({}),

						//A
						new sap.m.Text({
							text: totalA.toFixed(1)
						}),

						//AT
						new sap.m.Text({
							text: totalAT.toFixed(2)
						}),

						//AV
						new sap.m.Text({
							text: totalAV.toFixed(2)
						}),

						//SO2L
						new sap.m.Text({
							text: totalSO2L.toFixed(3)
						}),

						//SO2T
						new sap.m.Text({
							text: totalSO2T.toFixed(3)
						}),

						//MR
						new sap.m.Text({
							text: totalMR.toFixed(1)
						}),

						//PH
						new sap.m.Text({
							text: totalPH.toFixed(2)
						}),

						//Color
						new sap.m.Text({
							text: totalColor.toFixed(1)
						})

					]
				});

				var oTable = this.getView().byId('analisis');
				oTable.addItem(oItem);
			}
			//Activa boton verificar
			this._wizard.validateStep(this.byId("AnalisisStep"));
			return totalA;

		},

		/*onReviewComponentes: function () {
			var oTable1 = gThis.getView().byId('componentes');
			var oTable2 = this._oWizardReviewPage.getContent()[1].getContent()[0].getContent()[0]; //gThis.getView().byId('reviewComponentes');

			oTable1.getItems().forEach(function (fila) {
				//if (fila.getCells()[0].getMetadata().getName() === "sap.m.Input") {
				var oItem = new sap.m.ColumnListItem({
					cells: [
						//Origen
						new sap.m.Text({
							text: fila.getCells()[0].getMetadata().getName() === "sap.m.Input" ? fila.getCells()[0].getValue() : fila.getCells()[0]
								.getText()
						}),

						//Cuba
						new sap.m.Text({
							text: fila.getCells()[1].getMetadata().getName() === "sap.m.Input" ? fila.getCells()[1].getValue() : fila.getCells()[1]
								.getText()
						}),

						//Bodega
						new sap.m.Text({
							text: fila.getCells()[2].getMetadata().getName() === "sap.m.ComboBox" ? fila.getCells()[2].getSelectedKey() : fila.getCells()[
								2].getText()
						}),

						//Código
						new sap.m.Text({
							text: fila.getCells()[3].getMetadata().getName() === "sap.m.Input" ? fila.getCells()[3].getValue() : fila.getCells()[3]
								.getText()
						}),

						//Descripción
						new sap.m.Text({
							text: fila.getCells()[4].getText()
						}),

						//Calidad
						new sap.m.Text({
							text: fila.getCells()[5].getText()
						}),

						//Variedad
						new sap.m.Text({
							text: fila.getCells()[6].getText()
						}),

						//D.O
						new sap.m.Text({
							text: fila.getCells()[7].getText()
						}),

						//Cosecha
						new sap.m.Text({
							text: fila.getCells()[8].getMetadata().getName() === "sap.m.Input" ? fila.getCells()[8].getValue() : fila.getCells()[8]
								.getText()
						}),

						//Cantidad
						new sap.m.Text({
							text: fila.getCells()[9].getMetadata().getName() === "sap.m.Input" ? fila.getCells()[9].getValue() : fila.getCells()[9]
								.getText()
						}),

						//Precio
						new sap.m.Text({
							text: fila.getCells()[10].getText()
						}),

						//Stock
						new sap.m.Text({
							text: fila.getCells()[11].getText()
						}),

						//% Componente
						new sap.m.Text({
							text: fila.getCells()[12].getText()
						})

					]
				});

				oTable2.addItem(oItem);
				//}

			});
		},

		onReviewAnalisis: function () {
			var oTable1 = gThis.getView().byId('analisis');
			var oTable2 = this._oWizardReviewPage.getContent()[2].getContent()[0].getContent()[0];

			oTable1.getItems().forEach(function (fila) {
				var oItem = new sap.m.ColumnListItem({
					cells: [
						//Bodega
						new sap.m.Text({
							text: fila.getCells()[0].getText()
						}),

						//Cuba
						new sap.m.Text({
							text: fila.getCells()[1].getText()
						}),

						//Componente
						new sap.m.Text({
							text: fila.getCells()[2].getText()
						}),

						//A
						new sap.m.Text({
							text: fila.getCells()[3].getMetadata().getName() === "sap.m.Input" ? fila.getCells()[3].getValue() : fila.getCells()[3]
								.getText()
						}),

						//AT
						new sap.m.Text({
							text: fila.getCells()[4].getMetadata().getName() === "sap.m.Input" ? fila.getCells()[4].getValue() : fila.getCells()[4]
								.getText()
						}),

						//AV
						new sap.m.Text({
							text: fila.getCells()[5].getMetadata().getName() === "sap.m.Input" ? fila.getCells()[5].getValue() : fila.getCells()[5]
								.getText()
						}),

						//SO2L
						new sap.m.Text({
							text: fila.getCells()[6].getMetadata().getName() === "sap.m.Input" ? fila.getCells()[6].getValue() : fila.getCells()[6]
								.getText()
						}),

						//SO2T
						new sap.m.Text({
							text: fila.getCells()[7].getMetadata().getName() === "sap.m.Input" ? fila.getCells()[7].getValue() : fila.getCells()[7]
								.getText()
						}),

						//MR
						new sap.m.Text({
							text: fila.getCells()[8].getMetadata().getName() === "sap.m.Input" ? fila.getCells()[8].getValue() : fila.getCells()[8]
								.getText()
						}),

						//PH
						new sap.m.Text({
							text: fila.getCells()[9].getMetadata().getName() === "sap.m.Input" ? fila.getCells()[9].getValue() : fila.getCells()[9]
								.getText()
						}),

						//Color
						new sap.m.Text({
							text: fila.getCells()[10].getMetadata().getName() === "sap.m.Input" ? fila.getCells()[10].getValue() : fila.getCells()[
									10]
								.getText()
						})

					]
				});

				oTable2.addItem(oItem);
				//}

			});

		},*/

		onAddCompo: function (oEvent) {
			var that = this;
			if (!this._validaCamposTabla()) {
				return;
			}
			var oTable1 = gThis.getView().byId("componentes");
			//var oTable3 = this.getView().byId("analisis");
			var oTable2 = gThis.getView().byId("selectAptitud").getSelectedItems();
			oTable2.forEach(function (fila) {
				var oItem = new sap.m.ColumnListItem({
					cells: [
						//Cuba
						new sap.m.Input({
							maxLength: 4,
							type: sap.m.Input.Number,
							placeholder: "",
							editable: true
						}),

						//Bodega
						new sap.m.Text({
							text: fila.getCells()[0].getText()
						}),

						//Código Vino 
						new sap.m.Text({
							text: fila.getCells()[1].getText()
						}),

						//Descripción
						new sap.m.Text({
							text: fila.getCells()[2].getText()
						}),

						//Calidad
						new sap.m.Text({
							text: fila.getCells()[5].getText()
						}),

						//Variedad
						new sap.m.Text({
							text: fila.getCells()[6].getText()
						}),

						//D.O
						new sap.m.Text({
							text: fila.getCells()[7].getText()
						}),

						//Cosecha
						new sap.m.Text({
							text: fila.getCells()[3].getText()
						}),

						//Cantidad Requerida
						new sap.m.Input({
							required: true,
							maxLength: 12,
							type: sap.m.Input.Currency,
							liveChange: gThis.validaInput,
							placeholder: "Ej: 5.000",
							editable: true
						}),

						//Precio
						new sap.m.Text({
							text: fila.getCells()[8].getText()
						}),

						//Stock
						new sap.m.Text({
							text: fila.getCells()[9].getText()
						}),

						//%
						new sap.m.Text({}),

						//Origen
						new sap.m.Input({
							maxLength: 4,
							type: sap.m.Input.Number,
							editable: true
						}),

						//Boton
						new sap.m.Button({
							icon: "sap-icon://decline",
							width: "3em",
							press: [gThis.remove, this]
						}),

						//lote
						new sap.m.Text({
							text: fila.getCells()[11].getText()
						})

					]
				});
				var bExist = false;
				oTable1.getItems().forEach(function (t) { //2 y 1 Código // 1 y 0 Bodega // 7 y 3 Cosecha // 10 y 9 Stock //14 y 11 lote
					if (t.getCells()[2].getText() === fila.getCells()[1].getText() && t.getCells()[1].getText() === fila.getCells()[0].getText() &&
						t.getCells()[7].getText() === fila.getCells()[3].getText() && t.getCells()[10].getText() === fila.getCells()[9].getText() &&
						t.getCells()[14].getText() === fila.getCells()[11].getText()) {
						bExist = true;
					}
				});
				if (!bExist) {
					oTable1.addItem(oItem);
					var w = that.getView().byId("SimuladorWizard");
					if (w.getCurrentStep() !== that.getView().byId("ComponentesStep").getId()) {
						w.setCurrentStep(that.getView().byId("ComponentesStep").getId());
					}
					that.getView().byId("ComponentesStep").setValidated(false);
					that.getView().byId("btnCalcular").setEnabled(false);
				}
				//oTable3.removeAllItems();
			});

			this.onCloseDialog();

		},

		resultVariedad: function () {
			var variedad = 0;
			var vari = [];
			var oTable1 = gThis.getView().byId('componentes');
			for (var i = 0; i < oTable1.getItems().length - 2; i++) {
				var e = oTable1.getItems()[i];
				if (e.getCells()[5].getMetadata().getName() === "sap.m.Text" && e.getCells()[5].getText() !== "") {
					if ($.sap.aMosto.indexOf(e.getCells()[2].getText()) === -1 && $.sap.Adicion.indexOf(e.getCells()[2].getText()) === -1) {
						if (vari.length === 0) {
							vari.push({
								"variedad": e.getCells()[5].getText(),
								"total": Number(e.getCells()[11].getText()) //100 / (oTable1.getItems().length - 2)
							});
						} else {
							if (vari.filter(function (w) {
									return w.variedad === e.getCells()[5].getText();
								}).length !== 0) {
								var tot = vari.filter(function (w) {
									return w.variedad === e.getCells()[5].getText();
								})[0].total;
								vari.filter(function (w) {
									return w.variedad === e.getCells()[5].getText();
								}).filter(function (r) {
									r.total = tot + Number(e.getCells()[11].getText()); //(100 / (oTable1.getItems().length - 2));
								});
							} else {
								vari.push({
									"variedad": e.getCells()[5].getText(),
									"total": Number(e.getCells()[11].getText()) //100 / (oTable1.getItems().length - 2)
								});
							}
						}
					}
				}
			}
			var oFormV = sap.ui.getCore().byId("rvariedadForm");
			var bCumple = false;
			var o = 0;
			vari.forEach(function (e) {
				if (e.total >= 85.0) {
					bCumple = true;
				}
				oFormV.addContent(new sap.m.Label({
					text: e.variedad
				}));
				o += e.total;
				oFormV.addContent(new sap.m.Input({
					type: sap.m.InputType.Text,
					value: e.total.toFixed(2) + "%", ///IBA
					enabled: false
				}));
			});

			if (bCumple) {
				oFormV.addContent(new sap.m.Label({
					text: "Total",
					design: "Bold"
				}));
				oFormV.addContent(new sap.m.Input({
					type: sap.m.InputType.Text,
					value: Number(o.toFixed()) + "%",
					enabled: false,
					valueState: sap.ui.core.ValueState.None
				}));
			} else {
				oFormV.addContent(new sap.m.Label({
					text: "Total",
					design: "Bold"
				}));
				oFormV.addContent(new sap.m.Input({
					type: sap.m.InputType.Text,
					value: Number(o.toFixed()) + "%",
					enabled: false,
					valueState: sap.ui.core.ValueState.None
				}));
				this.bValidaCumple = false;
			}

		},

		resultCosecha: function () {
			var cosecha = 0;
			var cose = [];
			var oTable1 = gThis.getView().byId('componentes');
			for (var i = 0; i < oTable1.getItems().length - 2; i++) {
				var e = oTable1.getItems()[i];
				if (e.getCells()[7].getMetadata().getName() === "sap.m.Text" && e.getCells()[7].getText() !== "") {
					if ($.sap.aMosto.indexOf(e.getCells()[2].getText()) === -1 && $.sap.Adicion.indexOf(e.getCells()[2].getText()) === -1) {
						if (cose.length === 0) {
							cose.push({
								"cosecha": e.getCells()[7].getText(),
								"total": Number(e.getCells()[11].getText()) //100 / (oTable1.getItems().length - 2)
							});
						} else {
							if (cose.filter(function (w) {
									return w.cosecha === e.getCells()[7].getText();
								}).length !== 0) {
								var tot = cose.filter(function (w) {
									return w.cosecha === e.getCells()[7].getText();
								})[0].total;
								cose.filter(function (c) {
									return c.cosecha === e.getCells()[7].getText();
								}).filter(function (r) {
									r.total = tot + Number(e.getCells()[11].getText()); //(100 / (oTable1.getItems().length - 2));
								});
							} else {
								cose.push({
									"cosecha": e.getCells()[7].getText(),
									"total": Number(e.getCells()[11].getText()) //100 / (oTable1.getItems().length - 2)
								});
							}
						}
					}
				}
			}
			var oFormV = sap.ui.getCore().byId("rcosechaForm");
			var bCumple = false;
			var o = 0;
			cose.forEach(function (e) {
				if (e.total >= 85.0) {
					bCumple = true;
				}
				oFormV.addContent(new sap.m.Label({
					text: e.cosecha
				}));
				o += e.total;
				oFormV.addContent(new sap.m.Input({
					type: sap.m.InputType.Text,
					value: e.total.toFixed(2) + "%", ///IBA
					enabled: false
				}));
			});

			if (bCumple) {
				oFormV.addContent(new sap.m.Label({
					text: "Total",
					design: "Bold"
				}));
				oFormV.addContent(new sap.m.Input({
					type: sap.m.InputType.Text,
					value: Number(o.toFixed()) + "%",
					enabled: false,
					valueState: sap.ui.core.ValueState.None
				}));
			} else {
				oFormV.addContent(new sap.m.Label({
					text: "Total",
					design: "Bold"
				}));
				oFormV.addContent(new sap.m.Input({
					type: sap.m.InputType.Text,
					value: Number(o.toFixed()) + "%",
					enabled: false,
					valueState: sap.ui.core.ValueState.None
				}));
				this.bValidaCumple = false;
			}

		},

		resultOrigen: function () {
			var origen = 0;
			var ori = [];
			var oTable1 = gThis.getView().byId('componentes');
			for (var i = 0; i < oTable1.getItems().length - 2; i++) {
				var e = oTable1.getItems()[i];
				if (e.getCells()[6].getMetadata().getName() === "sap.m.Text" && e.getCells()[6].getText() !== "") {
					if ($.sap.aMosto.indexOf(e.getCells()[2].getText()) === -1 && $.sap.Adicion.indexOf(e.getCells()[2].getText()) === -1) {
						if (ori.length === 0) {
							ori.push({
								"origen": e.getCells()[6].getText(),
								"total": Number(e.getCells()[11].getText()) //100 / (oTable1.getItems().length - 2)
							});
						} else {
							if (ori.filter(function (w) {
									return w.origen === e.getCells()[6].getText();
								}).length !== 0) {
								var tot = ori.filter(function (w) {
									return w.origen === e.getCells()[6].getText();
								})[0].total;
								ori.filter(function (o) {
									return o.origen === e.getCells()[6].getText();
								}).filter(function (r) {
									r.total = tot + Number(e.getCells()[11].getText()); //(100 / (oTable1.getItems().length - 2));
								});
							} else {
								ori.push({
									"origen": e.getCells()[6].getText(),
									"total": Number(e.getCells()[11].getText()) //100 / (oTable1.getItems().length - 2)
								});
							}
						}
					}
				}
			}
			var oFormV = sap.ui.getCore().byId("rorigenForm");
			var bCumple = false;
			var o = 0;
			ori.forEach(function (e) {
				if (e.total >= 85.0) {
					bCumple = true;
				}
				oFormV.addContent(new sap.m.Label({
					text: e.origen
				}));
				o += e.total;
				oFormV.addContent(new sap.m.Input({
					type: sap.m.InputType.Text,
					value: e.total.toFixed(2) + "%", ///IBA
					enabled: false
				}));
			});

			if (bCumple) {
				oFormV.addContent(new sap.m.Label({
					text: "Total",
					design: "Bold"
				}));
				oFormV.addContent(new sap.m.Input({
					type: sap.m.InputType.Text,
					value: Number(o.toFixed()) + "%",
					enabled: false,
					valueState: sap.ui.core.ValueState.None
				}));
			} else {
				oFormV.addContent(new sap.m.Label({
					text: "Total",
					design: "Bold"
				}));
				oFormV.addContent(new sap.m.Input({
					type: sap.m.InputType.Text,
					value: Number(o.toFixed()) + "%",
					enabled: false,
					valueState: sap.ui.core.ValueState.None
				}));
				this.bValidaCumple = false;
			}

		},

		resultCalidad: function () {
			var calidad = 0;
			var cali = [];
			var oTable1 = gThis.getView().byId('componentes');
			for (var i = 0; i < oTable1.getItems().length - 2; i++) {
				var e = oTable1.getItems()[i];
				if (e.getCells()[4].getMetadata().getName() === "sap.m.Text" && e.getCells()[4].getText() !== "") {
					if ($.sap.aMosto.indexOf(e.getCells()[2].getText()) === -1 && $.sap.Adicion.indexOf(e.getCells()[2].getText()) === -1) {
						if (cali.length === 0) {
							cali.push({
								"calidad": e.getCells()[4].getText(),
								"total": Number(e.getCells()[11].getText()) //100 / (oTable1.getItems().length - 2)
							});
						} else {
							if (cali.filter(function (w) {
									return w.calidad === e.getCells()[4].getText();
								}).length !== 0) {
								var tot = cali.filter(function (w) {
									return w.calidad === e.getCells()[4].getText();
								})[0].total;
								cali.filter(function (x) {
									return x.calidad === e.getCells()[4].getText();
								}).filter(function (r) {
									r.total = tot + Number(e.getCells()[11].getText()); //(100 / (oTable1.getItems().length - 2));
								});
							} else {
								cali.push({
									"calidad": e.getCells()[4].getText(),
									"total": Number(e.getCells()[11].getText()) //100 / (oTable1.getItems().length - 2)
								});
							}
						}
					}
				}
			}
			var oFormV = sap.ui.getCore().byId("rcalidadForm");
			var bCumple = false;
			var o = 0;
			cali.forEach(function (e) {
				if (e.total >= 85.0) {
					bCumple = true;
				}
				oFormV.addContent(new sap.m.Label({
					text: e.calidad
				}));
				o += e.total;
				oFormV.addContent(new sap.m.Input({
					type: sap.m.InputType.Text,
					value: e.total.toFixed(2) + "%", ///IBA
					enabled: false
				}));
			});

			if (bCumple) {
				oFormV.addContent(new sap.m.Label({
					text: "Total",
					design: "Bold"
				}));
				oFormV.addContent(new sap.m.Input({
					type: sap.m.InputType.Text,
					value: Number(o.toFixed()) + "%",
					enabled: false,
					valueState: sap.ui.core.ValueState.None
				}));
			} else {
				oFormV.addContent(new sap.m.Label({
					text: "Total",
					design: "Bold"
				}));
				oFormV.addContent(new sap.m.Input({
					type: sap.m.InputType.Text,
					value: Number(o.toFixed()) + "%",
					enabled: false,
					valueState: sap.ui.core.ValueState.None
				}));
				this.bValidaCumple = false;
			}

		},

		/*disableCreate: function () {
			var btnCrear = sap.ui.getCore().byId("crear");
			var mensaje = sap.ui.getCore().byId("msg");
			if (!this.bValidaCumple) {
				btnCrear.setEnabled(false);
				mensaje.setVisible(true);
			} else {
				btnCrear.setEnabled(true);
				mensaje.setVisible(false);
			}
		},*/

		clearHeader: function () {
			var cCodigo = this.getView().byId("CodigoMezcla");
			var cDescrip = this.getView().byId("Descripcion");
			var cNmezcla = this.getView().byId("NMezcla");
			var cCantidad = this.getView().byId("Cantidad");
			var cBodega = this.getView().byId("Centro");
			var cCosecha = this.getView().byId("Cosecha");
			var cCalidad = this.getView().byId("Calidad");
			var cFamilia = this.getView().byId("Familia");
			var cColor = this.getView().byId("Color");
			var cDO = this.getView().byId("DO");
			var cGrado = this.getView().byId("Grado");
			var cAzucar = this.getView().byId("Azucar");

			cCodigo.setValue("");
			cDescrip.setValue("");
			cNmezcla.setValue("");
			cCantidad.setValue("");
			cBodega.setValue("");
			cCosecha.setValue("");
			cCalidad.setValue("");
			cFamilia.setValue("");
			cColor.setValue("");
			cDO.setValue("");
			cGrado.setValue("");
			cAzucar.setValue("");
		},

		clearTables: function () {
			var table1 = this.getView().byId("componentes");
			var table2 = this.getView().byId("analisis");
			table1.removeAllItems();
			table2.removeAllItems();
		},

		clearAll: function () {
			this.clearHeader();
			this.clearTables();
		},

		//Fecha actual
		fecha: function () {
			var date;
			var now = new Date();
			date.setDateValue(now);
			date.setMinDate(now);
		},

		onSave: function (oEvent) {
			var vCodigoMezcla = this.getView().byId("CodigoMezcla").getValue();
			var vNMezcla = this.getView().byId("NMezcla").getValue();
			var vCantidad = this.getView().byId("Cantidad").getValue().split(".").join("").split(",").join(".");
			var vBodega = this.getView().byId("Centro").getSelectedKey();
			var vCosecha = this.getView().byId("Cosecha").getValue();
			var vCalidad = this.getView().byId("Calidad").getValue();
			var vColor = this.getView().byId("Color").getValue();
			var vGrado = this.getView().byId("Grado").getValue().split(",").join(".");
			var vAzucar = this.getView().byId("Azucar").getValue().split(",").join(".");

			//TABLAS CABECERA
			var oTable1 = $.valle;
			var oTable2 = $.cepa;
			var oTable3 = $.restric;

			//TABLAS POSICION
			var oTable4 = gThis.getView().byId("componentes");
			var oTable5 = gThis.getView().byId("analisis");
			var vFilas4 = oTable4.getItems();
			var vFilas5 = oTable5.getItems();

			//TABLAS RESULTADOS
			/*var oTable6 = sap.ui.getCore().byId("variedadTable");
			var oTable7 = sap.ui.getCore().byId("cosechaTable");
			var oTable8 = sap.ui.getCore().byId("denomOrigen");
			var vFilas6 = oTable6.getItems();
			var vFilas7 = oTable7.getItems();
			var vFilas8 = oTable8.getItems();*/

			//TABLA VALLE
			var valleTable = [];
			oTable1.forEach(function (i) {
				valleTable.push({
					Matnr: vCodigoMezcla,
					Werks: vBodega,
					Quantity: vCantidad,
					Valle: i.ValueChar,
					Valor: i.Value
				});
			});

			//TABLA CEPA
			var cepaTable = [];
			oTable2.forEach(function (i) {
				cepaTable.push({
					Matnr: vCodigoMezcla,
					Werks: vBodega,
					Quantity: vCantidad,
					Cepa: i.ValueChar,
					Valor: i.Value
				});
			});

			//TABLA RESTRICCIONES
			var restricTable = [];
			oTable3.forEach(function (i) {
				restricTable.push({
					Matnr: vCodigoMezcla,
					Werks: vBodega,
					Quantity: vCantidad,
					Restric: i.CharactDescr,
					Valor: i.ValueChar
				});
			});

			//TABLA COMPONENTES
			var componenteTable = [];
			vFilas4.forEach(function (entry) {
				if (entry.getCells()[0].getMetadata().getName() === "sap.m.Input") {
					componenteTable.push({
						Matnr: vCodigoMezcla,
						Werks: vBodega,
						Quantity: vCantidad,
						Component: entry.getCells()[2].getText(),
						CompQty: entry.getCells()[8].getValue(),
						Porcentaje: entry.getCells()[11].getText(),
						Calidad: entry.getCells()[4].getText(),
						Variedad: entry.getCells()[5].getText(),
						DenomOrigen: entry.getCells()[6].getText(),
						Cosecha: entry.getCells()[7].getText()
					});
				}
			});

			//TABLA QUIMICOS
			var analisisTable = [];
			vFilas5.forEach(function (entry) {
				if (entry.getCells()[3].getMetadata().getName() === "sap.m.Input") {
					analisisTable.push({
						Matnr: vCodigoMezcla,
						Werks: vBodega,
						Quantity: vCantidad,
						AqA: entry.getCells()[3].getValue(),
						AqAt: entry.getCells()[4].getValue(),
						AqAv: entry.getCells()[5].getValue(),
						AqSo2l: entry.getCells()[6].getValue(),
						AqSo2t: entry.getCells()[7].getValue(),
						AqMr: entry.getCells()[8].getValue(),
						AqPh: entry.getCells()[9].getValue(),
						AqColor: entry.getCells()[10].getValue()
					});
				}
			});

			//TABLA COSTOS
			var cPonderdo = sap.ui.getCore().byId("rponderado");
			var cPrecioMezcla = sap.ui.getCore().byId("rmezcla");
			var cMezclaMosto = sap.ui.getCore().byId("rmosto");
			var cTeorico = sap.ui.getCore().byId("rteorico");
			var vPonderado = cPonderdo.getValue();
			var vPrecioMezcla = cPrecioMezcla.getValue();
			var vMezclaMosto = cMezclaMosto.getValue();
			var vTeorico = cTeorico.getValue();
			var Nav_Cost = [];
			Nav_Cost.push({
				Matnr: vCodigoMezcla,
				Werks: vBodega,
				Quantity: vCantidad,
				Ponderado: vPonderado,
				Mezcla: vPrecioMezcla,
				Mosto: vMezclaMosto,
				Teorico: vTeorico
			});

			//TABLA VARIEDAD
			var v = 0;
			var Nav_Vari = [];
			do {
				Nav_Vari.push({
					Matnr: vCodigoMezcla,
					Werks: vBodega,
					Quantity: vCantidad,
					Variedad: sap.ui.getCore().byId("rvariedadForm").getContent()[v].getText(),
					Valor: sap.ui.getCore().byId("rvariedadForm").getContent()[v + 1].getValue().substring(0, "valor".length - 1)
				});
				v = v + 2;
			} while (v < sap.ui.getCore().byId("rvariedadForm").getContent().length - 2);

			/*var Nav_Vari = [];
			vFilas6.forEach(function (entry) {
				Nav_Vari.push({
					Matnr: vCodigoMezcla,
					Werks: vBodega,
					Quantity: vCantidad,
					Variedad: entry.getCells()[0].getText(),
					Valor: entry.getCells()[1].getText()
				});
			});*/

			//TABLA COSECHA
			var c = 0;
			var Nav_Cose = [];
			do {
				Nav_Cose.push({
					Matnr: vCodigoMezcla,
					Werks: vBodega,
					Quantity: vCantidad,
					Cosecha: sap.ui.getCore().byId("rcosechaForm").getContent()[c].getText(),
					Valor: sap.ui.getCore().byId("rcosechaForm").getContent()[c + 1].getValue().substring(0, "valor".length - 1)
				});
				c = c + 2;
			} while (c < sap.ui.getCore().byId("rcosechaForm").getContent().length - 2);

			/*var Nav_Cose = [];
			vFilas7.forEach(function (entry) {
				Nav_Cose.push({
					Matnr: vCodigoMezcla,
					Werks: vBodega,
					Quantity: vCantidad,
					Cosecha: entry.getCells()[0].getText(),
					Valor: entry.getCells()[1].getText()
				});
			});*/

			//TABLA DO
			var o = 0;
			var Nav_Do = [];
			do {
				Nav_Do.push({
					Matnr: vCodigoMezcla,
					Werks: vBodega,
					Quantity: vCantidad,
					Origen: sap.ui.getCore().byId("rorigenForm").getContent()[o].getText(),
					Valor: sap.ui.getCore().byId("rorigenForm").getContent()[o + 1].getValue().substring(0, "valor".length - 1)
				});
				o = o + 2;
			} while (o < sap.ui.getCore().byId("rorigenForm").getContent().length - 2);
			/*var Nav_Do = [];
			vFilas8.forEach(function (entry) {
				Nav_Do.push({
					Matnr: vCodigoMezcla,
					Werks: vBodega,
					Quantity: vCantidad,
					Origen: entry.getCells()[2].getText(),
					Valor: entry.getCells()[6].getText()
				});
			});*/

			//TABLA CALIDAD
			var i = 0;
			var Nav_Cali = [];
			do {
				Nav_Cali.push({
					Matnr: vCodigoMezcla,
					Werks: vBodega,
					Quantity: vCantidad,
					Calidad: sap.ui.getCore().byId("rcalidadForm").getContent()[i].getText(),
					Valor: sap.ui.getCore().byId("rcalidadForm").getContent()[i + 1].getValue().substring(0, "valor".length - 1)
				});
				i = i + 2;
			} while (i < sap.ui.getCore().byId("rcalidadForm").getContent().length - 2);

			var oModel = this.getOwnerComponent().getModel("dos");
			var oModel1 = this.getOwnerComponent().getModel("tres");

			var oData1 = {
				Matnr: vCodigoMezcla,
				Werks: vBodega,
				Quantity: vCantidad,
				Nmezcla: vNMezcla,
				Cosecha: vCosecha,
				Calidad: vCalidad,
				Color: vColor,
				Grado: vGrado,
				NivelAzucar: vAzucar,
				ValidFrom: "",
				Message: "",
				Nav_Valle: valleTable,
				Nav_Cepa: cepaTable,
				Nav_Rest: restricTable,
				Nav_Comp: componenteTable,
				Nav_Quim: analisisTable,
				Nav_Cost: Nav_Cost,
				Nav_Vari: Nav_Vari,
				Nav_Cose: Nav_Cose,
				Nav_Do: Nav_Do,
				Nav_Cali: Nav_Cali
			};

			var oData2 = {
				IAction: "",
				IMatnr: vCodigoMezcla,
				IPlnum: "",
				ITotalPlordQty: vCantidad,
				IWerks: vBodega,
				EPlannedorder: "",
				Plnum: ""
			};

			sap.ui.core.BusyIndicator.show();
			oModel.create("/CabeceraSet", oData1, {
				success: function (Respuesta) {
					/*sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.success("¡La Mezcla ha sido Creada!", { //VARIABLE DE RETORNO
						title: "Confirmación",
						onClose: function () {
							location.reload(true);
							//gThis.editStepOne();
							//gThis.clearAll();
						},
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});*/
					oModel1.create("/OredenPreviosionalSet", oData2, {
						success: function (Response) {
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageBox.success("¡Mezcla N° " + Response.Plnum + " ha sido Creada!", { //VARIABLE DE RETORNO
								title: "Confirmación",
								onClose: function () {
									location.reload(true);
								},
								styleClass: "",
								initialFocus: null,
								textDirection: sap.ui.core.TextDirection.Inherit
							});

						}.bind(this),
						error: function () {
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageBox.error("¡Error al Crear Simulación!", {
								title: "Error",
								onClose: null,
								styleClass: "",
								initialFocus: null,
								textDirection: sap.ui.core.TextDirection.Inherit
							});
						}.bind(this)
					});
				}.bind(this),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error("Error al Crear Simulación: Verificar Valores", {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				}.bind(this)
			});

		}

	});
});