var herospotAnimation = {
	INTERVAL_TIME: 0,
	START_IN: 0,
	REPLAY: "false",	
	
	animation: new Array({
		img_id: "",
		timeout: 0,
		to_exe: "",
		style:""
	}),	
	
	animationX: function () {
		this.img_id= "";
		this.timeout= 0;
		this.to_exe= "";
		this.style= "";	
	},	
	
	init: function () {
		//Waiting time to display the animation
		herospotAnimation.START_IN = $('.header-content-wrapper-animated').attr('start_in');
		//Option to replay the animation		
		if($('.header-content-wrapper-animated').attr('replay')){			
				herospotAnimation.REPLAY=$('.header-content-wrapper-animated').attr('replay');
			}
		//Create Animation
		setTimeout("herospotAnimation.DoAnimation()",herospotAnimation.START_IN); 			
	},
	
	DoAnimation: function () {
		var slide = {
			time: 0,
			direction: '',
			x_pos: '0',
			y_pos: '0',
			opacity:''
		}
		
		function slideX() {  
			this.time = 0;  
			this.direction = '';  
			this.x_pos = '0';  
			this.y_pos = '0'; 
			this.opacity=''; 
		} 	
		
		//Get the values for each animation image
		$('.header-content-wrapper-animated').find('.animated').each(function(a) {	
			//In Animation Array
			var img = $(this).attr("id");
			herospotAnimation.animation[a] = new herospotAnimation.animationX();
			herospotAnimation.animation[a].img_id = img;
			herospotAnimation.animation[a].timeout = $(this).attr('interval_time');
			herospotAnimation.animation[a].style=$(this).attr('style');	
						
			var slideArrayObject = new Array();  
								
			//Add each attribute to its position			
			var attrs = $(this)[0].attributes;		
			
			for(var i=0;i<attrs.length;i++) {	
				//Get the position from the nodeName
				var p = attrs[i].nodeName.match(/\d+$/);
				if(p!=null)
				{	
					//Get the attribute name that correspond to the feature animation: x_pos, y_pos, time, direction, opacity
					var att_name = attrs[i].nodeName.replace(p,'');

					if(att_name in slide){
						if(typeof slideArrayObject[p] == 'undefined'){
							var slideV = new slideX();
							slideArrayObject[p] = slideV;
						}
						slideArrayObject[p][att_name] = attrs[i].nodeValue;
					}
				}
			}
			
			herospotAnimation.INTERVAL_TIME = 0;
			//Build the string from the array
			string_animation =	"$('#" + img + "')";
			for(w=0, pos=0; w<slideArrayObject.length; w++, pos=0 ) {					
				if(typeof slideArrayObject[w] != 'undefined')
					{			
						//Get the total duration of the last image in the animation
						if(a == ($('.header-content-wrapper-animated').find('.animated').length-1)){
							herospotAnimation.INTERVAL_TIME += parseInt(slideArrayObject[w].time);
						}
						
						if(slideArrayObject[w].opacity != ""){
							//string_animation += ".removeAttr('filter').animate({opacity:'" + slideArrayObject[w].opacity + "'},"+ slideArrayObject[w].time +")";
							string_animation += ".animate({opacity:'" + slideArrayObject[w].opacity + "'},"+ slideArrayObject[w].time +")";
						}
						else{
							if(typeof slideArrayObject[w].direction != 'undefined' && slideArrayObject[w].direction != ""){
								pos = (slideArrayObject[w].direction == 'right' || slideArrayObject[w].direction == 'left') ? slideArrayObject[w].x_pos : slideArrayObject[w].y_pos; 
								string_animation +=	".animate({" + slideArrayObject[w].direction + ":'" + pos + "px'},"+ slideArrayObject[w].time +")";
							}
							else {
								//console.log('You have missed the value direction for the slide animation');	
							}
						}
					}
			}
			//insert in AnimationArray
			herospotAnimation.animation[a].to_exe = string_animation;
		});		
		if(herospotAnimation.REPLAY == "true"){
			$('.header-content-wrapper-animated').append("<a href='' class='display_animation' title='Play Animation' style='opacity:0; filter:alpha(opacity=0); ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);' ></a>");
			herospotAnimation.ClickEvent();
		}	
		herospotAnimation.RunAnimation();
	},
	RunAnimation: function () {
		//Execute
		//var string_animation;		
		for(i=0, id=''; i< herospotAnimation.animation.length; i++) {			
			id=herospotAnimation.animation[i].img_id;
			$('#' + id).attr('style', herospotAnimation.animation[i].style);
		}
		
		for(i=0; i< herospotAnimation.animation.length; i++) {			
				setTimeout(herospotAnimation.animation[i].to_exe,herospotAnimation.animation[i].timeout);
		}
		
		var last_time = parseInt(herospotAnimation.START_IN) + parseInt(herospotAnimation.animation[i-1].timeout) + parseInt(herospotAnimation.INTERVAL_TIME);
		//At the end... Add icon to replay
		if(herospotAnimation.REPLAY == "true"){
			setTimeout("herospotAnimation.CreateClickEvent()",last_time);
		}	
	},
	CreateClickEvent: function () {
		//Create button
		setTimeout("$('.display_animation').animate({opacity:'1'},0);",0);	 
	},
	ClickEvent: function () {
		 $(".display_animation").click(function() {
			 $(this).animate({opacity:'0'},0);
			 herospotAnimation.RunAnimation();
			 return false;
		 });	 
	}
}

$(document).ready(function() {
	var animation_ready = ($('.header-content').length && $('.header-content-wrapper-animated').length) ? true : false;
	if (animation_ready) herospotAnimation.init();
});