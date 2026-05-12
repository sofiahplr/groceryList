
// Add item to List
// get the element in input, turn it into a text, make a list item
// make list item and append text into li (ex. <li>itemText</li>)
// now add that list element and append to the unorderedlist
function addItem() {
    var item = document.getElementById("itemToAdd").value 

    if (!item) {
        alert("Please enter an item")
        return;
    }

    var text = document.createTextNode(item)
    var newItem = document.createElement("li")
    newItem.appendChild(text)
    document.getElementById("firstList").appendChild(newItem)
}

function clearList() {
    var yes = confirm("Are you sure you want to delete this list?")
    if (yes) {
        document.getElementById("firstList").innerHTML = ""
    }
}