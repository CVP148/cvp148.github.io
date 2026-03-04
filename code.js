const filterType = document.getElementById("filterType");
const filterValue = document.getElementById("filterValue");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const list = document.getElementById("gameList");
const results = document.getElementById("results");

const API_KEY = "57bf286a1cd94d0da44d752d7e937f8a";

let gameList = [];
let searchResults = [];

searchBtn.addEventListener("click", searchGame);

async function searchGame() {
    const query = searchInput.value.trim();
    const filter = filterType.value;
    const filterText = filterValue.value.trim();

    if(!query && !filterText) return;

    let url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}`;

    if(filter && filterText){
        
        const filterResponse = await fetch (`https://api.rawg.io/api/${filter}?key=${API_KEY}&search=${filterText}`);

        const filterData = await filterResponse.json();

        if(filterData.results.length > 0 ){
            const id = filterData.results[0].id;
            url += `&${filter}=${id}`;
        } else {
            alert(`${filter} not found`);
            return;
        }

    }
    const response = await fetch(url);

    const data = await response.json();

    searchResults = data.results;
    
    displayResults(searchResults)
}

async function displayResults(games){
    results.innerHTML = "";

    for( const game of games){
        const div = document.createElement("div");
        div.classList.add("game-card");
        div.innerHTML = `
            <h3>${game.name}</h3>
            <div class = "gameIMG"><img src="${game.background_image}" width="200"></div>
            <p>Released: ${game.released || "N/A"}</p>
            <div class = "addButton"><button onclick="addGame(${game.id})">Add</button></div>
        `;


        results.appendChild(div);
    
    };


}

function addGame(id) {
    const game = searchResults.find(game => game.id === id);

    if (gameList.some(game => game.id === id)) {
        alert("Game already added!");
        return;
    }

    game.rating = 0;
    gameList.push(game);
    renderList();
}

function renderList() {
    list.innerHTML = "";

    gameList.forEach((game, index) => {
        const div = document.createElement("div");
        div.classList.add("log-card");

        div.innerHTML = `
            <h3>${game.name}</h3>
            <div class = "gameIMG"><img src="${game.background_image}" width="200"></div>
            <p></p>
            <div class = "removeButton"><button onclick="removeGame(${index})">Remove</button></div>
            <div class = "stars">${createStars(game.rating, index)}</div>
            
            <div class = "statusButton">Status: <button onclick="statusChange(this)">Playing</button></div>

            <p>Notes:</p>
            <textarea class = "thoughts" placeholder = "Write you notes here"></textarea>
        `;

        list.appendChild(div);
    });
}

function removeGame(index) {
    gameList.splice(index, 1);
    renderList();
}

function statusChange(button){
    const wasPlaying = button.textContent === "Playing";

    if(wasPlaying){
        button.textContent ="Played"

        confetti({
            particleCount: 3000,
            spread: 200,
            origin: {y: 0.12 },
            shapes: ['star'],
            colors: ['#FFD700', '#FFC107', '#FFEB3B'],
        });

        alert("Congratulations 🎉 You finished the game!");
    } else {
        button.textContent = "Playing";
    }
}

function createStars(currentRating, gameIndex){
    let starsHTML = "";

    for(let i = 1; i <= 5; i++){
        if(i <= currentRating){
            starsHTML += `<span class = "star filled" onclick = "setRating(${gameIndex}, ${i})">★</span>`
        } else {
            starsHTML += `<span class = "star filled" onclick = "setRating(${gameIndex}, ${i})">☆</span>`
        }
    }

    return starsHTML;
}

function setRating (gameIndex, rating){
    gameList[gameIndex].rating = rating;
    renderList();
}