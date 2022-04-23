sap.ui.define(["sap/ui/test/Opa5","cl/conchaytoro/zpp_aprobar_reclasificacion/test/integration/pages/Common","sap/ui/test/matchers/PropertyStrictEquals"],function(e,s,t){"use strict";var a="App",r="idAppControl";e.createPageObjects({onTheAppPage:{baseClass:s,actions:{iWaitUntilTheBusyIndicatorIsGone:function(){return this.waitFor({id:r,viewName:a,matchers:function(e){return e.getParent().getBusy()===false},errorMessage:"The app is still busy."})}},assertions:{iShouldSeeTheBusyIndicator:function(){return this.waitFor({id:r,viewName:a,success:function(s){e.assert.ok(s.getParent().getBusy(),"The app is busy")},errorMessage:"The app is not busy."})},iShouldSeeTheMessageBox:function(){return this.waitFor({searchOpenDialogs:true,controlType:"sap.m.Dialog",matchers:new t({name:"type",value:"Message"}),success:function(){e.assert.ok(true,"The correct MessageBox was shown")}})}}}})});