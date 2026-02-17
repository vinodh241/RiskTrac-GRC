var Dashboard = function () {
	var sidebarChangeWidth = function sidebarChangeWidth() {

	$("body").toggleClass("sidebar-is-reduced sidebar-is-expanded");
	$(".hamburger-toggle").toggleClass("is-opened");

};

return {
	init: function init() {
		$(".js-hamburger").on("click", sidebarChangeWidth);

	}
};
}();

Dashboard.init();
//# sourceURL=pen.js