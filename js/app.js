$(document).foundation()
var c = document.getElementById('c'),
    ctx = c.getContext('2d'),
    cw = c.width = 300,
    ch = c.height = 300,
    parts = [],
    partCount = 200,   
    partsFull = false,    
    hueRange = 50,
    globalTick = 0,
    rand = function(min, max){
        return Math.floor( (Math.random() * (max - min + 1) ) + min);
    };

var Part = function(){
  this.reset();
};

Part.prototype.reset = function(){
  this.startRadius = rand(1, 25);
  this.radius = this.startRadius;
  this.x = cw/2 + (rand(0, 6) - 3);
  this.y = 250;      
  this.vx = 0;
  this.vy = 0;
  this.hue = rand(globalTick - hueRange, globalTick + hueRange);
  this.saturation = rand(50, 100);
  this.lightness = rand(20, 70);
  this.startAlpha = rand(1, 10) / 100;
  this.alpha = this.startAlpha;
  this.decayRate = .1;  
  this.startLife = 7;
  this.life = this.startLife;
  this.lineWidth = rand(1, 3);
}
    
Part.prototype.update = function(){  
  this.vx += (rand(0, 200) - 100) / 1500;
  this.vy -= this.life/50;  
  this.x += this.vx;
  this.y += this.vy;  
  this.alpha = this.startAlpha * (this.life / this.startLife);
  this.radius = this.startRadius * (this.life / this.startLife);
  this.life -= this.decayRate;  
  if(
    this.x > cw + this.radius || 
    this.x < -this.radius ||
    this.y > ch + this.radius ||
    this.y < -this.radius ||
    this.life <= this.decayRate
  ){
    this.reset();  
  }  
};
  
Part.prototype.render = function(){
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = ctx.strokeStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, '+this.alpha+')';
  ctx.lineWidth = this.lineWidth;
  ctx.fill();
  ctx.stroke();
};

var createParts = function(){
  if(!partsFull){
    if(parts.length > partCount){
      partsFull = true;
    } else {
      parts.push(new Part()); 
    }
  }
};
  
var updateParts = function(){
  var i = parts.length;
  while(i--){
    parts[i].update();
  }
};

var renderParts = function(){
  var i = parts.length;
  while(i--){
    parts[i].render();
  }   
};
    
var clear = function(){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'hsla(0, 0%, 0%, .3)';
  ctx.fillRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = 'lighter';
};
     
var loop = function(){
  window.requestAnimFrame(loop, c);
  clear();
  createParts();
  updateParts();
  renderParts();
  globalTick++;
};

window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)}}();

loop();
// NOTE: The change to red signifies the start of 
// the animation


// Allows elements to be accessed in a clean way
var circle = document.getElementById('circle'), 
    button = document.getElementById('button');

    // Gets element to show current percentage
var result = document.getElementById('result'),
    // Current position of circle around its path
    // in percent in reference to the original
    totalCurrentPercent = 0,
    // Percent of circle around its path in
    // percent in reference to the latest origin
    currentPercent = 0;

// Updates the percent change from the latest origin
var showPercent = window.setInterval(function() {
  if(currentPercent < 100)
  {
    currentPercent += 1;
  }
  else {
    currentPercent = 0;
  }
  result.innerHTML = currentPercent;
}, 39); // Runs at a rate based on the animation's
        // duration (milliseconds / 100)



// Checks to see if the specified rule is within 
// any of the stylesheets found in the document;
// returns the animation object if so
function findKeyframesRule(rule) {
    var ss = document.styleSheets;
    for (var i = 0; i < ss.length; ++i) {
        for (var j = 0; j < ss[i].cssRules.length; ++j) {
            if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule) { return ss[i].cssRules[j]; }
        }
    }
    return null;
}

// Replaces the animation based on the percent
// when activated and other hard coded 
// specifications
function change(anim) {
  // Obtains the animation object of the specified
  // animation
  var keyframes = findKeyframesRule(anim),
      length = keyframes.cssRules.length;
  
  // Makes an array of the current percent values
  // in the animation
  var keyframeString = [];  
  for(var i = 0; i < length; i ++)
  {
    keyframeString.push(keyframes[i].keyText);
  }
  
    
  // Removes all the % values from the array so
  // the getClosest function can perform calculations
  var keys = keyframeString.map(function(str) {
    return str.replace('%', '');
  });
  
  // Updates the current position of the circle to
  // be used in the calculations
  totalCurrentPercent += currentPercent;
  if(totalCurrentPercent > 100)
  {
    totalCurrentPercent -= 100;
  }
  // Self explanatory variables if you read the
  // description of getClosest
  var closest = getClosest(keys);
  
  var position = keys.indexOf(closest), 
      firstPercent = keys[position];
  
  // Removes the current rules of the specified 
  // animation
  for(var i = 0, j = keyframeString.length; i < j; i ++)
  {
    keyframes.deleteRule(keyframeString[i]);
  }
  
  // Turns the percent when activated into the
  // corresponding degree of a circle
  var multiplier = firstPercent * 3.6;
  
  // Essentially this creates the rules to set a new 
  // origin for the path based on the approximated
  // percent of the animation when activated and
  // increases the diameter of the new circular path  
  keyframes.insertRule("0% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 0) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 0) + "deg); background-color:red; }");
  keyframes.insertRule("13% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 45) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 45) + "deg); }");
  keyframes.insertRule("25% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 90) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 90) + "deg); }");
  keyframes.insertRule("38% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 135) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 135) + "deg); }");
  keyframes.insertRule("50% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 180) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 180) + "deg); }");
  keyframes.insertRule("63% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 225) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 225) + "deg); }");
  keyframes.insertRule("75% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 270) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 270) + "deg); }");
  keyframes.insertRule("88% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 315) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 315) + "deg); }");
  keyframes.insertRule("100% { -webkit-transform: translate(100px,100px) rotate(" + (multiplier + 360) + "deg) translate(-100px,-100px) rotate(" + (multiplier + 360) + "deg); }");
  
  // Shows the circle again
  circle.style.display = "inherit";
  // Sets the animation to the newly specified rules 
  circle.style.webkitAnimationName = anim; 
  
  // Resets the approximate animation percent counter
  window.clearInterval(showPercent);
  currentPercent = 0;
  showPercent = self.setInterval(function() {
    if(currentPercent < 100)
    {
      currentPercent += 1;
    }
    else {
      currentPercent = 0;
    }
    result.innerHTML = currentPercent;
  }, 39); 
}

// Attatches the change function to the button's
// onclick function
button.onclick = function() {
  // Removes the animation so a new one can be set
  circle.style.webkitAnimationName = "none";
  // Temporarily hides the circle
  circle.style.display = "none";
  // Initializes change function
  setTimeout(function () { 
      change("rotate"); 
  }, 0);
}

// Gets the animation's closest % value based on
// the approximated % found below
function getClosest(keyframe) {
  var curr = keyframe[0];
  var diff = Math.abs (totalCurrentPercent - curr);
  for (var val = 0, j = keyframe.length; val < j; val++) {
    var newdiff = Math.abs(totalCurrentPercent - keyframe[val]);
    if (newdiff < diff) {
      diff = newdiff;
      curr = keyframe[val];
     }
  }
  return curr;
}