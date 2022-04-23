/*global QUnit*/

sap.ui.define([
	"cl/conchaytoro/zpp_elaboracion_mezcla/model/GroupSortState",
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
		assert.strictEqual(this.oGroupSortState.sort("Gsmng").length, 1, "The sorting by Gsmng returned a sorter");
		assert.strictEqual(this.oGroupSortState.sort("Psttr").length, 1, "The sorting by Psttr returned a sorter");
	});

	QUnit.test("Should return a grouper when grouping", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.group("Gsmng").length, 1, "The group by Gsmng returned a sorter");
		assert.strictEqual(this.oGroupSortState.group("None").length, 0, "The sorting by None returned no sorter");
	});


	QUnit.test("Should set the sorting to Gsmng if the user groupes by Gsmng", function (assert) {
		// Act + Assert
		this.oGroupSortState.group("Gsmng");
		assert.strictEqual(this.oModel.getProperty("/sortBy"), "Gsmng", "The sorting is the same as the grouping");
	});

	QUnit.test("Should set the grouping to None if the user sorts by Psttr and there was a grouping before", function (assert) {
		// Arrange
		this.oModel.setProperty("/groupBy", "Gsmng");

		this.oGroupSortState.sort("Psttr");

		// Assert
		assert.strictEqual(this.oModel.getProperty("/groupBy"), "None", "The grouping got reset");
	});
});