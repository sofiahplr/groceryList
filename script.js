
// to do: use const and let, lessen var 

let editMode = false;
let currentEditingItem = null;

// Add item to List
// get the element in input, turn it into a text, make a list item
// make list item and append text into li (ex. <li>itemText</li>)
// now add that list element and append to the unorderedlist
function addItem() {
    var nameInput = document.getElementById("itemToAdd");
    var qtyInput = document.getElementById("itemQty");
    var memoInput = document.getElementById("itemMemo");

    var name = nameInput.value.trim();
    var qty = qtyInput.value;
    var memo = memoInput.value.trim();

    // check if its empty
    if (!name) {
        alert("Please enter an item");
        return;
    }

    // checks for duplicates
    const allItemNames = document.querySelectorAll(".item-name");
    const currentItemName = name.toLowerCase();
    for (let i = 0; i < allItemNames.length; i++) {
        if (allItemNames[i].textContent.trim().toLowerCase() === currentItemName) {
            alert("This is already on the list");
            return;
        }
    }

    createListItem(name, qty, memo);
    saveList();

    // clear input
    nameInput.value = "";
    qtyInput.value = "";
    memoInput.value = "";
}

// split into diff funcs
function createListItem(name, qty, memo, bought = false) {
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

    topLayer.dataset.name = name;
    topLayer.dataset.qty = qty;
    topLayer.dataset.memo = memo;

    // display
    topLayer.textContent = "";

    let nameSpan = document.createElement("span");
    nameSpan.classList.add("item-name");
    nameSpan.textContent = name;

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
        if (editMode) {
            selectEditItem(this);
        } else {
            markAsBought(this);
            saveList();
        }
    }

    // swipe feature 
    addSwipeFeature(topLayer);

    // add wrapper to ul
    document.getElementById("firstList").appendChild(listItem);
}

window.addEventListener("load", loadList);

/* To do: combine these three listeners so not repetitive */
document.getElementById("itemToAdd").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addItem();
    }
})

document.getElementById("itemQty").addEventListener("keydown", function (event) {
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

            let abs = Math.abs(distance);

            const fadeStart = 25;
            const fadeRange = 50;

            let progress = 0;

            if (abs > fadeStart) {
                progress = Math.min((abs - fadeStart) / fadeRange, 1);
            }

            progress = Math.pow(progress, 1.8);

            let fadePoint = 100 - progress * 90;

            topLayer.style.webkitMaskImage =
            `linear-gradient(to right, black ${fadePoint}%, transparent 100%)`;
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
            topLayer.style.webkitMaskImage = "";
        }

    });

    topLayer.addEventListener("pointercancel", () => {
        isDragging = false;
        topLayer.style.transform = "translateX(0px)";
    });
}

function showInput() {
    var inputs = document.querySelectorAll(".groceryInput");
    var showInp = document.getElementById("showInputBtn");

    var isHidden = inputs[0].classList.contains("hidden");

    inputs.forEach(input => {
        if (isHidden) {
            input.classList.remove("hidden");
        } else {
            input.classList.add("hidden");
        }
    });

    showInp.textContent = isHidden ? "Done" : "Add Food";

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
            name: topLayer.dataset.name,
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
            savedItem.name, 
            savedItem.qty,
            savedItem.memo,
            savedItem.bought);
    });
}

function selectEditItem(groceryItem) {
    if (currentEditingItem) {
        currentEditingItem.classList.remove("editing-selected");
    }
    
    currentEditingItem = groceryItem;

    currentEditingItem.classList.add("editing-selected");

    document.getElementById("editName").value = groceryItem.dataset.name;
    document.getElementById("editQty").value = groceryItem.dataset.qty;
    document.getElementById("editMemo").value = groceryItem.dataset.memo;
}

function saveEditedItem() {
    if (!currentEditingItem) {
        alert("Please select an item first");
        return;
    }

    const newName = document.getElementById("editName").value.trim();
    const newQty = document.getElementById("editQty").value;
    const newMemo = document.getElementById("editMemo").value.trim();

    if (!newName) {
        alert("Item name cannot be empty");
        return;
    }

    currentEditingItem.dataset.name = newName;
    currentEditingItem.dataset.qty = newQty;
    currentEditingItem.dataset.memo = newMemo;

    currentEditingItem.querySelector(".item-name").textContent = newName;
    currentEditingItem.querySelector(".item-qty").textContent = newQty ? ` x${newQty}` : "";
    currentEditingItem.querySelector(".item-memo").textContent = newMemo;

    saveList();
}

function toggleEditor() {
    document.getElementById("editMode").classList.toggle("hidden");

    let form = document.getElementById("editForm");
    form.classList.toggle("hidden");

    let btn = document.getElementById("editBtn");

    let isHidden = form.classList.contains("hidden");
    editMode = !isHidden;

    btn.textContent = isHidden ? "Edit" : "Close Edit"

    if (isHidden) {
        currentEditingItem.classList.remove("editing-selected");
        currentEditingItem = null;
    } else {
        const firstItem = document.querySelector(".topLayer");

        if (firstItem) {
            selectEditItem(firstItem);
        }
    }
}

function clearInput() {
    document.querySelectorAll(".groceryInput input, .groceryInput textarea")
        .forEach(input => input.value = "");
}