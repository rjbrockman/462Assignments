var main = function () {
    "use strict";
    
    // array of objects
	// Added a number value for suits spades-1, hearts-2, clubs-3, diamonds-4
	// Added number value to rank two-2, three-3,...,jack-11, queen-12, king-13, ace-14
    var hand = [
        {"suit":"spades","rank":"2"},
        {"suit":"hearts","rank":"4"},
        {"suit":"clubs","rank":"2"},
        {"suit":"diamonds","rank":"4"},
        {"suit":"spades","rank":"3"}
    ];
	
	// Setting up 2 Arrays, rankArray is for rank, and suitsArray is for suit.
	var rankArray = [];
	var suitsArray = [];
 

	 var handAssessor = function(hand){
		var resultString = ""; 
		convertHand();
	
		switch(duplicateCards()){
			case "2":
               resultString = "1 Pair";
               break;
			case "22":
               resultString = "2 Pairs";
               break;
			case "3":
               resultString = "3 of a Kind";
               break;
			case "23":
			case "32":
               resultString = "Full House";
               break;
			case "4":
               resultString = "4 of a Kind";
               break;
			default:
               if(isStraight()){
                    resultString = "Straight";     
               }
               if(isAceStraight()){
                    resultString = "Ace Straight";
               }
               break;
     }
     if(isFlush()){
          if(resultString){
               resultString += " and Flush";     
          }
          else{
               resultString = "Flush";
          }
     }
     if(!resultString){
          resultString = "Bust!";
     }
     console.log(resultString);
}  
 
function convertHand(){
     for(var i = 0; i < 5; i ++){
          rankArray[i] = hand[i].rank % 13;
          suitsArray[i] = Math.floor(hand[i].suit / 13);     
     }
}

// Function to check if all 5 cards are of the same suit. 
function isFlush(){
     for(var i = 0; i < 4; i ++){
          if(suitsArray[i] != suitsArray[i+1]){
               return false;
          }
     }
     return true;
}

// Function to check when the ace is low
function isStraight(){
     var lowest = getLowest();
     for(var i = 1; i < 5; i++){
          if(occurrencesOf(lowest + i) != 1){
               return false
          }     
     }
     return true;
}

// Function to check when the ace is high 
function isAceStraight(){
     var lowest = 9;
     for(var i = 1; i < 4; i++){
          if(occurrencesOf(lowest + i) != 1){
               return false
          }     
     }
     return occurrencesOf(1) == 0;
}
 
function getLowest(){
     var min = 12;
     for(var i = 0; i < rankArray.length; i++){
          min = Math.min(min, rankArray[i]);     
     }
     return min;     
} 
 
// This function checks for duplicate cards
 function duplicateCards(){
     var occurFound = []; 
     var result = "";
     for(var i = 0; i < rankArray.length; i++){
          var occur = occurOf(rankArray[i]);
          if(occur > 1 && occurFound.indexOf(rankArray[i]) == -1){
               result += occur; 
               occurFound.push(rankArray[i]);    
          }
     }
     return result;
}
// This function checks the occurrences of cards
function occurOf(n){
     var count = 0;
     var index = 0;   
     do{          
          index = rankArray.indexOf(n, index) + 1;  
          if(index == 0){
               break;
          }
          else{
               count ++;
          }
     } while(index < rankArray.length);
     return count;
}  

    
    // call the function
    handAssessor(hand);
};
$(document).ready(main);