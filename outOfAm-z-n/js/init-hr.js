/* global functions and variables */
var $window,$body;		// portent bien leur nom
var getWidth;			// fonction de mise à la bonne largeur (en fonction de l'usage)
var rW=10,rH=5,rW0,rWg,rWi; // largeur et hauteur de la zone de tracé + variables largeurs initiales graphes et illustrations

(function($) {
	$(function() {
		$window = $(window),
		$body = $('body');
	// Disable animations/transitions until the page has loaded.
		$body.addClass('is-loading');
		$window.on('load', function() {
			$body.removeClass('is-loading');
		});

	// removable menu for handeld device
		$('#navIcon').click(function(){
			$('#nav').toggleClass('active')
			});

	// function that get width of #main element
	getWidth=function(usage) {
		switch(usage) {
			case 'map' :
				rW=$(window).width();
				rH=$(window).height()-120;
				break;
			case 'graph' :
				rW=$('#main').width();
				rH=rW/2;
				break;
			case 'full' :
				rW=$('#main').width();
				rH=$(window).height();
				break;
			default :
				rW=$('#main').width();
				rH=$(window).height();
				if(rW0==null) rW0=rW;
			}
	}

    // detect new suggested bookstore in url (from bookstore website)
    if(document.location.href.match(/\?bookstore=/g)) {

    }
    })
})(jQuery);
