'use strict';

// useful?
const qSelectAll = ((query) => [...document.querySelectorAll(query)]).bind(document);

const DAILY_GOAL = 30;

const settings = {
    measureGoal: true,
    categorySeparator: '——',
    delimiter: '::',
};

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
const validCallTypes = ['inbound', 'outbound'];
const isValidCall = (aCallType) => validCallTypes.includes(aCallType);
const updateTotal = () => categories.total = Object.keys(categories)
                                                   .filter(isValidCall)
                                                   .map(category => categories[category])
                                                   .reduce(sum);

const updatePageCounts = () => {
    const counters = [...document.querySelectorAll('[data-signal]')];
    counters.map(element => element.textContent = categories[element.dataset.signal]);
    const totalCounter = document.querySelector('[data-signal="total"]');
    const hasMetGoal = categories.total >= DAILY_GOAL;
    hasMetGoal ? totalCounter.classList.add('magenta')
               : totalCounter.classList.remove('magenta');
};


qSelectAll('[data-inc_category]').map((element) => {
    element.onclick = (event) => {
        const numberToAdd = subtractMode ? -1 : 1;
        addToCategory(categories, numberToAdd, element.dataset.inc_category);
        updateTotal();
        updatePageCounts();
    };
});

document.addEventListener('keydown', (event) => {
    const buttons = [...document.querySelectorAll('button')];
    if (event.key === 'Control') subtractMode = !subtractMode;
    buttons.map((element) => element.textContent = subtractMode ? '-' : '+');
});

document.querySelector('.total').addEventListener('click', (_) => {
    const onlyPositiveCounts = (category) => categories[category] && categories[category] > 0;
    let results = Object.keys(categories)
                          .filter(onlyPositiveCounts)
                          .map(cat => `${cat}${settings.delimiter}${categories[cat]}`)
                          .join(settings.categorySeparator);
    if (settings['measureGoal']) results += `/${DAILY_GOAL}`;
    navigator.clipboard.writeText(results);
    console.log(`Progress copied to clipboard.`);
});

// initialization

document.querySelector('#goal').textContent = DAILY_GOAL;
if (!settings.measureGoal) {
    qSelectAll('.goal').map(element => element.hidden = true);
}
updateTotal();
updatePageCounts();