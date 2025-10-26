let hasCashews = false;
let hasMilk = false;

const mixture = document.querySelector('.mixture');
const mixBtn = document.querySelector('.mix-button');
const finalSweet = document.querySelector('.final-sweet');
const nextBtn = document.querySelector('.next-button');
const doneMsg = document.querySelector('.done-message');

document.getElementById('cashews').addEventListener('click', () => {
    if (!hasCashews) {
        mixture.style.height = "20px";
        hasCashews = true;
        check();
    }
});

document.getElementById('milk').addEventListener('click', () => {
    if (!hasMilk) {
        mixture.style.height = "45px";
        hasMilk = true;
        check();
    }
});

function check() {
    if (hasCashews && hasMilk) {
        mixBtn.disabled = false;
    }
}

mixBtn.addEventListener('click', () => {
    mixBtn.disabled = true;
    mixture.style.transition = "transform 1.8s ease";
    mixture.style.transform = "translateX(-50%) rotate(360deg)";

    setTimeout(() => {
        mixture.style.display = "none";
        finalSweet.style.display = "block";
        doneMsg.style.display = "block";
        doneMsg.textContent = "💛 The kitchen's calling, and I think we need to whip up something hot... I'm ready to be your sous-chef, taking your orders and getting messy with all the ingredients.💛";
        nextBtn.style.display = "inline-block";
    }, 2000);
});
