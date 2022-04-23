var gruposSelec = "";
var gruposSelec2 = "";

var orgSelec = "";
var orgSelec2 = "";

var sourceGC1 = "";
var sourceGC2 = "";

sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/TablePersoController",
    "sap/m/TablePersoDialog",
    "./utilities",
    "./Blob",
    "./xlsx.full.min",    
    "./Formatter",    
    "./FileSaver",
    "sap/ui/core/util/Export", 
    "sap/ui/core/util/ExportTypeCSV",
    "sap/ui/core/routing/History"
    ], function(BaseController, MessageBox, Utilities, History) {
    "use strict";

    return BaseController.extend("com.sap.build.standard.ztestcap.controller.Page1", {
    handleRouteMatched: function (oEvent) {
            		
		var oParams = {}; 
		
		if (oEvent.mParameters.data.context) { 
		    this.sContext = oEvent.mParameters.data.context;
		    var oPath; 
		    if (this.sContext) { 
		        oPath = {path: "/" + this.sContext, parameters: oParams}; 
		        this.getView().bindObject(oPath);
		    } 
		}
		
		
		
        },
        
 /** ************ Setea OData a la vista *********** */
        
setModel:  function(oData, view, nombreModelo){
	
	var jsonList = new sap.ui.model.json.JSONModel();
	jsonList.setData(oData);
	view.setModel(jsonList, nombreModelo);
	
},


/** ************ Imprime json por consola luego de llamar a un OData *********** */

imprJson : function (oData){
	
	var str = JSON.stringify(oData);
	str = JSON.stringify(oData, null, 4); 			
	// console.log(">>>>>>>>>>>>>>>>>imprimiendo json>>>>>>>>>>>>>>>>>>>>>>>");
	// console.log(str);
	
},



busy: function() {
	var busyDialog = this.getView().byId("BusyDialog");
	busyDialog.open();
},

noBusy: function() {
	var busyDialog = this.getView().byId("BusyDialog");
	busyDialog.close();
},


onBeforeRendering: function() {

	// alert("cargo!");
	
	$("#__bar0-toolbar").hide();
	

},


carGrpCom : function () {
	
	  var view = this.getView();
	  var that = this;
	  
	   /**
		 * **********************************************OBTIENE ORGANIZACION
		 * COMPRA *******************
		 */
	  var sServiceUrlUD = "/FioriSCP.comsapbuildstandardztestcap/sap/opu/odata/sap/ZMM_ODATA_ELIB_SRV/";
	  var oModelUD = new sap.ui.model.odata.ODataModel(sServiceUrlUD, true);
	  var oModelJsonUD = new sap.ui.model.json.JSONModel();			  
	  oModelUD.read("ListGCSet?$filter=IEkgrp  eq 'X'", null, null, true, function(oData, response) {		
		  
			that.setModel(oData, view, "gcModel");
		  													
		},										
		function(oError) {						
			console.log(oError.response.body);
			var data = oError.response.body
			data = $.parseJSON(data);
			sap.m.MessageToast.show(data.error.message.value);
		}
		);

	
},


carOrgCom : function () {
	
	  var view = this.getView();
	  var that = this;
	  
	   /**
		 * **********************************************OBTIENE ORGANIZACION
		 * COMPRA *******************
		 */
	  var sServiceUrlUD = "/FioriSCP.comsapbuildstandardztestcap/sap/opu/odata/sap/ZMM_ODATA_ELIB_SRV/";
	  var oModelUD = new sap.ui.model.odata.ODataModel(sServiceUrlUD, true);
	  var oModelJsonUD = new sap.ui.model.json.JSONModel();			  
	  oModelUD.read("ListOCSet?$filter=IEkorg  eq 'X'", null, null, true, function(oData, response) {		
		  
			that.setModel(oData, view, "ocModel");
		  													
		},										
		function(oError) {						
			console.log(oError.response.body);
			var data = oError.response.body
			data = $.parseJSON(data);
			sap.m.MessageToast.show(data.error.message.value);
		}
		);

	
},

onFilter : function (oEvt) {
    var searchValue = oEvt.getSource().getValue().toUpperCase();
    var filters = [ 
    new sap.ui.model.Filter("Frggr", sap.ui.model.FilterOperator.Contains, searchValue),
    new sap.ui.model.Filter("Frgsx", sap.ui.model.FilterOperator.Contains, searchValue)
    ];  
    
    
    var oFilter = new sap.ui.model.Filter( filters, false );   	   
	this.getView().byId("idDetalleTable").getBinding("items").filter(oFilter);
	this.getView().byId("idDetalleTableFact").getBinding("items").filter(oFilter);
	this.getView().byId("idDetalleTableSP").getBinding("items").filter(oFilter);
	this.getView().byId("idDetalleTableHES").getBinding("items").filter(oFilter);
  },	
  
  
  
onValidaIngreso : function () {
	
	
	var view = this.getView();
	var that = this;
	
	
	if(view.byId("RB3-1").getSelected() == false && view.byId("RB3-2").getSelected() == false &&  view.byId("RB3-3").getSelected() == false && view.byId("RB3-4").getSelected() == false){		
		return false;		
	}else{
		return true;
	}
	
	
} ,



onValidaTipo : function () {
	
	
	var view = this.getView();
	var that = this;
	
	
	if(view.byId("RB3-1").getSelected() == false && view.byId("RB3-2").getSelected() == false &&  view.byId("RB3-3").getSelected() == false && view.byId("RB3-4").getSelected() == false){		
		return false;		
	}else{
		return true;
	}
	
	
} ,


onValidaSelect : function () {
	
	
	var view = this.getView();
	var that = this;
	
	if (view.byId("IEkgrp").getValue() == null || view.byId("IEkgrp").getValue() == ""){
		return false;
	}else{
		return true;
	}
	
	
} ,




onFilterA : function () {

	
// var _timeout;
	
	// _timeout = jQuery.sap.delayedCall(500, this, function () {
		
// });

	
	var view = this.getView();
	var that = this;	
	var selectAll = view.byId("RB3-10").getSelected();
	var selectPR = view.byId("RB3-11").getSelected();
	
	var flagFactura = view.byId("RB3-4").getSelected();
	
	
	if(!this.onValidaTipo()){
		sap.m.MessageToast.show("Debe Seleccionar un tipo de consulta");
		view.byId("RB3-1").setValueState("Error");
		view.byId("RB3-2").setValueState("Error");
		view.byId("RB3-3").setValueState("Error");
		view.byId("RB3-4").setValueState("Error");
	// view.byId("RB3-5").setValueState("Error");
		return;
	}else{
		view.byId("RB3-1").setValueState(null);
		view.byId("RB3-2").setValueState(null);
		view.byId("RB3-3").setValueState(null);
		view.byId("RB3-4").setValueState(null);
	// view.byId("RB3-5").setValueState(null);
	}
	
	if(!this.onValidaSelect()){
		
		if (selectAll == false && flagFactura == false ){
			sap.m.MessageToast.show("Debe Seleccionar un Grupo de Compra");
			view.byId("IEkgrp").setValueState("Error");
			return;
		}
	}else{
		view.byId("IEkgrp").setValueState(null);
	}
	
	
	this.busy();
	
	
	
	var sServiceUrl = "/FioriSCP.comsapbuildstandardztestcap/sap/opu/odata/sap/ZMM_ODATA_ELIB_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);			  

	

	
	var oc = view.byId("RB3-1").getSelected();
	var sp = view.byId("RB3-2").getSelected();
	var hes = view.byId("RB3-3").getSelected();
	var bf = view.byId("RB3-4").getSelected();
	
	var allselect = view.byId("RB3-10").getSelected();
	
	
	var IEkgrp = view.byId("IEkgrp").getValue();
	var IEkorg = view.byId("IEkorg").getSelectedKey();
	
	var IEkgrp2 = ""; //view.byId("IEkgrp2").getValue();
	var IEkorg2 = view.byId("IEkorg2").getSelectedKey();
	
	var iEkgrpArray = IEkgrp.split(",");
	
	
	
	if (selectPR == true &&  (IEkgrp == "" || iEkgrpArray.length <= 1  ) ){
		sap.m.MessageToast.show("Debe seleccionar más de un grupo de compra para consultar por rango");
		this.noBusy();
		return;
	}
	
	var iEkgrpArrayIni = iEkgrpArray[0];	
	var iEkgrpArrayFin = iEkgrpArray[iEkgrpArray.length-1];
	
	console.log("iEkgrpArrayIni: " + iEkgrpArrayIni );
	console.log("iEkgrpArrayFin: " + iEkgrpArrayFin );	

	
	// var IEkorg3 = view.byId("IEkorg3").getValue();
	// var IEkorg4 = view.byId("IEkorg4").getValue();
	
	// console.log("IEKORG3::: " + IEkorg3 + ":::IEKORG4: " + IEkorg4 );
	var grupos = gruposSelec + gruposSelec2;	
	var orgs   = orgSelec + orgSelec2;
	
	
	var gruposArray =  IEkgrp.split(",");
	
	if (gruposArray.length > 1 && allselect == false){
		
		
		
		var url = "ListM3Set?$filter=IGrupos  eq  '"+IEkgrp+"' and  IEkorgIni eq '"+IEkorg+"'   and  ";
		
		if(oc == true){
			url += "   IOc eq  'X'";
		}else if (sp == true){
			url += "   ISolped eq  'X'";
		}else if (hes == true){
			url += "   IHes eq  'X'";
		}else if (bf == true){
			url += "   IOc eq  'X'";
		}
				
		url += " and IIdioma eq 'S'"				
		
		if (bf == true){
			url = "ListFactMSet?$filter=IGrupos  eq '"+IEkgrp+"'   and  IEkorgIni eq '"+IEkorg+"' and  IEkorgFin eq '"+IEkorg2+"' and IIdioma eq 'S' and IFact eq 'X'"	}
		
	
	
		// cambiar URLs si viene por rango
		if(selectPR == true && bf == true){			
			url = "ListFactSet?$filter=IEkgrpIni  eq '"+iEkgrpArrayIni+"' and IEkgrpFin  eq '"+iEkgrpArrayFin+"' and  IEkorgIni eq '"+IEkorg+"' and IIdioma eq 'S' and IFact eq 'X'"			
		}else if (selectPR == true || selectAll == true){				
			
			 url = "List3Set?$filter=IEkgrpIni  eq  '"+iEkgrpArrayIni+"' and  IEkgrpFin  eq '"+iEkgrpArrayFin+"' and  IEkorgIni eq '"+IEkorg+"'     and IIdioma eq 'S' and ";
			 
				if(oc == true){
					url += "   IOc eq  'X'";
				}else if (sp == true){
					url += "   ISolped eq  'X'";
				}else if (hes == true){
					url += "   IHes eq  'X'";
				}else if (bf == true){
					url += "   IOc eq  'X'";
				}

		}
								
		
		console.log(">>>>>>>>>>URL>>>>>>>>>>>>>>URL>>>>>>>>>>>>>: " + url);
		
		oModel.read(url, null, null, true, function(oData, response) {													
			
			that.imprJson(oData);
			
			if (oData.results.length > 0){
				sap.m.MessageToast.show(oData.results.length + " Registros encontrados");
			}
			
			that.setModel(oData, view, "listModel");
							
			that.noBusy();	
							
		},										
		function(oError) {
			that.noBusy();
			console.log(oError.response.body);
			var data = oError.response.body
			data = $.parseJSON(data);
			sap.m.MessageToast.show(data.error.message.value);
		}
		);


		
	}else if (allselect == true){
		
		
		var url = "List3Set?$filter=IEkgrpIni  eq '001' and IEkgrpFin  eq 'Z999' and IEkorgIni eq '"+IEkorg+"'   and  IEkorgFin eq '"+IEkorg2+"'  and  ";
		
		if(oc == true){
			url += "   IOc eq  'X'";
		}else if (sp == true){
			url += "   ISolped eq  'X'";
		}else if (hes == true){
			url += "   IHes eq  'X'";
		}else if (bf == true){
			url += "   IOc eq  'X'";
		}
		
		
		url += " and IIdioma eq 'S'"
		
		
		
		if (bf == true){
			url = "ListFactSet?$filter=IEkgrpIni  eq '001' and IEkgrpFin  eq 'Z999' and IEkorgIni eq '"+IEkorg+"'  and  IEkorgFin eq '"+IEkorg2+"' and IIdioma eq 'S' and IFact eq 'X'"	}
		
		
		
		
		console.log(">>>>>>>>>>URL>>>>>>>>>>>>>>URL>>>>>>>>>>>>>: " + url);
		
		oModel.read(url, null, null, true, function(oData, response) {													
			
			that.imprJson(oData);
			
			if (oData.results.length > 0){
				sap.m.MessageToast.show(oData.results.length + " Registros encontrados");
			}
			
			that.setModel(oData, view, "listModel");
							
			that.noBusy();	
							
		},										
		function(oError) {
			that.noBusy();
			console.log(oError.response.body);
			var data = oError.response.body
			data = $.parseJSON(data);
			sap.m.MessageToast.show(data.error.message.value);
		}
		);
	
		
	}else{
	
	
	if(gruposSelec.split(",").length == 1 && gruposSelec2.split(",").length == 1){
		
		var url = "List3Set?$filter=IEkgrpIni  eq  '"+IEkgrp+"' and  IEkorgIni eq '"+IEkorg+"' and   IEkorgFin eq '"+IEkorg2+"'  and  ";
		
		if(oc == true){
			url += "   IOc eq  'X'";
		}else if (sp == true){
			url += "   ISolped eq  'X'";
		}else if (hes == true){
			url += "   IHes eq  'X'";
		}else if (bf == true){
			url += "   IOc eq  'X'";
		}
		
		
		url += " and IIdioma eq 'S'"
		
		
		
		if (bf == true){
			url = "ListFactSet?$filter=IEkgrpIni  eq '"+IEkgrp+"'   and  IEkorgIni eq '"+IEkorg+"' and IIdioma eq 'S' and IFact eq 'X'"	}
		
		
		
		
		console.log(">>>>>>>>>>URL>>>>>>>>>>>>>>URL>>>>>>>>>>>>>: " + url);
		
		oModel.read(url, null, null, true, function(oData, response) {													
			
			that.imprJson(oData);
			
			if (oData.results.length > 0){
				sap.m.MessageToast.show(oData.results.length + " Registros encontrados");
			}
			
			that.setModel(oData, view, "listModel");
							
			that.noBusy();	
							
		},										
		function(oError) {
			that.noBusy();
			console.log(oError.response.body);
			var data = oError.response.body
			data = $.parseJSON(data);
			sap.m.MessageToast.show(data.error.message.value);
		}
		);


		
	}else{
	
	
	var dataFinal;
	var i;
	
	 // llamar a la otra RFC que recibe las cadenas como entrada
	
		
		var url = "ListM3Set?$filter=IGrupos  eq  '"+grupos+"' and  IEkorgIni eq '"+IEkorg+"' and IEkorgFin eq '"+IEkorg2+"'  and  ";
		
		if(oc == true){
			url += "   IOc eq  'X'";
		}else if (sp == true){
			url += "   ISolped eq  'X'";
		}else if (hes == true){
			url += "   IHes eq  'X'";
		}else if (bf == true){
			url += "   IOc eq  'X'";
		}
				
		url += " and IIdioma eq 'S'"
						
		if (bf == true){
			url = "ListFactSet?$filter=IEkgrpIni  eq '"+IEkgrp+"' and IIdioma eq 'S' and IFact eq 'X'"	}
								
		console.log(">>>>>>>>>>URL>>>>>>>>>>>>>>URL>>>>>>>>>>>>>: " + url);
		
		oModel.read(url, null, null, true, function(oData, response) {																
			that.imprJson(oData);										
			// concatenar resultados
			
			if (oData.results.length > 0){
				sap.m.MessageToast.show(oData.results.length + " Registros encontrados");
			}
			
			that.setModel(oData, view, "listModel");
							
			that.noBusy();	
			
		},										
		function(oError) {
			that.noBusy();
			console.log(oError.response.body);
			var data = oError.response.body
			data = $.parseJSON(data);
			sap.m.MessageToast.show(data.error.message.value);
		}
		);

	
	
	
	
/*
 * if (oData.results.length > 0){ sap.m.MessageToast.show(oData.results.length + "
 * Registros encontrados"); }
 */
	

					
	that.noBusy();	
	
	}
}
	
	
	
},




handleSelectionFinishIEkgrp: function(oEvent) {
	var selectedItems = oEvent.getParameter("selectedItems");
	for (var i = 0; i < selectedItems.length; i++) {
	   gruposSelec += selectedItems[i].getText().split("-")[0].trim() + ",";
	}

},


handleSelectionFinishIEkgrp2: function(oEvent) {
	var selectedItems = oEvent.getParameter("selectedItems");
	for (var i = 0; i < selectedItems.length; i++) {
	   gruposSelec2 = selectedItems[i].getText().split("-")[0].trim() + ",";
	}

},

handleSelectionFinishIEkorg: function(oEvent) {
	var selectedItems = oEvent.getParameter("selectedItems");
	for (var i = 0; i < selectedItems.length; i++) {
	   orgSelec += selectedItems[i].getText().split("-")[0].trim() + ",";
	}

},


handleSelectionFinishIEkorg2: function(oEvent) {
	var selectedItems = oEvent.getParameter("selectedItems");
	for (var i = 0; i < selectedItems.length; i++) {
	   orgSelec2 = selectedItems[i].getText().split("-")[0].trim() + ",";
	}

},



onDataExport: sap.m.Table.prototype.exportData || function() {

	var oModel = this.getView().getModel("listModel");
	var oExport = new sap.ui.core.util.Export({

		exportType: new sap.ui.core.util.ExportTypeCSV({
			fileExtension: "xls",
			separatorChar: ";"
		}),

		models: oModel,

		rows: {
			path: "/results"
		},
		columns: [{
			name: "First Name",
			template: {
				content: "{listModel>Frggr}"
			}
		}, {
			name: "Last name",
			template: {
				content: "aaa"
			}
		}, {
			name: "Job Title",
			template: {
				content: "aaaa"
			}
		}, {
			name: "Location",
			template: {
				content: "bbbbbb"
			}
		}, {
			name: "Department",
			template: {
				content: "ccccccc"
			}
		}]
	});
	console.log(oExport);
	oExport.saveFile().catch(function(oError) {

	}).then(function() {
		oExport.destroy();
	});
},


/** ************* Método que se ejecuta al inicio ******************** */
oTPC : null,

onInit: function () {
	
	
	// this.busy();
            		
        this.mBindingOptions = {};
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
        
        
        

		var sServiceUrl = "/FioriSCP.comsapbuildstandardztestcap/sap/opu/odata/sap/ZMM_ODATA_ELIB_SRV/";
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);			  

		var view = this.getView();
		var that = this;
		
		
		this.carOrgCom();
		this.carGrpCom();
		
		
	/*
	 * oModel.read("ListSet?$filter=IEkgrp eq '002' and IEkorg eq '0008' and IOc
	 * eq 'X'", null, null, true, function(oData, response) {
	 * 
	 * that.imprJson(oData); that.setModel(oData, view, "listModel");
	 * 
	 *  }, function(oError) { console.log(oError.response.body); var data =
	 * oError.response.body data = $.parseJSON(data);
	 * sap.m.MessageToast.show(data.error.message.value); } );
	 */
		
		this.getView().byId("idDetalleTable").setVisible(false);
		  
		this.getView().byId("idDetalleTableSP").setVisible(false);
		this.getView().byId("idDetalleTableHES").setVisible(false);
		this.getView().byId("idDetalleTableFact").setVisible(false);

		
		
		var oPersoService = {
				getPersData: function() {
					var oDeferred = new jQuery.Deferred();
					var oBundle = this._oBundle;
					oDeferred.resolve(oBundle);
					return oDeferred.promise();
				},

				setPersData: function(oBundle) {
					var oDeferred = new jQuery.Deferred();
					this._oBundle = oBundle;
					oDeferred.resolve();
					return oDeferred.promise();
				},

				resetPersData: function() {
					var oDeferred = new jQuery.Deferred();

					var oInitialData = {
						_persoSchemaVersion: "1.0",
						aColumns: [
							{
								id: "empty_component-testTable-Name",
								order: 2,
								text: "Name",
								visible: true
							}, {
								id: "empty_component-testTable-Number",
								order: 1,
								text: "Number",
								visible: true
							}, {
								id: "empty_component-testTable-Color",
								order: 0,
								text: "Color",
								visible: true
							}
						]
					};

					this._oBundle = oInitialData;

					// this._oBundle = null;
					oDeferred.resolve();
					return oDeferred.promise();
				},

				getCaption: function(oColumn) {
					if (oColumn.getHeader() && oColumn.getHeader().getText) {
						if (oColumn.getHeader().getText() == "Color") {
							return "Color: this is a very very very very long Column Name to check how the TablePersoDialog deals with it";
						}
					}
					return null;
				},

				getGroup: function(oColumn) {
					if (oColumn.getHeader() && oColumn.getHeader().getText) {
						if (oColumn.getHeader().getText() == "Color") {
							return "Primary Group";
						}
					}
					return "Secondary Group";
				}
			};
		
		
		
		
		
		
	
		
		
		 this.oTPC = new sap.m.TablePersoController({
			table:  this.getView().byId("idDetalleTable"),
			persoService: oPersoService,
			hasGrouping: true
		});
		this.oTPC.activate();
		
		
		/*
		 * 0<m:ObjectIdentifier title="{listModel>Frggr}" titleActive="false"
		 * visible="true"/> 1<m:Text text="{listModel>Frgsx}" width="auto"
		 * maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 2<m:Text text="{listModel>Frgxt}"
		 * width="auto" maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 3<m:Text text="{listModel>Werks}"
		 * width="auto" maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 4<m:Text text="{listModel>Ekorg}"
		 * width="auto" maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 5<m:Text text="{listModel>Bsart}"
		 * width="auto" maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 6<m:Text text="{listModel>Ekgrp}"
		 * width="auto" maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 7<m:Text text="{listModel>Ktwrt}"
		 * width="auto" maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 8<m:Text text="{listModel>Gnetw}"
		 * width="auto" maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 9<m:Text text="" width="auto" maxLines="1"
		 * wrapping="false" textAlign="Begin" textDirection="Inherit"/> 10<m:Text
		 * text="{listModel>Matkl}" width="auto" maxLines="1" wrapping="false"
		 * textAlign="Begin" textDirection="Inherit"/> 11<m:Text
		 * text="{listModel>Knttp}" width="auto" maxLines="1" wrapping="false"
		 * textAlign="Begin" textDirection="Inherit"/> 12<m:ObjectIdentifier
		 * title="{listModel>Frgc1}" text="" titleActive="false"
		 * visible="true"/> 13<m:Text text="{listModel>Objid1}" width="auto"
		 * maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 14<m:ObjectIdentifier
		 * title="{listModel>Frgc2}" text="" titleActive="false"
		 * visible="true"/> 15<m:Text text="{listModel>Objid2}" width="auto"
		 * maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 16<m:ObjectIdentifier
		 * title="{listModel>Frgc3}" text="" titleActive="false"
		 * visible="true"/> 17<m:Text text="{listModel>Objid3}" width="auto"
		 * maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 18<m:ObjectIdentifier
		 * title="{listModel>Frgc4}" text="" titleActive="false"
		 * visible="true"/> 19<m:Text text="{listModel>Objid4}" width="auto"
		 * maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 20<m:ObjectIdentifier
		 * title="{listModel>Frgc5}" text="" titleActive="false"
		 * visible="true"/> 21<m:Text text="{listModel>Objid5}" width="auto"
		 * maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 22<m:ObjectIdentifier
		 * title="{listModel>Frgc6}" text="" titleActive="false"
		 * visible="true"/> 23<m:Text text="{listModel>Objid6}" width="auto"
		 * maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 24<m:ObjectIdentifier
		 * title="{listModel>Frgc7}" text="" titleActive="false"
		 * visible="true"/> 25<m:Text text="{listModel>Objid7}" width="auto"
		 * maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/> 26<m:ObjectIdentifier
		 * title="{listModel>Frgc8}" text="" titleActive="false"
		 * visible="true"/> 27<m:Text text="{listModel>Objid8}" width="auto"
		 * maxLines="1" wrapping="false" textAlign="Begin"
		 * textDirection="Inherit"/>
		 */


		var oTable = this.getView().byId("idDetalleTable");				
	// oTable.getColumns()[1].setProperty("visible", false);
		
		oTable.getColumns()[0].setProperty("visible", false);
		oTable.getColumns()[1].setProperty("visible", false);
		oTable.getColumns()[2].setProperty("visible", false);
		oTable.getColumns()[3].setProperty("visible", false);		
		oTable.getColumns()[4].setProperty("visible", false);
		oTable.getColumns()[5].setProperty("visible", false);
		oTable.getColumns()[6].setProperty("visible", false);
		oTable.getColumns()[7].setProperty("visible", false);
		oTable.getColumns()[8].setProperty("visible", false);
		oTable.getColumns()[9].setProperty("visible", false);				
		oTable.getColumns()[10].setProperty("visible", false);
		oTable.getColumns()[11].setProperty("visible", false);
		oTable.getColumns()[12].setProperty("visible", false);
		oTable.getColumns()[13].setProperty("visible", false);
		oTable.getColumns()[14].setProperty("visible", false);
		oTable.getColumns()[15].setProperty("visible", false);
		oTable.getColumns()[16].setProperty("visible", false);
		oTable.getColumns()[17].setProperty("visible", false);
		oTable.getColumns()[18].setProperty("visible", false);
		oTable.getColumns()[19].setProperty("visible", false);
		oTable.getColumns()[20].setProperty("visible", false);
		oTable.getColumns()[21].setProperty("visible", false);
		oTable.getColumns()[22].setProperty("visible", false);
		oTable.getColumns()[23].setProperty("visible", false);
		oTable.getColumns()[24].setProperty("visible", false);
		oTable.getColumns()[25].setProperty("visible", false);
		oTable.getColumns()[26].setProperty("visible", false);
		oTable.getColumns()[27].setProperty("visible", false);
		oTable.getColumns()[28].setProperty("visible", false);
		oTable.getColumns()[29].setProperty("visible", false);
		oTable.getColumns()[30].setProperty("visible", false);
		oTable.getColumns()[31].setProperty("visible", false);
				
		
		
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + com.sap.build.standard.ztestcap.controller.Formatter.testImpr());
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + com.sap.build.standard.ztestcap.controller.Formatter.testImpr());
        
        
},




ocultarTodasLasCol : function () {
	
	var view = this.getView();
	
	this.setModel(null, view, "listModel");
	
	var oTable = this.getView().byId("idDetalleTable");				
	// oTable.getColumns()[1].setProperty("visible", false);
		
		
		oTable.getColumns()[0].setProperty("visible", false);
		oTable.getColumns()[1].setProperty("visible", false);
		oTable.getColumns()[2].setProperty("visible", false);
		oTable.getColumns()[3].setProperty("visible", false);		
		oTable.getColumns()[4].setProperty("visible", false);
		oTable.getColumns()[5].setProperty("visible", false);
		oTable.getColumns()[6].setProperty("visible", false);
		oTable.getColumns()[7].setProperty("visible", false);
		oTable.getColumns()[8].setProperty("visible", false);
		oTable.getColumns()[9].setProperty("visible", false);				
		oTable.getColumns()[10].setProperty("visible", false);
		oTable.getColumns()[11].setProperty("visible", false);
		oTable.getColumns()[12].setProperty("visible", false);
		oTable.getColumns()[13].setProperty("visible", false);
		oTable.getColumns()[14].setProperty("visible", false);
		oTable.getColumns()[15].setProperty("visible", false);
		oTable.getColumns()[16].setProperty("visible", false);
		oTable.getColumns()[17].setProperty("visible", false);
		oTable.getColumns()[18].setProperty("visible", false);
		oTable.getColumns()[19].setProperty("visible", false);
		oTable.getColumns()[20].setProperty("visible", false);
		oTable.getColumns()[21].setProperty("visible", false);
		oTable.getColumns()[22].setProperty("visible", false);
		oTable.getColumns()[23].setProperty("visible", false);
		oTable.getColumns()[24].setProperty("visible", false);
		oTable.getColumns()[25].setProperty("visible", false);
		oTable.getColumns()[26].setProperty("visible", false);
		oTable.getColumns()[27].setProperty("visible", false);
		oTable.getColumns()[28].setProperty("visible", false);
		oTable.getColumns()[29].setProperty("visible", false);
		oTable.getColumns()[30].setProperty("visible", false);
		oTable.getColumns()[31].setProperty("visible", false);
	
	
},



selectOC : function (oEvent){
	
	
	this.getView().byId("idDetalleTableSP").setVisible(false);
	this.getView().byId("idDetalleTable").setVisible(true);
	this.getView().byId("idDetalleTableHES").setVisible(false);
	this.getView().byId("idDetalleTableFact").setVisible(false);
	
	console.log(oEvent.getParameters("selected").selected);
	
	var that = this;
	this.ocultarTodasLasCol();
	
	var oTable = this.getView().byId("idDetalleTable");				
	
	if (this.getView().byId("RB3-1").getSelected() == true){
	
		oTable.getColumns()[0].setProperty("visible", true); // GRUPO
		oTable.getColumns()[1].setProperty("visible", true); // CODIGO
		oTable.getColumns()[2].setProperty("visible", true); // TEXTO
		oTable.getColumns()[4].setProperty("visible", true); // ORG COMPRA
		oTable.getColumns()[5].setProperty("visible", true); // Clase PEDIDO
		oTable.getColumns()[6].setProperty("visible", true); // Grupo de
																// compra
		oTable.getColumns()[7].setProperty("visible", true); // Valor
																// Previsto
																// Acumulado
		oTable.getColumns()[8].setProperty("visible", true); // Valor Neto
																// Total
		oTable.getColumns()[9].setProperty("visible", true); // Campo texto
																// usuario

		
		
		oTable.getColumns()[12].setProperty("visible", true);
		oTable.getColumns()[13].setProperty("visible", true);
		oTable.getColumns()[14].setProperty("visible", true);
		oTable.getColumns()[15].setProperty("visible", true);
		oTable.getColumns()[16].setProperty("visible", true);
		oTable.getColumns()[17].setProperty("visible", true);
		oTable.getColumns()[18].setProperty("visible", true);
		oTable.getColumns()[19].setProperty("visible", true);
		oTable.getColumns()[20].setProperty("visible", true);
		oTable.getColumns()[21].setProperty("visible", true);
		oTable.getColumns()[22].setProperty("visible", true);
		oTable.getColumns()[23].setProperty("visible", true);
		oTable.getColumns()[24].setProperty("visible", true);
		oTable.getColumns()[25].setProperty("visible", true);
		oTable.getColumns()[26].setProperty("visible", true);
		oTable.getColumns()[27].setProperty("visible", true);
	// oTable.getColumns()[31].setProperty("visible", true);
		
		
		if (oEvent.getParameters("selected").selected == true){		
			that.onFilterA();
		}	
		
		
		
	}
},



selectFB : function (oEvent){
	
	var that = this;
	
/*
 * this.ocultarTodasLasCol();
 * 
 * this.getView().byId("idDetalleTableSP").setVisible(false);
 * this.getView().byId("idDetalleTable").setVisible(true);
 * this.getView().byId("idDetalleTableHES").setVisible(false);
 * 
 * var oTable = this.getView().byId("idDetalleTable");
 * 
 * if (this.getView().byId("RB3-4").getSelected() == true){
 * oTable.getColumns()[4].setProperty("visible", true); // GRUPO
 * oTable.getColumns()[6].setProperty("visible", true); // CODIGO
 * 
 * oTable.getColumns()[28].setProperty("visible", true); // CODIGO
 * oTable.getColumns()[29].setProperty("visible", true); // CODIGO
 * oTable.getColumns()[30].setProperty("visible", true); // CODIGO
 * oTable.getColumns()[31].setProperty("visible", false);
 * 
 * 
 * if (oEvent.getParameters("selected").selected == true){ that.onFilterA(); }
 * 
 *  }
 */
	
	if (oEvent.getParameters("selected").selected == true){		
		that.onFilterA();
	}
	
	this.getView().byId("idDetalleTableSP").setVisible(false);
	this.getView().byId("idDetalleTable").setVisible(false);
	this.getView().byId("idDetalleTableHES").setVisible(false);
	this.getView().byId("idDetalleTableFact").setVisible(true);
	

	
},

selectHES : function (oEvent){
	
	var that = this;
/*
 * this.ocultarTodasLasCol();
 * 
 * var oTable = this.getView().byId("idDetalleTable");
 * 
 * if (this.getView().byId("RB3-3").getSelected() == true){
 * 
 * 
 * 
 * 
 * oTable.getColumns()[0].setProperty("visible", true); // GRUPO
 * oTable.getColumns()[1].setProperty("visible", true); // CODIGO
 * oTable.getColumns()[2].setProperty("visible", true); // TEXTO
 * oTable.getColumns()[3].setProperty("visible", true); // CENTRO
 * oTable.getColumns()[4].setProperty("visible", true); // ORG COMPRA
 * oTable.getColumns()[10].setProperty("visible", true); // Grupo de artículos
 * 
 * 
 * 
 * oTable.getColumns()[12].setProperty("visible", true);
 * oTable.getColumns()[13].setProperty("visible", true);
 * oTable.getColumns()[14].setProperty("visible", true);
 * oTable.getColumns()[15].setProperty("visible", true);
 * oTable.getColumns()[16].setProperty("visible", true);
 * oTable.getColumns()[17].setProperty("visible", true);
 * oTable.getColumns()[18].setProperty("visible", true);
 * oTable.getColumns()[19].setProperty("visible", true);
 * oTable.getColumns()[20].setProperty("visible", true);
 * oTable.getColumns()[21].setProperty("visible", true);
 * oTable.getColumns()[22].setProperty("visible", true);
 * oTable.getColumns()[23].setProperty("visible", true);
 * oTable.getColumns()[24].setProperty("visible", true);
 * oTable.getColumns()[25].setProperty("visible", true);
 * oTable.getColumns()[26].setProperty("visible", true);
 * oTable.getColumns()[27].setProperty("visible", true);
 * //oTable.getColumns()[31].setProperty("visible", true);
 * 
 * if (oEvent.getParameters("selected").selected == true){ that.onFilterA(); }
 * 
 *  }
 */
	
	if (oEvent.getParameters("selected").selected == true){		
		that.onFilterA();
	}	
	
	var that = this;	
	this.getView().byId("idDetalleTableSP").setVisible(false);
	this.getView().byId("idDetalleTable").setVisible(false);
	this.getView().byId("idDetalleTableHES").setVisible(true);
	this.getView().byId("idDetalleTableFact").setVisible(false);
	
	
	
},




selectSP : function (oEvent){
	
	var that = this;	
	this.getView().byId("idDetalleTableSP").setVisible(true);
	this.getView().byId("idDetalleTable").setVisible(false);
	this.getView().byId("idDetalleTableHES").setVisible(false);
	this.getView().byId("idDetalleTableFact").setVisible(false);
	
// this.ocultarTodasLasCol();
	
	// var oTable = this.getView().byId("idDetalleTable");
	
	/*
	 * if (this.getView().byId("RB3-2").getSelected() == true){
	 * 
	 * oTable.getColumns()[0].setProperty("visible", true); // GRUPO
	 * oTable.getColumns()[1].setProperty("visible", true); // CODIGO
	 * oTable.getColumns()[2].setProperty("visible", true); // TEXTO
	 * oTable.getColumns()[3].setProperty("visible", true); // CENTRO
	 * oTable.getColumns()[4].setProperty("visible", true); // ORG COMPRA
	 * oTable.getColumns()[6].setProperty("visible", true); // Grupo de compra
	 * 
	 * 
	 * oTable.getColumns()[10].setProperty("visible", true); // Grupo de
	 * artículos oTable.getColumns()[11].setProperty("visible", true); // Tipo
	 * Imputación
	 * 
	 * 
	 * oTable.getColumns()[12].setProperty("visible", true);
	 * oTable.getColumns()[13].setProperty("visible", true);
	 * oTable.getColumns()[14].setProperty("visible", true);
	 * oTable.getColumns()[15].setProperty("visible", true);
	 * oTable.getColumns()[16].setProperty("visible", true);
	 * oTable.getColumns()[17].setProperty("visible", true);
	 * oTable.getColumns()[18].setProperty("visible", true);
	 * oTable.getColumns()[19].setProperty("visible", true);
	 * oTable.getColumns()[20].setProperty("visible", true);
	 * oTable.getColumns()[21].setProperty("visible", true);
	 * oTable.getColumns()[22].setProperty("visible", true);
	 * oTable.getColumns()[23].setProperty("visible", true);
	 * oTable.getColumns()[24].setProperty("visible", true);
	 * oTable.getColumns()[25].setProperty("visible", true);
	 * oTable.getColumns()[26].setProperty("visible", true);
	 * oTable.getColumns()[27].setProperty("visible", true);
	 * //oTable.getColumns()[31].setProperty("visible", true);
	 */
		
		if (oEvent.getParameters("selected").selected == true){		
			that.onFilterA();
		}	

		
		
	// }
},



onPersoButtonPressed: function (oEvent) {
	this.oTPC.openDialog();
},

onTablePersoRefresh : function() {
	DemoPersoService.resetPersData();
	this.oTPC.refresh();
},

onTableGrouping : function(oEvent) {
	this.oTPC.setHasGrouping(oEvent.getSource().getSelected());
},



onChange : function (){
	
	this.onFilterA();
	// alert(this.getView().byId("idCombo").getSelectedKey());
	// console.log(this.getView().byId("idCombo").getSelectedKey());
},


onChangeOb : function (){
	
	var view = this.getView();		
	if (view.byId("IEkorg").getValue() != null && view.byId("IEkorg").getValue() != ""){
		view.byId("IEkorg").setValueState(null);
	}
	
	this.onFilterA();
	
	// alert(this.getView().byId("idCombo").getSelectedKey());
	// console.log(this.getView().byId("idCombo").getSelectedKey());
},

onExport2 : function () {

	
var view = this.getView();

var model = view.getModel("listModel");

if(model.getData().results.length <= 0){
	sap.m.MessageToast.show("No existen Registros para descargar...");
	return;
}


var aExcelData = model.getData().results;

/*
 * 
 * var aExcelData = [ { "ProductId": "1239102", "Name": "Power Projector 4713",
 * "Category": "Projector", "SupplierName": "Titanium", "Description": "A very
 * powerful projector with special features for Internet usability, USB",
 * "WeightMeasure": 1467, "WeightUnit": "g", "Price": 856.49, "CurrencyCode":
 * "EUR", "Status": "Available", "Quantity": 3, "UoM": "PC", "Width": 51,
 * "Depth": 42, "Height": 18, "DimUnit": "cm" }, { "ProductId": "2212-121-828",
 * "Name": "Gladiator MX", "Category": "Graphics Card", "SupplierName":
 * "Technocom", "Description": "Gladiator MX: DDR2 RoHS 128MB Supporting 512MB
 * Clock rate: 350 MHz Memory Clock: 533 MHz, Bus Type: PCI-Express, Memory
 * Type: DDR2 Memory Bus: 32-bit Highlighted Features: DVI Out, TV Out , HDTV",
 * "WeightMeasure": 321, "WeightUnit": "g", "Price": 81.7, "CurrencyCode":
 * "EUR", "Status": "Discontinued", "Quantity": 10, "UoM": "PC", "Width": 34,
 * "Depth": 14, "Height": 2, "DimUnit": "cm", } ];
 */
              // Consider above array of object as a dummy data

                  this.fnJSONToXLSXConvertor(aExcelData, "reporte_estrategias_lib");
             },

 fnJSONToXLSXConvertor : function(JSONData, ReportTitle) {
	 
	 			  var view = this.getView();

                  var aData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
                  if (aData.length) {
                      var aFinalXlsxData,
                          aXlsxHeaderData;

                      // Array variable to store header data in XLSX file
                      aXlsxHeaderData = [];
                      aFinalXlsxData = [];

                      // Below loop to extract header data
                      for ( var iIndex in aData[0]) {
                    	  /*
							 * switch (iIndex) { case "ProductId":
							 * aXlsxHeaderData.push("aaaaa"); break; case
							 * "Name": aXlsxHeaderData.push("bbbbbb"); break;
							 *  }
							 */
                    	  
                    	  
                      var oc = view.byId("RB3-1").getSelected();
                      var sp = view.byId("RB3-2").getSelected();
                      var hes = view.byId("RB3-3").getSelected();
                      var bf = view.byId("RB3-4").getSelected();                    		                    		
                    		
                      if(oc == true){
                    	  
                    	  ReportTitle += "OC";

                          aXlsxHeaderData.push("Grup Lib");
                          aXlsxHeaderData.push("Est L");
                          aXlsxHeaderData.push("Nombre");
                          aXlsxHeaderData.push("Org. Comp.");
                          aXlsxHeaderData.push("Clase.Ped.");
                          aXlsxHeaderData.push("Grp.Compras");
                          aXlsxHeaderData.push("Valor Prev. Acum.");
                          aXlsxHeaderData.push("Valor Neto Total");
                          aXlsxHeaderData.push("Campo de usuario formato Carac");
                          aXlsxHeaderData.push("Lib1");
                          aXlsxHeaderData.push("CodUsr1");
                          aXlsxHeaderData.push("Lib2");
                          aXlsxHeaderData.push("CodUsr2");
                          aXlsxHeaderData.push("Lib3");
          			      aXlsxHeaderData.push("CodUsr3");
          		          aXlsxHeaderData.push("Lib4");
                          aXlsxHeaderData.push("CodUsr4");
          				  aXlsxHeaderData.push("Lib5");
          		          aXlsxHeaderData.push("CodUsr5");
          			      aXlsxHeaderData.push("Lib6");
          			      aXlsxHeaderData.push("CodUsr6");
          			      aXlsxHeaderData.push("Lib7");
             		      aXlsxHeaderData.push("CodUsr7");
             		      aXlsxHeaderData.push("Lib8");
                          aXlsxHeaderData.push("CodUsr8");

                      }else if (sp == true){
                    	  
                    	  ReportTitle += "SP";

                          aXlsxHeaderData.push("Grup Lib");
                          aXlsxHeaderData.push("Est L");                         
                          aXlsxHeaderData.push("Nombre");
                          aXlsxHeaderData.push("Centro");
                          aXlsxHeaderData.push("Grp.Art.");                         
                          aXlsxHeaderData.push("Tipo.Input");          			                		                                  
          				  aXlsxHeaderData.push("Valor Total Posición");
          				  aXlsxHeaderData.push("Org. Comp.");
          				  aXlsxHeaderData.push("Grp.Compras");
                          aXlsxHeaderData.push("Lib1");
                          aXlsxHeaderData.push("CodUsr1");
                          aXlsxHeaderData.push("Lib2");
                          aXlsxHeaderData.push("CodUsr2");
                          aXlsxHeaderData.push("Lib3");
          			      aXlsxHeaderData.push("CodUsr3");
          		          aXlsxHeaderData.push("Lib4");
                          aXlsxHeaderData.push("CodUsr4");
          				  aXlsxHeaderData.push("Lib5");
          		          aXlsxHeaderData.push("CodUsr5");
          			      aXlsxHeaderData.push("Lib6");
          			      aXlsxHeaderData.push("CodUsr6");
          			      aXlsxHeaderData.push("Lib7");
             		      aXlsxHeaderData.push("CodUsr7");
             		      aXlsxHeaderData.push("Lib8");
                          aXlsxHeaderData.push("CodUsr8");                    	  
                    	  
                      }else if (hes == true){
                    	  
                    	  ReportTitle += "HES";

                          aXlsxHeaderData.push("Grup Lib");
                          aXlsxHeaderData.push("Est L");                           
                          aXlsxHeaderData.push("Nombre");
                          aXlsxHeaderData.push("Centro");
          				  aXlsxHeaderData.push("Grp.Art");
          				  aXlsxHeaderData.push("Valor Servicios");
                          aXlsxHeaderData.push("Org. Comp.");   
                          aXlsxHeaderData.push("Grp.Compras");
                          aXlsxHeaderData.push("Lib1");
                          aXlsxHeaderData.push("CodUsr1");
                          aXlsxHeaderData.push("Lib2");
                          aXlsxHeaderData.push("CodUsr2");
                          aXlsxHeaderData.push("Lib3");
          			      aXlsxHeaderData.push("CodUsr3");
          		          aXlsxHeaderData.push("Lib4");
                          aXlsxHeaderData.push("CodUsr4");
          				  aXlsxHeaderData.push("Lib5");
          		          aXlsxHeaderData.push("CodUsr5");
          			      aXlsxHeaderData.push("Lib6");
          			      aXlsxHeaderData.push("CodUsr6");
          			      aXlsxHeaderData.push("Lib7");
             		      aXlsxHeaderData.push("CodUsr7");
             		      aXlsxHeaderData.push("Lib8");
                          aXlsxHeaderData.push("CodUsr8");   
                    			
                      }else if (bf == true){
                    	  
                    	  ReportTitle += "FACT"
                    		  
                          aXlsxHeaderData.push("Org. Comp.");
                          aXlsxHeaderData.push("Grp.Compras");                          
                          aXlsxHeaderData.push("Usuario-1");
                          aXlsxHeaderData.push("Usuario-2");
                          aXlsxHeaderData.push("Usuario-TI");
                      }
                    		                    	  
                      
                      
                      // Adding column header data in final XLSX data
                      aFinalXlsxData.push(aXlsxHeaderData);

                      // Below loop to extract data
                      console.log(aData);
                      for (var i = 0; i < aData.length; i++) {
                          // Array variable to store content data in XLSX file
                          var aXlsxContentData = [];
                          for ( var iIndex in aData[i]) {
                        	  
                        	  console.log(iIndex);
                    	                    		
                        	  if(oc == true){
                                  switch (iIndex) {
                                  case "Frggr":
                                  case "Frgsx":
                                  case "Frgxt":
                                  case "Ekorg":
                                  case "Bsart":
                                  case "Ekgrp":
                                  case "Ktwrt":
                                  case "Gnetw":
                                  case "Frgc1":
                                  case "Objid1":                                	  
                                  case "Frgc2":
                                  case "Objid2":                                	  
                                  case "Frgc3":
                                  case "Objid3":                                	  
                                  case "Frgc4":
                                  case "Objid4":                                	  
                                  case "Frgc5":
                                  case "Objid5":                                	  
                                  case "Frgc6":
                                  case "Objid6":                                	  
                                  case "Frgc7":
                                  case "Objid7":                                	  
                                  case "Frgc8":
                                  case "Objid8":                                	  
	  
                                	  
                                  if (iIndex == "Gnetw" || iIndex == "Ktwrt"){
                                	  var val = aData[i][iIndex].split(".").join("");
                                	  val = val.split("$").join("");
                                	  aXlsxContentData.push(val);
                                  }else{
                                	  aXlsxContentData.push(aData[i][iIndex]);  
                                  }
                                
                                   
                                   
                                   if (iIndex == "Gnetw"){
                                	   aXlsxContentData.push(aData[i]["Fusuario"]);                                	   
                                   } 
                                   
                                   break;
                                  }
                        		  
                        	  }else if (sp == true){
                        		  
                        		  switch (iIndex) {
                                  case "Frggr":
                                  case "Frgsx":
                                  case "Frgxt":
                                  case "Werks": 
                            // case "Matkl":
                             // case "Knttp":
                              // case "Gnetw":
                                  case "Ekorg":                                
                                // case "Ekgrp":
                                  case "Frgc1":
                                  case "Objid1":                                	  
                                  case "Frgc2":
                                  case "Objid2":                                	  
                                  case "Frgc3":
                                  case "Objid3":                                	  
                                  case "Frgc4":
                                  case "Objid4":                                	  
                                  case "Frgc5":
                                  case "Objid5":                                	  
                                  case "Frgc6":
                                  case "Objid6":                                	  
                                  case "Frgc7":
                                  case "Objid7":                                	  
                                  case "Frgc8":
                                  case "Objid8":                        
                                	  
                                	  
                                if (iIndex == "Ekorg" || iIndex == "Ekorg"){
                                	
                                	aXlsxContentData.push(aData[i]["Matkl"]);
                                	aXlsxContentData.push(aData[i]["Knttp"]);
                                	
                                  	
                                  	var val = aData[i]["Gnetw"].split(".").join("");
                                  	val = val.split("$").join("");
                                  	aXlsxContentData.push(val);
                                  	
                                // aXlsxContentData.push(aData[i]["Gnetw"]);
                                	
                                	
                                	
                                	
                                	aXlsxContentData.push(aData[i]["Ekorg"]);
                                	aXlsxContentData.push(aData[i]["Ekgrp"]);                                	                                	
                                		  
                                }else{
	  
                                
                                    if (iIndex == "Gnetw" || iIndex == "Gnetw"){
                                    	  var val = aData[i][iIndex].split(".").join("");
                                    	  val = val.split("$").join("");
                                    	  aXlsxContentData.push(val);
                                      }else{
                                    	  aXlsxContentData.push(aData[i][iIndex]);  
                                      }
                                    
                                } 

                                   break;
                                  }                        		  
                        		  
                        	  }else if (hes == true){
                        		  
                        		  
                        		  switch (iIndex) {
                                  case "Frggr":
                                  case "Frgsx":
                                  case "Frgxt":
                                  case "Werks":
                               // case "Matkl":
                                // case "Gnetw":
                                  case "Ekorg":                                                                  
                                // case "Ekgrp":
                                  case "Frgc1":
                                  case "Objid1":                                	  
                                  case "Frgc2":
                                  case "Objid2":                                	  
                                  case "Frgc3":
                                  case "Objid3":                                	  
                                  case "Frgc4":
                                  case "Objid4":                                	  
                                  case "Frgc5":
                                  case "Objid5":                                	  
                                  case "Frgc6":
                                  case "Objid6":                                	  
                                  case "Frgc7":
                                  case "Objid7":                                	  
                                  case "Frgc8":
                                  case "Objid8":                                	  
	  
                                	  
                                	  if (iIndex == "Ekorg" || iIndex == "Ekorg"){
                                      	
                                      	aXlsxContentData.push(aData[i]["Matkl"]);
                                      	
                                      	var val = aData[i]["Ktwrt"].split(".").join("");
                                      	val = val.split("$").join("");
                                      	aXlsxContentData.push(val);
                                      	
                                    // aXlsxContentData.push(aData[i]["Gnetw"]);
                                      	aXlsxContentData.push(aData[i]["Ekorg"]);
                                      	aXlsxContentData.push(aData[i]["Ekgrp"]);                                	                                	
                                      		  
                                      }else{
                                
                                      if (iIndex == "Gnetw" || iIndex == "Gnetw"){
                                    	  var val = aData[i][iIndex].split(".").join("");
                                    	  val = val.split("$").join("");
                                    	  aXlsxContentData.push(val);
                                      }else{
                                    	  aXlsxContentData.push(aData[i][iIndex]);  
                                      }
                                      
                                      }

                                   break;
                                  }                         		  
                        		  
                        	  }else if (bf == true){
                        		  
                                  switch (iIndex) {
                                  case "Ekorg":
                                  //case "Ekgrp":
                                  case "Uname1":
                                  case "Uname2":
                                  case "Userti":
                                	  
                                	  if (iIndex == "Ekorg" || iIndex == "Ekorg"){
                                		  	aXlsxContentData.push(aData[i]["Ekorg"]); 
                                			aXlsxContentData.push(aData[i]["Ekgrp"]); 
                                	  }else{                                
	                                      aXlsxContentData.push(aData[i][iIndex]);
	                                      break;
                                	  }
                                  }
                        		  
                        	  }
                        	  

                          }
                          // Adding content data in final XLSX data
                          aFinalXlsxData.push(aXlsxContentData);
                      }

                      var Workbook = function Workbook() {
                          if(!(this instanceof Workbook)) return new Workbook();
                          this.SheetNames = [];
                          this.Sheets = {};
                      }
                      var wb = Workbook();
                      wb.SheetNames.push(ReportTitle);

                      var sheet_from_array_of_arrays = function sheet_from_array_of_arrays(data, opts) {
                          var ws = {};
                          var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
                          for(var R = 0; R != data.length; ++R) {
                              for(var C = 0; C != data[R].length; ++C) {
                                  if(range.s.r > R) range.s.r = R;
                                  if(range.s.c > C) range.s.c = C;
                                  if(range.e.r < R) range.e.r = R;
                                  if(range.e.c < C) range.e.c = C;
                                  var cell = {v: data[R][C] };
                                  if(cell.v == null) continue;
                                  var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

                                  if(typeof cell.v === 'number') cell.t = 'n';
                                  else if(typeof cell.v === 'boolean') cell.t = 'b';
                                  else if(cell.v instanceof Date) {
                                      cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                                      cell.v = datenum(cell.v);
                                  }
                                  else cell.t = 's';

                                  ws[cell_ref] = cell;
                              }
                          }
                          if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                          return ws;
                      }

                      var ws = sheet_from_array_of_arrays(aFinalXlsxData);

                      // Setting up Excel column width
                      ws['!cols'] = [ 
                          {wch:14},
                          {wch:12}                      
                      ];
                      wb.Sheets[ReportTitle] = ws;        // wb.Sheets[ReportTitle]
															// -> To set sheet
															// name

                      var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
                      var s2ab = function s2ab(s) {
                          var buf = new ArrayBuffer(s.length);
                          var view = new Uint8Array(buf);
                          for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                          return buf;
                      };
                      saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), ReportTitle + ".xlsx");
                      break;

                  // } else {
                      /*
						 * MessageBox.error( "No data..!", { styleClass:
						 * bCompact? "sapUiSizeCompact" : "" } );
						 */
                  // }
              }

           }},
           
           
       	handleValueHelpOC : function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
 
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"com.sap.build.standard.ztestcap.controller.DOrgCompra",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}
 
			// create a filter for the binding
			this._valueHelpDialog.getBinding("items").filter([new sap.ui.model.Filter(
				"Ekorg",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);
 
			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},
 
		_handleValueHelpSearchOC : function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"Ekorg",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
 
		_handleValueHelpCloseOC : function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		},
	
		
		//_handleValueHelpSearchGC
       	handleValueHelpGC : function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
 
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
		//	if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"com.sap.build.standard.ztestcap.controller.DGrpCompra",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			//}
			
			this._valueHelpDialog.setMultiSelect(true);
			this._valueHelpDialog.setRememberSelections(true);
 
			// create a filter for the binding
			
			  this._valueHelpDialog.getBinding("items").filter([new
			  sap.ui.model.Filter( "Ekgrp",
			  sap.ui.model.FilterOperator.Contains, "" )]);
			 
 
			// open value help dialog filtered by the input value
			
			
			// this._valueHelpDialog.open(sInputValue);
			
			this._valueHelpDialog.open();
		},
		
		//handleValueHelpGC
 
		_handleValueHelpSearchGC : function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"Ekgrp",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		
		cambiaMultiInput : function (oEvent){
			
			
			if (this.getView().byId("IEkgrp").getValue() == ""){
				
				this._valueHelpDialog.destroy();
				
				this._valueHelpDialog = sap.ui.xmlfragment(
						"com.sap.build.standard.ztestcap.controller.DGrpCompra",
						this
					);
				this.getView().addDependent(this._valueHelpDialog);

				
			}
			

		},
		
		
		
		handleConfirmGC: function(oEvent) {
			
			var that = this;
			
			
			
			var seleccionados = "";
			console.log("aaa");
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				seleccionados  = aContexts.map(
						function(oContext) { 
							return oContext.getObject().Ekgrp; 
							}).join(",")
			
				if (parseInt(seleccionados.split(",").length) > 50){
					sap.m.MessageToast.show("Sólo puede seleccionar hasta 50 grupos de compra.");
					return;
				}
				
				this.getView().byId("IEkgrp").setValue(seleccionados);	
				this.getView().byId("IEkgrp").setValueState(null);
				
			} else {
				sap.m.MessageToast.show("No se ha escogido Grupo de Compra.");
			}
												
			console.log("seleccionados = " + seleccionados);								
		//	oEvent.getSource().getBinding("items").filter("Ekgrp", sap.ui.model.FilterOperator.Contains, "001");
		},
		
		
		
		
		
		handleCloseGC: function(oEvent) {
			
		
		},
		
		dialogLib : function(oEvent){
			
			var view = this.getView();
			var bindingContext = oEvent.getSource().getBindingContext("listModel");						  			  
			console.log(bindingContext);
			
			
		  /*  console.log(bindingContext.getProperty("Frgc1"));		    
		    console.log(bindingContext.getProperty("Objid1"));
		    console.log(bindingContext.getProperty("Frgc2"));		    
		    console.log(bindingContext.getProperty("Objid2"));
		    console.log(bindingContext.getProperty("Frgc3"));		    
		    console.log(bindingContext.getProperty("Objid3"));
		    console.log(bindingContext.getProperty("Frgc4"));		    
		    console.log(bindingContext.getProperty("Objid4"));
		    console.log(bindingContext.getProperty("Frgc5"));		    
		    console.log(bindingContext.getProperty("Objid5"));
		    console.log(bindingContext.getProperty("Frgc6"));		    
		    console.log(bindingContext.getProperty("Objid6"));
		    console.log(bindingContext.getProperty("Frgc7"));		    
		    console.log(bindingContext.getProperty("Objid7"));
		    console.log(bindingContext.getProperty("Frgc8"));		    
		    console.log(bindingContext.getProperty("Objid8"));*/
			
			console.log(bindingContext.getProperty("Knttp"));
			
			var tipoImp = bindingContext.getProperty("Knttp").split("-");
			var col1 = "col1";
			var col2 = "col2"; 
			var i=0;
			var dataStr = "{\"TipoCollection\":[";
			for(i=0; i < tipoImp.length; i++){
				
				console.log(tipoImp[i]);
				var char1 = tipoImp[i];
				var char2 = ""
				
				if(char1 === "3" ){
					char2 = "Normal";
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}else if (char1 === "A" ){
					char2 = "Activo Fijo";
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}else if (char1 === "C"){	
					char2 = "Pedido Cliente";			
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}else if (char1 === "F"){
					char2 = "Orden";					
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}else if (char1 === "K"){
					char2 = "Centro Costo";				
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}else if (char1 === "J"){
					char2 = "Centro Costo";				
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}else if (char1 === "T"){
					char2 = "Todos nuevos costo Ind.";	
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}else if (char1 === "U"){
					char2 = "Desconocida";				
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}else if (char1 === "X"){
					char2 = "Todas Imput. Auxiliares";	
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}else if (char1 === "P"){
					char2 = "Proyecto";					
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}else if (char1 === "8"){
					char2 = "Activo Fijo con CO";		
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}else if (char1 === "R"){
					char2 = "CeCo / Orden";		
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}else if (char1 === "S"){
					char2 = "CeCo SERV.Generales";		
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}else if (char1 === "T"){
					char2 = "Todos Nuevos CostInd";		
					dataStr += "{" + "\"" + col1  + "\"" + ":" +  "\"" + char1 + "\"" + "," +  "\"" + col2  + "\"" + ":" +  "\"" + char2 + "\""      +"},"
				}									
				
			}
			
			dataStr = dataStr.substring(0, dataStr.length -1);
			dataStr += "]}";
			console.log(dataStr);
			var array = jQuery.parseJSON(dataStr);
			
			console.log(JSON.stringify(array, null, 4) );
			var columnEvalModel = new sap.ui.model.json.JSONModel();		  
			columnEvalModel.setData(array);
			view.setModel(columnEvalModel, "commonModel");
			  view.getModel("commonModel").refresh()
			
		    		    
			/* var dataInfo = {
					    f1: bindingContext.getProperty("Frgc1"),					    
					    o1: bindingContext.getProperty("Objid1"),
					    f2: bindingContext.getProperty("Frgc2"),					    
					    o2: bindingContext.getProperty("Objid2"),
					    f3: bindingContext.getProperty("Frgc3"),					    
					    o3: bindingContext.getProperty("Objid3"),
					    f4: bindingContext.getProperty("Frgc4"),					    
					    o4: bindingContext.getProperty("Objid4"),
					    f5: bindingContext.getProperty("Frgc5"),					    
					    o5: bindingContext.getProperty("Objid5"),
					    f6: bindingContext.getProperty("Frgc6"),					    
					    o6: bindingContext.getProperty("Objid6"),
					    f7: bindingContext.getProperty("Frgc7"),					    
					    o7: bindingContext.getProperty("Objid7"),
					    f8: bindingContext.getProperty("Frgc8"),					    
					    o8: bindingContext.getProperty("Objid8")
					    
			  };
			 
	//		 var dataInfo2 = { dataStr };			 
			  
			  var oModelJsonInfo = new sap.ui.model.json.JSONModel();
			  
			  oModelJsonInfo.setData(dataInfo);
			  console.log(JSON.stringify(dataInfo, null, 4) );
			  view.setModel(oModelJsonInfo, "commonModel");
			  view.getModel("commonModel").refresh();*/
		    

			 
			var sDialogName = "/dialog_8";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : this.getView().getModel();
			var oView;
			// if (!oDialog) {
				this.getOwnerComponent().runAsOwner(function() {
					oView = sap.ui.xmlview({
						viewName: "com.sap.build.standard.ztestcap.view" + sDialogName
					});
					this.getView().addDependent(oView);
					oView.getController().setRouter(this.oRouter);
					oDialog = oView.getContent()[0];
					this.mDialogs[sDialogName] = oDialog;
				}.bind(this));
			// }

			return new ES6Promise.Promise(function(resolve, reject) {
				oDialog.attachEventOnce("afterOpen", null, resolve);

				oDialog.open();
				if (oView) {
					oDialog.attachAfterOpen(function() {
						oDialog.rerender();
					});
				} else {
					oView = oDialog.getParent();
				}
				oView.setModel(oModel);
				if (sPath) {
					var oParams = oView.getController().getBindingParameters();
					oView.bindElement(sPath, oParams);
				}
			});

			
			
		},
		
		
		handleInfoMessageBoxPress: function(oEvent) {
			
			var row = oEvent.getSource().getBindingContext("listModel").getPath();
			console.log(row);
			
			var bindingContext = oEvent.getSource().getBindingContext("listModel");						  			  
			console.log(bindingContext);			  
		    console.log(bindingContext.getProperty("Ekgrp"));

			
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			sap.m.MessageBox.information(
					bindingContext.getProperty("Ekgrp"),
				{
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
		},
		
		
		
		
		handleInfoMessageBoxPressCEN: function(oEvent) {
			
			var row = oEvent.getSource().getBindingContext("listModel").getPath();
			console.log(row);
			
			var bindingContext = oEvent.getSource().getBindingContext("listModel");						  			  
			console.log(bindingContext);			  
		    console.log(bindingContext.getProperty("Werks"));

			
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			sap.m.MessageBox.information(
					bindingContext.getProperty("Werks"),
				{
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
		},		
		
		
		
		handleInfoMessageBoxPressGA: function(oEvent) {
			
			var row = oEvent.getSource().getBindingContext("listModel").getPath();
			console.log(row);
			
			var bindingContext = oEvent.getSource().getBindingContext("listModel");						  			  
			console.log(bindingContext);			  
		    console.log(bindingContext.getProperty("Matkl"));

			
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			sap.m.MessageBox.information(
					bindingContext.getProperty("Matkl"),
				{
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
		},		
 
		_handleValueHelpCloseGC : function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		}		


    });
    
    
    
    
}, /* bExport= */true);
