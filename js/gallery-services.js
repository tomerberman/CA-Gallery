"use strict";

var gProjs = [];
var gCurrProjIdx = 0;

function createInitialProjs() {
  createProj(
    "Pacman",
    "Fight the monsters",
    "This game takes place on a 2D board",
    "projs/pacman/index.html",
    "6-6-2018",
    "Coding Academy",
    "Games",
    ['computer games','monsters','matrix','survival'],
    'img/portfolio/pacman.png'
  );

  createProj(
    "Book Shop",
    "Manage your books inventory",
    "a new way to add, remove and edit books and prices",
    "projs/book-shop/index.html",
    "12-6-2018",
    "Coding Academy",
    "Items Managment",
    ['reading','selling','orginzing'],
    'img/portfolio/book-shop.png'
  );

  createProj(
    "Ball Board",
    "Control the board with keyboard",
    "POPOLISM the world. it is a big fun. come join",
    "projs/ball-board/index.html",
    "04-February-2018",
    "Davidi Inc.",
    "Bullshitting",
    ['water','World','Navigating'],
    'img/portfolio/ball-board.png'
  );

  createProj(
    "Calculator",
    "Super Duper Calculations made easy",
    "Loreming every day and this is just Lorem ipsum dolor sit amet consectetur adipisicing elit ",
    "projs/calculator/index.html",
    "30-December-2000",
    "Avi and Bonny Inc.",
    "pilpelim",
    ['Television','People'],
    'img/portfolio/calculator.png'
  );

  createProj(
    "Touch Nums",
    "How fast can you finish the board?",
    "Loreming every day and this is just Lorem ipsum dolor sit amet consectetur adipisicing elit ",
    "projs/touch-nums/index.html",
    "30-December-2000",
    "Avi and Bonny Inc.",
    "pilpelim",
    ['Television','People'],
    'img/portfolio/touch-nums.png'
  );

  createProj(
    "Mine Sweeper",
    "Try to avoid the mines...",
    "Loreming every day and this is just Lorem ipsum dolor sit amet consectetur adipisicing elit ",
    "projs/mine-sweeper/index.html",
    "31-May-2018",
    "Avi and Bonny Inc.",
    "pilpelim",
    ['Army','Board'],
    'img/portfolio/mine-sweeper.png'
  );
  
  createProj(
    "Chess",
    "Play chess with legal moves display",
    "Loreming every day and this is just Lorem ipsum dolor sit amet consectetur adipisicing elit ",
    "projs/chess/index.html",
    "30-December-2018",
    "Avi and Bonny Inc.",
    "pilpelim",
    ['Television','People'],
    'img/portfolio/chess.png'
  );

  createProj(
    "To do's",
    "Easily manage your tasks",
    "Loreming every day and this is just Lorem ipsum dolor sit amet consectetur adipisicing elit ",
    "projs/todos/index.html",
    "30-December-2000",
    "Avi and Bonny Inc.",
    "pilpelim",
    ['Television','People'],
    'img/portfolio/todos.png'
  );
}

function getIdString() {
  var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var randomStr = "";
  for (var i = 0; i < 6; i++) {
    var chr = parseInt(Math.random() * 36);
    randomStr += abc[chr];
  }
  return randomStr;
}

function createProj(name, intro, desc, url, date, client, category, labels, imgPath) {
  var randomId = getIdString();
  var details = {
    date: date,
    client: client,
    category: category
  };
  var proj = {
    id: randomId,
    name: name,
    intro: intro,
    desc: desc,
    url: url,
    details: details,
    publishedAt: 1448693940000,
    labels: labels, 
    imgPath: imgPath
  };
  gProjs.push(proj);
}
