sap.ui.define(["sap/ui/test/opaQunit"],function(e){"use strict";QUnit.module("Phone not found");e("Should see the not found page if the hash is something that matches no route",function(e,o,t){e.iStartTheApp({hash:"somethingThatDoesNotExist"});o.onTheNotFoundPage.iLookAtTheScreen();t.onTheNotFoundPage.iShouldSeeTheNotFoundPage().and.theNotFoundPageShouldSayResourceNotFound()});e("Should end up on the master list, if the back button is pressed",function(e,o,t){o.onTheNotFoundPage.iPressTheBackButton("NotFound");t.onTheMasterPage.iShouldSeeTheList().and.iTeardownMyAppFrame()});e("Should see the not found master and detail page if an invalid object id has been called",function(e,o,t){e.iStartTheApp({hash:"/BuscarSet/SomeInvalidObjectId"});o.onTheNotFoundPage.iLookAtTheScreen();t.onTheNotFoundPage.iShouldSeeTheObjectNotFoundPage().and.theNotFoundPageShouldSayObjectNotFound()});e("Should end up on the master list, if the back button is pressed",function(e,o,t){o.onTheNotFoundPage.iPressTheBackButton("DetailObjectNotFound");t.onTheMasterPage.iShouldSeeTheList().and.iTeardownMyAppFrame()});e("Should see the not found text for no search results",function(e,o,t){e.iStartTheApp();o.onTheMasterPage.iSearchForSomethingWithNoResults();t.onTheMasterPage.iShouldSeeTheNoDataTextForNoSearchResults().and.iTeardownMyAppFrame()})});