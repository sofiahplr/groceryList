
// Add item to List
// get the element in input, turn it into a text, make a list item
// make list item and append text into li (ex. <li>itemText</li>)
// now add that list element and append to the unorderedlist
function addItem() {
    var itemInput = document.getElementById("itemToAdd")
    var item = itemInput.value.trim()

    // check if its empty
    if (!item) {
        alert("Please enter an item")
        return;
    }

    var allItems = document.getElementById("firstList").getElementsByTagName("li")
    
    for(let i = 0; i < allItems.length; i++) {
        if (allItems[i].textContent.toLowerCase() === item.toLowerCase()) {
            alert("This is already on the list")
            return;
        }
    }

    var text = document.createTextNode(item)
    var newItem = document.createElement("li")
    newItem.appendChild(text)
    document.getElementById("firstList").appendChild(newItem)

    itemInput.value = ""
}

function clearList() {
    var yes = confirm("Are you sure you want to delete this list?")
    if (yes) {
        document.getElementById("firstList").innerHTML = ""
    }
}