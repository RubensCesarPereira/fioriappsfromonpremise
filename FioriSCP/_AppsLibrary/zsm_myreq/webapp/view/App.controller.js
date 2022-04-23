/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["zsm/itsm/myreq/cust/view/BaseController", "sap/ui/model/json/JSONModel", "zsm/itsm/myreq/cust/util/Util"], function (B, J, U) { "use strict"; return B.extend("zsm.itsm.myreq.cust.view.App", { onInit: function () { var v, s, l = this.getOwnerComponent().oListSelector, o = this.getView().getBusyIndicatorDelay(); v = new J({ busy: true, delay: 0 }); this.setModel(v, "appView"); s = function () { v.setProperty("/busy", false); v.setProperty("/delay", o); }; this.getOwnerComponent().getModel().metadataLoaded().then(s); l.attachListSelectionChange(function () { this.byId("idAppControl").hideMaster(); }, this); this.getView().addStyleClass(U.getContentDensityClass()); } }); });
