const fr = document.querySelector(".fr");
const en = document.querySelector(".en");

const langFr = document.querySelector(".lang-fr");
const langEn = document.querySelector(".lang-en");

// Quand on appuie sur fr
langFr.addEventListener("click", hideEn);

// ça envoit la fonction hideEn
function hideEn() {
    en.style.display = "none";
    fr.style.display = "block";
}

// Quand on appuie sur en
langEn.addEventListener("click", hideFr);
// ça envoit la fonction hideFr
function hideFr() {
    en.style.display = "block";
    fr.style.display = "none";
}
