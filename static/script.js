let burger = document.getElementById('burger');
let header = document.querySelector('.navbar-off');
let navElement = document.querySelector(".burger").nextElementSibling.querySelectorAll("span");

let topButton = document.querySelector('.topButton');

function toggleNav(){
    header.classList.toggle('navbar');
}

burger.addEventListener('click', toggleNav);

navElement.forEach(element => {
    element.addEventListener('click', toggleNav);
})

// show/hide top button depending of the scroll Y position
window.onscroll = function() {
    let top = window.scrollY;
    if (top >= 100) topButton.style.display="inline-block";
    else topButton.style.display="none";
}