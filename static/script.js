function showHideNavBar() {
    if (document.getElementById("navbar").style.width === "80vw") {
        document.getElementById("navbar").style.width = "0vw";

        document.getElementById("navbar").childNodes.forEach(
            e => {
                if (e.nodeName === "SPAN") {
                    e.style.display = "none";
                }
            }
        )
        return;
    }

    if (document.getElementById("navbar").style.width === "0vw") {
        document.getElementById("navbar").style.width = "80vw";

        document.getElementById("navbar").childNodes.forEach(
            e => {
                if (e.nodeName === "SPAN") {
                    e.style.display = "block";
                }
            }
        )
    }
}