
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
    var allItems = document.getElementById("firstList").getElementsByTagName("li");
    var currentItem = item.toLowerCase();
    for(let i = 0; i < allItems.length; i++) {
        if (allItems[i].textContent.toLowerCase() === currentItem) {
            alert("This is already on the list");
            return;
        }
    }

    // create wrapper
    var wrapper = document.createElement("div");
    wrapper.classList.add("swipeWrapper");

    // red background behind item
    var background = document.createElement("div");
    background.classList.add("deleteBg");
    background.textContent = "DELETE";

    // create item
    var text = document.createTextNode(item);
    var newItem = document.createElement("li");
    newItem.appendChild(text);

    // adding marking when items are bought
    newItem.onclick = function () {
        markAsBought(this);
    }

    // swipe feature 
    addSwipeFeature(newItem);

    // build structure
    wrapper.appendChild(background);
    wrapper.appendChild(newItem);

    // add wrapper to ul
    document.getElementById("firstList").appendChild(wrapper);

    // clear input
    itemInput.value = "";
}

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

function addSwipeFeature(item) {
    let startPos = 0;
    let isDragging = false;

    item.addEventListener("pointerdown", (e) => {
        isDragging = true;
        startPos = e.clientX;
        item.setPointerCapture(e.pointerId);
    });

    item.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        let currentPos = e.clientX;
        let distance = currentPos - startPos;

        if (distance < 0) {
            if (Math.abs(distance) > 10) {
                item.moved = true;
            }

            item.style.transform = `translateX(${distance}px)`;

            let opacity = Math.min(Math.abs(distance) / 100, 1);
            let redStop = 80 - opacity * 50;

            item.style.background = `linear-gradient(
                to right,
                rgb(241, 229, 241) 0%,
                rgb(255, 192, 203) ${redStop}%,
                rgba(241, 229, 241, 0) 100%
            )`;
        }
    })

    item.addEventListener("pointerup", (e) => {
        if(!isDragging) return;

        isDragging = false;

        let distance = e.clientX - startPos;

        if (distance < -60) {
            item.parentElement.remove(); // remove wrapper
        } else {
            item.style.transform = "translateX(0px)";
            item.style.background = null;
        }

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
    }
}