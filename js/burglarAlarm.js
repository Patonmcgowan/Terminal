//
// ----------------------------------------------------------------------------
//
//
function drawHousePlan() {
  var ctx = document.getElementById("occupancyMap").getContext("2d");

  // This is what the response text looks like
  // ?date=18/10/2013&time=21:53:58.000&lastRestartMinutes=15&lastRestartHours=3&lastRestartDays=0&sensorOn=0B0010000000000000&sensorTurnedOn=0B0000000100000000&sensorExcluded=0B1000000000000000&sensorBad=0B0000000000000001&lastSensorState=0B0000000010000000&statusFlags=0Bxxxxxxxxxxxxxxxx

  // Main outline
  ctx.beginPath();
  ctx.moveTo(256, 16); 
  ctx.lineTo(324, 16);    // Front of my bedroom
  ctx.lineTo(324, 362);   // Right hand side
  ctx.lineTo(144, 362);   // Bottom - Georgia's bedroom etc
  ctx.lineTo(144, 288);   // Left hand edge of pergola
  ctx.lineTo(76, 240);    // Angle of pergola
  ctx.lineTo(4, 240);     // Edge of pergola at bottom of carport
  ctx.lineTo(4, 72);      // Left hand edge of carport 
  ctx.lineTo(224, 72);    // Front of carport / garage
  ctx.lineTo(240, 94);    // Dodgy bit near front entrance
  ctx.moveTo(234, 84);
  ctx.lineTo(256, 70);
  ctx.lineTo(256, 16);    // Left hand wall of my bedroom
  ctx.moveTo(76, 72);     // Left hand wall of garage
  ctx.lineTo(76, 192);
  ctx.moveTo(172, 72);    // Right hand wall of garage
  ctx.lineTo(172, 168);
  ctx.moveTo(76, 192);    // Rear wall of laundry
  ctx.lineTo(232, 192);
  ctx.moveTo(172, 192);   // Rear wall of laundry
  ctx.lineTo(172, 188);
  ctx.moveTo(132, 168);   // Front wall of laundry
  ctx.lineTo(152, 168);
  ctx.moveTo(168, 168);   // Front wall of kitchen
  ctx.lineTo(232, 168);
  ctx.moveTo(132, 168);   // Left wall of laundry
  ctx.lineTo(132, 192);
  ctx.moveTo(268, 88);    // Rear wall of my bedroom
  ctx.lineTo(272, 88);
  ctx.moveTo(288, 88);    // Rear wall of my bedroom
  ctx.lineTo(324, 88);
  ctx.moveTo(271, 91);    // Ensuite sliding door
  ctx.lineTo(289, 91);
  ctx.moveTo(268, 88);    // Ensuite left hand wall
  ctx.lineTo(260, 96);
  ctx.lineTo(260, 112);
  ctx.moveTo(260, 112);   // Ensuite rear wall
  ctx.lineTo(324, 112);
  ctx.moveTo(260, 112);   // Angled bit of my office
  ctx.lineTo(252, 120);
  ctx.lineTo(252, 124);
  ctx.moveTo(258, 140);   // My office left hand wall
  ctx.lineTo(258, 168);
  ctx.moveTo(192, 192);   // Lounge / Dining room left hand wall
  ctx.lineTo(192, 362);
  ctx.moveTo(252, 168);   // Left hand wall - ironing room
  ctx.lineTo(252, 216);
  ctx.moveTo(252, 232);   // Left hand wall - hallway
  ctx.lineTo(252, 362);
  ctx.moveTo(252, 168);   // Common wall my office & ironing room
  ctx.lineTo(324, 168);
  ctx.moveTo(266, 216);   // Ironing room rear wall
  ctx.lineTo(324, 216);
  ctx.moveTo(266, 216);   // Hallway cupboard
  ctx.lineTo(266, 244);
  ctx.lineTo(294, 244);
  ctx.moveTo(276, 216);   // Georgia's bathroom
  ctx.lineTo(276, 246);
  ctx.moveTo(310, 244);
  ctx.lineTo(324, 244);
  ctx.moveTo(276, 258);   // Georgia vanity
  ctx.lineTo(276, 272);
  ctx.moveTo(310, 256);
  ctx.lineTo(310, 272);
  ctx.moveTo(276, 260);
  ctx.lineTo(310, 260);
  ctx.moveTo(266, 272);   // Guest bedroom front wall
  ctx.lineTo(324, 272);
  ctx.moveTo(266, 312);   // Common wall guest bedroom & Georgia's room
  ctx.lineTo(324, 312);
  ctx.moveTo(266, 284);   // Guest bedroom left hand wall
  ctx.lineTo(266, 312);
  
  ctx.lineWidth = 1;
  ctx.strokeStyle="#000000";
  ctx.stroke();
  
  // Draw windows & doors
  ctx.beginPath();
  ctx.moveTo(264, 16);    // My bedroom window 
  ctx.lineTo(312, 16);
  ctx.moveTo(324, 94);    // Ensuite window 
  ctx.lineTo(324, 106);
  ctx.moveTo(324, 116);   // My office window 
  ctx.lineTo(324, 160);
  ctx.moveTo(324, 172);   // Ironing room window 
  ctx.lineTo(324, 204);
  ctx.moveTo(324, 219);   // Georgia's bathroom window 
  ctx.lineTo(324, 241);
  ctx.moveTo(324, 249);   // Georgia's toilet window 
  ctx.lineTo(324, 269);
  ctx.moveTo(324, 278);   // Guest bedroom window 
  ctx.lineTo(324, 304);
  ctx.moveTo(76, 88);     // Garage window 
  ctx.lineTo(76, 120);
  ctx.moveTo(236, 82);    // Front door
  ctx.lineTo(252, 72);
  ctx.moveTo(140, 192);   // Laundry window 
  ctx.lineTo(156, 192);
  ctx.moveTo(158, 192);   // Laundry door
  ctx.lineTo(170, 192);
  ctx.moveTo(84, 72);     // Left hand garage door
  ctx.lineTo(120, 72);
  ctx.moveTo(130, 72);    // Right hand garage door
  ctx.lineTo(166, 72);
  ctx.moveTo(180, 72);    // Rumpus window
  ctx.lineTo(220, 72);
  ctx.moveTo(192, 208);   // Dining room slider
  ctx.lineTo(192, 256);
  ctx.moveTo(192, 288);   // Lounge side window
  ctx.lineTo(192, 336);
  ctx.moveTo(208, 362);   // Lounge rear window
  ctx.lineTo(236, 362);
  ctx.moveTo(268, 362);   // Georgia's bedroom window
  ctx.lineTo(308, 362);
  ctx.moveTo(266, 219);   // Hallway cupboards
  ctx.lineTo(266, 229);
  ctx.moveTo(266, 231);   // Hallway cupboards
  ctx.lineTo(266, 241);
  
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#000000";
  ctx.stroke();
  return;
}

// 
// Overlay the house plan with sensor information in the top update pane of alarmstatus.php
//
var SENSOR_OFF = "#D1DAD1";        // Colour to draw with when sensor turns off; background colour
var REEDS_OFF = "#000000";         // Colour to draw with when reed switches turn off; background colour
var SENSOR_JUST_ON = "#FF0000";    // Colour to draw with when sensor has just turned on
var SENSOR_ON = "#003300";         // Colour to draw with when sensor is on
//
// ----------------------------------------------------------------------------
//
//
function drawSensor(sensor, action) {
  var ctx = document.getElementById("OccupancyMap").getContext("2d");

  ctx.beginPath();
  switch (sensor)
  {
    case 0: // Garage
      break
    case 1: // Master bedroom
      break
    case 2: // Laundry
      break
    case 3: // Office
      break
    case 4: // Family room
      break
    case 5: // Bedroom 2
      break
    case 6: // Bedroom 3
        break
    case 7: // LHS reed switches
      if (action == SENSOR_OFF) {
          action = REEDS_OFF;
      }
      break
    case 8: // RHS reed switches
      if (action == SENSOR_OFF) {
        action = REEDS_OFF;
      }
      break
  }
  ctx.lineWidth = 1;
  ctx.fillStyle = action;
  ctx.closePath();
  ctx.fill();    

  return;
}
//
// ----------------------------------------------------------------------------
//
//
function loadAlarmDHTMLWindow() { 	// Load popup DHTML window for burglar alarm update server
  var dhtmlDiv = document.createElement('div');
  dhtmlDiv.id = 'dhtmlwindowholder';
  document.getElementsByTagName('body')[0].appendChild(dhtmlDiv);
  dhtmlDiv.innerHTML = '<span style="display:none">.</span>';

  /* 
    Create the following HTML programatically.  The mainContainer <div> is created when we call the dhtmlwindow.open() method 
    <div id="mainContainer">
      <div id="contentWrapper">
        <div class="topWorkspace">
          <canvas id="occupancyMap" width="328" height="366"></canvas>
        </div>
        <div class="bottomWorkspace">
          <div class="bottomWorktext" id="bottomUpdatePane"></div>
        </div>
        <div id="bottomSection">
          <div id="leftFooter">Waiting...</div>
          <div id="rightFooter"></div>
          <div id="middleFooter"></div>
        </div>
      </div>
    </div>
   */

  var contentWrapper = document.createElement('div');
  contentWrapper.id = 'contentWrapper';
  document.body.appendChild(contentWrapper);

  var topWorkspace = document.createElement('div');
  topWorkspace.classList.add('topWorkspace');
  contentWrapper.appendChild(topWorkspace);
  var can = document.createElement('canvas');
  can.id = "occupancyMap";
  can.width = 328;
  can.height = 366;
  topWorkspace.appendChild(can);

  var bottomWorkspace = document.createElement('div');
  bottomWorkspace.classList.add('bottomWorkspace');
  contentWrapper.appendChild(bottomWorkspace);

  var div = document.createElement('div');
  div.id = 'bottomUpdatePane';
  div.classList.add('bottomWorktext');
  bottomWorkspace.appendChild(div);

  var bottomSection = document.createElement('div');
  bottomSection.classList.add('bottomSection');
  bottomWorkspace.appendChild(bottomSection);

  var div = document.createElement('div');
  div.id = 'leftDHTMLFooter';
  bottomSection.appendChild(div);

  div = document.createElement('div');
  div.id = "rightDHTMLFooter";
  bottomSection.appendChild(div);

  div = document.createElement('div');
  div.id = "middleDHTMLFooter";
  bottomSection.appendChild(div);


  // Create the DHTML window
	var w = window,		d = document,		e = d.documentElement,		g = d.getElementsByTagName('body')[0],		x = w.innerWidth || e.clientWidth || g.clientWidth;
	var width = 370; // Popup width
	var left = x - width - 25;
	if (left < 0) {	left = 0;		width = x - left - 25;	}
	alarmStatus = dhtmlwindow.open('mainContainer', 'div', 'contentWrapper', 'Burglar Alarm Status', 'width=' + width + 'px,height=650px,left=' + left + 'px,top=190px,resize=1,scrolling=1');
	alarmStatus.style.position="fixed";
	alarmStatus.style.top="5px";
	alarmStatus.style.left=left + "px";     // This works under IE8
	// alarmStatus.style.right="40px";         // But this won't
	alarmStatus.isResize(true);
	alarmStatus.isScrolling(false);
	alarmStatus.show();

  // Rewrite the resize function so we can control which elements shrink and grow as it resizes
  dhtmlwindow.resize = function(t, e){
    // Existing stuff from core function
    t.style.width=Math.max(dhtmlwindow.width+dhtmlwindow.distancex, 150)+"px"
    t.contentarea.style.height=Math.max(dhtmlwindow.contentheight+dhtmlwindow.distancey, 100)+"px"
    // New bit to resize the bottom panel when we resize the window
    document.getElementById('bottomUpdatePane').style.height = (parseInt(t.contentarea.style.height) - 355 - 40) + "px"
  };

  // Just write some stuff in there for now
  document.getElementById('leftDHTMLFooter').innerHTML = "Waiting...";
  document.getElementById('middleDHTMLFooter').innerHTML = "Middle";
  document.getElementById('rightDHTMLFooter').innerHTML = "Right";
	return;
}
//
// ----------------------------------------------------------------------------
//
//
loadAlarmDHTMLWindow(); 
drawHousePlan(); 

registerFile(5);
//
// ----------------------------------------------------------------------------
//                               End of file
// ----------------------------------------------------------------------------
//
