'use strict';

// mutable let
let categories = {
    inbound:  0,
    outbound: 0,
    skip:     0,
};
let subtractMode = false;

const addToCategory = (aCollection, aNumber, aCategory) => {
    const currentValue = aCollection[aCategory] || 0;
    const nextValue = currentValue + aNumber;
    const nextState = { ...aCollection, [aCategory]: nextValue };
    categories = nextState;
    updateTotal();
    updatePageCounts();
};

// if binding is to be used, the object values need to be mutable, rather than the reference to the object itself
// const incCategory = addToCategory.bind(document, categories);

const sum = (a, b) => a + b;
const notTotal = category => category.toLowerCase() !== 'total';
const updateTotal = () => categories.total = Object.keys(categories)
                                                   .filter(notTotal)
                                                   .map(category => categories[category])
                                                   .reduce(sum);

const updatePageCounts = () => {
    const counters = [...document.querySelectorAll('[data-signal]')];
    counters.map(element => element.textContent = categories[element.dataset.signal]);
};


[...document.querySelectorAll('[data-inc_category]')].map((element) => {
    element.onclick = (event) => {
        const numberToAdd = subtractMode ? -1 : 1;
        addToCategory(categories, numberToAdd, element.dataset.inc_category);
        updateTotal();
        updatePageCounts();
    }
});

document.addEventListener('keydown', (event) => {
    const buttons = [...document.querySelectorAll('button')];
    if (event.key === 'Control') subtractMode = !subtractMode;
    buttons.map((element) => element.textContent = subtractMode ? '-' : '+');
});

updateTotal();
updatePageCounts();