(function() {

var data = [
{"code":"3"},
{"code":"4"},
{"code":"5"},
{"code":"6"},
{"code":"8"},
{"code":"7"},
{"code":"12"},
{"code":"9"},
{"code":"11"},
{"code":"10"},
{"code":"13"},
{"code":"14"},
{"code":"15"},
{"code":"16"},
{"code":"17"},
{"code":"18"},
{"code":"19"},
{"code":"20"},
{"code":"21"},
{"code":"22"},
{"code":"23"},
{"code":"24"},
{"code":"25"},
{"code":"26"},
{"code":"27"},
{"code":"28"},
{"code":"29"},
{"code":"30"},
{"code":"31"},
{"code":"32"},
{"code":"33"},
{"code":"34"},
{"code":"35"},
{"code":"A02"},
{"code":"A03"},
{"code":"S01"},
{"code":"S02"},
{"code":"S03"},
{"code":"S04"}];

var AWARDEES = 'awardees';

var $board = $('.board');
var $handler = $('.handler');
var $awardees = $('.awardees');
var $won = $('.won');
var codes;

init(data);
renderAwardees();

$(document)
.on('click', '.js-start', start)
.on('click', '.js-stop', stop)
.on('click', '.js-confirm', confirm);

function init(data) {
  codes = data.map(function(item) {
    return item.code;
  }).filter(function(code) {
    return getAwardees().indexOf(code) === -1;
  }).sort(function() {
    return 0.5 - Math.random();
  });
  $board.html('');
  console.log('当前一轮：', codes);
  codes.forEach(function(code) {
    var $digit = $('<ul class="digit"></ul>');
    var nums = len3(code).split('');
    nums.forEach(function(num) {
      $digit.append('<li>' + num + '</li>');
    });
    $board.append($digit);
  });
}

function renderAwardees() {
  $awardees.html('');
  var awardees = Lockr.get('awardees') || [];
  awardees.forEach(function(code) {
    $awardees.append('<li>'+len3(code)+'</li>');
  });
  $awardees[0].scrollTop = 1000;
}

var SPEED = 28;
var height = $('.digit').height();
var number = $('.digit').length;
var stopped = false;
var offsetY = 0;

function step() {
  offsetY += SPEED;
  $board.css({
    transform: 'translate3d(0, '+ -offsetY +'px, 0)'
  });
  var offsetMax = height * ($('.digit').length - 3);
  if (offsetY > offsetMax) offsetY = 0;
  if (!(stopped && (offsetY % height === 0))) requestAnimationFrame(step);
}

function start() {
  stopped = false;
  $handler
    .removeClass('js-start')
    .addClass('js-stop')
    .text('停止');
  requestAnimationFrame(step)
}

function stop() {
  stopped = true;
  showWon();
  $handler
    .removeClass('js-stop')
    .addClass('js-confirm')
    .text('确认');
  $board.addClass('board-confirm');
}

function confirm() {
  var result = codes[offsetY / height + 1];
  addAwardees(result);
  renderAwardees();
  init(data);
  hideWon();
  $handler
    .removeClass('js-confirm')
    .addClass('js-start')
    .text('抽奖');
  $board.removeClass('board-confirm');
}

function getAwardees() {
  return Lockr.get(AWARDEES) || [];
}

function addAwardees(code) {
  return Lockr.sadd(AWARDEES, code);
}

function showWon() {
  $won.addClass('active');
}

function hideWon() {
  $won.removeClass('active');
}

function len3(code) {
  for (var i = 0, len = 3 - code.length; i < len; i++) {
    code = '0' + code;
  }
  return code;
}

})();
