jQuery.sap.require("sap.ui.qunit.qunit-css");jQuery.sap.require("sap.ui.thirdparty.qunit");jQuery.sap.require("sap.ui.qunit.qunit-junit");QUnit.config.autostart=false;sap.ui.require(["sap/ui/test/Opa5","conchaytoro/cl/zsd_contabilizar_despacho/test/integration/pages/Common","sap/ui/test/opaQunit","conchaytoro/cl/zsd_contabilizar_despacho/test/integration/pages/App","conchaytoro/cl/zsd_contabilizar_despacho/test/integration/pages/Browser","conchaytoro/cl/zsd_contabilizar_despacho/test/integration/pages/Master","conchaytoro/cl/zsd_contabilizar_despacho/test/integration/pages/Detail","conchaytoro/cl/zsd_contabilizar_despacho/test/integration/pages/NotFound"],function(t,a){"use strict";t.extendConfig({arrangements:new a,viewNamespace:"conchaytoro.cl.zsd_contabilizar_despacho.view."});sap.ui.require(["conchaytoro/cl/zsd_contabilizar_despacho/test/integration/MasterJourney","conchaytoro/cl/zsd_contabilizar_despacho/test/integration/NavigationJourney","conchaytoro/cl/zsd_contabilizar_despacho/test/integration/NotFoundJourney","conchaytoro/cl/zsd_contabilizar_despacho/test/integration/BusyJourney"],function(){QUnit.start()})});