sap.ui.define(["sap/ui/test/Opa5","sap/ui/test/actions/Press","sap/ui/test/matchers/PropertyStrictEquals","sap/ui/Device","cl/conchaytoro/zpp_libera_descomposicion/test/integration/pages/Common"],function(e,t,o,s,n){"use strict";var i="page",a="NotFound",r="DetailObjectNotFound";e.createPageObjects({onTheNotFoundPage:{baseClass:n,actions:{iPressTheBackButton:function(e){return this.waitFor({viewName:e,controlType:"sap.m.Button",matchers:new o({name:"type",value:s.os.android?"Up":"Back"}),actions:new t,errorMessage:"Did not find the back button"})}},assertions:{iShouldSeeTheNotFoundGeneralPage:function(t,o){return this.waitFor({controlType:"sap.m.MessagePage",viewName:o,success:function(){e.assert.ok(true,"Shows the message page")},errorMessage:"Did not reach the empty page"})},iShouldSeeTheNotFoundPage:function(){return this.iShouldSeeTheNotFoundGeneralPage(i,a)},iShouldSeeTheObjectNotFoundPage:function(){return this.iShouldSeeTheNotFoundGeneralPage(i,r)},theNotFoundPageShouldSayResourceNotFound:function(){return this.waitFor({id:i,viewName:a,success:function(t){e.assert.strictEqual(t.getTitle(),t.getModel("i18n").getProperty("notFoundTitle"),"The not found text is shown as title");e.assert.strictEqual(t.getText(),t.getModel("i18n").getProperty("notFoundText"),"The resource not found text is shown")},errorMessage:"Did not display the resource not found text"})},theNotFoundPageShouldSayObjectNotFound:function(){return this.waitFor({id:i,viewName:r,success:function(t){e.assert.strictEqual(t.getTitle(),t.getModel("i18n").getProperty("detailTitle"),"The object text is shown as title");e.assert.strictEqual(t.getText(),t.getModel("i18n").getProperty("noObjectFoundText"),"The object not found text is shown")},errorMessage:"Did not display the object not found text"})}}}})});