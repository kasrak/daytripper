app.factory('Foursquare', function($rootScope, Matrix) {
	//App Credentials
	var CLIENT_ID = "HE5JMHFU0A4ZWQWYZPUTHH2JID4DBE2IJP5ICMVHJXCVNGZ2";
	var CLIENT_SECRET = "2O4ZBJ1EWCCEYKTTPYBPEBI3N4YY4ZBSGD3M3X4STRPBUMPX";

	//Category Ids
	var RESTAURANT = "4bf58dd8d48988d1c4941735";
	var BREAKFAST = "4bf58dd8d48988d143941735";
	var BAR = "4bf58dd8d48988d116941735";
	var LANDMARKS = "4bf58dd8d48988d12d941735";
	var AQUARIUM = "4fceea171983d5d06c3e9823";
	var	GALLERY = "4bf58dd8d48988d1e2931735";
	var CASINO = "4bf58dd8d48988d17c941735";
	var ENTERTAINMENT = "4bf58dd8d48988d1f1931735";
	var HISTORIC = "4deefb944765f83613cdba6e";
	var MUSEUM = "4bf58dd8d48988d181941735";
	var STADIUM = "4bf58dd8d48988d184941735";
	var NEIGHBORHOOD = "4f2a25ac4b909258e854f55f";
	var MALL = "4bf58dd8d48988d1fd941735";
	var MARKET = "4bf58dd8d48988d1fa941735";

	//foood
	var AMERICAN = "4bf58dd8d48988d14e941735";
	var AREPA = "4bf58dd8d48988d152941735";
	var ASIAN = "4bf58dd8d48988d142941735";
	var BBQ = "4bf58dd8d48988d1df931735";
	var BURGER = "4bf58dd8d48988d16c941735";
	var CAFE = "4bf58dd8d48988d16d941735";
	var CAJUN = "4bf58dd8d48988d17a941735";
	var CARRIBEAN = "4bf58dd8d48988d144941735";
	var CUBAN = "4bf58dd8d48988d154941735";
	var DELI = "4bf58dd8d48988d146941735";
	var DIMSUM = "4bf58dd8d48988d1f5931735";
	var DINER = "4bf58dd8d48988d147941735";
	var ETHIOPIA = "4bf58dd8d48988d10a941735";
	var TRUCK = "4bf58dd8d48988d1cb941735";
	var FRENCH = "4bf58dd8d48988d10c941735";
	var GASTROPUB = "4bf58dd8d48988d155941735";
	var GERMAN = "4bf58dd8d48988d10d941735";
	var GREEK = "4bf58dd8d48988d10e941735";
	var INDIAN = "4bf58dd8d48988d10f941735";
	var ITALIAN = "4bf58dd8d48988d110941735";
	var JAPANESE = "4bf58dd8d48988d111941735";
	var KOREAN = "4bf58dd8d48988d113941735";
	var MEDITERRANEAN = "4bf58dd8d48988d1c0941735";
	var MEXICAN = "4bf58dd8d48988d1c1941735";
	var MIDDLEEASTERN = "4bf58dd8d48988d115941735";
	var MOLEGASTRO = "4bf58dd8d48988d1c2941735";
	var PORTUGUESE = "4def73e84765ae376e57713a";
	var RAMEN = "4bf58dd8d48988d1d1941735";
	var SALAD = "4bf58dd8d48988d1bd941735";
	var SANDWICH = "4bf58dd8d48988d1c5941735";
	var SEAFOOD = "4bf58dd8d48988d1ce941735";
	var SOUP = "4bf58dd8d48988d1dd931735";
	var SOUTHAMERICAN = "4bf58dd8d48988d1cd941735";
	var SOUTHERN = "4bf58dd8d48988d14f941735";
	var SPANISH = "4bf58dd8d48988d150941735";
	var STEAK = "4bf58dd8d48988d1cc941735";
	var SUSHI = "4bf58dd8d48988d1d2941735";
	var SWISS = "4bf58dd8d48988d158941735";
	var TACO = "4bf58dd8d48988d151941735";
	var THAI = "4bf58dd8d48988d149941735";
	var VEGGIE = "4bf58dd8d48988d1d3941735";
	var VIETNAMESE = "4bf58dd8d48988d14a941735";
	var WINGS = "4bf58dd8d48988d14b941735";


    var Foursquare = function() {
		this.route=[];
		this.done = null;
		this.progress = null;
		this.foundcb = null;
		this.getPhotos("3fd66200f964a5209df11ee3", null);
    };

	Foursquare.prototype.getRoute = function(ll, done, progress){
    this.route=[];
		this.ll=ll;
		this.getNext(ll, 'T');
		this.done = done;
		this.progress = progress;
	};

	Foursquare.prototype.getMiddleVenue = function(ll1, ll2, type){
		var ll = [(ll1[0]+ll2[0])/2, (ll1[1]+ll2[1])/2];
		var radius = 500;

		var pointa = new google.maps.LatLng(ll1[0], ll1[1]);
		var pointb = new google.maps.LatLng(ll2[0], ll2[1]);
		Matrix.run([pointa], [pointb], function(response, status){
            radius = response.rows[0].elements[0].distance.value/2;
		});

		this.call4sq(ll, radius, type, 'a');
	};

	Foursquare.prototype.replaceVenue = function(index, type, foundcb){
        /* Types:
         * B    breakfast
         * L    lunch
         * D    dinner
         * T    general tourism
         * N    nightlife
         */
		this.foundcb = foundcb;
		this.index = index;
		var radius = 500;
		if (index > 0 && index < this.route.length - 1){
			ll2 = [this.route[index-1].location.lat, this.route[index-1].location.lng];
			ll1 = [this.route[index+1].location.lat, this.route[index+1].location.lng];
		}else{
			if (index == 0){
				ll2 = [this.route[1].location.lat, this.route[1].location.lng];
				ll1 = this.ll;
			}else if (index == this.route.length-1){
				ll2 = [this.route[index-1].location.lat, this.route[index-1].location.lng];
				ll1 = this.ll;
			}
		}

		var ll = [(ll1[0]+ll2[0])/2, (ll1[1]+ll2[1])/2];
	
		var pointa = new google.maps.LatLng(ll1[0], ll1[1]);
		var pointb = new google.maps.LatLng(ll2[0], ll2[1]);
		Matrix.run([pointa], [pointb], function(response, status){
            radius = response.rows[0].elements[0].distance.value/2;
            if (radius < 500)
				radius = 500;
		});
		this.call4sq(ll, radius, type, 'r');
	};

	Foursquare.prototype.getNext = function(ll, type) {
		var radius = 10000;
    if (this.route.length > 0){
      var prev;
      if (this.route.length == 1)
        prev = this.ll;
      else
        prev = [this.route[0].location.lat, this.route[0].location.lng];
      ll[0] = ll[0] + (Math.random()-0.5)*(ll[0] - prev[0]);
      ll[1] = ll[1] + (Math.random()-0.5)*(ll[1] - prev[1]);
    }
		this.call4sq(ll, radius, type, 'a');
    };


	Foursquare.prototype.replace = function(venues){
		this.route[this.index] = venues[this.getBest(venues)];
		this.foundcb();
	};

	Foursquare.prototype.alreadyInRoute = function(venue){
		if (this.route === null)
			return false;
		for (var i = 0; i < this.route.length; i++)
			if (this.route[i].id == venue.id)
				return true;
		return false;
	};

	Foursquare.prototype.getBest = function(venues){
		var self = this;
		var scores = [];
		_.each(venues, function(venue){
			if (venue.categories[0].name === "Coffee Shop" || venue.categories[0].name==="Hotel" || venue.categories[0].name === "Office" || venue.categories[0].name === "Grocery Store"|| venue.categories[0].name === "Bank"|| venue.categories[0].name === "Bookstore")
				scores.push(0);
			else if (self.alreadyInRoute(venue))
				scores.push(0);
			else
				scores.push(venue.stats.checkinsCount/venue.location.distance);
		});

		var temp = scores.slice(0);
		temp.sort(function(a,b){return a-b;});
		var picks;
		if (venues.length >10)
			picks = 10;
		else
			picks = venues.length;
		return scores.indexOf(temp[temp.length-Math.floor((Math.random()*picks))-1]);
	};

	Foursquare.prototype.append = function(venues){
		if (venues !== null){
			switch(this.route.length){
        case 0:
        case 1:
        case 2:
          this.route.push(venues[this.getBest(venues)]);
          break;
        case 3:
          this.route.splice(0,0,venues[this.getBest(venues)]);
          break;
        case 4:
          this.route.splice(2,0,venues[this.getBest(venues)]);
          break;
        case 5:
          this.route.splice(4,0,venues[this.getBest(venues)]);
          break;
        case 6:
          this.route.splice(6,0,venues[this.getBest(venues)]);
          break;
      }
		}


		switch(this.route.length){
			case 1:
				this.getNext([this.route[0].location.lat,this.route[0].location.lng], 'T');
				this.progress(1/7);
				break;
			case 2:
				this.getNext([this.route[1].location.lat,this.route[1].location.lng], 'T');
				this.progress(2/7);
				break;
			case 3:
				this.getMiddleVenue(this.ll, [this.route[0].location.lat,this.route[0].location.lng], 'B');
				this.progress(3/7);
				break;
			case 4:
				this.getMiddleVenue([this.route[2].location.lat,this.route[2].location.lng], [this.route[1].location.lat,this.route[1].location.lng], 'L');
				this.progress(4/7);
				break;
			case 5:
				this.getMiddleVenue([this.route[4].location.lat,this.route[4].location.lng], [this.route[3].location.lat,this.route[3].location.lng], 'D');
				this.progress(5/7);
				break;
			case 6:
				this.getMiddleVenue([this.route[5].location.lat,this.route[5].location.lng],this.ll, 'N');
				this.progress(6/7);
				break;
			case 7:
				this.progress(1);
				this.done();
				console.log(this.route);
				break;
		}
	};

	function getStrList(cat){
		//returns serialized list seperated by commas
		var str = "";
		for (var i = 0; i < cat.length-1; i++){
			str += (cat[i]+",");
		}
		str += cat[cat.length-1];
		return str;
	}

	Foursquare.prototype.call4sq = function(ll, radius, type, action){
		//takes tuple of latitue and longitude as input
		//type -> B: Breakfast, N: Nightlife, T: Tourspots, F: Food other than breakfast
		var category;
		var self =  this;
		switch(type){
			case 'T':
				category = [MALL, MARKET, NEIGHBORHOOD, LANDMARKS, AQUARIUM, GALLERY, CASINO, HISTORIC, MUSEUM];
				break;
			case 'B':
				category = [BREAKFAST, CAFE, DIMSUM];
				break;
			case 'N':
				category = [BAR];
				break;
			case 'L':
				category = [SANDWICH, SEAFOOD, TACO, VEGGIE, WINGS, TRUCK, DINER, DELI, BURGER, BBQ, DIMSUM, RAMEN, SUSHI, CAFE];
				break;
			case 'D':
				category = [AMERICAN, AREPA, ASIAN, BBQ, BURGER, CAJUN, CARRIBEAN, CUBAN, ETHIOPIA, FRENCH, GASTROPUB, GERMAN, GREEK, INDIAN, ITALIAN, JAPANESE, KOREAN, MEDITERRANEAN, MEXICAN, MIDDLEEASTERN, MOLEGASTRO, PORTUGUESE, RAMEN, SEAFOOD, SOUTHAMERICAN, SOUTHERN, SPANISH, STEAK, SUSHI, SWISS, THAI, VIETNAMESE, WINGS];
				break;
		}

		var url = "https://api.foursquare.com/v2/venues/search?client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&categoryId="+getStrList(category)+"&ll="+getStrList(ll)+"&radius="+radius+"&intent=browse";

		console.log(url);

		$.getJSON(url, function(data){
			var data = data.response.groups[0].items;
			if (data.length <1){
				self.done();
				self.progress(1);
			}
			else if (action == 'a')
				self.append(data);
			else if (action == 'r')
				self.replace(data);
		})
		.fail(function(error){
			console.log("Foursquare search error: ", error);
			if (action == 'a')
				self.append(null);
			else if (action == 'r')
				self.replace(null);
		});
	};

  Foursquare.prototype.getTips = function(venueId, tipscb){
		var url = "https://api.foursquare.com/v2/venues/"+venueId+"/tips?client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&sort=popular";

    console.log(url);
    
		$.getJSON(url, function(data){
      		var status = "success";
			tipscb(data, status);	
		})
		.fail(function(error){
			console.log("Foursquare api error: ", error);
      		var status = "failed";
			tipscb(error, status);	
		});
  };

  Foursquare.prototype.getPhotos = function(venueId, photoscb){
		var url = "https://api.foursquare.com/v2/venues/"+venueId+"/photos?client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET;

    	console.log(url);
    
		$.getJSON(url, function(data){
			console.log(data);
      		var status = "success";
			photoscb(data, status);	
		})
		.fail(function(error){
			console.log("Foursquare api error: ", error);
      		var status = "failed";
			photoscb(error, status);	
		});
  };

    return new Foursquare();
});
