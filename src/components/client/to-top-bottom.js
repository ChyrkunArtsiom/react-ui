let topButton = document.getElementById("to-top");
let downButton = document.getElementById("to-bottom");
let container = document.querySelector('div.content-container');
let scrollPosition;

container.addEventListener("scroll", function () {
    if (container.scrollTop > 20) {
        topButton.style.display = "block";
        downButton.style.display = "none";
    } else {
        topButton.style.display = "none";
    }
});

topButton.addEventListener("click", function () {
    scrollPosition = container.scrollTop;
    container.scroll(0, 0);
    downButton.style.display = "block";
    topButton.style.display = "none";
});

downButton.addEventListener("click", function () {
    container.scroll(0, scrollPosition)
    topButton.style.display = "none";
})


