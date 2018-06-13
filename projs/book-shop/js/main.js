"use strict";
var gCounter = 1;
var gRateInterval;
$(document).ready(init());

function init() {
  creatBook("Aba Ganuv", 25.95, "../img/book1.jpg");
  creatBook("Life of PIE", 30.0, "img/book2.jpg");
  creatBook("Cooking 2018", 38.5, "../img/book3.jpg");
  creatBook("Hasamba", 12, "../img/book4.jpg");
  renderBooks();
}

function renderBooks() {
  var str = `<tr>
      <th>Id</th>
      <th >Title</th>
      <th>Price</th>
      <th>Rating</th>
      <th colspan="3">Action</th>
      </tr>`;

  for (var i = 0; i < gBooks.length; i++) {
    var currBook = gBooks[i];
    str += `<tr>
      <td>${currBook.id}</td>
      <td>${currBook.name}</td>
      <td>${currBook.price}</td>
      <td>${currBook.rating}</td>
      <td><button data-toggle="modal" data-target="#exampleModal"
       class="btn btn-details" onclick="onReadDetails('${
         currBook.id
       }')">Details</button></td>
      <td><button class="btn btn-update" onclick="onUpdateBook('${
        currBook.id
      }')">Update</button></td>
      <td><button class="btn btn-delete" onclick="onDeleteBook('${
        currBook.id
      }')">Delete</button></td>
      </tr>`;
  }
  document.querySelector(".book-table").innerHTML = str;
}

function onUpdateBook(id) {
  gRateInterval = setInterval(function() {
    var rating = $(".slider").val();
    rating += "";
    document.querySelector(".input-rating-update").value = rating;
  }, 100);
  var idx = getIdxById(id);
  $(".modal-update").show();
  $(".input-name-update").val(gBooks[idx].name);
  $(".input-price-update").val(gBooks[idx].price);
  document
    .querySelector(".input-done-update")
    .setAttribute("onclick", `onUpdateDone('${id}')`);
}

function onUpdateDone(id) {
  var name = $(".input-name-update").val();
  var name = document.querySelector(".input-name-update").value;
  var price = document.querySelector(".input-price-update").value;
  var rating = $(".slider").val() + "";
  updateBook(id, name, price, rating);
  $(".modal-update").hide();
  clearInterval(gRateInterval);
  renderBooks();
}

function readAndAddNewBook() {
  $(".modal-add").modal("show");
}

function onBookInput(ev) {
  if (ev.key === "Enter") {
    var name = document.querySelector(".input-name").value;
    var price = document.querySelector(".input-price").value;
    creatBook(name, price);
    renderBooks();
    document.querySelector(".input-name").value = "";
    document.querySelector(".input-price").value = "";
    $(".modal-add").modal("hide");
  }
}

function onDeleteBook(id) {
  deleteBook(id);
  renderBooks();
}

function changeRating(id, direction) {
  var idx = getIdxById(id);
  var val = parseInt(gBooks[idx].rating);
  if (direction === "up" && val < 10) gBooks[idx].rating = val + 1;
  else if (direction === "down" && val > 1)  gBooks[idx].rating = val - 1;
  document.querySelector(".rating").innerText = `Rating: ${gBooks[idx].rating}`;
}

function closeDetailsModal() {
  renderBooks();
}

function onReadDetails(id) {
  var idx = getIdxById(id);
  var name = gBooks[idx].name;
  var price = gBooks[idx].price;
  var imgSrc = gBooks[idx].photo;
  var rating = gBooks[idx].rating;
  var str = "";
  str += `<div class="flex-content"> <img src="${imgSrc}"></img> <div>
     <li>${name}</li> <li>Price: ${price}</li> <li class="rating">Rating: ${rating}</li> <div> <div>
     <img src="img/thumbs_up.png" class="thumb-up">
     <img src="img/thumbs_up.png" class="thumb-down">`;
  $(".modal-body").html(str);
  document
    .querySelector(".thumb-up")
    .setAttribute("onclick", `changeRating('${id}','up')`);
  document
    .querySelector(".thumb-down")
    .setAttribute("onclick", `changeRating('${id}','down')`);
}
