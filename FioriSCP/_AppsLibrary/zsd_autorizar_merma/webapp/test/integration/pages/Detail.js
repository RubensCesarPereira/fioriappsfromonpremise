sap.ui.define(["sap/ui/test/Opa5","sap/ui/test/actions/Press","conchaytoro/cl/zsd_autorizar_merma/test/integration/pages/Common","sap/ui/test/matchers/AggregationLengthEquals","sap/ui/test/matchers/AggregationFilled","sap/ui/test/matchers/PropertyStrictEquals"],function(e,t,i,s,n,r){"use strict";var a="Detail";e.createPageObjects({onTheDetailPage:{baseClass:i,actions:{iPressTheBackButton:function(){return this.waitFor({id:"page",viewName:a,actions:new t,errorMessage:"Did not find the nav button on detail page"})}},assertions:{iShouldSeeTheBusyIndicator:function(){return this.waitFor({id:"page",viewName:a,success:function(t){e.assert.ok(t.getBusy(),"The detail view is busy")},errorMessage:"The detail view is not busy."})},iShouldSeeNoBusyIndicator:function(){return this.waitFor({id:"page",viewName:a,matchers:function(e){return!e.getBusy()},success:function(t){e.assert.ok(!t.getBusy(),"The detail view is not busy")},errorMessage:"The detail view is busy."})},theObjectPageShowsTheFirstObject:function(){return this.iShouldBeOnTheObjectNPage(0)},iShouldBeOnTheObjectNPage:function(t){return this.waitFor(this.createAWaitForAnEntitySet({entitySet:"HeaderMermaSet",success:function(i){var s=i[t].Name;this.waitFor({controlType:"sap.m.ObjectHeader",viewName:a,matchers:new r({name:"title",value:i[t].Name}),success:function(){e.assert.ok(true,"was on the first object page with the name "+s)},errorMessage:"First object is not shown"})}}))},iShouldSeeTheRememberedObject:function(){return this.waitFor({success:function(){var e=this.getContext().currentItem.bindingPath;this._waitForPageBindingPath(e)}})},_waitForPageBindingPath:function(t){return this.waitFor({id:"page",viewName:a,matchers:function(e){return e.getBindingContext()&&e.getBindingContext().getPath()===t},success:function(i){e.assert.strictEqual(i.getBindingContext().getPath(),t,"was on the remembered detail page")},errorMessage:"Remembered object "+t+" is not shown"})},iShouldSeeTheObjectLineItemsList:function(){return this.waitFor({id:"lineItemsList",viewName:a,success:function(t){e.assert.ok(t,"Found the line items list.")}})},theLineItemsListShouldHaveTheCorrectNumberOfItems:function(){return this.waitFor(this.createAWaitForAnEntitySet({entitySet:"MermaToPosiciones",success:function(t){return this.waitFor({id:"lineItemsList",viewName:a,matchers:new n({name:"items"}),check:function(e){var i=e.getBindingContext().getProperty("Rsnum");var s=t.filter(function(e){return e.Rsnum===i}).length;return e.getItems().length===s},success:function(){e.assert.ok(true,"The list has the correct number of items")},errorMessage:"The list does not have the correct number of items."})}}))},theLineItemsHeaderShouldDisplayTheAmountOfEntries:function(){return this.waitFor({id:"lineItemsList",viewName:a,matchers:new n({name:"items"}),success:function(t){var i=t.getItems().length;return this.waitFor({id:"lineItemsHeader",viewName:a,matchers:new r({name:"text",value:"<MermaToPosicionesPlural> ("+i+")"}),success:function(){e.assert.ok(true,"The line item list displays "+i+" items")},errorMessage:"The line item list does not display "+i+" items."})}})},iShouldSeeTheShareEmailButton:function(){return this.waitFor({id:"shareEmail",viewName:a,success:function(){e.assert.ok(true,"The E-Mail button is visible")},errorMessage:"The E-Mail button was not found"})}}}})});