$(function() {
	$(".scoll-wrapper").each(function(i, item) {
		window.scroll = new IScroll(item, {
			scrollbars: true,
			mouseWheel: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			fadeScrollbars: true
		});
	})
})