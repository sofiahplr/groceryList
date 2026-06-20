
// Add item to List
// get the element in input, turn it into a text, make a list item
// make list item and append text into li (ex. <li>itemText</li>)
// now add that list element and append to the unorderedlist
function addItem() {
    var itemInput = document.getElementById("itemToAdd");
    var qtyInput = document.getElementById("itemQty");
    var memoInput = document.getElementById("itemMemo");

    var itemName = itemInput.value.trim();
    var qty = qtyInput.value;
    var memo = memoInput.value.trim();

    // check if its empty
    if (!itemName) {
        alert("Please enter an item");
        return;
    }

    // checks for duplicates
    const allItems = document.querySelectorAll(".item-name");
    const currentItemName = itemName.toLowerCase();
    for (let i = 0; i < allItems.length; i++) {
        if (allItems[i].textContent.trim().toLowerCase() === currentItemName) {
            alert("This is already on the list");
            return;
        }
    }

    createListItem(itemName, qty, memo);
    saveList();

    // clear input
    itemInput.value = "";
    qtyInput.value = "";
    memoInput.value = "";
}

function createListItem(itemName, qty, memo, bought = false) {
    // create wrapper
    var listItem = document.createElement("li");
    listItem.classList.add("swipeWrapper");

    // red background behind item
    var deleteBackground = document.createElement("div");
    deleteBackground.classList.add("deleteBg");
    deleteBackground.textContent = "DELETE";

    // create item
    var topLayer = document.createElement("div");
    topLayer.classList.add("topLayer");

    topLayer.dataset.itemName = itemName;
    topLayer.dataset.qty = qty;
    topLayer.dataset.memo = memo;

    // display
    topLayer.textContent = "";

    let nameSpan = document.createElement("span");
    nameSpan.classList.add("item-name");
    nameSpan.textContent = itemName;

    let qtySpan = document.createElement("span");
    qtySpan.classList.add("item-qty");
    qtySpan.textContent = qty ? ` x${qty}` : "";

    let memoSpan = document.createElement("span");
    memoSpan.classList.add("item-memo");
    memoSpan.textContent = memo ? memo : "";

    topLayer.appendChild(nameSpan);
    topLayer.appendChild(qtySpan);
    topLayer.appendChild(memoSpan);

    if (bought) {
        topLayer.classList.add("bought");
    }
    

    // build structure
    listItem.appendChild(deleteBackground);
    listItem.appendChild(topLayer);

    // adding marking when items are bought
    topLayer.onclick = function () {
        markAsBought(this);
        saveList();
    }

    // swipe feature 
    addSwipeFeature(topLayer);

    // add wrapper to ul
    document.getElementById("firstList").appendChild(listItem);
}

window.addEventListener("load", loadList);

document.getElementById("itemToAdd").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addItem();
    }
})
document.getElementById("itemMemo").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addItem();
    }
})

function markAsBought(topLayer) {
    if (topLayer.moved) {
        topLayer.moved = false;
        return;
    }
    topLayer.classList.toggle("bought");
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
        //limit swipe to the left
        distance = Math.max(distance, -70);

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
    var inputs = document.querySelectorAll(".groceryInput");
    var button = document.getElementById("showInputBtn");

    var isHidden = inputs[0].classList.contains("hidden");

    inputs.forEach(input => {
        if (isHidden) {
            input.classList.remove("hidden");
        } else {
            input.classList.add("hidden");
        }
    });

    button.textContent = isHidden ? "Done" : "Add Food";

    if (isHidden) {
        inputs[0].focus();
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

    document.querySelectorAll(".topLayer").forEach(topLayer => {
        items.push({
            itemName: topLayer.dataset.itemName,
            qty: topLayer.dataset.qty,
            memo: topLayer.dataset.memo,
            bought: topLayer.classList.contains("bought")
        });
    });

    localStorage.setItem(
        "groceryList",
        JSON.stringify(items)
    );
}

function loadList() {
    const savedList = localStorage.getItem("groceryList");

    if (!savedList) return;

    document.getElementById("firstList").innerHTML = "";

    const items = JSON.parse(savedList);

    items.forEach(savedItem => {
        createListItem(
            savedItem.itemName, 
            savedItem.qty,
            savedItem.memo,
            savedItem.bought);
    });
}