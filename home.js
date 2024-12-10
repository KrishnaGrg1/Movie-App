// Get the Home link and add the event listener
const homeLink = document.getElementById('home-link');
const movieContainer = document.querySelector('.movie-container');
const main = document.querySelector('main');
const inputBox = document.getElementById('searchInput');
const searchButton = document.getElementById('search-movie');
const searchResults = document.getElementById('searchResults');

// Event listener for "Home" link
homeLink.addEventListener('click', (event) => {
    event.preventDefault();  // Prevent the default anchor behavior (scrolling)
    
    // Clear the movie container
    movieContainer.innerHTML = '';
    
    // Clear the search input field
    inputBox.value = '';

    // Hide the search results container
    if (searchResults) {
        searchResults.classList.remove('visible');
    }

    // Reset the main content to initial state (if you have a default homepage state)
    // For example, you can restore the "Trending", "Top Picks", etc. sections here:
    main.innerHTML = `
        <!-- Left Section (Default Homepage Content) -->
        <div class="left">
            <section class="trending-trailer">
                <h2>New Trending Trailer</h2>
                <div class="trailers">
                    <!-- Add trending content here -->
                </div>
            </section>

            <section class="continue-watching">
                <h2>Continue Watching</h2>
                <ul id="continueWatchingList">
                    <!-- Add continue watching items here -->
                </ul>
            </section>
        </div>

        <!-- Right Section (Default Homepage Content) -->
        <div class="right">
            <section class="trending">
                <h2>Now on Trending</h2>
                <div class="trending-content">
                    <!-- Trending content goes here -->
                </div>
            </section>

            <section class="top-picks">
                <h2>Top Picks For You</h2>
                <div class="movie-cards">
                    <!-- Top picks content goes here -->
                </div>
            </section>
        </div>
    `;
    
    // Reset the page to show the initial content
    currentPage = 1;  // Reset current page
    currentMovieName = '';  // Clear the current movie name
});


// Example of restoring trending movies when home is clicked
const restoreHomepageContent = async () => {
    // Fetch trending movies or other initial content
    const trendingMovies = await getTrendingMovies(); // Example function

    const trendingContainer = document.querySelector('.trending-content');
    trendingContainer.innerHTML = '';

    trendingMovies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.innerHTML = `
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        `;
        trendingContainer.appendChild(movieElement);
    });
};

// Call restoreHomepageContent after resetting the content
homeLink.addEventListener('click', async (event) => {
    event.preventDefault();
    
    // Clear current search and movie details
    movieContainer.innerHTML = '';
    inputBox.value = '';
    if (searchResults) searchResults.classList.remove('visible');

    // Reset the state
    currentPage = 1;
    currentMovieName = '';
    
    // Restore the homepage content (trending, top picks, etc.)
    await restoreHomepageContent();
});
