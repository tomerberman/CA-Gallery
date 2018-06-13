console.log("Starting up");

document.body.onload = init();

function init() {
  createInitialProjs();
  initPage();
  createGrid();
}

function onEmailSubmit() {
  var email = $("#contact-email").val();
  var subject = $("#contact-subject").val();
  var body = $("#contact-body").val();
  var str = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
  window.location = str;
}

function modalImgClicked() {
  window.location = gProjs[gCurrProjIdx].url;
}

function onThumbnailClick(i) {
  gCurrProjIdx = i;
  renderModal();
}

function initPage() {
  renderModal();
}

function createGrid() {
    var str ='';
  for (var i = 0; i < gProjs.length; i++) {
    var proj = gProjs[i];
     str += `
    <div class="col-md-4 col-sm-6 portfolio-item">
    <a class="portfolio-link" data-toggle="modal" href="#portfolioModal1" onclick="onThumbnailClick(${i})">
    <div class="portfolio-hover">
        <div class="portfolio-hover-content">
        <i class="fa fa-plus fa-3x"></i>
        </div>
    </div>
    <img class="img-fluid" src=${proj.imgPath} alt="">
    </a>
    <div class="portfolio-caption">
    <h4>${proj.name}</h4>
    <p class="text-muted">${proj.intro}</p>
    </div>
    </div>`;
    $('.grid-thumbnail').html(str);
  }
}

function renderModal() {
  var proj = gProjs[gCurrProjIdx];
  document.querySelector("#portfolioModal1 h2").innerHTML = proj.name;
  document.querySelector("#portfolioModal1 .item-intro").innerHTML = proj.intro;
  document.querySelector("#portfolioModal1 .description").innerHTML = proj.desc;
  var str = `<li>Date: ${proj.details.date}</li>
                <li>Client: ${proj.details.client}</li>
                <li>Category: ${proj.details.category}</li>`;
  document.querySelector("#portfolioModal1 .list-inline").innerHTML = str;
  document
    .querySelector("#portfolioModal1 img")
    .setAttribute("src", proj.imgPath);
  document
    .querySelector("#portfolioModal1 img")
    .setAttribute("onclick", "modalImgClicked()");
}
