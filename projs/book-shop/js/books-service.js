'use strict'

var gBooks = [];

function updateBook(id,newName,newPrice,rating){
    var idx = getIdxById(id);
    gBooks[idx].name = newName;
    gBooks[idx].price = newPrice;
    gBooks[idx].rating = rating;
}

function creatBook(name, price, photoPath) {
    var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var randomStr = '';
    for (var i=0; i<6 ; i++){
        var chr = parseInt(Math.random()*36);
        randomStr += abc[chr];
    }
    var book = {
        name : name,
        price : price,
        id : randomStr,
        photo : photoPath,
        rating : 0
    };
    gBooks.push(book);
    return book;
}

function deleteBook(id){
    var Idx = getIdxById(id);
    gBooks.splice(Idx,1);
}

function getIdxById(id){
    // var i = gBooks.findIndex(function(b){
    //     return b.id === id;
    // })
    for (var i=0; i<gBooks.length; i++){
        if (gBooks[i].id === id) {
            return i;
        }
    }
    return null;
}