
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

    var text = document.createTextNode(item);
    var newItem = document.createElement("li");
    newItem.appendChild(text);

    // adding marking when items are bought
    newItem.onclick = function () {
        markAsBought(this);
    }

    addSwipeFeature(newItem);

    document.getElementById("firstList").appendChild(newItem);

    itemInput.value = "";
}

document.getElementById("itemToAdd").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addItem();
    }
})

function markAsBought(element) {
    element.classList.toggle("bought")
}

function addSwipeFeature(item){
    let startPos = 0;
    let currentPos = 0;
    let isDragging = false;

    item.addEventListener("pointerdown", (e) => {
        isDragging = true;
        startPos = e.clientX;

        item.setPointerCapture(e.pointerId);
    })

    item.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        currentPos = e.clientX;
        
        let distance = currentPos - startPos;

        if (distance < 0) {
            item.style.transform = `translateX(${distance}px)`;
        } 
    })

    item.addEventListener("pointerup", (e) => {
        if(!isDragging) return;

        isDragging = false;

        let distance = currentPos - startPos;

        if(distance < -100) {
            item.remove()
        } else {
            item.style.transform = "translateX(0px)";
        }

    })
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