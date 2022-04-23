/*global QUnit*/

sap.ui.define([
	"cl/conchaytoro/zpp_aprobar_reclasificacion/model/GroupSortState",
	"sap/ui/model/json/JSONModel"
], function (GroupSortState, JSONModel) {
	"use strict";

	QUnit.module("GroupSortState - grouping and sorting", {
		beforeEach: function () {
			this.oModel = new JSONModel({});
			// System under test
			this.oGroupSortState = new GroupSortState(this.oModel, function() {});
		}
	});

	QUnit.test("Should always return a sorter when sorting", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.sort("CantCab").length, 1, "The sorting by CantCab returned a sorter");
		assert.strictEqual(this.oGroupSortState.sort("Aufnr").length, 1, "The sorting by Aufnr returned a sorter");
	});

	QUnit.test("Should return a grouper when grouping", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.group("CantCab").length, 1, "The group by CantCab returned a sorter");
		assert.strictEqual(this.oGroupSortState.group("None").length, 0, "The sorting by None returned no sorter");
	});


	QUnit.test("Should set the sorting to CantCab if the user groupes by CantCab", function (assert) {
		// Act + Assert
		this.oGroupSortState.group("CantCab");
		assert.strictEqual(this.oModel.getProperty("/sortBy"), "CantCab", "The sorting is the same as the grouping");
	});

	QUnit.test("Should set the grouping to None if the user sorts by Aufnr and there was a grouping before", function (assert) {
		// Arrange
		this.oModel.setProperty("/groupBy", "CantCab");

		this.oGroupSortState.sort("Aufnr");

		// Assert
		assert.strictEqual(this.oModel.getProperty("/groupBy"), "None", "The grouping got reset");
	});
});