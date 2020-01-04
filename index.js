/*GLOBAL VARIABLES*/

// The grid contains 400 points, with dimension 20 x 20
var rows = 20;
var cols = 20;

//Create a canvas and context 
var canvas;
var ctx;

// Dictionary to store the locations of grey gridpoints
var gridLocations = {};

//Spaces between gridpoints in the x and y direction
var spaceX;
var spaceY; 

/** Function that draws a singular square shaped point in a specific location (x,y) within the grid
	@param {Number} x: The x coordinate of for the point location
	@param {Number} y: The y coordinate of for the point location
	@return {Path2D}  Returns a Path2D object representing the newly added gridpoint
*/

function drawSquare(x,y)
{
	var square = new Path2D();
	square.rect(x,y, 5,5);
	var key = `x:${x}y:${y}`
	gridLocations[key] = square;
	return square;
}

/**Function that draws the 20x20 grid of square, grey, evenly spaced points
	@params: None
	@return: None
*/

function drawGrid()
 {
 	for (var i = 0; i < rows; i++) {
 	 	for (var j = 0; j < cols; j++) {
 	 		// canvas.width / rows = 20, but this adds flexibility in case the canvas dimenion changes
 	 		var x = i * spaceX;
 			var y = j * spaceY;
 	 		point= drawSquare(x,y);
 	 		ctx.fillStyle = "grey";
			ctx.fill(point);
 	 	}
 	 }
 } 


/* HELPER FUNCTIONS */ 

/** Function that calculates the Euclidean distance between two points
	@param {Number} x1: x coordinate of first point
	@param {Number} x2: x coordinate of second point
	@param {Number} y1: y coordinate of first point
	@param {Number} y2: y coordinate of second point
	@return {Number} Euclidean distance between two points
*/

function calculateDistance(x1,x2, y1, y2) {
        return Math.sqrt(((x1-x2)**2 + (y1-y2)**2));
}

/** Function that gets coordinates of mouse event relative to the canvas
	@param canvas  Current canvas 
	@param {function} event: Event (a mouse click or release) 
	@return {array} Returns the (x,y) coordinates of the mouse position with respect to the event
*/

function getMousePosition(canvas, event) {
	let rect = canvas.getBoundingClientRect(); 
    var x = event.clientX - rect.left; 
    var y = event.clientY - rect.top; 
    return [x, y];
}


/** Function that changes the color of points on boundary of the circle to blue
	@param {array} squares: A list of Path2D objects
	@return: None, but colors the given Path2D objects blue
*/

function colorBlue(squares){
 	squares.forEach(function(s){
 		ctx.fillStyle = "blue";
 		ctx.fill(s);
 	});
 }


/** Function that makes a linearly spaced vector of angles from 0 to 2pi
	@param {Number} startValue: Start value of output array
	@param {Number} endValue: End value of output array
	@param {Number} size: Number of elements in the output array
	@return {array} A list of 'size' evenly spaced numbers starting at 'startValue' and ending at 'endValue'
*/

function makeArr(startValue, stopValue, size) {
  var arr = [];
  var step = (stopValue - startValue) / (size - 1);
  for (var i = 0; i < size; i++) {
    arr.push((startValue + (step * i)));
  }
  return arr;
}

/** Function that finds the nearest grid point to a given point on the canvas
	@param {Number} x: x coordinate of given point
	@param {Number} y: y coordinate of given point
	@return {array} Returns the (x,y) coordinates of the closest gridpoint
*/

function roundToNearestGridPoint(x,y){
	 if (x%spaceX <= spaceX/ 2){
			var newX = x - (x%spaceX);
			if (newX < 0){
				newX = 0;
			}
		}
		else{
			var newX = x + (spaceX - (x%spaceX));
			if (newX ==canvas.width){
				newX = x - (x%spaceX)
			}
		}
		if (y%spaceY <= spaceY / 2){
			var newY = y - (y%spaceY);
			if (newY < 0){
				newY = 0;
			}
		}
		else{
			var newY = y+ (spaceY- (y%spaceY));
			if (newY ==canvas.height){
				newX = y - (y%spaceY)
			}
		}
		return {x:newX, y:newY};
}



/* Main function that is called from main.html. This draws the grid,allowsthe user to select 
the functionality (part 1 or part 2), and allows the user to reset their work and begin again */

 function main(height, width)
 {
 	canvas = document.getElementById("canvas");
 	// Initialise the height and width of the grid in which gridpoints will reside
 	canvas.width = width;
	canvas.height = height;
	spaceX = canvas.width / rows;
	spaceY = canvas.height / cols;
 	ctx =  canvas.getContext("2d");
 	drawGrid(height, width);
 	
 	// 'Reset' button that allows user to redraw circles / reselect gridpoints instead of refreshing the page
 	var button = document.getElementById("resetButton");
	button.addEventListener("click", function(event)
{
	ctx.clearRect(0,0, width, height);
	ctx.beginPath();
	drawGrid();
	squares = [];
	circlePoints = [];

});
 	// 'Generate button that generates the optimal circle
	var generateButton = document.getElementById("generateButton");
	// 'Part 1' button that allows user to switch between the two functionalities
	var button = document.getElementById("part1Button");
	button.addEventListener("click", function(event)

{
	// If user wants to click and drag, stop any event listener from Part 2
	canvas.removeEventListener("click", handleClick);
	// If user is in Part 1, then hide the 'Generate' button
	generateButton.style.display= "None";
	initPart1()
});
	var button = document.getElementById("part2Button");
	button.addEventListener("click", function(event)
{
	// If user wants to generate the best fitting circle, stop any event listener from Part 1
	canvas.removeEventListener("mousedown", handleMouseDown);
	canvas.removeEventListener("mouseup", handleMouseUp);
	// If user is in Part 2, then show the 'Generate' button
	generateButton.style.display= "inline";
	initPart2()
});
}


