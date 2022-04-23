sap.ui.define(["conchaytoro/cl/zsd_autorizar_merma/controller/BaseController","sap/ui/model/json/JSONModel","conchaytoro/cl/zsd_autorizar_merma/model/formatter"],function(e,t,i){"use strict";return e.extend("conchaytoro.cl.zsd_autorizar_merma.controller.Detail",{formatter:i,onInit:function(){var e=new t({busy:false,delay:0,lineItemListTitle:this.getResourceBundle().getText("detailLineItemTableHeading")});this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched,this);this.setModel(e,"detailView");this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this))},onShareEmailPress:function(){var e=this.getModel("detailView");sap.m.URLHelper.triggerEmail(null,e.getProperty("/shareSendEmailSubject"),e.getProperty("/shareSendEmailMessage"))},onListUpdateFinished:function(e){var t,i=e.getParameter("total"),o=this.getModel("detailView");if(this.byId("lineItemsList").getBinding("items").isLengthFinal()){if(i){t=this.getResourceBundle().getText("detailLineItemTableHeadingCount",[i])}else{t=this.getResourceBundle().getText("detailLineItemTableHeading")}o.setProperty("/lineItemListTitle",t)}},_onObjectMatched:function(e){var t=e.getParameter("arguments").objectId;this.getModel().metadataLoaded().then(function(){var e=this.getModel().createKey("HeaderMermaSet",{Rsnum:t});this._bindView("/"+e)}.bind(this))},_bindView:function(e){var t=this.getModel("detailView");t.setProperty("/busy",false);this.getView().bindElement({path:e,events:{change:this._onBindingChange.bind(this),dataRequested:function(){t.setProperty("/busy",true)},dataReceived:function(){t.setProperty("/busy",false)}}})},_onBindingChange:function(){var e=this.getView(),t=e.getElementBinding();if(!t.getBoundContext()){this.getRouter().getTargets().display("detailObjectNotFound");this.getOwnerComponent().oListSelector.clearMasterListSelection();return}var i=t.getPath(),o=this.getResourceBundle(),s=e.getModel().getObject(i),a=s.Rsnum,r=s.Rsnum,n=this.getModel("detailView");this.getOwnerComponent().oListSelector.selectAListItem(i);n.setProperty("/shareSendEmailSubject",o.getText("shareSendEmailObjectSubject",[a]));n.setProperty("/shareSendEmailMessage",o.getText("shareSendEmailObjectMessage",[r,a,location.href]))},_onMetadataLoaded:function(){var e=this.getView().getBusyIndicatorDelay(),t=this.getModel("detailView"),i=this.byId("lineItemsList"),o=i.getBusyIndicatorDelay();t.setProperty("/delay",0);t.setProperty("/lineItemTableDelay",0);i.attachEventOnce("updateFinished",function(){t.setProperty("/lineItemTableDelay",o)});t.setProperty("/busy",true);t.setProperty("/delay",e)},_selectFirst:function(){sap.ui.getCore().byId("application-ZOBJ_SEM_AUT_MERMA-display-component---master--list").getItems()[0].firePress()},clearCells:function(e){var t=this.getView().byId("lineItemsList")},onAutorizar:function(e){var t=this;var i=sap.ui.getCore().byId("application-ZOBJ_SEM_AUT_MERMA-display-component---master--list");var o=t.getView().byId("lineItemsList");var s=o.getItems();var a=t.getView().byId("objectHeader");var r=a.getNumber();var n=t.getView().byId("objectAttribute");var l=n.getText();var c=t.getView().byId("motivo");var d=c.getText();var u=[];s.forEach(function(e){u.push({Rsnum:r,Rspos:e.getCells()[0].getText(),Material:e.getCells()[1].getText(),StoreLoc:e.getCells()[5].getText(),Batch:e.getCells()[6].getText(),Quantity:e.getCells()[3].getText(),Unit:e.getCells()[4].getUnit(),Fedoc:"",Nombre:"",Fecon:"",Motiivo:"",Autorizado:e.getCells()[8].getSelected()?"X":"",Makt:""})});var g=this.getOwnerComponent().getModel("dos");var h={Rsnum:r,MoveType:"",Plant:l,Kostl:"",Motivo:d,MermaToPosiciones:u};sap.ui.core.BusyIndicator.show();g.create("/HeaderMermaSet",h,{method:"GET",success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageBox.success("¡Documento N° "+r+" ha sido Contabilizado!",{title:"Confirmación",onClose:function(){i.getBinding("items").refresh(true);t._selectFirst()},styleClass:"",initialFocus:null,textDirection:sap.ui.core.TextDirection.Inherit})}.bind(this),error:function(){sap.ui.core.BusyIndicator.hide();sap.m.MessageBox.error("Error al Autorizar",{title:"Error",onClose:null,styleClass:"",initialFocus:null,textDirection:sap.ui.core.TextDirection.Inherit})}.bind(this)})},_onAutorizar:function(){var e=[];e.push({Rsnum:"0019393354",Rspos:"0001",Material:"",StoreLoc:"",Batch:"",Quantity:"",Unit:"",Fedoc:"",Nombre:"",Fecon:"",Motiivo:"",Autorizado:"X",Makt:""});var t=this.getOwnerComponent().getModel();var i={Rsnum:"0019393354",MoveType:"",Plant:"",Kostl:"",Motivo:"",MermaToPosiciones:e};sap.ui.core.BusyIndicator.show();t.create("/HeaderMermaSet",i,{success:function(e){sap.ui.core.BusyIndicator.hide();sap.m.MessageBox.success("¡Merma N° "+e.Rsnum+" Autorizada!",{title:"Confirmación",onClose:null,styleClass:"",initialFocus:null,textDirection:sap.ui.core.TextDirection.Inherit})}.bind(this),error:function(){sap.ui.core.BusyIndicator.hide();sap.m.MessageBox.error("Error al Autorizar",{title:"Error",onClose:null,styleClass:"",initialFocus:null,textDirection:sap.ui.core.TextDirection.Inherit})}.bind(this)})},_validaCheck:function(e){if(e.getSource().getProperty("selected"))e.getSource().getParent().getCells()[9].setSelected(false);else e.getSource().getParent().getCells()[9].setSelected(true)},_validaCheckRech:function(e){if(e.getSource().getProperty("selected"))e.getSource().getParent().getCells()[8].setSelected(false);else e.getSource().getParent().getCells()[8].setSelected(true)}})});