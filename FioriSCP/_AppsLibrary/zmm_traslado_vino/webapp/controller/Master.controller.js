sap.ui.define(["cl/conchaytoro/zmm_traslado_vino/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/GroupHeaderListItem","sap/ui/Device","cl/conchaytoro/zmm_traslado_vino/model/formatter"],function(e,t,i,r,s,o,a){"use strict";return e.extend("cl.conchaytoro.zmm_traslado_vino.controller.Master",{formatter:a,onInit:function(){var e=this.byId("list"),t=this._createViewModel(),i=e.getBusyIndicatorDelay();this._oList=e;this._oListFilterState={aFilter:[],aSearch:[]};this.setModel(t,"masterView");e.attachEventOnce("updateFinished",function(){t.setProperty("/delay",i)});this.getView().addEventDelegate({onBeforeFirstShow:function(){this.getOwnerComponent().oListSelector.setBoundMasterList(e)}.bind(this)});this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched,this);this.getRouter().attachBypassed(this.onBypassed,this)},onUpdateFinished:function(e){this._updateListItemCount(e.getParameter("total"));this.byId("pullToRefresh").hide()},onRefresh:function(){this._oList.getBinding("items").refresh()},onSelectionChange:function(e){var t=e.getSource(),i=e.getParameter("selected");if(!(t.getMode()==="MultiSelect"&&!i)){this._showDetail(e.getParameter("listItem")||e.getSource())}},onBypassed:function(){this._oList.removeSelections(true)},createGroupHeader:function(e){return new s({title:e.text,upperCase:false})},onNavBack:function(){history.go(-1)},_createViewModel:function(){return new t({isFilterBarVisible:false,filterBarLabel:"",delay:0,title:this.getResourceBundle().getText("masterTitleCount",[0]),noDataText:this.getResourceBundle().getText("masterListNoDataText"),sortBy:"Vbeln",groupBy:"None"})},_onMasterMatched:function(){this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(function(e){if(e.list.getMode()==="None"){return}var t=e.firstListitem.getBindingContext().getProperty("Vbeln");this.getRouter().navTo("object",{objectId:t},true)}.bind(this),function(e){if(e.error){return}this.getRouter().getTargets().display("detailNoObjectsAvailable")}.bind(this))},_showDetail:function(e){var t=!o.system.phone;this.getRouter().navTo("object",{objectId:e.getBindingContext().getProperty("Vbeln")},t)},_updateListItemCount:function(e){var t;if(this._oList.getBinding("items").isLengthFinal()){t=this.getResourceBundle().getText("masterTitleCount",[e]);this.getModel("masterView").setProperty("/title",t)}},onSearch:function(e){if(e.getParameters().refreshButtonPressed){this.onRefresh();return}var t=e.getParameter("query");if(t){this._oListFilterState.aSearch=[new i("Vbeln",r.Contains,t)]}else{this._oListFilterState.aSearch=[]}this._applyFilterSearch()},_applyFilterSearch:function(){var e=this._oListFilterState.aSearch.concat(this._oListFilterState.aSearch),t=this.getModel("masterView");this._oList.getBinding("items").filter(e);if(e.length!==0){t.setProperty("/noDataText",this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"))}else if(this._oListFilterState.aSearch.length>0){t.setProperty("/noDataText",this.getResourceBundle().getText("masterListNoDataText"))}},onSearchDocuments:function(e){var t=this.getView().getModel("masterView");var s=this.byId("NuDocumento").getValue();var o=t.getProperty("/imFecha1");var a=t.getProperty("/imFecha2");if(o===""){sap.m.MessageToast.show(this.getResourceBundle().getText("date1Invalid"));return}if(a===""){sap.m.MessageToast.show(this.oResourceBundle.getText("date2Invalid"));return}var n=[];n.push(new i("ImFecha1",r.EQ,o));n.push(new i("ImFecha2",r.EQ,a));n.push(new i("ImProceso",r.EQ,"1"));if(s!==""){n.push(new i("ImXblnr",r.EQ,s))}this.getTableItems().filter(n)},_applyGroupSort:function(e){this._oList.getBinding("items").sort(e)},_updateFilterBar:function(e){var t=this.getModel("masterView");t.setProperty("/isFilterBarVisible",this._oListFilterState.aFilter.length>0);t.setProperty("/filterBarLabel",this.getResourceBundle().getText("masterFilterBarText",[e]))}})});