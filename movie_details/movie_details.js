// Selecting the logo element and adding a click event listener to navigate to the homepage
const logo = document.querySelector('.logo');
logo.addEventListener('click', () => {
    window.location.href = '../home.html';
});

// Selecting various elements on the page for displaying movie details
const movieTitle = document.getElementById('movieTitle');
const moviePoster = document.getElementById('moviePoster');
const movieYear = document.getElementById('movieYear');
const rating = document.getElementById('rating');
const genre = document.getElementById('genre');
const plot = document.getElementById('plot');
const language = document.getElementById("language");
const iframe = document.getElementById("iframe");
const watchListBtn = document.querySelector('.watchListBtn');

// Retrieving the watchlist from localStorage (or initializing an empty array if not present)
const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// TMDB API key
const api_Key = '4626200399b08f9d04b72348e3625f15';

// Retrieve the TMDb ID and Media from the URL parameter
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const media = params.get("media");

// Function to fetch detailed information using the TMDb ID
async function fetchMovieDetails(id) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/${media}/${id}?api_key=${api_Key}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        throw new Error("Unable to fetch movie details at the moment.");
    }
}

// Function to fetch video details (trailers) for a movie or TV show
async function fetchVideoDetails(id) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/${media}/${id}/videos?api_key=${api_Key}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching video details:", error);
        return [];
    }
}

// Function to update the watchlist button and manage the watchlist
function updateWatchlistButton(movieDetails) {
    const isInWatchlist = watchlist.some(favoriteMovie => favoriteMovie.id === movieDetails.id);
    watchListBtn.textContent = isInWatchlist ? "Remove From WatchList" : "Add To WatchList";
}

// Function to toggle adding/removing from favorites (watchlist)
function toggleFavorite(movieDetails) {
    const index = watchlist.findIndex(movie => movie.id === movieDetails.id);
    if (index !== -1) {
        watchlist.splice(index, 1);
    } else {
        watchlist.push(movieDetails);
    }
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    updateWatchlistButton(movieDetails);
}

// Display the movie details on the page
async function displayMovieDetails() {
    try {
        const movieDetails = await fetchMovieDetails(id);

        // Updating movie details
        const spokenLanguages = movieDetails.spoken_languages.map(language => language.english_name);
        language.textContent = spokenLanguages.join(', ');

        const genreNames = movieDetails.genres.map(genre => genre.name);
        genre.innerText = genreNames.join(', ');

        plot.textContent = movieDetails.overview.length > 290
            ? `${movieDetails.overview.substring(0, 290)}...`
            : movieDetails.overview;

        movieTitle.textContent = movieDetails.name || movieDetails.title;
        moviePoster.src = `https://image.tmdb.org/t/p/w500${movieDetails.backdrop_path}`;
        movieYear.textContent = movieDetails.release_date || movieDetails.first_air_date;
        rating.textContent = movieDetails.vote_average;

        // Update the watchlist button
        updateWatchlistButton(movieDetails);

        // Watchlist button click listener (only set once)
        watchListBtn.addEventListener('click', () => toggleFavorite(movieDetails));

        // Fetch and display video details (like trailers)
        const videoDetails = await fetchVideoDetails(id);
        const trailer = videoDetails.find(video => video.type === 'Trailer');
        if (trailer) {
            iframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            moviePoster.style.display = "none";  // Hide the poster when the trailer is displayed
        } else {
            iframe.style.display = "none";  // Hide iframe if no trailer found
        }
    } catch (error) {
        movieTitle.textContent = "Details are not available right now! Please try again later.";
        console.error("Error loading movie details:", error);
    }
}

// Call the function to display movie details when the page loads
window.addEventListener('load', displayMovieDetails);
