jQuery.sap.require("sap.ui.qunit.qunit-css");jQuery.sap.require("sap.ui.thirdparty.qunit");jQuery.sap.require("sap.ui.qunit.qunit-junit");QUnit.config.autostart=false;sap.ui.require(["sap/ui/test/Opa5","cl/conchaytoro/zpp_notifica_descomposicion/test/integration/pages/Common","sap/ui/test/opaQunit","cl/conchaytoro/zpp_notifica_descomposicion/test/integration/pages/App","cl/conchaytoro/zpp_notifica_descomposicion/test/integration/pages/Browser","cl/conchaytoro/zpp_notifica_descomposicion/test/integration/pages/Master","cl/conchaytoro/zpp_notifica_descomposicion/test/integration/pages/Detail","cl/conchaytoro/zpp_notifica_descomposicion/test/integration/pages/NotFound"],function(o,i){"use strict";o.extendConfig({arrangements:new i,viewNamespace:"cl.conchaytoro.zpp_notifica_descomposicion.view."});sap.ui.require(["cl/conchaytoro/zpp_notifica_descomposicion/test/integration/MasterJourney","cl/conchaytoro/zpp_notifica_descomposicion/test/integration/NavigationJourney","cl/conchaytoro/zpp_notifica_descomposicion/test/integration/NotFoundJourney","cl/conchaytoro/zpp_notifica_descomposicion/test/integration/BusyJourney"],function(){QUnit.start()})});