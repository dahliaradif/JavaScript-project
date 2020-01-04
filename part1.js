/*GLOBAL VARIABLES*/

//Variables for storing (x,y) coordinate of mouse click and drag relative to the canvas. 
var mouseX = 0;
var mouseY = 0;
var draggedX = 0;
var draggedY = 0;


/** Function that draws a circle with center specified by position of the mouse click, and radius specified by where 
the mouse is dragged, and colors the circle's edge gridpoints blue. Additionally, draws two red circles corresponding
to the largest and smallest radius of the highlighted gridpoints.
	@param {Number} x: x coordinate of center of circle to draw (specified by user mouseclick)
	@param {Number} y: y coordinate of center of circle to draw (specified by user mouseclick)
	@param {Number} radius: radius of circle (specified by user mousedrag)
	@return : None
*/

function drawCircles(x,y, radius)
{
	/* Check if circle with radius 'radius' lies partially outside the canvas boundary. If true,
	set radius = minimum distance from center to each of the four canvas edges*/
	if(x+radius > canvas.width || x-radius < 0 || y + radius > canvas.height || y - radius < 0){
		radius = Math.min(x, y, canvas.height - y,canvas.width - x) - Math.max(spaceX, spaceY);
	}
	drawBlueCircle(x,y,radius);
	var circleFeatures = getBoundaryPointsAndCircles(x,y,radius);
	var squares = circleFeatures.squares;
	var minDist = circleFeatures.minDist;
	var maxDist = circleFeatures.maxDist;
	colorBlue(squares);
	drawRedCircles(x,y,minDist, maxDist);

}

/** Function that extracts the gridpoints to be coloured blue, based on the drawn circle, as well as the 
minimum and maximum radiuses 
	@param {Number} x: x coordinate of center of circle to draw (specified by user mouseclick)
	@param {Number} y: y coordinate of center of circle to draw (specified by user mouseclick)
	@param {Number} radius: radius of circle (specified by user mousedrag)
	@return {object} Returns a list of Path2D objects to be colored, and the minimum and maximum radius of the 
	highlighted points
*/
function getBoundaryPointsAndCircles(x,y,radius){
	var squares = [];
	var minDist = Infinity;
	var maxDist = 0;
	//Create an evenly spaced list of angles to iterate through. Use radius/3 to control number of points on the circle 
	//to use to avoid over-colouring
	var angles = makeArr(0,2*Math.PI, radius / 3)
	//for each angle, obtain a point on the circle and find the nearest grid point
	for (var i = 0; i < angles.length; i++) {
		var newX;
		var newY;
		var angle = angles[i];
		var paramX = Math.round(x + radius * Math.cos(angle));
		var paramY = Math.round(y + radius * Math.sin(angle));
		//For each point, find the closest gridpoint to the current point on the circle
		var newPoints = roundToNearestGridPoint(paramX,paramY);
		newX = newPoints.x;
		newY = newPoints.y;
		//Extract the Path2D object corresponding to the chosen grid point using xy as the key
		var gridPoint = gridLocations[`x:${newX}y:${newY}`];
		squares.push(gridPoint);
		//Get the closest and furthest distance to the highlighted points
		var dist = calculateDistance(x, newX, y, newY);
		if (dist < minDist){
			minDist = dist;
		}
		else if (dist > maxDist){
			maxDist = dist;
		}
	}
  //If minDist is negative, return 0
  return {squares, minDist:Math.max(0, minDist), maxDist};
}

/** Function that draws one blue circle with center (x,y) and radius 'radius'
	@param {Number} x: x coordinate of center of circle to draw 
	@param {Number} y: y coordinate of center of circle to draw
	@param {Number} radius: radius of circle 
	@return None
*/
function drawBlueCircle(x,y, radius)
{
	ctx.beginPath();
	ctx.arc(x,y, radius,0, 2*Math.PI);
	ctx.strokeStyle = '#0000FF';
	ctx.stroke();
	ctx.closePath();
}

/** Function that draws two red circles corresponding to the largest and smallest radius of the highlighted points
	@param {Number} x: x coordinate of center of circles to draw 
	@param {Number} y: y coordinate of center of circles to draw
	@param {Number} minDist: radius of smaller circle
	@param {Number} maxDist: radius of larger circle
	@return None
*/
function drawRedCircles(x,y,minDist, maxDist){

	ctx.beginPath();
	ctx.arc(x,y, minDist - Math.sqrt(50),0, 2*Math.PI);
	ctx.strokeStyle = '#FF0000';
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x,y, maxDist + Math.sqrt(50),0, 2*Math.PI);
	ctx.strokeStyle = '#FF0000';
	ctx.stroke();
	ctx.closePath();

}
/* Function that sets mouseX and mouseY equal to the mouse click coordinate values*/
function handleMouseDown(event){
	mouseX = getMousePosition(canvas,event)[0];
 	mouseY = getMousePosition(canvas,event)[1];
}
/* Function that sets draggedX and draggedY equal to the mouse drag coordinate values, calculates the
radius of the desired circle, and draws the required circles*/

function handleMouseUp(event){
	draggedX = getMousePosition(canvas,event)[0];
 	draggedY = getMousePosition(canvas,event)[1];
 	var radius = calculateDistance(mouseX, draggedX, mouseY, draggedY);
   	drawCircles(mouseX, mouseY, radius);
}

function initPart1(){
 	// Logs the position of the mouse when the user clicks, specifying the center of the circle
 	canvas.addEventListener("mousedown", handleMouseDown);
    // Logs the position of the mouse once the user has dragged it, from which the radius can be calculated 
   	canvas.addEventListener('mouseup', handleMouseUp);
}


