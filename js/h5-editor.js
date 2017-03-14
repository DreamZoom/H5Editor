(function() {

	var editor = angular.module("H5Editor", ["ngSanitize", "ng-iscroll","colorpicker.module",'ui.slider']);

	editor.service("project", function() {

		this.metadata = {
			"backgroundColor": {
				displayName: "背景颜色",
				editor: "color",
				editor_params: {
					type: ""
				}
			},
			"left":{
				displayName: "位置x",
				editor: "value",
			},
			"top":{
				displayName: "位置y",
				editor: "value",
			}
		}

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
					backgroundColor: "#ffffff"					
				},
				animations: [],
				page_shapes: [{
					shape_name: "测试",
					shape_type: "text",
					propertys: {
						backgroundImage: "",
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
					backgroundColor: "#ffffff"			
				},
				animations: [],
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
					backgroundColor: "#ffffff"					
				},
				animations: [],
				page_shapes: [{
					shape_name: "测试",
					shape_type: "text",
					propertys: {
						backgroundImage: "",
						backgroundColor: "#ffffff"
						
					},
					animations: [],
					selected: false
				}]
			}],

			selected_page: null,
			selected_shape: null,
			get_selected_page:function(){
				return this.selected_page || this.pages[0];
			},
			get_selected_shape:function(){
				return this.selected_shape|| this.get_selected_page().page_shapes[0];
			},
			get_select_propertys:function(){
				return (this.selected_shape|| this.get_selected_page()).propertys;
			}

		};

		this.get_project = function() {
			return this.project;
		}

		this.get_page_list = function() {
			return this.project.pages;
		}

		this.get_selected_page = function() {
			return this.project.selected_page || this.get_page_list()[0];
		}

		this.select_page = function(page, index) {
			angular.forEach(this.get_page_list(), function(item, i) {
				item.selected = false;
			});
			page.selected = true;
			this.project.selected_page = page;

		}

		this.select_shape = function(shape) {
			angular.forEach(this.get_page_list(), function(page) {
				angular.forEach(page.page_shapes, function(item) {
					item.selected = false;
				});
			});

			if(shape) {
				shape.selected = true;
			}
			this.project.selected_shape = shape;
		}

		this.get_selected_shapes = function() {
			return this.project.selected_shape;
		}
		
		this.get_metadata=function(){
			return this.metadata;
		}

		//init
		this.project.selected_page = this.get_selected_page();

	});

	editor.controller("pagelist", function($rootScope, $scope, project) {
		$scope.project = project.get_project();

		$scope.select_page = function(page) {
			project.select_page(page);
		}

	});

	editor.controller("toolbar", function() {

	});

	editor.controller("propertys", function($scope, project) {
		$scope.project = project.get_project();
		$scope.get_fileds = function(shape,page) {
			var propertys =null;
			if(shape){
				propertys = shape.propertys;
			}
			else{
				propertys = page.propertys;
			}
			var fields = [];
			for(var d in propertys) {
				fields.push({
					propertyName: d,
					propertyDesc: d
				})
			}
			return fields;
		}
		
		$scope.get_metadata=function(filedName){
			console.log(filedName)
			return project.get_metadata()[filedName]||{
				dispalyName:filedName,
				editor:"default",
				editor_params:{}
			}
		}
		
		

	});

	editor.controller("pageEditor", function($rootScope, $scope, project) {
		//$scope.page =$rootScope.selected_page || project.get_selected_page();
		$scope.project = project.get_project();

        $scope.select_shape=function(shape){
        	project.select_shape(shape);
        }
        
		$scope.getStyle = function(shape) {
			var style = {};
			style = angular.extend(style, shape.propertys)
			return style;
		}

		$scope.$on("onDrag", function(e, d) {
			var shape = $scope.project.get_selected_shape();
			$scope.$apply(function() {
				angular.extend(shape.propertys, d);
			});

		});
		$scope.$on("onResize", function(e, d) {
			var shape = $scope.project.get_selected_shape();
			$scope.$apply(function() {
				angular.extend(shape.propertys, d);
			});
		});
		$scope.$on("onRoate", function(e, d) {
			var shape = $scope.project.get_selected_shape();
			$scope.$apply(function() {
				angular.extend(shape.propertys, d);
				shape.propertys.transform = 'rotate(' + shape.propertys.angle + 'deg)';
			});
		});

	});

})();