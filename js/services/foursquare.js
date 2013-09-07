app.factory('Foursquare', function($rootScope) {
	
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

	//settings
	var radius = 8000;

    var Foursquare = function() {
		this.route=[];
		this.done = null;
		this.progress = null;
		this.foundcb = null;
		this.ll = [43.652, -79.382];
		this.getNext([43.652, -79.382], 'B');
    };


	Foursquare.prototype.getRoute = function(ll, done, progress){
		this.ll=ll;
		this.getNext(ll, 'B');
		this.done = done;
		this.progress = progress;
	};

	Foursquare.prototype.getMiddleVenue = function(ll1, ll2, type){
		var ll = [(ll1[0]+ll2[0])/2, (ll1[1]+ll2[1])/2];
		var radius = 8000; //to be calculated
		this.call4sq(ll, radius, type, 'a');
	};

	Foursquare.prototype.replaceVenue = function(index, type, foundcb){
		this.foundcb = foundcb;
		this.index = index;
		var lat = (this.route[index-1].location.lat + this.route[index+1].location.lat)/2;
		var lng = (this.route[index-1].location.lng + this.route[index+1].location.lng)/2;
		var radius = 8000; //to be calculated
		this.call4sq(ll, radius, type, 'r');
	};

	Foursquare.prototype.getNext = function(ll, type) {
		this.call4sq(ll, radius, type, 'a');
    };


	Foursquare.prototype.replace = function(venues){
		this.route[this.index] = venues[this.getBest(venues)];	
		this.foundcb();
	};

	Foursquare.prototype.alreadyInRoute = function(venue){
		if (this.route == null)
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
			if (venue.categories[0].name === "Coffee Shop" || venue.categories[0].name==="Hotel" || venue.categories[0].name === "Office")
				scores.push(0);
			else if (self.alreadyInRoute(venue))
				scores.push(0);
			else 
				scores.push(venue.stats.checkinsCount/venue.location.distance);			
		});
		
		var temp = scores.slice(0);
		temp.sort(function(a,b){return a-b});
		return scores.indexOf(temp[temp.length-Math.floor((Math.random()*10))-1]);
	};

	Foursquare.prototype.append = function(venues){
		console.log(this.route);
		if (venues != null)
			this.route.push(venues[this.getBest(venues)]);

		switch(this.route.length){
			case 1:
				this.getNext([this.route[0].location.lat,this.route[0].location.lng], 'T');
				this.progress(1/6);
				break;
			case 2:
				this.getNext([this.route[1].location.lat,this.route[1].location.lng], 'F');
				this.progress(2/6);
				break;
			case 3:
				this.getNext([this.route[2].location.lat,this.route[2].location.lng], 'T');
				this.progress(3/6);
				break;
			case 4:
				this.getNext([this.route[3].location.lat,this.route[3].location.lng], 'F');
				this.progress(4/6);
				break;
			case 5:
				this.getNext([this.route[4].location.lat,this.route[4].location.lng], 'T');
				this.progress(5/6);
				break;
			case 6:
				var radius = 10; //to be changed
				this.getMiddleVenue([this.route[4].location.lat,this.route[4].location.lng],this.ll, 'N');
				this.progress(6/6);
				break;
			case 7:
				console.log(this.route);
				this.done();
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
				category = [MALL, MARKET, NEIGHBORHOOD, LANDMARKS, AQUARIUM, GALLERY, CASINO, HISTORIC, MUSEUM, STADIUM];
				break;
			case 'B':
				category = [BREAKFAST];
				break;
			case 'N':
				category = [BAR];
				break;
			case 'F':
				category = [RESTAURANT];
				break;
		}

		var url = "https://api.foursquare.com/v2/venues/search?client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&categoryId="+getStrList(category)+"&ll="+getStrList(ll)+"&radius="+radius+"&intent=browse";
		
		console.log(url);

		$.getJSON(url, function(data){
			data = data.response.groups[0].items;
			if (data.length < 1)
				this.done();
			if (action == 'a')	
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

    return new Foursquare();
});
