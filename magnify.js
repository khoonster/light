$(document).ready(function(){

	             $(document).scroll(function(){
	             if(document.documentElement.clientHeight +
	             $(document).scrollTop() >= document.body.offsetHeight )$(document).scrollTop(0);
	             });

	var num_germs = 166;

	// Clone the existing .magnify div a bunch of times
	var $magnifiers = $("#magnifiers");
	var $source_germ = $("#magnify1");
	for (var i = 2; i <= num_germs; i++) {
		// Convert i to a padded string like "02";
		var str_number = "" + i;
		var pad = "00000";
		var padded_number = pad.substring(0, pad.length - str_number.length) + str_number;
		console.log("Creating", padded_number);

		// Clone a new .magnify div from the original one, but don't put it into
		// the DOM yet -- first customize it
		var $new_germ = $source_germ.clone();

		// First update its id attribute
		$new_germ.attr("id", "magnify" + i);
		
		$new_germ.find(".small").attr("width", generateRandomWidth());
		
		$new_germ.css({"margin-top" : "-"+(generateRandomMargin()+15)+"px"});
		$new_germ.css({"margin-bottom" : "-"+generateRandomMargin()+"px"});
		$new_germ.css({"margin-left" : "-"+generateRandomMargin()+"px"});
		$new_germ.css({"margin-right" : "-"+generateRandomMargin()+"px"});
		// Then update its images
		$new_germ.find(".small").attr("src", "lightsmall_" + padded_number + ".gif");
		$new_germ.find(".large").attr("style", "background-image: url('lightlarge_" + padded_number + ".gif');")

		// NOW insert the cloned, modified .magnify div into the DOM
		$magnifiers.append($new_germ);
	}
	
	function generateRandomWidth()
		{
			
			var min =100;
			var max = 200;
			var maxMin = max-min+1;
			var rand = Math.random()*(maxMin)+min; 			
			var finalRand= Math.floor(rand);
			return finalRand;
		}
		
		function generateRandomMargin()
		{
			var min =20;
			var max = 40;
			var maxMin = max-min+1;
			var rand = Math.random()*(maxMin)+min; 			
			var finalRand= Math.floor(rand);
			return finalRand;
		}

	//Now the mousemove function, on every .magnify div
	$(".magnify").mousemove(function(e){

		// Find the .small and .large div's _within_ this .magnify div
		var $germ = $(this);
		var $small = $germ.find(".small");
		var $large = $germ.find(".large");

		// Retrieve these values from this .magnify div, so they are scoped to this div
		var native_width = $germ.data("native_width");
		var native_height = $germ.data("native_height");

		//When the user hovers on the image, the script will first calculate
		//the native dimensions if they don't exist. Only after the native dimensions
		//are available, the script will show the zoomed version.
		if(!native_width && !native_height)
		{
			//This will create a new image object with the same image as that in .small
			//We cannot directly get the dimensions from .small because of the
			//width specified to 200px in the html. To get the actual dimensions we have
			//created this image object.
			var image_object = new Image();
			image_object.src = $small.attr("src");

			//This code is wrapped in the .load function which is important.
			//width and height of the object would return 0 if accessed before
			//the image gets loaded.
			native_width = image_object.width;
			native_height = image_object.height;

			// Store these values on the .magnify div so we can retrieve them in a
			// future mouseover event, scoped to this div
			$germ.data({native_width: native_width, native_height: native_height});
		}
		else
		{
			//x/y coordinates of the mouse
			//This is the position of .magnify with respect to the document.
			var magnify_offset = $(this).offset();
			//We will deduct the positions of .magnify from the mouse positions with
			//respect to the document to get the mouse positions with respect to the
			//container(.magnify)
			var mx = e.pageX - magnify_offset.left;
			var my = e.pageY - magnify_offset.top;

			if(mx < $(this).width() && my < $(this).height() && mx > 0 && my > 0)
			{
				// If the mouse is inside the container, fade this glass in
				$large.fadeIn(100);
				// And fade al other glasses out, just in case any got orphaned
				$('.large:visible').not($large).fadeOut(0);
			}
			else
			{
				// If the mouse is outside the container, fade this glass out
				$large.fadeOut(0);
			}
			if($large.is(":visible"))
			{
				//The background position of .large will be changed according to the position
				//of the mouse over the .small image. So we will get the ratio of the pixel
				//under the mouse pointer with respect to the image and use that to position the
				//large image inside the magnifying glass
				var rx = Math.round(mx / $small.width() * native_width - $large.width() / 100) * -2;
				var ry = Math.round(my / $small.height() * native_height - $large.height() / 100) * -2;
				var bgp = rx + "px " + ry + "px";

				//Time to move the magnifying glass with the mouse
				var px = mx - $large.width() / 2;
				var py = my - $large.height() / 2;
				//Now the glass moves with the mouse
				//The logic is to deduct half of the glass's width and height from the
				//mouse coordinates to place it with its center at the mouse coordinates

				//If you hover on the image now, you should see the magnifying glass in action
				$large.css({left: px, top: py, backgroundPosition: bgp});
			}
		}
	})
})
