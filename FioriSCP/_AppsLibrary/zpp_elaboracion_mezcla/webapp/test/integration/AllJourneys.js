jQuery.sap.require("sap.ui.qunit.qunit-css");jQuery.sap.require("sap.ui.thirdparty.qunit");jQuery.sap.require("sap.ui.qunit.qunit-junit");QUnit.config.autostart=false;sap.ui.require(["sap/ui/test/Opa5","cl/conchaytoro/zpp_elaboracion_mezcla/test/integration/pages/Common","sap/ui/test/opaQunit","cl/conchaytoro/zpp_elaboracion_mezcla/test/integration/pages/App","cl/conchaytoro/zpp_elaboracion_mezcla/test/integration/pages/Browser","cl/conchaytoro/zpp_elaboracion_mezcla/test/integration/pages/Master","cl/conchaytoro/zpp_elaboracion_mezcla/test/integration/pages/Detail","cl/conchaytoro/zpp_elaboracion_mezcla/test/integration/pages/NotFound"],function(a,o){"use strict";a.extendConfig({arrangements:new o,viewNamespace:"cl.conchaytoro.zpp_elaboracion_mezcla.view."});sap.ui.require(["cl/conchaytoro/zpp_elaboracion_mezcla/test/integration/MasterJourney","cl/conchaytoro/zpp_elaboracion_mezcla/test/integration/NavigationJourney","cl/conchaytoro/zpp_elaboracion_mezcla/test/integration/NotFoundJourney","cl/conchaytoro/zpp_elaboracion_mezcla/test/integration/BusyJourney"],function(){QUnit.start()})});