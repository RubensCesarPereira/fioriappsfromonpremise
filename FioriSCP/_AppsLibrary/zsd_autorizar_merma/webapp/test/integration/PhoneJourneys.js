jQuery.sap.require("sap.ui.qunit.qunit-css");jQuery.sap.require("sap.ui.thirdparty.qunit");jQuery.sap.require("sap.ui.qunit.qunit-junit");QUnit.config.autostart=false;sap.ui.require(["sap/ui/test/Opa5","conchaytoro/cl/zsd_autorizar_merma/test/integration/pages/Common","sap/ui/test/opaQunit","conchaytoro/cl/zsd_autorizar_merma/test/integration/pages/App","conchaytoro/cl/zsd_autorizar_merma/test/integration/pages/Browser","conchaytoro/cl/zsd_autorizar_merma/test/integration/pages/Master","conchaytoro/cl/zsd_autorizar_merma/test/integration/pages/Detail","conchaytoro/cl/zsd_autorizar_merma/test/integration/pages/NotFound"],function(t,a){"use strict";t.extendConfig({arrangements:new a,viewNamespace:"conchaytoro.cl.zsd_autorizar_merma.view."});sap.ui.require(["conchaytoro/cl/zsd_autorizar_merma/test/integration/NavigationJourneyPhone","conchaytoro/cl/zsd_autorizar_merma/test/integration/NotFoundJourneyPhone","conchaytoro/cl/zsd_autorizar_merma/test/integration/BusyJourneyPhone"],function(){QUnit.start()})});