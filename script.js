
// Add item to List
// get the element in input, turn it into a text, make a list item
// make list item and append text into li (ex. <li>itemText</li>)
// now add that list element and append to the unorderedlist
function addItem() {
    var itemInput = document.getElementById("itemToAdd");
    var item = itemInput.value.trim();

    // check if its empty
    if (!item) {
        alert("Please enter an item");
        return;
    }

    // checks for duplicates
    const allItems = document.querySelectorAll(".topLayer");
    const currentItem = item.toLowerCase();
    for (let i = 0; i < allItems.length; i++) {
        if (allItems[i].textContent.toLowerCase() === currentItem) {
            alert("This is already on the list");
            return;
        }
    }

    createListItem(item);
    saveList();

    // clear input
    itemInput.value = "";
}

function createListItem(text, bought = false) {
    // create wrapper
    var li = document.createElement("li");
    li.classList.add("swipeWrapper");

    // red background behind item
    var background = document.createElement("div");
    background.classList.add("deleteBg");
    background.textContent = "DELETE";

    // create item
    var topLayer = document.createElement("div");
    topLayer.classList.add("topLayer")
    topLayer.textContent = text;

    if (bought) {
        topLayer.classList.add("bought");
    }

    // build structure
    li.appendChild(background);
    li.appendChild(topLayer);

    // adding marking when items are bought
    topLayer.onclick = function () {
        markAsBought(this);
        saveList();
    }

    // swipe feature 
    addSwipeFeature(topLayer);

    // add wrapper to ul
    document.getElementById("firstList").appendChild(li);
}

window.addEventListener("load", loadList);

document.getElementById("itemToAdd").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addItem();
    }
})

function markAsBought(element) {
    if (element.moved) {
        element.moved = false;
        return;
    }
    element.classList.toggle("bought");
}

function addSwipeFeature(topLayer) {
    let startPos = 0;
    let isDragging = false;

    topLayer.addEventListener("pointerdown", (e) => {
        isDragging = true;
        startPos = e.clientX;
        topLayer.setPointerCapture(e.pointerId);
    });

    topLayer.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        let currentPos = e.clientX;
        let distance = currentPos - startPos;

        if (distance < 0) {
            if (Math.abs(distance) > 10) {
                topLayer.moved = true;
            }

            topLayer.style.transform = `translateX(${distance}px)`;

            let opacity = Math.min(Math.abs(distance) / 100, 1);
            let redStop = 80 - opacity * 50;

            topLayer.style.background = `linear-gradient(
                to right,
                rgb(241, 229, 241) 0%,
                rgb(255, 192, 203) ${redStop}%,
                rgba(241, 229, 241, 0) 100%
            )`;
        }
    })

    topLayer.addEventListener("pointerup", (e) => {
        if(!isDragging) return;

        isDragging = false;

        let distance = e.clientX - startPos;

        if (distance < -50) {
            topLayer.parentElement.remove(); // remove wrapper
            saveList();
        } else {
            topLayer.style.transform = "translateX(0px)";
            topLayer.style.background = null;
        }

    });

    topLayer.addEventListener("pointercancel", () => {
        isDragging = false;
        topLayer.style.transform = "translateX(0px)";
    });
}

function showInput() {
    var input = document.getElementById("itemToAdd");
    var button = document.getElementById("showInputBtn");

    if (input.classList.contains("hidden")) {
        input.classList.remove("hidden");
        button.textContent = "Done";
        input.focus(); // makes the cursor jump into it
    } else {
        input.classList.add("hidden");
        button.textContent = "Add Food";
    }
}

function clearList() {
    var yes = confirm("Are you sure you want to delete this list?");
    if (yes) {
        document.getElementById("firstList").innerHTML = "";
        saveList();
    }
}

function saveList() {
    const items = [];

    document.querySelectorAll(".topLayer").forEach(item => {
        items.push({
            text: item.textContent,
            bought: item.classList.contains("bought")
        });
    });

    localStorage.setItem(
        "groceryList",
        JSON.stringify(items)
    );
}

function loadList() {
    const saved = localStorage.getItem("groceryList");

    if (!saved) return;

    document.getElementById("firstList").innerHTML = "";

    const items = JSON.parse(saved);

    items.forEach(item => {
        createListItem(item.text, item.bought);
    });
}