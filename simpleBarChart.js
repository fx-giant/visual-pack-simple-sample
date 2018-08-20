namespace("leesa.visual")["simpleBarChart"] = (function (leesa, _, d3) {
	var magicalChart = {
		extend: function (quadrant) {},
		render: function (quadrant, callback) {
			var content = quadrant.htmlJContent();
			content.html("");
			var visual = quadrant.visual();
			var data = quadrant.data();
			var parameters = visual.parameters || {};


			var columnField = parameters.columnField;
			var valueField = parameters.valueField;

			if (!columnField || !valueField) {
				data = getSampleData();
				valueField = "visits";
				columnField = "country"
			}


			AmCharts.makeChart(content[0], {
				type: "serial",
				theme: "light",
				dataProvider: data,
				categoryField: columnField,
				graphs: [{
					type: "column",
					valueField: valueField
				}]
			})
		},
		configuration: {},
	}
	return magicalChart;

	function getSampleData() {
		return [{
			"country": "USA",
			"visits": 2025
		}, {
			"country": "China",
			"visits": 1882
		}, {
			"country": "Japan",
			"visits": 1809
		}, {
			"country": "Germany",
			"visits": 1322
		}, {
			"country": "UK",
			"visits": 1122
		}, {
			"country": "France",
			"visits": 1114
		}, {
			"country": "India",
			"visits": 984
		}, {
			"country": "Spain",
			"visits": 711
		}, {
			"country": "Netherlands",
			"visits": 665
		}, {
			"country": "Russia",
			"visits": 580
		}, {
			"country": "South Korea",
			"visits": 443
		}, {
			"country": "Canada",
			"visits": 441
		}, {
			"country": "Brazil",
			"visits": 395
		}];
	}
})(leesa, _, d3)