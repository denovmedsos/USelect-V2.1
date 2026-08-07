/* =====================================================
   USELECT V2
   PART 1
   Gallery Generator
===================================================== */

const MAX_SELECTION = 100;

let currentIndex = 0;
let currentZoom = 1;
let selectedCount = 0;

const galleryContainer = document.getElementById("gallery");

const counterText = document.getElementById("selectedCount");
const progressBar = document.getElementById("progressBar");

const lightbox = document.getElementById("lightbox");
const previewImage = document.getElementById("previewImage");
const previewFilename = document.getElementById("previewFilename");

const zoomText = document.getElementById("zoomPercent");

const btnZoomIn = document.getElementById("zoomIn");
const btnZoomOut = document.getElementById("zoomOut");

const btnNext = document.getElementById("nextPhoto");
const btnPrev = document.getElementById("prevPhoto");
const btnClose = document.getElementById("closePreview");

const btnSelect = document.getElementById("selectPhoto");

const btnReset = document.getElementById("resetBtn");
const btnExport = document.getElementById("exportBtn");

let cards = [];



/* =====================================================
   MEMBUAT GALLERY OTOMATIS
===================================================== */

function buildGallery(){

    galleryContainer.innerHTML="";

    gallery.forEach((filename,index)=>{

        const card=document.createElement("div");

        card.className="card";

        card.dataset.index=index;

        card.innerHTML=`

            <div class="thumbnail">

                <img src="images/${filename}" loading="lazy">

            </div>

            <div class="filename">

                ${filename}

            </div>

            <div class="checkmark">

                ✓

            </div>

        `;

        galleryContainer.appendChild(card);

    });

    cards=document.querySelectorAll(".card");

    installCardEvents();

}



buildGallery();



/* =====================================================
   UPDATE COUNTER
===================================================== */

function updateCounter(){

    counterText.innerText=selectedCount;

    let percent=(selectedCount/MAX_SELECTION)*100;

    progressBar.style.width=percent+"%";

}



/* =====================================================
   OPEN PREVIEW
===================================================== */

function openPreview(index){

    currentIndex=index;

    currentZoom=1;

    const file=gallery[index];

    previewImage.src="images/"+file;

    previewFilename.innerText=file;

    previewImage.style.transform="scale(1)";

    zoomText.innerText="100%";

    lightbox.classList.add("show");

}



/* =====================================================
   INSTALL EVENT CARD
===================================================== */

function installCardEvents(){

    cards.forEach(card=>{

        card.addEventListener("click",()=>{

            openPreview(Number(card.dataset.index));

        });

    });

}
/* =====================================================
   LIGHTBOX CONTROL
===================================================== */

btnClose.addEventListener("click", () => {

    lightbox.classList.remove("show");

});



lightbox.addEventListener("click", (e) => {

    if (e.target === lightbox) {

        lightbox.classList.remove("show");

    }

});



/* =====================================================
   NEXT PHOTO
===================================================== */

btnNext.addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= gallery.length) {

        currentIndex = 0;

    }

    openPreview(currentIndex);

});



/* =====================================================
   PREVIOUS PHOTO
===================================================== */

btnPrev.addEventListener("click", () => {

    currentIndex--;

    if (currentIndex < 0) {

        currentIndex = gallery.length - 1;

    }

    openPreview(currentIndex);

});



/* =====================================================
   ZOOM IN
===================================================== */

btnZoomIn.addEventListener("click", () => {

    currentZoom += 0.25;

    if (currentZoom > 5) {

        currentZoom = 5;

    }

    previewImage.style.transform = `scale(${currentZoom})`;

    zoomText.innerText = Math.round(currentZoom * 100) + "%";

});



/* =====================================================
   ZOOM OUT
===================================================== */

btnZoomOut.addEventListener("click", () => {

    currentZoom -= 0.25;

    if (currentZoom < 0.25) {

        currentZoom = 0.25;

    }

    previewImage.style.transform = `scale(${currentZoom})`;

    zoomText.innerText = Math.round(currentZoom * 100) + "%";

});



/* =====================================================
   KEYBOARD SHORTCUT
===================================================== */

document.addEventListener("keydown", (e) => {

    if (!lightbox.classList.contains("show")) return;

    switch (e.key) {

        case "ArrowRight":

            btnNext.click();

            break;

        case "ArrowLeft":

            btnPrev.click();

            break;

        case "+":

        case "=":

            btnZoomIn.click();

            break;

        case "-":

            btnZoomOut.click();

            break;

        case "Escape":

            btnClose.click();

            break;

    }

});
/* =====================================================
   PHOTO SELECTION
===================================================== */

btnSelect.addEventListener("click", () => {

    const card = cards[currentIndex];

    if (card.classList.contains("selected")) {

        card.classList.remove("selected");

        selectedCount--;

    } else {

        if (selectedCount >= MAX_SELECTION) {

            alert("Maksimal memilih 100 foto.");

            return;

        }

        card.classList.add("selected");

        selectedCount++;

    }

    updateCounter();

    updateSelectButton();

});



/* =====================================================
   UPDATE SELECT BUTTON
===================================================== */

function updateSelectButton() {

    const card = cards[currentIndex];

    if (card.classList.contains("selected")) {

        btnSelect.innerText = "✓ Sudah Dipilih";

        btnSelect.classList.add("selected");

    } else {

        btnSelect.innerText = "✓ Pilih Foto";

        btnSelect.classList.remove("selected");

    }

}



/* =====================================================
   RESET
===================================================== */

btnReset.addEventListener("click", () => {

    if (!confirm("Reset semua pilihan?")) return;

    cards.forEach(card => {

        card.classList.remove("selected");

    });

    selectedCount = 0;

    updateCounter();

});



/* =====================================================
   EXPORT CSV
===================================================== */

btnExport.addEventListener("click", () => {

    let csv = "Filename\n";

    cards.forEach((card, index) => {

        if (card.classList.contains("selected")) {

            csv += gallery[index] + "\n";

        }

    });

    const blob = new Blob([csv], {

        type: "text/csv"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Selected_Photos.csv";

    a.click();

    URL.revokeObjectURL(url);

});



/* =====================================================
   UPDATE PREVIEW BUTTON
===================================================== */

const oldOpenPreview = openPreview;

openPreview = function(index){

    oldOpenPreview(index);

    updateSelectButton();

};



/* =====================================================
   START
===================================================== */

updateCounter();

/* =====================================================
   PART 4
   FINAL FIX & FINISHING
===================================================== */

/* ---------- Perbaiki openPreview ---------- */

const originalOpenPreview = openPreview;

openPreview = function(index){

    originalOpenPreview(index);

    updateSelectButton();

};


/* ---------- Double Click = Zoom ---------- */

previewImage.addEventListener("dblclick",()=>{

    if(currentZoom===1){

        currentZoom=2;

    }else{

        currentZoom=1;

    }

    previewImage.style.transform=`scale(${currentZoom})`;

    zoomText.innerText=Math.round(currentZoom*100)+"%";

});


/* ---------- Mouse Wheel Zoom ---------- */

previewImage.addEventListener("wheel",(e)=>{

    e.preventDefault();

    if(e.deltaY<0){

        currentZoom+=0.25;

    }else{

        currentZoom-=0.25;

    }

    if(currentZoom<0.25) currentZoom=0.25;

    if(currentZoom>5) currentZoom=5;

    previewImage.style.transform=`scale(${currentZoom})`;

    zoomText.innerText=Math.round(currentZoom*100)+"%";

});


/* ---------- Tutup Preview dengan Klik Background ---------- */

lightbox.addEventListener("click",(e)=>{

    if(e.target===lightbox){

        lightbox.classList.remove("show");

    }

});


/* ---------- Inisialisasi ---------- */

updateCounter();

console.log("✅ USelect V2 Loaded");