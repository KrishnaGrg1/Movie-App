// Define the API key and base URL
const api_Key = '4626200399b08f9d04b72348e3625f15';
const baseUrl = 'https://api.themoviedb.org/3/';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const trendingSection = document.querySelector('.trending-content');
const trending = document.querySelector('.trending');
const trailersContainer = document.querySelector('.trailers');
const continueWatchingList = document.getElementById('continueWatchingList');

// Function to fetch search results based on user input
async function fetchSearchResults(query) {
    try {
        const response = await fetch(`${baseUrl}search/multi?api_key=${api_Key}&query=${query}`);
        const data = await response.json();
        displaySearchResults(data.results);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

// Event listener for search input changes
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();

    // If there is something typed, fetch the search results
    if (query) {
        fetchSearchResults(query);
    } else {
        searchResults.innerHTML = ''; // Clear results if no input
        searchResults.classList.remove('visible'); // Hide results when input is empty
    }
});

// Function to display search results
function displaySearchResults(results) {
    searchResults.innerHTML = ''; // Clear previous results

    // Show results container if there are results
    if (results.length > 0) {
        searchResults.classList.add('visible');
    } else {
        searchResults.classList.remove('visible');
    }

    results.slice(0, 10).forEach(result => {
        const title = result.title || result.name;
        const posterPath = result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : 'placeholder.jpg';
        const date = result.release_date || result.first_air_date;

        const movieItem = document.createElement('div');
        movieItem.classList.add('search-item');
        movieItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${posterPath}" alt="${title}">
            </div>
            <div class="search-item-info">
                <h3>${title}</h3>
                <p>${result.media_type} <span>&nbsp; ${date}</span></p>
            </div>
            <button class="watchListBtn" id="${result.id}">Add to Playlist</button>
        `;
 // Add event listener to redirect to details page
 const poster = document.getElementById(`movie-poster-${id}`);
 poster.addEventListener('click', () => {
     window.location.href = `./movie_details/movie_details.html?id=${id}`;
 });
        searchResults.appendChild(movieItem);
    });
}

// Fetch data for trending movies and display them along with trailers
async function fetchAndDisplayTrendingMovies() {
    try {
        const response = await fetch(`${baseUrl}trending/all/week?api_key=${api_Key}`);
        const data = await response.json();

        // Clear previous trailers before displaying new ones
        trailersContainer.innerHTML = ''; // Clear previous trailers

        // Only display a few trailers (for example, 3)
        const trendingMovies = data.results.slice(0, 6);
        displayMovieTrailers(trendingMovies);
        displayTrendingMovie(data.results[0]); // Display the top trending movie
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
}

// Fetch Video Trailers for the given movie ID
async function fetchMovieTrailer(movieId) {
    try {
        const response = await fetch(`${baseUrl}movie/${movieId}/videos?api_key=${api_Key}`);
        const data = await response.json();

        // Get the YouTube trailer (if available)
        const video = data.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');
        if (video) {
            return `https://www.youtube.com/embed/${video.key}`;
        }

        return null;  // No trailer found
    } catch (error) {
        console.error('Error fetching movie trailer:', error);
        return null;  // Fallback if no trailer is found
    }
}

function displayTrendingMovie(movie) {
    // Set the background image to the movie poster
    const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.jpg';
    trending.style.backgroundImage = `url(${posterPath})`; // Set background image of the .trending section

    // Create the HTML structure for the movie details
    const movieItem = document.createElement('div');
    movieItem.classList.add('info');
    
    const title = movie.title || movie.name;
    const releaseDate = movie.release_date || movie.first_air_date;
    const movieOverview = movie.overview ? movie.overview + '...' : 'No overview available';

    movieItem.innerHTML = `
        <h3>${title}</h3>
        <p>${releaseDate}</p>
        <p>${movieOverview}</p>
        <div class="info-button-section">
            <button id="watch">
                <i class="fa fa-play"></i><span>Watch</span>
            </button>
            <button id="playlist">
                Add to Playlist
            </button>
        </div>
    `;

    // Handle "Watch" button click to open trailer if available
    const watchBtn = movieItem.querySelector('#watch');
    watchBtn.disabled = true; // Initially disable the button

    fetchMovieTrailer(movie.id).then(trailerUrl => {
        if (trailerUrl) {
            watchBtn.disabled = false; // Enable the button if a trailer is found
            watchBtn.addEventListener('click', () => {
                window.open(trailerUrl, '_blank'); // Open the trailer in a new tab
            });
        } else {
            watchBtn.textContent = 'No Trailer Available'; // Update button text if no trailer
        }
    });

    // Append movie item to the trending content section
    trendingSection.appendChild(movieItem);
}


// Function to display movie trailers
async function displayMovieTrailers(movies) {
    trailersContainer.innerHTML = ''; // Clear previous results
    
    for (let movie of movies) {
        const title = movie.title || movie.name;
        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.jpg';
        const movieId = movie.id;
        
        // Fetch trailer URL
        const trailerUrl = await fetchMovieTrailer(movieId);
        
        if (trailerUrl) {
            // Create a trailer item
            const trailerItem = document.createElement('div');
            trailerItem.classList.add('trailer-item');
            
            // Create iframe and set the src for the trailer video
            const iframe = document.createElement('iframe');
            iframe.src = trailerUrl;
            iframe.frameBorder = "0";
            iframe.allow = "autoplay; encrypted-media";
            iframe.allowFullscreen = true;
            
            // Add iframe to the trailer item
            trailerItem.appendChild(iframe);
            
            // Append to the trailers container
            trailersContainer.appendChild(trailerItem);
        }
    }
}

// Call the function to fetch and display trending movies and trailers when the page loads
window.addEventListener('DOMContentLoaded', fetchAndDisplayTrendingMovies);

// Fetch data for continue watching section
async function fetchContinueWatching() {
    try {
        const response = await fetch(`${baseUrl}trending/movie/week?api_key=${api_Key}`);
        const data = await response.json();
        displayContinueWatchingMovies(data.results.slice(0, 3)); // Limit to 3 movies
    } catch (error) {
        console.error('Error fetching continue watching movies:', error);
    }
}

// Function to display the movies in the "Continue Watching" section
function displayContinueWatchingMovies(movies) {
    continueWatchingList.innerHTML = ''; // Clear any existing content

    // Loop through the movies and create HTML for each
    movies.forEach(movie => {
        const title = movie.title || movie.name;
        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.jpg';
        const releaseDate = movie.release_date || movie.first_air_date;
        const movieId = movie.id;

        // Create movie item HTML
        const movieItem = document.createElement('li');
        movieItem.innerHTML = `
            <div class="movie-item">
                <img src="${posterPath}" alt="${title}">
                <div class="details">
                    <h4>${title}</h4>
                    <span>${releaseDate}</span>
                </div>
                <button class="play-button" id="play-${movieId}">
                    <i class="fa fa-play"></i> <!-- Play Icon -->
                </button>
            </div>
        `;
        
        // Append the movie item to the list
        continueWatchingList.appendChild(movieItem);

        // Add event listener for the play button
        const playButton = movieItem.querySelector(`#play-${movieId}`);
        playButton.addEventListener('click', async () => {
            const trailerUrl = await fetchMovieTrailer(movieId);
            if (trailerUrl) {
                // Open the YouTube trailer in a new tab
                window.open(trailerUrl, '_blank');
            } else {
                alert('No trailer available for this movie');
            }
        });
    });
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', fetchContinueWatching);

const movie_cards=document.querySelector('.movie-cards'); 


// Fetch and display top picks for you
async function fetchAndDisplayTopPicks() {
    try {
        // Fetch top-rated movies
        const response = await fetch(`${baseUrl}movie/top_rated?api_key=${api_Key}`);
        const data = await response.json();

        // Clear the container before adding new movies
        movie_cards.innerHTML = '';

        // Limit the number of movie cards (for example, 4 cards)
        const topMovies = data.results.slice(0, 4);
        displayMovieCards(topMovies);
    } catch (error) {
        console.error('Error fetching top picks movies:', error);
    }
}

// Function to display movie cards
function displayMovieCards(movies) {
    for (const movie of movies) {
        const title = movie.title || movie.name;
        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.jpg';
        const releaseDate = movie.release_date || movie.first_air_date;
        const movieId = movie.id;

        // Create movie card HTML
        const movieCard = document.createElement('div');
        movieCard.classList.add('card');
        movieCard.innerHTML = `
            <img src="${posterPath}" alt="${title}">
            <div class="play-overlay">
                <button class="play-button" id="play-${movieId}">
                    <i class="fa fa-play"></i> <!-- Play Icon Only -->
                </button>
            </div>
        `;

        // Append the movie card to the container
        movie_cards.appendChild(movieCard);

        // Add event listener for the play button
        const playButton = movieCard.querySelector(`#play-${movieId}`);
        playButton.addEventListener('click', async () => {
            const trailerUrl = await fetchMovieTrailer(movieId);
            if (trailerUrl) {
                window.open(trailerUrl, '_blank'); // Open trailer in a new tab
            } else {
                alert('No trailer available for this movie');
            }
        });
    }
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', fetchAndDisplayTopPicks);


 // Get the hamburger menu and navigation elements
 const hamburgerMenu = document.getElementById('hamburgerMenu');
 const nav = document.querySelector('nav');

 // Add an event listener to the hamburger menu
 hamburgerMenu.addEventListener('click', () => {
   // Toggle the visibility of the navigation menu
   nav.classList.toggle('visible'); 
 });
 

 function fetchMedia(containerClass, endpoint, mediaType) {
    const containers = document.querySelectorAll(`.${containerClass}`);
    containers.forEach((container) => {
        fetch(`https://api.themoviedb.org/3/${endpoint}&api_key=${api_Key}`)
            .then(response => response.json())
            .then(data => {
                const fetchResults = data.results;
                if (fetchResults.length === 0) {
                    container.innerHTML = `<p>No results found.</p>`;
                    return;
                }
                fetchResults.forEach(item => {
                    const itemElement = document.createElement('div');
                    const imageUrl = containerClass === 'netflix-container' ? item.poster_path : item.backdrop_path;
                    itemElement.innerHTML = ` <img src="https://image.tmdb.org/t/p/w500${imageUrl}" alt="${item.title || item.name}"> `;
                    container.appendChild(itemElement);

                    itemElement.addEventListener('click', () => {
                        const media_Type = item.media_type || mediaType
                        window.location.href = `movie_details/movie_details.html?media=${media_Type}&id=${item.id}`;
                    });
                });

                // Netflix Banner setup
                if (containerClass === 'netflix-container') {
                    const randomIndex = Math.floor(Math.random() * fetchResults.length);
                    const randomMovie = fetchResults[randomIndex];
                    const banner = document.getElementById('banner');
                    const play = document.getElementById('play-button');
                    const info = document.getElementById('more-info');
                    const title = document.getElementById('banner-title');
                    banner.src = `https://image.tmdb.org/t/p/original/${randomMovie.backdrop_path}`;
                    title.textContent = randomMovie.title || randomMovie.name;

                    function redirectToMovieDetails() {
                        const media_Type = randomMovie.media_type || mediaType;
                        window.location.href = `movie_details/movie_details.html?media=${media_Type}&id=${randomMovie.id}`;
                    }

                    play.addEventListener('click', redirectToMovieDetails);
                    info.addEventListener('click', redirectToMovieDetails);
                }
            })
            .catch(error => {
                console.error(error);
                const container = document.querySelector(`.${containerClass}`);
                container.innerHTML = '<p>Failed to load data. Please try again later.</p>';
            });
    })
}


// Debounce function to limit the frequency of API calls
let debounceTimeout;
async function handleSearchInput() {
    const query = searchInput.value;
    if (query.length > 2) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            const results = await fetchSearchResults(query);
            if (results.length !== 0) {
                searchResults.style.visibility = "visible";
            } else {
                searchResults.innerHTML = '<p>No results found</p>';
                searchResults.style.visibility = "visible";
            }
            displaySearchResults(results);
        }, 500); // Delay before making the API call
    } else {
        searchResults.innerHTML = '';
        searchResults.style.visibility = "hidden";
    }
}

// Fetch search results from TMDB API
async function fetchSearchResults(query) {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${api_Key}&query=${query}`);
    const data = await response.json();
    return data.results || [];
}


// Update the watchlist button text based on stored movies
function updateWatchListBtn(movie) {
    const watchListBtn = document.querySelector(`[id="${movie.id}"]`);
    if (watchListBtn) {
        const buttonText = watchlist.some(watchlistItem => watchlistItem.id === movie.id)
            ? "Go to WatchList"
            : "Add to WatchList";
        watchListBtn.textContent = buttonText;
    }
}

// Add movie to the watchlist
function addToWatchList(movie) {
    if (!watchlist.some(watchlistItem => watchlistItem.id === movie.id)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist)); // Store updated watchlist
        updateWatchListBtn(movie); // Update button text
    }
}

// Close search results when clicking outside
document.addEventListener('click', (event) => {
    if (!searchResults.contains(event.target) && !searchInput.contains(event.target)) {
        searchResults.innerHTML = '';
        searchResults.style.visibility = "hidden";
    }
});
