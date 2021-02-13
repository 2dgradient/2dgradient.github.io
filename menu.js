window.addEventListener('load', () => {
    let sliders = document.querySelectorAll('input[type=range]');
    for (let slider of sliders) {
        update(slider);
        slider.addEventListener('input', (e) => update(e.target));
    };
});

function update(slider) {
    if (slider.parentElement.classList.contains('doubleRange')) {
        let parent = slider.parentElement;
        let classes = [['.min', Math.min], ['.max', Math.max]];
        if (slider.classList.contains('max')) classes.reverse();
        slider.value = classes[0][1](slider.value, parent.querySelector(classes[1][0]).value);
        parent.previousElementSibling.querySelector(classes[0][0]).innerHTML = slider.value;
    }
    else slider.previousElementSibling.innerHTML = slider.value;
}
