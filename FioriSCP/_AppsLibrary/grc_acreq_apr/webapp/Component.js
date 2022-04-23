jQuery.sap.declare("fcg.grc.accessrequest.approve.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ui.core.routing.Router");
jQuery.sap.require("sap.ui.core.routing.History");
sap.ui.core.UIComponent.extend("fcg.grc.accessrequest.approve.Component", {
    metadata: {
        "manifest": "json",
        "routing": {
            "config": {
                viewType: "XML",
                viewPath: "fcg.grc.accessrequest.approve.view",
                targetControl: "MainSplitContainer",
                targetAggregation: "detailPages",
                "viewLevel": undefined,
                clearTarget: false,
                "resourceBundle": "i18n/i18n.properties"
            },
            "routes": [{
                pattern: "",
                view: "MainSplitContainer",
                name: "masterDetail",
                viewPath: "sap.ca.scfld.md.view",
                targetControl: "fioriContent",
                targetAggregation: "pages",
                subroutes: [{
                    pattern: "",
                    view: "RequestMaster",
                    name: "master",
                    targetAggregation: "masterPages"
                }, {
                    pattern: "detail/{contextPath}",
                    view: "RequestDetail",
                    name: "detail"
                }, {
                    pattern: "roleDetails/{contextPath}/{key}",
                    view: "RoleDetails",
                    name: "roleDetails"
                }, {
                    pattern: "masterUpdate/{contextPath}",
                    view: "RequestMaster",
                    name: "masterUpdate",
                    targetAggregation: "masterPages"
                }]
            }]
        }
    },
    createContent: function() {
        var v = {
            component: this
        };
        return sap.ui.view({
            viewName: "fcg.grc.accessrequest.approve.Main",
            type: sap.ui.core.mvc.ViewType.XML,
            viewData: v
        });
    },
    init: function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
        this.getRouter().attachRouteMatched(this._handleRouteMatched);
        this.getRouter().initialize();
    },
    _handleRouteMatched: function(e) {
        var a = e.getParameter("targetControl");
        if (!(a instanceof sap.m.NavContainer || a instanceof sap.m.SplitContainer)) {
            return;
        }
        if (sap.m.InstanceManager.hasOpenPopover()) {
            sap.m.InstanceManager.closeAllPopovers();
        }
        if (sap.m.InstanceManager.hasOpenDialog()) {
            sap.m.InstanceManager.closeAllDialogs();
        }
        var v = e.getParameter("view");
        var V = e.getParameter("config").viewLevel;
        var n = (a instanceof sap.m.SplitContainer) && !!a.getMasterPage(v.getId());
        var h = sap.ui.core.routing.History.getInstance();
        var b;
        if (V === undefined || this._iCurrentViewLevel === undefined || V === this._iCurrentViewLevel) {
            b = h.getDirection() === "Backwards";
        } else {
            b = (V !== undefined && V < this._iCurrentViewLevel);
        }
        if (b) {
            var p = a.getPreviousPage(n);
            if (!p || p.getId() !== v.getId()) {
                a.insertPreviousPage(v.getId());
            }
            a.backToPage(v.getId());
        } else {
            a.to(v.getId());
        }
        this._iCurrentViewLevel = V;
    }
});