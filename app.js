(function() {
	var app = angular.module('depotStore', []);

	app.controller('StoreController', ['$http', function($http){
		var store = this;
		store.products = [];
		$http.get('/Depot/store-products.json').success(function(data){
			store.products = data;
		});

		//---------CART---------------
		this.cartTotal = 0;
		this.cart = [];
		this.amount = [];

		this.addToCart = function(item) {
			var hoeveelheid = prompt("Hoeveel wil jy koop?", 1);
			if (isNaN(hoeveelheid) || hoeveelheid <= 0) {
				tempAlert("Dit was nie 'n geldige getal nie, probeer asseblief weer.", 0);
				return;
			};
			for (var i = 0; i < this.cart.length; i++) {
				if(this.cart[i] === item)
				{
					this.amount[i] += parseInt(hoeveelheid);
					this.cartTotal += (item.price * parseInt(hoeveelheid));
					tempAlert("Daar is nou " + this.amount[i] + " " + item.name + " in die Mandjie.", 1);
					return;
				}
			};
			this.cart.push(item);
			this.amount.push(parseInt(hoeveelheid));
			this.cartTotal += (item.price * parseInt(hoeveelheid));
			tempAlert("Daar is nou " + hoeveelheid + " " + item.name + " in die Mandjie.", 1);
		};

		this.removeFromCart = function(item) {
			var tempCart = [];
			var tempAmount = [];
			var removed = false;
			var hoeveelheid = 1;
			for (var i = 0; i < this.cart.length; i++) {
				if(this.cart[i] === item && this.amount[i] > 1)
				{
					hoeveelheid = prompt("Hoeveel wil jy verwyder?", this.amount[i]);
					if (isNaN(hoeveelheid) || hoeveelheid <= 0 || hoeveelheid > this.amount[i]) 
					{
						tempAlert("Dit was nie 'n geldige getal nie, probeer asseblief weer.", 0);
						return;
					};
					if (this.amount[i] != hoeveelheid) 
					{
						tempAmount.push(this.amount[i]-hoeveelheid);
						tempCart.push(this.cart[i]);
						removed = true;
					};
				}
				else if(this.cart[i] !== item)
				{
					tempCart.push(this.cart[i]);
					tempAmount.push(this.amount[i]);
				}
			};
			if (this.cart.length != tempCart.length || removed) {
				this.cartTotal -= item.price * hoeveelheid;
				this.cart = tempCart;
				this.amount = tempAmount;
			};
		};

		//---------TABS--------------
		this.search = "";
		activeTab = 1;
		this.isSet = function(tab) {
			if (activeTab === tab) { return true; };
			return false;
		};
		this.setTab = function(tab) {
			activeTab = tab;
			if (tab === 1) { this.search = ""; }
			else if (tab === 5) { this.signOut(); };
		};

		//--------LOG-IN/OUT-ADMIN----
		
		this.isAdmin = false;
		this.signedIn = false;
		this.user = "";
		this.pass = "";
		this.signIn = function(usr, pas) {
			this.user = "";
			this.pass = "";
			if (usr == pas && pas == "Admin") 
			{
				this.signedIn = true;
				this.isAdmin = true;
				this.setTab(1);
			} 
			else if (usr == pas && pas == "User")
			{
				this.signedIn = true;
				this.isAdmin = false;
				this.setTab(1);
			}
			else
			{
				this.signedIn = false;
				this.isAdmin = false;
				return false;
			};
		};
		this.signOut = function() {
			this.signedIn = false;
			this.isAdmin = false;
			this.setTab(1);
			this.cart = [];
			this.cartTotal = 0;
		};

		//---------------------
	}]);

})();

function tempAlert(msg, good)
{
 var el = document.createElement("div");
 el.setAttribute("class",(good)?"good":"bad");
 el.innerHTML = "<h4>"+msg+"</h4>";
 setTimeout(function(){
  el.parentNode.removeChild(el);
 }, 2000);
 document.body.appendChild(el);
};