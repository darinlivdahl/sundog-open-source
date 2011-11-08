var ageReqMet = false;

function validateForm(id,standalone) {
	$('#' + id).submit(function() { return checkForm(id,standalone); }); // check validation on submit
	if ($('.rel').length) expandForm('input:radio, select'); // form expansions
	if ($('.ffage').length) ageAccess(id,'Are_you_over_the_age_of_13__c'); // age check
}

function expandForm(els) {
	var a = 'data-rel'; // target element atribute
	var req = '.ffreq'; // required class value
	if ($([a]).length && els != undefined) { // check if relationships exists
		var ffArr = []; ffArr = els.split(', '); // form field array
		
		jQuery.each(ffArr, function(index, type) { // bind event handlers based on field type
			switch(type) {
				case 'input:radio':
					$(type).click(function() {
						var $group = $(this).siblings(type);
						var rel = $(this).attr(a);
						updateForm($group, rel);
					});
					break;
				case 'select':
					$(type).change(function() {
						var $group = $(this).children('option').not(':selected');
						var rel = $(this).children('option:selected').attr(a);
						updateForm($group, rel);
					});
					break;
			}
		});
		function updateForm(g,r) { // show target relationship if exists, hide others
			if (r != undefined) {
				$('#' + r).fadeIn();
				$('#' + r).find(req).each(function() {
					$(this).attr('required','required');
				});
			}
			$(g).each(function() {
				r = $(this).attr(a);
				if (r != undefined) {
					$('#' + r).hide();
					$('#' + r).find(req).removeAttr('required');
					// clear field values if closed
					$('#' + r).find('input').not(':button, :reset, :submit, :hidden').val('');
					$('#' + r).find('select, textarea').val('');
					$('#' + r).find('input:radio, input:checkbox').removeAttr('checked');
				}
			});	
		}
	} else {
		return false;
	}
}

function checkForm(formId,standalone) {
	var e = new Array();
	var eMessage = "";
	var message = "";
	
	// Check for error p tag
	if ($("#formerr").get(0) == null && standalone == true) { $("#" + formId).prepend("<p id='formerr'></p>"); }
	
	// Clear all highlighting from required fields
	$("#" + formId).find('.ff').removeClass('ffalert');
	
	// Run blank validation
	$("#" + formId).find("[required]").each(function() {
		if ($(this).is('input:not(:radio), textarea')) {
			if ($(this).val() == null || $(this).val() == "") {
				message = "Please enter a valid entry for " + $(this).attr('title') + "<br />";
				e.push($(this).attr('id'));
				eMessage += message;
			}
		} else if ($(this).is('select')) {
			if ($(this).find('option').eq(0).is(':selected')) { // check select menu
				message = "Please select an option for " + $(this).attr('title') + "<br />";
				e.push($(this).attr('id'));
				eMessage += message;
			}
		}
	});
	
	// Run blank validation on radio buttons
	var radioGroupArr = [];
	var groupName;
	// find all required radio groups, add to array
	$("#" + formId).find('input[required]:radio').each(function() {
		groupName = $(this).attr('name');
		if ($.inArray(groupName,radioGroupArr) == -1) { // check array for radio group name
			radioGroupArr.push(groupName);
		}
	});
	// loop through required radio button groups, check for unchecked required groups
	$.each(radioGroupArr, function(i,val) {
		var nextMove = false;
		$("#" + formId).find("input[name='" + val + "']").each(function() {
			if ($(this).is(':checked')) {
				nextMove = true;
				return; // stop checking
			}
		});
		if (!nextMove) {
			message = "Please choose an option for " + $("#" + formId).find("input[name='" + val + "']").eq(0).attr('title') + "<br />";
			e.push($("#" + formId).find("input[name='" + val + "']").eq(0).attr('id'));
			eMessage += message;
		}
	});
			
	// Run Email validation
	$("#" + formId).find(".ffemail").each(function(){
		if(!validateEmailAddress($(this).val())) {
			message = "Please enter a valid email address for " + $(this).attr('title') + "<br />";
			e.push($(this).attr('id'));
			eMessage += message;
		}
	});
	// think of a way to do pairings and repeat instead of applying it to entire form
	var emailStr;
	var emailSet = false;
	$("#" + formId).find(".emailconfirm").each(function() {
		if (emailSet != true) {
			emailStr = $(this).val();
			emailSet = true;
		} else if (emailSet == true && emailStr != $(this).val()) {
			message = "Email Address does not match" + "<br />";
			e.push($(this).attr('id'));
			eMessage += message;
		}
	});
	// Run Zip code validation
	$("#" + formId).find(".ffzip").each(function(){
		if(!validateNumString($(this).val(), 5) && !validateCanZip($(this).val())) {
			message = "Please enter a valid zip code for " + $(this).attr('title') + "<br />";
			e.push($(this).attr('id'));
			eMessage += message;
		}
	});
	// Run Phone validation
	$("#" + formId).find(".ffphone").each(function(){
		if(!validatePhone($(this).val())) {
			message = "Please enter a valid phone number (including area code) for " + $(this).attr('title') + "<br />";
			e.push($(this).attr('id'));
			eMessage += message;
		}
	});
	// Run Age validation
	if (!ageReqMet) {
		message = "You must be over 13 to submit this form." + "<br />";
		e.push($('.ffage').attr('id'));
		eMessage += message;
	}
	// Outline all errored fields in red
	if(e.length > 0) {
		$(e).each(function(i, ele) {
			$("#" + ele).parent('.ff').addClass('ffalert');
		});
		if (standalone == true) {
			$("#formerr").html(eMessage);
			window.scrollTo(0,400);
		}
		return false;
	} else { $("#formerr").remove(); }
}

// ---------------------- Utility Functions ---------------------- //

function validateEmailAddress(email) {
	var valid = true;
	/* if the email address is blank, then just return true */
	if(email == "") { return true; }
	/* validate the format */
	var emailReg = "^[\\w-_\.+]*[\\w-_\.]\@([\\w]+\\.)+[\\w]+[\\w]$";
	var regex = new RegExp(emailReg);
	if(regex.test(email) !== true) { valid = false; }
	return valid;
}
function validateNumString(val, num) {
	var valid = true;
	var regex;
	/* if the email address is blank, then just return true */
	if(val == "") { return true; }
	/* validate the format */
	numReg = "^\\d{" + num + "}$";
	var regex = new RegExp(numReg);
	if(regex.test(val) !== true) { valid = false; }
	return valid;
}
function validateCanZip(val) {
	var valid = true;
	var regex;
	/* if the email address is blank, then just return true */
	if(val == "") { return true; }
	/* validate the format */
	var numReg = "^[a-zA-Z]\\d[a-zA-Z]\\s\\d[a-zA-Z]\\d$";
	var regex = new RegExp(numReg);
	if(regex.test(val) !== true) { valid = false; }
	return valid;
}
function validatePhone(val) {
	var valid = true;
	var regex;
	/* if the phone number is blank, then just return true */
	if(val == "") { return true; }
	var phoneReg = "^\\(?\\d{3}\\)?[\\s\.-]?\\d{3}[\\s\.-]?\\d{4}$";
	var regex = new RegExp(phoneReg);
	if(regex.test(val) !== true) { valid = false; }
	return valid;
}
function ageAccess(form, val) {
	$('[name="' + val + '"]').click(function() {
		if ($(this).val() == 'no' && $(this).is(':checked')) {
			$('#' + form + ' input, #' + form + ' select').not('[name="' + val + '"]').attr('disabled','disabled');
			ageReqMet = false;
		} else if ($(this).val() == 'yes' && $(this).is(':checked')) {
			$('#' + form + ' input, #' + form + ' select').not('[name="' + val + '"]').removeAttr('disabled');
			ageReqMet = true;
		}
	});
}
function isNumeric(num){
    return !isNaN(num)
}
function selectDOBMsg(month,day,year,age,msg) {
	var $parentFF = $('#' + year).parent('.ff');
	$parentFF.find('select').change(function() {
		var msgOn = $parentFF.find('.dob-msg').length;
		var monthVal = $('#' + month).val();
		var dayVal = $('#' + day).val();
		var yearVal = $('#' + year).val();
		if (isNumeric(monthVal) && isNumeric(dayVal) && isNumeric(yearVal)) {
			var min_age = age;
			var DOBmonth = $('#' + month).val();
			var DOBday = $('#' + day).val();
			var DOByear = $('#' + year).val();
			var DOBtheirDate = new Date(parseInt(DOByear) + min_age, DOBmonth-1, DOBday);
			var DOBtoday = new Date();
			if ((DOBtoday.getTime() - DOBtheirDate.getTime()) >= 0) {
				if (msgOn) $parentFF.find('.dob-msg').remove();
			} else {
				if (!msgOn) $parentFF.append("<p class='dob-msg'>" + msg + "</p>");
				$parentFF.find('.dob-msg').fadeIn();
			}
		}
	});
}

function ageCheck(e) {
	var optionGrp_name = $(e).attr('name');
	var selected_option = $(e).val();
	if (selected_option == 'N') {
		$('#req-age').fadeIn('fast');
		$(e).parents('form').find('input, select').not('[name="' + optionGrp_name + '"]').attr('disabled','disabled');
	} else {
		if ($('#req-age').is(':visible')) {
			$('#req-age').hide();
		}
		$(e).parents('form').find('input, select').removeAttr('disabled');
	}
}

function showContactOptions(e) {
	if ($(e).val() == 'Phone') {
		$('#contacted-phone-lnk').fadeIn('fast');
	} else {
		if ($('#contacted-phone-lnk').is(':visible')) {
			$('#contacted-phone-lnk').hide();
		}
	}
}

function simpleFollowUp(e,obj) {
	var $t = $('#' + obj);
	var this_val = $(e).val();
	var toggle = (this_val.toLowerCase() == 'yes' || this_val.toLowerCase() == 'y') ? true : false;
	if (toggle) {
		$t.fadeIn('fast');
	} else {
		if ($t.is(':visible')) {
			resetFieldset(obj);
			$t.hide();
		}
	}
}
function resetFieldset(obj) {
	$('#' + obj).find('input:text').val('');
	$('#' + obj).find('select, textarea').val('');
	$('#' + obj).find('input:radio, input:checkbox').removeAttr('checked');
	$('#' + obj).find('.rel').hide();
}