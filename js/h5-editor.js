(function() {

	var editor = angular.module("H5Editor", ["ngSanitize","ng-iscroll"]);

	editor.service("project", function() {

		this.project = {
			project_name: "",
			project_desc: "",
			project_type: "mobile",
			document_size: {
				height: 620,
				width: 326
			},
			pages: [{
				page_title: "测试",
				page_thumb: "",
				selected: true,
				propertys: {
					backgroundImage: "",
					backgroundColor: "#ffffff",
					animations: []
				},
				page_shapes: [{
					shape_name: "测试",
					shape_type: "text",
					propertys: {
						backgroundImage: "url(img/default.png)",
						backgroundColor: "#000000",
						left: 0,
						top: 0
					},
					animations: [],
					shape_content: "测试文字",
					selected: true
				}]
			}, {
				page_title: "测试2",
				page_thumb: "",
				selected: false,
				propertys: {
					backgroundImage: "",
					backgroundColor: "#ffffff",
					animations: []
				},
				page_shapes: [{
					shape_name: "测试",
					shape_type: "text",
					propertys: {
						backgroundImage: "",
						backgroundColor: "#ffffff",
						animations: []
					},
					selected: false
				}]
			}, {
				page_title: "测试3",
				page_thumb: "",
				selected: false,
				propertys: {
					backgroundImage: "",
					backgroundColor: "#ffffff",
					animations: []
				},
				page_shapes: [{
					shape_name: "测试",
					shape_type: "text",
					propertys: {
						backgroundImage: "",
						backgroundColor: "#ffffff",
						animations: []
					},
					selected: false
				}]
			}]
		  
		
		};

		this.get_page_list = function() {
			return this.project.pages;
		}

		this.get_selected_page = function() {
			var current = null;
			if (this.get_page_list().length == 0) return null;
			angular.forEach(this.get_page_list(), function(item, i) {
				if (item.selected) {
					current = item;
				}
			});
			return current || this.get_page_list()[0];
		}

		this.select_page = function(page, index) {
			angular.forEach(this.get_page_list(), function(item, i) {
				item.selected = false;
			});

			page.selected = true;
		}

		this.select_shape = function(shape) {
			angular.forEach(this.get_page_list(), function(page) {
				angular.forEach(page.page_shapes, function(item) {
					item.selected = false;
				});
			});

			shape.selected = true;
		}

		this.get_selected_shapes = function() {
			var page = this.get_selected_page();
			var shape = null;
			angular.forEach(page.page_shapes, function(item, i) {
				if (item.selected) {
					shape = item;
				}
			});
			return shape;
		}

	});

	editor.controller("pagelist", function($rootScope,$scope, project) {
		$scope.pages = project.get_page_list();

		$scope.select_page = function(page) {
			project.select_page(page);
			$rootScope.$broadcast("editor-change");
		}
		setTimeout(function(){
			$rootScope.$apply(function(){
				$rootScope.$broadcast("editor-change");
			})
			
		},0)
		
	});

	editor.controller("toolbar", function() {

	});

	editor.controller("propertys", function($scope, project) {
        
        $scope.$on("editor-change",function(){
        	$scope.page = project.get_selected_page();
			$scope.shape = project.get_selected_shapes()||$scope.page;
			$scope.fields = get_fileds($scope.shape.propertys);
        });
        

		function get_fileds(o) {
			var fields = [];
			for (var d in o) {
				fields.push({
					propertyName: d,
					propertyDesc: d
				})
			}
			return fields;
		}

	});

	editor.controller("pageEditor", function($rootScope, $scope, project) {
		//$scope.page =$rootScope.selected_page || project.get_selected_page();
        
        
        $scope.$on("editor-change",function(){
        	$scope.page = project.get_selected_page();
        });
        
		

		$scope.getStyle = function(shape) {
			var style = {};
			style = angular.extend(style, shape.propertys)
			return style;
		}

		$scope.$on("onDrag", function(e, d) {
			var shape = project.get_selected_shapes();
			$scope.$apply(function() {
				angular.extend(shape.propertys, d);
			});

		});
		$scope.$on("onResize", function(e, d) {
			var shape = project.get_selected_shapes();
			$scope.$apply(function() {
				angular.extend(shape.propertys, d);
			});
		});
		$scope.$on("onRoate", function(e, d) {
			var shape = project.get_selected_shapes();
			$scope.$apply(function() {
				angular.extend(shape.propertys, d);
				shape.propertys.transform = 'rotate(' + shape.propertys.angle + 'deg)';
			});
		});

	});

})();