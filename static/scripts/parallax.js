/* Parallax */

function offsetTop(element, acc = 0) {
    if (element.offsetParent) {
        return offsetTop(element.offsetParent, acc + element.offsetTop);
    }
    return acc + element.offsetTop;
};

class Parallax {
    constructor(element) {

        this.element = element;
        this.ratio = parseFloat(element.dataset.parallax);

        window.addEventListener('load', ()=> this.onScroll());
        document.addEventListener('scroll', ()=> this.onScroll());
        window.addEventListener('resize', ()=> this.onScroll());
    };

    onScroll() {
        const screenY = window.scrollY + window.innerHeight / 2;
        
        const elementY = offsetTop(this.element) + this.element.offsetHeight / 2;
        
        const diffY = elementY - screenY;

        this.element.style.setProperty("transform", `translateY(${diffY * -1 * this.ratio}px)`);
    }

    static bind() {
        return Array.from(document.querySelectorAll('[data-parallax]')).map((element) => {
            return new Parallax(element);
        });
    };
};

Parallax.bind();
