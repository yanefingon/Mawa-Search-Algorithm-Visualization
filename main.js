// get constant elements' references
const slider = document.getElementById("speed");
const button = document.getElementsByTagName("button")[0];
const array_input = document.getElementById("array");
const search_input = document.getElementById("search");
const display = document.getElementsByClassName("display")[0];
const monitor = document.getElementsByClassName("monitored-values")[0];
const complexity = document.getElementsByClassName("complexity")[0];

// ****************************************************************
//                         main functions
// ****************************************************************

function startSimulation() {
    let array = [];
    let i, l, r;
    // parse the input
    try {
        array = getArray();
        if (array.length === 0) {
            throw "input array is empty!";
        }

        i = search_input.value;
    }
    catch (err) {
        alert(err);
        return;
    }

    // now as we know the input is valid
    changeButton(stopSimulation, "Clear", "rgb(108, 198, 180)");

    l = 0;
    r = array.length - 1;
    startMonitor(array.length);

    // run the simulation loop till the very end
    mawaSearch(array, i, l, r);
}

function stopSimulation() {
    changeButton(startSimulation, "Start Simulation", "rgb(146, 190, 147)");
    monitor.style.visibility = "hidden";
    complexity.style.visibility = "hidden";
    slider.value = 100; // to end simulation faster
    display.innerHTML = "";
}

// ****************************************************************
//                          helper functions
// ****************************************************************

// get the array for the simulation
function getArray() {
    const array = [];

    try {
        let values = array_input.value;
        values = values.replaceAll(/[\[\] ]/g, ''); // remove all '[', ']', ''
        values = values.split(',');
        for (const i in values) {
            const j = parseInt(values[i]);
            if (Number.isInteger(j)) array.push(j);
            else throw "one of the values is NaN";
        }

        return array;
    } 
    catch (err) {
        throw "Input array is invalid: " + err;
    }
}

// change the button for the next phase
function changeButton(onclick, text, colour) {
    button.onclick = onclick;
    button.innerText = text;
    button.style.backgroundColor = colour;
}

// add a new row to the simulation display
function addRow(array) {
    const frag = new DocumentFragment();
    row = frag.appendChild(document.createElement("div"));
    for (let i = 0; i < array.length; i++) {
        const element = document.createElement("div");
        element.innerText = array[i];
        row.appendChild(element);
    }

    display.appendChild(frag);
    return row;
}

// get the row ready to be displayed
function styleRow(row, l, m, r) {
    const children = row.children;
    //children[l].className = children[r].className = "edge";
    children[l].className = "l";
    children[r].className = "r";
    children[m].className = "m";
}

function updateMonitor(l, m, r) {
    const rows = document.getElementsByTagName("td");
    rows[0].innerHTML = l;
    rows[1].innerHTML = m;
    rows[2].innerHTML = r;
    // increment Steps
    rows[4].innerHTML = parseInt(rows[4].innerHTML) + 1;
}

function startMonitor(n) {
    // complexity
    document.getElementsByTagName("td")[3].innerHTML = n;
    document.getElementsByTagName("td")[4].innerHTML = 0;

    let shift = "0vw";
    if (n < 15) shift = "30vw";
    else if (n < 35) shift = "15vw";
    display.style.marginLeft = shift;

    monitor.style.visibility = "visible";
    complexity.style.visibility = "visible";
}

// get the wait period from slider
function getSleepTime() {
    return (100 - slider.value) * 30; // 0 to 3 seconds
}

// just a sleepy function lol
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

// got refactored heavily as it was essentially unreadable. Still the same thing.
const mawaSearch = async(array, i, l, r) => {
    try {
        const m = parseInt((l + r) / 2);

        // **********************************
        // this is not the algorithm yet
        styleRow(addRow(array), l, m, r);
        updateMonitor(l, m, r);
        await sleep(getSleepTime());
        // **********************************

        // the algorithm itself
        if (array[m] == i) 
        {
            return m;
        } 
        else 
        {
            array.splice(m, 1); // remove the middle element

            if (m == 0) 
            {
                if (array.length)
                {
                    mawaSearch(array, i, 0, array.length - 1);
                }
            } 
            else if (array[m - 1] > i) 
            {
                mawaSearch(array, i, l, m - 1);
            } 
            else 
            {
                mawaSearch(array, i, m - 1, r - 1);
            }
        }
    }
    catch (err) {
        alert("Killer input for this algorithm. Possibly, memory corruption.");
    }
}
