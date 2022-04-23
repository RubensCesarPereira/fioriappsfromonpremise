sap.ui.define(["conchaytoro/cl/zsd_contabilizar_despacho/controller/BaseController", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/GroupHeaderListItem", "sap/ui/Device", "conchaytoro/cl/zsd_contabilizar_despacho/model/formatter"], function(e, t, a, r, s, i, o) {
    "use strict";
    return e.extend("conchaytoro.cl.zsd_contabilizar_despacho.controller.Master", {
        formatter: o,
        onInit: function() {
            var e = this.byId("list"),
                t = this._createViewModel(),
                a = e.getBusyIndicatorDelay();
            this._oList = e;
            this._oListFilterState = {
                aFilter: [],
                aSearch: []
            };
            this.setModel(t, "masterView");
            e.attachEventOnce("updateFinished", function() {
                t.setProperty("/delay", a)
            });
            this.getView().addEventDelegate({
                onBeforeFirstShow: function() {
                    this.getOwnerComponent().oListSelector.setBoundMasterList(e)
                }.bind(this)
            });
            this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
            this.getRouter().attachBypassed(this.onBypassed, this)
        },
        onUpdateFinished: function(e) {
            this._updateListItemCount(e.getParameter("total"));
            this.byId("pullToRefresh").hide()
        },
        onSearch: function(e) {
            if (e.getParameters().refreshButtonPressed) {
                this.onRefresh();
                return
            }
            var t = e.getParameter("query");
            if (t) {
                this._oListFilterState.aSearch = [new a("Purchaseorder", r.Contains, t)]
            } else {
                this._oListFilterState.aSearch = []
            }
            this._applyFilterSearch()
        },
        onRefresh: function() {
            this._oList.getBinding("items").refresh()
        },
        onSelectionChange: function(e) {
            this._showDetail(e.getParameter("listItem") || e.getSource())
        },
        onBypassed: function() {
            this._oList.removeSelections(true)
        },
        createGroupHeader: function(e) {
            return new s({
                title: e.text,
                upperCase: false
            })
        },
        onNavBack: function() {
            history.go(-1)
        },
        _createViewModel: function() {
            return new t({
                isFilterBarVisible: false,
                filterBarLabel: "",
                delay: 0,
                title: this.getResourceBundle().getText("masterTitleCount", [0]),
                noDataText: this.getResourceBundle().getText("masterListNoDataText"),
                sortBy: "Purchaseorder",
                groupBy: "None"
            })
        },
        _onMasterMatched: function() {
            this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(function(e) {
                if (e.list.getMode() === "None") {
                    return
                }
                var t = e.firstListitem.getBindingContext().getProperty("Purchaseorder");
                this.getRouter().navTo("object", {
                    objectId: t
                }, true)
            }.bind(this), function(e) {
                if (e.error) {
                    return
                }
                this.getRouter().getTargets().display("detailNoObjectsAvailable")
            }.bind(this))
        },
        clearInput: function(e) {
            var t = e[0].getContent()[0].getContent()[2].getItems();
            var a = e[0].getContent()[0].getContent()[3].getItems();
            var r = e[0].getContent()[0].getContent()[4].getItems();
            var s = e[0].getContent()[0].getContent()[5].getItems();
            var i = e[0].getContent()[0].getContent()[7].getContent()[0];
            var o = i.getItems();
            var n = t[1];
            var l = t[3];
            var u = t[5];
            var c = a[1];
            var g = a[3];
            var h = a[5];
            var d = r[1];
            var p = r[3];
            var f = r[5];
            var S = s[1];
            var m = s[3];
            n.setValue("");
            l.setValue("");
            u.setValue("");
            c.setValue("");
            g.setValue("");
            h.setValue("");
            d.setValue("");
            p.setValue("");
            f.setValue("");
            S.setValue("");
            m.setValue("");
            n.setValueState(sap.ui.core.ValueState.None);
            l.setValueState(sap.ui.core.ValueState.None);
            c.setValueState(sap.ui.core.ValueState.None);
            g.setValueState(sap.ui.core.ValueState.None);
            h.setValueState(sap.ui.core.ValueState.None);
            p.setValueState(sap.ui.core.ValueState.None);
            f.setValueState(sap.ui.core.ValueState.None);
            S.setValueState(sap.ui.core.ValueState.None);
            o.forEach(function(e) {
                if (e.getCells()[0].getText().substring(0, 1) !== "9") {
                    e.getCells()[11].setValue("");
                    e.getCells()[11].setValueState(sap.ui.core.ValueState.None);
                    e.getCells()[12].setSelected(false)
                }
            })
        },
        _showDetail: function(e) {
            // $.contSub = 9e5;
            // var t = e.getEventingParent().getParent().getParent().getParent().getParent().getParent().getDetailPages();
            // this.clearInput(t);
            var a = !i.system.phone;
            this.getRouter().navTo("object", {
                objectId: e.getBindingContext().getProperty("Purchaseorder")
            }, a);
            // var r = e.getParent().getParent().getParent().getParent().getParent().getParent().getDetailPages()[0].getContent()[0].getFooter().getContent()[1];
            // r.setEnabled(false)
        },
        _updateListItemCount: function(e) {
            var t;
            if (this._oList.getBinding("items").isLengthFinal()) {
                t = this.getResourceBundle().getText("masterTitleCount", [e]);
                this.getModel("masterView").setProperty("/title", t)
            }
        },
        _applyFilterSearch: function() {
            var e = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
                t = this.getModel("masterView");
            this._oList.getBinding("items").filter(e, "Application");
            if (e.length !== 0) {
                t.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"))
            } else if (this._oListFilterState.aSearch.length > 0) {
                t.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"))
            }
        },
        _applyGroupSort: function(e) {
            this._oList.getBinding("items").sort(e)
        },
        _updateFilterBar: function(e) {
            var t = this.getModel("masterView");
            t.setProperty("/isFilterBarVisible", this._oListFilterState.aFilter.length > 0);
            t.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [e]))
        }
    })
});