/*GLOBAL VARIABLES*/

// x and y coordinates that take on the positions of mouse when clicked
var x = 0;
var y = 0;
//array to store the Path2D gridpoints
var squares = [];
//array to store the coordinates of clicked gridpoints
var circlePoints = [];



/** Function that solves a 2D matrix equation
	@param {array} matrix: A flattened 2D array where the flattening is in row-major layout 
	@param {array} vector: A 1D list of values forming the 'b' vector when solving Ax = b
	@return {array}  Returns the solution to the system (the 'x' vector when solving Ax = b). 
*/

function matrixSolver2D(matrix, vector){
	var det = matrix[0]*matrix[3] - matrix[1]*matrix[2];
    if (det < 1e-8) return false; //no solution
    var v = (matrix[0]*vector[1] - matrix[2]*vector[0])/det;
    var u = (vector[0] - matrix[1]*v)/matrix[0];
    return [u,v];
}


/** Function that calculates the optimal center and radius of the chosen points.

Let u,v encode coordinates of center translated by (x_bar, y_bar). We find the center and radius using 
a least squares approach; we minimize  f = (u − uc)^2 + (v − vc)^2 − radius^2 with respect to the three unknowns:
uc, vc, and the radius  

 @param {array}  circlePoints: A list of objects containing (x,y) coordinates of selected gridpoints
 @return {object}  Returns the (x,y) coordinates of the center of the optimal circle, and the radius of the optimal circle


*/

function getCenterAndRadius(circlePoints){
	var n = circlePoints.length;
	var sumX = 0;
	var sumY = 0;
	//Suu = sum (u_i^2), Suvv = sum(u_i * v_i^2), etc
	var Suu = 0;
	var	Suv = 0;
	var	Svv = 0;
	var Suuu = 0;
	var Suvv = 0;
	var Svuu = 0;
	var Svvv = 0;
	for (var i = 0; i < n ; i ++)
	{
		sumX += circlePoints[i].x;
		sumY += circlePoints[i].y;
	}
	//Calculate average of x coordinates and y coordinates of selected points
	x_bar = sumX / n;
	y_bar = sumY / n;
	for (var i = 0; i < n ; i ++)
	{
		Suu += (circlePoints[i].x - x_bar)**2;
		Suv += (circlePoints[i].y - y_bar) * (circlePoints[i].x - x_bar);
		Svv += (circlePoints[i].y - y_bar)**2;
		Suuu += (circlePoints[i].x - x_bar)**3;
		Suvv += (circlePoints[i].x - x_bar)*((circlePoints[i].y - y_bar)**2);
		Svuu += (circlePoints[i].y - y_bar)*((circlePoints[i].x - x_bar)**2);
		Svvv += (circlePoints[i].y - y_bar)**3;
	}
	//Use the matrix solver to solve two equations for uc and vc:
	//1. uc Suu + vc Suv =1/2(Suuu + Suvv)
	//2. uc Suv + vc Svv =1/2 (Svvv + Svuu)
	var center = matrixSolver2D([Suu, Suv, Suv,Svv], [0.5*(Suuu + Suvv), 0.5*(Svuu + Svvv)]);

	//Compute radius from circle equation: r^2 = uc^2 + vc^2 + (Suu + Svv)/ n
    var radius2 = center[0]*center[0] + center[1]*center[1] + (Suu+Svv)/n;
    var radius = Math.sqrt(radius2);
	return {x:center[0] + x_bar, y:center[1] +y_bar, radius};
}

/* Function that sets x and y equal to the mouse click coordinate values, finds the nearest gridpoint to 
the mouse position,and highlights the gridpoint */
function handleClick(){
	x = getMousePosition(canvas,event)[0];
	y = getMousePosition(canvas,event)[1];
	var newPoints = roundToNearestGridPoint(x,y);
	circlePoints.push(newPoints);
	var gridPoint = gridLocations[`x:${newPoints.x}y:${newPoints.y}`];
	squares.push(gridPoint);
	colorBlue(squares);
}
/* Function that listens to mouse clicks to highlight gridpoints and displays the desired circle*/
function initPart2(){
	var button = document.getElementById("generateButton");
	button.addEventListener("click", function(event){
		var centerAndRadius = getCenterAndRadius(circlePoints);
		drawBlueCircle(centerAndRadius.x, centerAndRadius.y, centerAndRadius.radius);
	});

	canvas.addEventListener("click", handleClick);
}


