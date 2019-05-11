var GameRules = "A simple memory game. No rules really needed.\nWritten in HTML, CSS, JavaScript, jQuery.\nAll trademarks and art belong to Ubisoft.";

var cards_all = []; // initialize the array of card**.png names
var cards_all_preload = [];
var images = [];

for (var i=1; i<=34; i++) // << the number of total card image files (card**.png) in the folder img/
{
	let m = "card" + i + ".png"; // create the image file names
	cards_all.push( m ); // push the image file name to the array
	cards_all_preload.push( "img/" + m ); // push the image file name to the array
	images[i-1] = new Image();
	images[i-1].src = cards_all_preload[i-1];
}

/* *********** pure JavaScript array random shuffling function *********** */

function shuffle(array)
{
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

/* ********************** */

shuffle(cards_all); // shuffle the array of card image names

var x = 9; // << max pairs in the game (18 cards)
var cards = []; // create an array of current cards

while(x--) // until x is other than 0 post-decrement x (the loop will still run for 0!)
{
	// let z = cards_all[x]; // z = current index in the array of a pair of cards (for simplification of code)
	// cards.push( z, z ); // creating pairs in the new array for the current game
	cards.push( cards_all[x], cards_all[x] ); // creating pairs of two identical card names in the new array for the current game
}

shuffle(cards); // the last random shuffle of the array of card names

//console.log(cards); // for debugging

// *********** Auto-generate divs ************ //

var board_html = "";

for(x=0; x<=17; x++)
{
	board_html += '<div class="card" id="c'+x+'"></div>\n'; // concatenate for more performance
}

$('.board').html( board_html );

//console.log(x);

// ******************************************* //

x = 17; // card id = c0 - c17

do
{
	document.getElementById( "c" + x ).addEventListener("click", ( function(c) { return function() {  revealCard( c ); } } )(x) );
	// a function inside a function which returns a function
}
while(x--)
	
// ----------------------------------------------------

var oneVisible = false;
var turnCounter = 0;
var correctCard;
var lock = false;
var pairsLeft = 9; //how many pairs are left to uncover
var cardId = "";

function revealCard(nr)
{
	//alert(nr);
	var opacityValue = $('#c'+nr).css('opacity');
	//var opacityValue = $(".board").find("div").eq(nr).css('opacity');
	//alert('Opacity: '+opacityValue);
	
	if ( opacityValue != 0 && lock == false && cardId != 'c'+nr ) // only if opacity of element is other than 0
	{
		lock = true;
		
		var cardimg = 'url("img/' + cards[nr] + '")';
		// global function jQuery = $() or jQuery()
		setTimeout( function() { $('#c'+nr).css('background-image', cardimg); }, 150 ); // inline function invoking a delayed change of the image
		$('#c'+nr).addClass('cardA'); // adds a Class to one already existing
		$('#c'+nr).removeClass('card'); // removes already existing class
		
		// first scenario - only one card uncovered
		if (!oneVisible)
		{
			oneVisible = true; // turn on the flag
			correctCard = nr; // put the card's number in memory
			lock = false;
			cardId = $('#c'+nr).attr("id"); // put the id of the card in memory
		}
		// second scenario - two cards uncovered
		else
		{
			if ( cards[correctCard] == cards[nr] && cardId != "c"+nr ) // if the two uncovered cards are identical
			{
				//alert("match")
				//console.log(cardId);
				setTimeout( function() { hide2cards(correctCard,nr) }, 750 ); // function to hide both uncovered cards when they were identical
			}
			else
			{
				//alert("nope")
				//console.log(cardId);
				setTimeout( function() { restore2cards(correctCard,nr) }, 1000 ); // function to restore both cards if they were not identical
			}
		}
	}

}

function hide2cards(nr1,nr2) // function to hide both uncovered cards when they were identical 
{
	$('#c'+nr1).css('opacity', '0'); // change opacity [hide the first card]
	$('#c'+nr2).css('opacity', '0'); // change opacity [hide the second card]
	pairsLeft--;
	
	if (pairsLeft == 0)
	{
		turnCounter++;
		$('.score').html('');
		$('.board').html('<p class="wonmsg">You\'ve won!<br>Assassin has finished the game in <span style="color:#f6a225">'+turnCounter+'</span> turns.<br>To play again, restart the game:</p>');
	}
	else
	{
		lock = false;
		turnCounter++;
		$('.score').html('Turn counter: '+turnCounter);
		oneVisible = false; // reset flag back
	}
}

function restore2cards(nr1,nr2) // function to restore both cards if they were not identical
{
	setTimeout( function() { $('#c'+nr1).css('background-image', 'url("img/accard.png")'); }, 150 ); // inline function invoking a delayed change of the image
	$('#c'+nr1).addClass('card'); // adds a Class to one already existing
	$('#c'+nr1).removeClass('cardA'); // removes already existing class

	setTimeout( function() { $('#c'+nr2).css('background-image', 'url("img/accard.png")'); }, 150 ); // inline function invoking a delayed change of the image
	$('#c'+nr2).addClass('card'); // adds a Class to one already existing
	$('#c'+nr2).removeClass('cardA'); // removes already existing class

	lock = false;
	cardId = "";
	turnCounter++;
	$('.score').html('Turn counter: '+turnCounter);
	oneVisible = false; // reset flag back
}