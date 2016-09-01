(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    $('.modal-trigger').leanModal();
    $('select').material_select();
     	var options = [
	    	{selector: '#quotes-list-stagger', offset: 300, callback: function(el) {
	      		Materialize.showStaggeredList($(el));
	    	} },
	    	{selector: '#quotes-list-stagger2', offset: 300, callback: function(el) {
	      		Materialize.showStaggeredList($(el));
	    	} }
		];
	Materialize.scrollFire(options);

  }); // end of document ready
})(jQuery); // end of jQuery name space