//Städer och länder

//Variables, not sure if these are needed...
var visitedCitiesArray = [];
var visitedCitiesPopulation = 0;

//Run loadsite when page loads
loadSite();

function loadSite(){
    
    //Print image in the content div.
    let contentDiv = document.getElementById("content");
    let img = document.createElement("img");
    img.src = "./images/earthicon.png";
    img.className = "mx-auto d-block";
    contentDiv.appendChild(img); 

    //Creates an item in localstorage for the users visited cities.
    localStorage.setItem("visitedCities", JSON.stringify(visitedCitiesArray));

    //Fetch the land.json file and store in "countries".
    fetch("land.json")
    .then (response => response.json())
    .then( function(countries){ 

    //Print country names in country-menu div as a menu.
    for(i = 0; i < countries.length; i++){
        let li = document.createElement("li");
        let menu = document.getElementById("country-menu");
        li.className = "nav-item";
            
        //Gives every li element a onClick that calls the printCities() function and sends the country id.
        li.innerHTML = "<a class=\"nav-link\" href=\"#\" onclick=\"printCities(" + countries[i].id + ")\">" + countries[i].countryname + "</a>";  
            
        //Insert the li elements before "besökta sidor" that is already created in the HTML document.
        menu.insertBefore(li, menu.childNodes[0]);             
    }
    })
}

//This function prints the cities of selected country as a menu in the "cities-div" div.
function printCities(id){
    let content = document.getElementById("city-menu");

    //if there is already something in the div, delete it.
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }
    //Fetch the stad.json file.
    fetch("stad.json")
    .then (response => response.json())
    .then( function(cities){ 
        //For every object in the file, check the countryid. if its the same as the clicked country, print the city.
        for(i = 0; i < cities.length; i++){
            if(cities[i].countryid === id){
                let li = document.createElement("li");

                //If a city is clicked, run the drawCity() function and send the city id from the object.
                li.innerHTML = "<a href=\"#\" class=\"nav-link\" onclick=\"drawCity(" + cities[i].id + ")\">" + cities[i].stadname + "</a>";
                content.appendChild(li);
            }
        }
    })
}

//This function prints the info about the city, based on the city that was clicked.
function drawCity(id){
    let content = document.getElementById("content");

    //if there is already something in the div, delete it.
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }

    //Fetch the stad.json file and store in "cities".
    fetch("stad.json")
    .then (response => response.json())
    .then(function(cities){ 

        //Find the object with the correct id.
        for(i = 0; i < cities.length; i++){
            if(cities[i].id === id){
                let content = document.getElementById("content");

                //Create the elements
                let h3 = document.createElement("h3");
                let p = document.createElement("p");

                //add attributes to the elements
                h3.innerHTML = cities[i].stadname;
                p.innerHTML = cities[i].stadname + " är en stad med " + cities[i].population + " invånare.";
                h3.className = "text-center";
                p.className = "text-center";

                //Append to the content div
                content.appendChild(h3);
                content.appendChild(p);

                //Fetch the "visitedCities" item from localstorage and check if it includes the selected citys id.
                let inc = JSON.parse(localStorage.getItem("visitedCities"));
                //"does" will be a either true or false.
                let does = inc.includes(cities[i].id);

                //if the citys id is not in the localstorage, print a button that calls the "visitedCitiesBtnClick()" function.
                //else print a message that tells the user that the city is already visited.
                if(does === false){
                    let btn = document.createElement("button");
                    btn.innerHTML = "Besökt";
                    btn.setAttribute("onclick", "visitedCitiesBtnClick(" + i + ")");
                    btn.id = "visitBtn";
                    content.appendChild(btn);
                }
                else{
                    let pr = document.createElement("p");
                    pr.innerHTML = "Du har Besökt " + cities[i].stadname;
                    pr.className = "text-center";
                    content.appendChild(pr);
                }
                
                //This prints the correct country flag image, depending on witch country the city is in.
                if(cities[i].countryid === 1){
                    let contentDiv = document.getElementById("content");
                    let img = document.createElement("img");
                    img.src = "./images/sweicon.png";
                    img.className = "mx-auto d-block";
                    contentDiv.appendChild(img);
                }
                else if(cities[i].countryid === 2){
                    let contentDiv = document.getElementById("content");
                    let img = document.createElement("img");
                    img.src = "./images/finicon.png";
                    img.className = "mx-auto d-block";
                    contentDiv.appendChild(img);
                }
                else{
                    let contentDiv = document.getElementById("content");
                    let img = document.createElement("img");
                    img.src = "./images/noricon.png";
                    img.className = "mx-auto d-block";
                    contentDiv.appendChild(img);
                } 
            }
    }
})
}

//This function is called when the user clicks the "Besökt" button for a city.
function visitedCitiesBtnClick(id){

    //Fetch the stad.json file and store in "cities"
    fetch ("stad.json")
        .then(response => response.json())
        .then(cities => {
                //store the city id in visitedCitiesArray, and save it in "visitedCities" in localstorage.
                visitedCitiesArray.push(cities[id].id);
                localStorage.setItem("visitedCities", JSON.stringify(visitedCitiesArray));

                //Add the population of the city to visitedCitiesPopulation and delete the button.
                let content = document.getElementById("content");
                let visitBtn = document.getElementById("visitBtn")
                let n = cities[id].population;
                visitedCitiesPopulation = (n + visitedCitiesPopulation);
                localStorage.setItem("visitedPopulation", visitedCitiesPopulation);
                content.removeChild(visitBtn);
        })
}

//This function is called when the user clicks "besökta städer" in the menu.
function drawVisitedCities(){

    //if there is already something in the div, delete it.
    let content = document.getElementById("content");
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }

    //Fetch the stad.json file and store int in "cities".
    fetch ("stad.json")
    .then(response => response.json())
    .then(cities => {

        //For every object in the file, check witch ones id's are in the localstorage as visited cities. 
        for(i = 0; i < cities.length; i++){
            let localS = JSON.parse(localStorage.getItem("visitedCities"));
            let does = localS.includes(cities[i].id);
                
                //If the city is in localstorage print out the name in a p element.
                if(does === true){
                    let p = document.createElement("p");
                    p.className = "text-center";
                    p.innerHTML = cities[i].stadname;
                    content.appendChild(p);
                }    
            }
        })

        //Create elements to show the population of the cities, or if you have not visited any cities.
        let h4 = document.createElement("h4");
        h4.className = "text-center";

        //if you have visited cities, print out the total population and create a button to delete visited cities.
        //else tell the user they have no visited cities.
        let ls = localStorage.getItem("visitedPopulation");
        if(ls > 1){
            h4.innerHTML = "I dessa städer kan du ha stött på: " + ls + " personer";
            content.appendChild(h4);
            let btn = document.createElement("button");
            btn.innerHTML = "Rensa";
            btn.setAttribute("onclick", "clearStorage()");
            content.appendChild(btn);
        }
        else{
            h4.innerHTML = "Du har inte besökt några städer.";
            content.appendChild(h4);
        }
}

//This function is called to delete their visited cities.
function clearStorage(){

    //Clear localstorage
    localStorage.clear();

    //Create and initiate the "visitedCities" item in localstorage again.
    visitedCitiesArray = [];
    localStorage.setItem("visitedCities", JSON.stringify(visitedCitiesArray));

    //reload the page.
    location.reload();
}

