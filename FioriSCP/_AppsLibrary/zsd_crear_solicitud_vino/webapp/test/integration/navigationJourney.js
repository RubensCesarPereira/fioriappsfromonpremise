sap.ui.define(["sap/ui/test/opaQunit","conchaytoro/cl/zsd_crear_solicitud_vino/test/integration/pages/View1"],function(e){"use strict";QUnit.module("Navigation Journey");e("Should see the initial page of the app",function(e,i,o){e.iStartTheApp();i.onTheAppPage.iLookAtTheScreen();o.onTheAppPage.iShouldSeeTheApp();o.iTeardownMyAppFrame()});e("Should check additional UI elements",function(e,i,o){e.iStartTheApp();i.onTheAppPage.iDoMyAction();o.onTheAppPage.iDoMyAssertion();o.iTeardownMyAppFrame()})});