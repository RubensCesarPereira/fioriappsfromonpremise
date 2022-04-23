sap.ui.define(["conchaytoro/cl/zsd_contabilizar_despacho/controller/App.controller","sap/m/SplitApp","sap/ui/core/Control","sap/ui/model/json/JSONModel","sap/ui/thirdparty/sinon","sap/ui/thirdparty/sinon-qunit"],function(t,e,n,o){"use strict";QUnit.module("AppController - Hide master");QUnit.test("Should hide the master of a SplitApp when selection in the list changes",function(i){var s,r=new n,a=new o,l=new n,p=new e,u=sinon.spy(p,"hideMaster");l.oListSelector={attachListSelectionChange:function(t,e){s=t.bind(e)}};l.getContentDensityClass=jQuery.noop;a.metadataLoaded=function(){return{then:jQuery.noop}};a.attachMetadataFailed=function(){jQuery.noop()};l.setModel(a);var c=new t;this.stub(c,"byId").withArgs("idAppControl").returns(p);this.stub(c,"getView").returns(r);this.stub(c,"getOwnerComponent").returns(l);c.onInit();i.ok(s,"Did register to the change event of the ListSelector");s();i.strictEqual(u.callCount,1,"Did hide the master")})});