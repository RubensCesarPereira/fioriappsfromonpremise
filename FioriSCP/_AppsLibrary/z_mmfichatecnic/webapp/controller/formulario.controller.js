sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/layout/VerticalLayout",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/ui/model/Filter",
	"z_mmfichatecnic/view/utils/connectivity",
	"z_mmfichatecnic/js/util"
	], function(BaseController, JSONModel, MessageToast, MessageBox, Dialog, HorizontalLayout, VerticalLayout, Button, ButtonType, Filter) {
	"use strict";

	return BaseController.extend("z_mmfichatecnic.controller.formulario", {
		onInit : function() {	
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("ficha").attachMatched(this._onRouteFound, this);
			var oInputDesc = this.byId('top-layout');
			oInputDesc.addEventDelegate({
				onAfterRendering: function(){
					oInputDesc.focus();        
				}
			});
		},
		_onRouteFound: function(oEvent){
			var oArgs = oEvent.getParameter("arguments");
			this.setDataToForm(oArgs.id);
			this.getInitInfo();
			this.configView();
		},
		onSave:function(){
			var that = this;
			var _oData = this.getView().getModel().oData;
			delete _oData.__metadata;
			delete _oData.STATUS;
			delete _oData.MESSAGE;
			var url = serviceUrl;
			var oModel = new sap.ui.model.odata.ODataModel(url,true);
			oModel.update("/DetalleFichaTecnicaSet(MATNR='"+_oData.MATNR+"')", this.modifDataToSend(_oData), {
				method: "PUT",
				success: function(data) {
					MessageToast.show("FTE fue modificada.");
					that.onNavBack();
				},
				error: function(e) {
					console.log('ERROOOOR!!!!!');
					console.log(e);
					MessageBox.error(e.message);
				}
			});
		},
		onFinishPress:function(){
			var prfl = this.getModel('CONF').getProperty('/LVL');
			
			if(prfl === 'ENO'){
				if(!this.onValidateFormEno()){
					MessageBox.warning('Se deben ingresar todo los datos del formulario para finalizar!');
					return;
				}
			}
			else if(prfl === 'LAB'){
				if(!this.onValidateFormLab()){
					MessageBox.warning('Se deben ingresar todo los datos del formulario para finalizar!');
					return;
				}
			}else{
				return;
			}
			var that = this;
			var dialog = new sap.m.Dialog({
				title: '',
				showHeader : false,
				type: 'Message',
				content: [
					new sap.m.Label({ text: 'Finalizar ficha y enviar a aprobación?'})
					],
					beginButton: new sap.m.Button({
						text: 'Confirmar',
						type: 'Accept',
						press: function (evt) {
							that.finish();
							dialog.close();
						}
					}),
					endButton: new sap.m.Button({
						text: 'Cancel',
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function(evt) {
						dialog.destroy();
					}
			}).addStyleClass('sapUiSizeCompact');
			dialog.open();
		},
		finish: function(){
			var that = this;
			var _oData = this.getView().getModel().oData;
			delete _oData.__metadata;
			delete _oData.STATUS;
			delete _oData.MESSAGE;
			_oData.FINALIZAR = 'X';
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
			oModel.update("/DetalleFichaTecnicaSet(MATNR='"+_oData.MATNR+"')", this.modifDataToSend(_oData), {
				method: "PUT",
				success: function(data) {
					that.onNavBack();
				},
				error: function(e) {
					console.log(e);
					MessageBox.error(e.message);
				}
			});
		},
		onNavBack:function(oEvent){
			var mode = this.getModel('CONF').getProperty('/MODE');
			if(mode === 'HIS'){
				this.getRouter().navTo("listadoant");
			}else if(mode === 'PEN'){
				this.getRouter().navTo("listado");
			}else if(mode === 'ADM'){
				this.getRouter().navTo("listadoadm");
			}else{
				this.getRouter().navTo("menu");
			}
		},
		sinoAp1:function(oEvent){
			var bSelected = oEvent.getParameter('selected');
			if(bSelected)
				this.getView().byId("sn1").setEnabled(false);
			else
				this.getView().byId("sn1").setEnabled(true);
		},
		accionSn9:function(oEvent){
//			var bSelected = oEvent.getSource().getState();
			var bSelected = this.byId('sn9').getState();
			if(bSelected){
				this.byId("inputAlergenos").setEditable(true);
			}else{
				this.byId("inputAlergenos").setEditable(false);
				this.byId("inputAlergenos").setValue("");
			}
		},
		modifDataToSend: function(data){
			var _data = data;
			//VINNEDO
			_data.SUPERFICIE = this.byId('superficie').getValue();
			_data.ANNO_PLANTACION_DESDE = this.byId('anoplandesde').getValue()+'';
			_data.ANNO_PLANTACION_HASTA = this.byId('anoplanhasta').getValue()+'';
			_data.CONDUCCION_ES = this.onFormatText(this.byId('conduccion_es').getValue());
			_data.CONDUCCION_EN = this.onFormatText(this.byId('conduccion_en').getValue());
			_data.PORCENTAJE_COSECHA_MECANICA = this.byId('slider-meca').getValue()+'';
			_data.PORCENTAJE_COSECHA_MANUAL = this.byId('slider-manu').getValue()+'';
			_data.ORIGEN_CARAC_SUELO_ES = this.onFormatText(this.byId('origsue_es').getValue());
			_data.ORIGEN_CARAC_SUELO_EN = this.onFormatText(this.byId('origsue_en').getValue());
			_data.CLASIFICACION_CLIMATICA_ES = this.onFormatText(this.byId('clasclim_es').getValue());
			_data.CLASIFICACION_CLIMATICA_EN = this.onFormatText(this.byId('clasclim_en').getValue());
			_data.COMENTARIO_CLIMA_TEMPORADA_ES = this.onFormatText(this.byId('comclimtemes_es').getValue());
			_data.COMENTARIO_CLIMA_TEMPORADA_EN = this.onFormatText(this.byId('comclimtemes_en').getValue());
			//PROCESO FERMENTATIVO
			_data.TIPO_VASIJA_FERMENTACION = this.byId('selectVasija').getSelectedKeys().join('-');
			_data.DURACION_FERMENTACION = this.byId('durferm').getValue()+'';
			_data.TEMPERATURA_FERMENTACION_DESDE = this.byId('tempfermdesde').getValue()+''; 
			_data.TEMPERATURA_FERMENTACION_HASTA = this.byId('tempfermhasta').getValue()+'';
			_data.USO_LEVADURA = this.byId('select_usolevadura').getSelectedKey();
			//GUARDA EN ESTANQUES
			_data.TIPO_ESTANQUE = this.byId('selectEstanq').getSelectedKeys().join('-');
			_data.TIEMPO_GUARDA_ESTANQUE = this.byId('tiempoGuardaEstq').getValue()+'';
			if(!this.byId('ch1').getSelected()){
				_data.USO_MADERA = this.byId('sn1').getState() ? 'SI' : 'NO';
			}else{
				_data.USO_MADERA = 'NA';
			}
			//GUARDA EN BARRICAS O FUDRES
			_data.TIPO_VASIJA_BARRICA = this.byId('selectBarrica').getSelectedKeys().join('-');
			_data.TIEMPO_GUARDA_BARRICA = this.byId('tiempoGuardBarr').getValue()+'';
			_data.PORCENTAJE_VINO_BARRICA = this.byId('slider-barr').getValue()+'';
			_data.PORCENTAJE_VINO_FUDRE = this.byId('slider-fudr').getValue()+'';
			_data.ORIGEN_MADERA_AMERICANO = this.byId('slider-amer').getValue()+'';
			_data.ORIGEN_MADERA_FRANCES = this.byId('slider-fran').getValue()+'';
			_data.PORCENTAJE_VINO_MADERA = this.byId('slider-mad').getValue()+'';
			//ESTABILIZACION
			_data.ESTABILIZACION_PROTEICA = this.byId('sn2').getState() ? 'X' : '';
			_data.ESTABILIZACION_TARTARICA_FRIO = this.byId('sn3').getState() ? 'X' : '';
			_data.ESTABILIZACION_TARTARICA_ADIT = this.byId('selectAditivos').getSelectedKeys().join('-');
			_data.ESTABILIZACION_TARTARICA_NATU = this.byId('sn5').getState() ? 'X' : '';
			//ENVASADO
			/*FECHA_ENVASADO_DESDE*/
			/*FECHA_ENVASADO_HASTA*/
			_data.GUARDA_BOTELLA = this.byId('sn10').getState() ? 'X' : '';
			_data.TIEMPO_GUARDA_BOTELLA = this.byId('tiempoGuarBot').getSelectedKey();
			/*FECHA_APROX_LIB_MERCADO_DESDE*/
			//PARÂMETROS ANALITICOS
			/**/
			/**/
			/**/
			/**/
			/**/
			/**/
			/**/
			//OTROS
			_data.APTO_VEGETARIANOS = this.byId('sn6').getState() ? 'X' : '';
			_data.APTO_VEGANOS = this.byId('sn7').getState() ? 'X' : '';
			_data.SULFITOS = this.byId('sn8').getState() ? 'X' : '';
			_data.ALERGENOS = this.byId('sn9').getState() ? 'X' : '';
			//NOTAS DE CATA
			_data.NOTA_CATA_COLOR_ES = this.onFormatText(this.byId('nota-color-es').getValue());
			_data.NOTA_CATA_COLOR_EN = this.onFormatText(this.byId('nota-color-en').getValue());
			_data.NOTA_CATA_AROMA_ES = this.onFormatText(this.byId('nota-aroma-es').getValue());
			_data.NOTA_CATA_AROMA_EN = this.onFormatText(this.byId('nota-aroma-en').getValue());
			_data.NOTA_CATA_SABOR_ES = this.onFormatText(this.byId('nota-sabor-es').getValue());
			_data.NOTA_CATA_SABOR_EN = this.onFormatText(this.byId('nota-sabor-en').getValue());
			_data.NOTA_CATA_TEMP_IDEAL_CONSUMO = this.byId('slider-temp-cons').getValue()+'';
			_data.RECOMENDACION_MARIDAJE_ES = this.onFormatText(this.byId('nota-mari-es').getValue());
			_data.RECOMENDACION_MARIDAJE_EN = this.onFormatText(this.byId('nota-mari-en').getValue());
			//CONSUMO SUGERIDO DE ACUERDO  A NUESTRA EXPERIENCIA
			_data.CONSUMO_MESES_FECHA_ENVASADO = this.byId('consumoEnv').getSelectedKey();
			/////
			return _data;
		},
		setDataToForm: function(id){
			var url = serviceUrl;
			var oModel = new sap.ui.model.odata.ODataModel(url,true);
			var oView = this.getView();
			var that = this;
			oView.setBusy(true);
			oModel.read("/DetalleFichaTecnicaSet('"+id+"')", null, [""], true,
					function(data, response) {
				oView.setBusy(false);
				//edit
				var _data = data;
				var fichaMod = new JSONModel(_data);
				that.getView().setModel(fichaMod);
				that.accionSn9();

			}, function(err) {
				oView.setBusy(false);
				var errTxt = err.message + "\n";
				sap.m.MessageBox.show(errTxt, sap.m.MessageBox.Icon.ERROR, "Error en la llamada al servicio");
			});	
		},
		configView: function(){
			var sMode = this.getModel('CONF').getProperty('/MODE');
			this.getModel('CONF').setProperty('/E',false);
			this.getModel('CONF').setProperty('/L',false);
			this.getModel('CONF').setProperty('/A',false);
			this.byId('btn-sv-mod').setVisible(false);
			this.byId('btn-ff-mod').setVisible(false);
			this.byId('btn-cc-mod').setVisible(false);
			this.byId('btn-ap-adm').setVisible(false);
			this.byId('btn-rj-adm').setVisible(false);
			this.byId('btn-sr-adm').setVisible(false);
			if(sMode === 'PEN'){
				if(this.getModel('CONF').getProperty('/LVL') === 'ENO'){
					this.getModel('CONF').setProperty('/E',true);
					this.byId('btn-sv-mod').setVisible(true);
					this.byId('btn-ff-mod').setVisible(true);
					this.byId('btn-cc-mod').setVisible(true);
				}else if(this.getModel('CONF').getProperty('/LVL') === 'LAB'){
					this.getModel('CONF').setProperty('/L',true);
					this.byId('btn-sv-mod').setVisible(true);
					this.byId('btn-ff-mod').setVisible(true);
					this.byId('btn-cc-mod').setVisible(true);	
				}else if(this.getModel('CONF').getProperty('/LVL') === 'ADM'){
					this.byId('btn-ap-adm').setVisible(true);
					this.byId('btn-rj-adm').setVisible(true);
					this.byId('btn-sr-adm').setVisible(true);
					this.byId('btn-cc-mod').setVisible(true);
				}else if(this.getModel('CONF').getProperty('/LVL') === 'CMC'){

				}else{
					this.getRouter().navTo("menu");
				}
			}
		},
		onSliderLiveChangeMeca: function(evt){
			var value = evt.getSource().getValue();
			this.byId('slider-manu').setValue(100-value);
			this.byId('slider-meca-lbl').setText(value + "% Mecánica");
			this.byId('slider-manu-lbl').setText(100-value + "% Manual");

		},
		onSliderLiveChangeManu: function(evt){
			var value = evt.getSource().getValue();
			this.byId('slider-meca').setValue(100-value);
			this.byId('slider-meca-lbl').setText(100-value + "% Mecánica");
			this.byId('slider-manu-lbl').setText(value + "% Manual");

		},
		onSliderLiveChangeFudr: function(evt){
			var value = evt.getSource().getValue();
			this.byId('slider-barr').setValue(100-value);
			this.byId('slider-fudr-lbl').setText(value + "% Fudre");
			this.byId('slider-barr-lbl').setText(100-value + "% Barrica");

		},
		onSliderLiveChangeBarr: function(evt){
			var value = evt.getSource().getValue();
			this.byId('slider-fudr').setValue(100-value);
			this.byId('slider-fudr-lbl').setText(100-value + "% Fudre");
			this.byId('slider-barr-lbl').setText(value + "% Barrica");

		},
		onSliderLiveChangeFran: function(evt){
			var value = evt.getSource().getValue();
			this.byId('slider-amer').setValue(100-value);
			this.byId('slider-fran-lbl').setText(value + "% Francés");
			this.byId('slider-amer-lbl').setText(100-value + "% Americano");

		},
		onSliderLiveChangeAmer: function(evt){
			var value = evt.getSource().getValue();
			this.byId('slider-fran').setValue(100-value);
			this.byId('slider-fran-lbl').setText(100-value + "% Francés");
			this.byId('slider-amer-lbl').setText(value + "% Americano");

		},
		onSliderLiveChangeMad: function(evt){
			var value = evt.getSource().getValue();
			this.byId('slider-mad-lbl').setText(value + "% Madera Nueva");

		},
		onSliderLiveChangeTempIdeal: function(evt){
			var value = evt.getSource().getValue();
			this.byId('slider-temp-cons-lbl').setText(value + " °C");
		},
		onApprovePress: function(){	
			var that = this;
			var dialog = new sap.m.Dialog({
				title: '',
				showHeader : false,
				type: 'Message',
				content: [
					new sap.m.Label({ text: 'Esta seguro que quiere aprobar la ficha?'})
					],
					beginButton: new sap.m.Button({
						text: 'Confirmar',
						type: 'Accept',
						press: function (evt) {
							that.approve();
							dialog.close();
						}
					}),
					endButton: new sap.m.Button({
						text: 'Cancel',
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function(evt) {
						dialog.destroy();
					}
			}).addStyleClass('sapUiSizeCompact');
			dialog.open();
		},
		approve: function(){
			var that = this;
			var data = this.getView().getModel().oData;
			var _oData = new Object();
			_oData.MOTIVO = '';
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
			oModel.update("/AprobarSet(MATNR='"+data.MATNR+"',ESTADO='05',SUBESTADO='"+data.SUBESTADO+"')",_oData, {
				method: "PUT",
				success: function(data) {
					MessageToast.show("FTE fue modificada.");
					that.onNavBack();
				},
				error: function(e) {
					MessageToast.show(e.message);
				}
			});
		},
		onRejectPress: function(){
			var that = this;
			var dialog = new sap.m.Dialog({
				title: '',
				showHeader : false,
				type: 'Message',
				content: [
					new sap.m.Label({ text: 'Esta seguro que quiere anular la ficha?', labelFor: 'rejectDialogTextarea'}),
					new sap.m.TextArea('rejectDialogTextarea', {
						width: '100%',
						placeholder: 'Añadir Motivo'
					})
					],
					beginButton: new sap.m.Button('confirmButton',{
						text: 'Confirmar',
						type: 'Accept',
						press: function (evt) {
							var sText = sap.ui.getCore().byId('rejectDialogTextarea').getValue();
							if(sText.trim().length > 1){
								that.reject(sText);
								dialog.close();
							}else{
								MessageBox.alert('Debe ingresar un motivo!');
							}
						}
					}),
					endButton: new sap.m.Button({
						text: 'Cancel',
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function(evt) {
						dialog.destroy();
					}
			}).addStyleClass('sapUiSizeCompact');
			dialog.open();
		},
		reject: function(sMotiv){
			var that = this;
			var data = this.getView().getModel().oData;
			var _oData = new Object();
			_oData.MOTIVO = sMotiv;
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
			oModel.update("/AprobarSet(MATNR='"+data.MATNR+"',ESTADO='04',SUBESTADO='"+data.SUBESTADO+"')",_oData, {
				method: "PUT",
				success: function(data) {
					MessageToast.show("FTE fue anulada.");
					that.onNavBack();
				},
				error: function(e) {
					MessageToast.show(e.message);
				}
			});
		},
		onRequestPress: function(){
			var that = this;
			var dialog = new sap.m.Dialog({
				title: '',
				showHeader : false,
				type: 'Message',
				content: [
					new sap.m.Label({ text: 'Enviar ficha a revisión?', labelFor: 'rejectDialogTextarea'}),
					new sap.m.TextArea('rejectDialogTextarea', {
						width: '100%',
						placeholder: 'Añadir Motivo'
					}),new sap.m.RadioButtonGroup('radio-button-group',{
						columns: 2,
						buttons: [
							new sap.m.RadioButton({
								text: 'Enologo'
							}),
							new sap.m.RadioButton({
								text: 'Laboratorio'
							})]
					})
					],
					beginButton: new sap.m.Button('confirmButton',{
						text: 'Confirmar',
						type: 'Accept',
						press: function (evt) {
							var sText = sap.ui.getCore().byId('rejectDialogTextarea').getValue();
							var iRb = sap.ui.getCore().byId('radio-button-group').getSelectedIndex();
							if(sText.trim().length > 1){
								that.checkRequest(sText,iRb);
								dialog.close();
							}else{
								MessageBox.alert('Debe ingresar un motivo!');
							}
						}
					}),
					endButton: new sap.m.Button({
						text: 'Cancel',
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function(evt) {
						dialog.destroy();
					}
			}).addStyleClass('sapUiSizeCompact');
			dialog.open();
		},
		checkRequest: function(sMotiv,iRb){
			var that = this; 
			var data = this.getView().getModel().oData;
			var _oData = new Object();
			var se = '';
			if(iRb === 0){
				se = 'ENO';
			}else if(iRb === 1){
				se = 'LAB';
			}
			_oData.MOTIVO = sMotiv;
			var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
			oModel.update("/AprobarSet(MATNR='"+data.MATNR+"',ESTADO='02',SUBESTADO='"+se+"')",_oData, {
				method: "PUT",
				success: function(data) {
					MessageToast.show("FTE fue enviada a revisión.");
					that.onNavBack();
				},
				error: function(e) {
					MessageToast.show(e.message);
				}
			});
		},
		onValidateFormEno: function(){
			var ids = ['vinedo-pro','superficie','anoplandesde','anoplanhasta','conduccion_es',
				'conduccion_en','origsue_es','origsue_en','clasclim_es','clasclim_en',
				'comclimtemes_es','comclimtemes_en','selectVasija','durferm','tempfermdesde','tempfermhasta',
				'select_usolevadura','selectEstanq','tiempoGuardaEstq','selectBarrica','tiempoGuardBarr','tiempoGuarBot','nota-color-es','nota-color-en','nota-aroma-es',
				'nota-aroma-en','nota-sabor-es','nota-sabor-en','nota-mari-es','nota-mari-en','consumoEnv'];
			var that = this;
			var state = true;
			ids.forEach(function(id){
				if(!state){
					return state;
				}
				var element = that.byId(id);
				switch(element.getMetadata()._sClassName){
				case 'sap.m.Input':
					if(element.getValue().length < 1){
						element.setValueState('Error');
						element.setValueStateText('Ingrese algún valor para el campo!');
						element.focus();
						state = false;
					}else{
						element.setValueState('None');
					}
					break;
				case 'sap.m.TextArea':
					if(element.getValue().length < 1){
						element.setValueState('Error');
						element.setValueStateText('Ingrese algún valor para el campo!');
						element.focus();
						state = false;
					}else{
						element.setValueState('None');
					}
					break;
				case 'sap.m.Select':
					if(element.getSelectedIndex() === -1){
						element.setValueState('Error');
						element.setValueStateText('Seleccione alguna opción!');
						element.focus();
						state = false;
					}else{
						element.setValueState('None');
					}
					break;
				case 'sap.m.MultiComboBox':
//					console.log("ELEMENTO DEBUGG");
//					console.log(id);
//					console.log("LENGTH: "+element.getSelectedItems().length);
					if(element.getSelectedItems().length === 0){
//						console.log('dio error...');
						element.setValueState('Error');
						element.setValueStateText('Tiene que seleccionar algun valor');
						element.focus();
						state = false;
					}else{
//						console.log('no dio error...');
						element.setValueState('None');
					}
					break;
				case 'sap.m.StepInput':
					if(element.getValue() === 0){
						element.setValueState('Error');
						element.setValueStateText('Tiene que seleccionar algun valor');
						element.focus();
						state = false;
					}else{
						element.setValueState('None');
					}
					break
				}

			});
			if(this.byId('sn9').getState() && this.byId('inputAlergenos').getValue().length < 1){
				this.byId('inputAlergenos').setValueState('Error');
				this.byId('inputAlergenos').setValueStateText('Ingrese un valor o deseleccione casilla anterior!');
				this.byId('inputAlergenos').focus();
				state = false;
			}else{
				this.byId('inputAlergenos').setValueState('None');
			}
			return state;
		},
		onValidateFormLab: function(){
			var that = this;
			var state = true;
			var ids = ['bben','alcohol','azu-red','acid-total','ph-ph','acid-vila','presion'];
			ids.forEach(function(id){
				var element = that.byId(id);
				if(element.getValue().length < 1){
					element.setValueState('Error');
					element.setValueStateText('Ingrese algún valor para el campo!');
					element.focus();
					state = false;
				}else{
					element.setValueState('None');
				}
			});
			return state;
		},
		onFormatText: function(text){
			var sFtext = '';
			var maxL = 132;
			for(var i = 0 ; i < text.length ; i=i+maxL){
				sFtext = sFtext + text.substring(i,i + maxL) + '\n';
			}
			return sFtext;
			
		}
	});
});