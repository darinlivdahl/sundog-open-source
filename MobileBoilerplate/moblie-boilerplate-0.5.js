/********************* MOBILE SCRIPTS **************************/

// mbp = mobile boilerplate
var mobile = false;
var mbp = {
	//set desired widths
	MOBILE_WIDTH: 540, 
	TABLET_WIDTH: 768, 
	DESKTOP_WIDTH: 1024,
	
	//set flags
	mobile_enabled: false, 
	menu_created: false,
	
	//getters for cloning  var: $selector
	menuObj: null,
	get_elementA: jQuery('#id'),
	get_elementB: jQuery('#id'),
	get_elementC: jQuery('#id').val(),
	get_elementD: jQuery('#id').text(),
	
	// setters for cloning. setters are null, values given later.
	set_elementA: null,	
	set_elementB: null,	
	set_elementC: null,
	set_elementD: null,		
	
	// start functions	
	getMobileStatus: function() {
		return mbp.mobile_enabled;
	},
	setMobileStatus: function(status) {
		mbp.mobile_enabled = status;
	},
	adaptForBreakpoints: function() {
	// this checks for window size and resize events
		var win_width = jQuery(window).width();
		if(win_width <= mbp.MOBILE_WIDTH && mbp.getMobileStatus() == false) {
			if(!mbp.menu_created) {
				mbp.createMobileMenu();
			}
			mbp.enableMobile(win_width);
		} else if(win_width > mbp.MOBILE_WIDTH && mbp.getMobileStatus() == true) {
			mbp.disableMobile(win_width);
		}
	},
	createMobileMenu: function() {
	// function to create the new elements. only runs first time throught.	
		//clone the items that need to be cloned. clone(true) clones events that were previously set, clone() does not	
		mbp.set_elementA = mbp.get_elementA.clone(true);
		mbp.get_elementA.hide();
		
		mbp.set_elementB = mbp.get_elementB.clone();
		mbp.get_elementB.hide();
		
		mbp.set_elementC = mbp.get_elementC.clone();
		mbp.get_elementC.hide();
		
		//put the new elements into the dom whever you want	
		// example::
		mbp.get_elementA.empty();
		mbp.get_elementA.before('<div id="newLogin"></div>');
		mbp.set_elementC.appendTo('#newLogin');
		mbp.set_elementC.removeAttr('style').attr('id','new_login_child').appendTo('#newLogin');
		
		// example 2::
		mbp.set_elementD = mbp.get_elementD.clone(true);
		mbp.get_elementD.hide();
		jQuery('#homeContainer, #content').before(mbp.newSearchObj.attr('id','mobileSearch'));
		jQuery('#mobileSearch .search').removeAttr('value onblur').attr({
			placeholder: 'search...'
		});
				
		//example condition statement
		if(jQuery('body').hasClass('home')) {
			mbp.newMainNavObj = mbp.mainNavObj.clone();
			mbp.mainNavObj.hide();
			jQuery('#homeContainer').before('<div id="mobileMainNav"><div id="mainMenuBtn"><a href="javascript:void(0);">MENU</a></div></div></div>');
			mbp.newMainNavObj.attr('id','mobileNav').appendTo('#mobileMainNav');
		}
		
		// set the flag for the menu being created. we wont return to this again.
		mbp.menu_created = true;
	},
	//enable mobile view
	enableMobile: function(w) {
		//we hide the old and show the new on resize
		mbp.get_elementA.hide();
		mbp.get_elementB.hide();
		mbp.get_elementC.hide();
		mbp.set_elementA.show();
		$('#somethingElse').show();  
		
		//set flag		
		mbp.setMobileStatus(true);
	},
	// disable mobile view
	disableMobile: function(w) {
		// we hide the new and show the old
		mbp.get_elementA.show();
		mbp.get_elementB.show();
		mbp.get_elementC.show();
		mbp.set_elementA.hide();
		$('#somethingElse').hide();
		 
		//set flag
		mbp.setMobileStatus(false);
	}	
} //end var mbp

$(document).ready(function() {

	// check for mobile on load
	mbp.adaptForBreakpoints();
	
	// resize to mobile if needed
	var resize_id;
	$(window).resize(function() {
		clearTimeout(resize_id);
		resize_id = setTimeout(mbp.adaptForBreakpoints, 200); // run checksize when resize has stopped
	});	
});