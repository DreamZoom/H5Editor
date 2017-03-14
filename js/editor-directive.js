angular.module('H5Editor')
	.directive("rpuiDrag", function($document) {
		return {
			restrict: 'A',
			scope:{
				onDrag:"&"
			},
			link: function($scope, $element, $attr) {
				var startX = 0,
					startY = 0;
				var draggableElement = angular.element('<div class="rpui-draggable"></div>');
				$element.append(draggableElement);
				draggableElement.on("mousedown", function($event) {
					$event.preventDefault();
					startX = $event.pageX - $element[0].offsetLeft;
					startY = $event.pageY - $element[0].offsetTop;
					$document.on("mousemove", mousemove);
					$document.on("mouseup", mouseup);
				});

				function mousemove($event) {
					y = $event.pageY - startY;
					x = $event.pageX - startX;
					$element.css({
						top: y + "px",
						left: x + "px"
					});
					
					$scope.$emit('onDrag', {
						top: y + "px",
						left: x + "px"
					});
					
				}

				function mouseup() {
					$document.off("mousemove", mousemove);
					$document.off("mouseup", mouseup);
				}
			}
		};

	});

angular.module('H5Editor')
	.directive("rpuiRoate", function($document) {
		return function($scope, $element, $attr) {

			var draggableElement = angular.element('<div class="rpui-roate"></div>');
			$element.append(draggableElement);
			draggableElement.on("mousedown", function($event) {
				$event.preventDefault();
				$document.on("mousemove", mousemove);
				$document.on("mouseup", mouseup);
			});

			function getAngle(px, py, mx, my) { //获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
				var x = Math.abs(px - mx);
				var y = Math.abs(py - my);
				var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
				var cos = y / z;
				var radina = Math.acos(cos); //用反三角函数求弧度
				var angle = Math.floor(180 / (Math.PI / radina)); //将弧度转换成角度

				if (mx > px && my > py) { //鼠标在第四象限
					angle = 180 - angle;
				}

				if (mx == px && my > py) { //鼠标在y轴负方向上
					angle = 180;
				}

				if (mx > px && my == py) { //鼠标在x轴正方向上
					angle = 90;
				}

				if (mx < px && my > py) { //鼠标在第三象限
					angle = 180 + angle;
				}

				if (mx < px && my == py) { //鼠标在x轴负方向
					angle = 270;
				}

				if (mx < px && my < py) { //鼠标在第二象限
					angle = 360 - angle;
				}
				console.log($element[0].offsetLeft);
				return angle;
			}

			function mousemove($event) {
				var center = {
					x: $element.offset().left + $element[0].offsetWidth / 2,
					y: $element.offset().top + $element[0].offsetHeight / 2
				};
				var angle = (getAngle(center.x, center.y, $event.pageX, $event.pageY));
				$element.css({
					transform: 'rotate(' +  angle+ 'deg)'
				});
				
				$scope.$emit('onRoate', {
					angle:angle
				});
			}

			function mouseup() {
				$document.off("mousemove", mousemove);
				$document.off("mouseup", mouseup);
			}
		};
	});

angular.module('H5Editor')
	.directive("rpuiResize", function($document) {
		return function($scope, $element, $attr) {
			var resizeUp = function($event, $startevent, $handle, $position) {
				var offset = $event.pageY - $startevent.pageY;
				var top = $position.top + offset;
				var height = $position.height - offset;
				if (height < 20) return;
				$element.css({
					top: top + "px",
					height: height + "px"
				});
				
				$scope.$emit('onResize', {
					top: top + "px",
					height: height + "px"
				});
			};

			var resizeDown = function($event, $startevent, $handle, $position) {
				var offset = $event.pageY - $startevent.pageY;
				var height = $position.height + offset;
				if (height < 20) return;
				$element.css({
					height: height + "px"
				});
				$scope.$emit('onResize', {
					height: height + "px"
				});
			};

			var resizeLeft = function($event, $startevent, $handle, $position) {
				var offset = $event.pageX - $startevent.pageX;
				var left = $position.left + offset;
				var width = $position.width - offset;
				if (width < 20) return;
				$element.css({
					left: left + "px",
					width: width + "px"
				});
				
				$scope.$emit('onResize', {
					left: left + "px",
					width: width + "px"
				});
			};

			var resizeRight = function($event, $startevent, $handle, $position) {
				var offset = $event.pageX - $startevent.pageX;
				var width = $position.width + offset;
				if (width < 20) return;
				$element.css({
					width: width + "px"
				});
				$scope.$emit('onResize', {
					width: width + "px"
				});
			};

			var handles = ["n", "e", "w", "s", "nw", "ne", "se", "sw"];
			var handleCall = {
				"n": resizeUp,
				"e": resizeRight,
				"s": resizeDown,
				"w": resizeLeft,
				"nw": function($event, $startevent, $handle, $position) {
					resizeUp.call(this, $event, $startevent, $handle, $position);
					resizeLeft.call(this, $event, $startevent, $handle, $position);
				},
				"ne": function($event, $startevent, $handle, $position) {
					resizeUp.call(this, $event, $startevent, $handle, $position);
					resizeRight.call(this, $event, $startevent, $handle, $position);
				},
				"sw": function($event, $startevent, $handle, $position) {
					resizeDown.call(this, $event, $startevent, $handle, $position);
					resizeLeft.call(this, $event, $startevent, $handle, $position);
				},
				"se": function($event, $startevent, $handle, $position) {
					resizeDown.call(this, $event, $startevent, $handle, $position);
					resizeRight.call(this, $event, $startevent, $handle, $position);
				},
			};

			angular.forEach(handles, function(handle, i) {
				var newElement = angular.element('<div class="' + handle + '-resize resize-handle"></div>');
				$element.append(newElement);
				newElement.on("mousedown", function($downevent) {
					$document.on("mousemove", mousemove);
					$document.on("mouseup", mouseup);
					var postion = {
						left: $element[0].offsetLeft,
						top: $element[0].offsetTop,
						height: $element[0].offsetHeight,
						width: $element[0].offsetWidth
					}

					function mousemove($event) {
						$event.preventDefault();
						handleCall[handle]($event, $downevent, handle, postion);
					}

					function mouseup() {
						$document.off("mousemove", mousemove);
						$document.off("mouseup", mouseup);
					}
				});
			});

		};
	});

angular.module('H5Editor').directive("rpuiShape", function($document, $compile) {
	return {
		restrict: 'A',
		template: '<div class="rpui-shape" rpui-drag rpui-resize rpui-roate></div>',
		link: function($scope, $element, $attrs) {}
	}
});

angular.module('H5Editor').directive("contenteditable", function() {
	return {
		restrict: "A",
		require: "ngModel",
		link: function(scope, element, attrs, ngModel) {

			function read() {
				ngModel.$setViewValue(element.html());
			}

			ngModel.$render = function() {
				element.html(ngModel.$viewValue || "");
			};

			element.bind("blur keyup change", function() {
				scope.$apply(read);
			});
		}
	};
});

//属性编辑器
angular.module('H5Editor').directive("fieldEditor", function() {
	return {
		restrict: "E",
		template: '<div class="field-editor" rpui-drag rpui-resize rpui-roate></div>',
		link: function(scope, element, attrs, ngModel) {

			function read() {
				ngModel.$setViewValue(element.html());
			}

			ngModel.$render = function() {
				element.html(ngModel.$viewValue || "");
			};

			element.bind("blur keyup change", function() {
				scope.$apply(read);
			});
		}
	};
});