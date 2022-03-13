let isPhoneDisplay = window.matchMedia('(max-width: 767px)');

if (isPhoneDisplay) {
    document.getElementById("navbar").style.zIndex = "-10";
    document.getElementById("navbar").style.width = "80vw";
}

function showHideNavBar() {
    if (document.getElementById("navbar").style.zIndex === "-10") {
        document.getElementById("navbar").style.zIndex = "10";

        return;
    }

    if (document.getElementById("navbar").style.zIndex === "10") {
        document.getElementById("navbar").style.zIndex = "-10";
    }
}