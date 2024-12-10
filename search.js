// Ensuring that the DOM is fully loaded before script execution
document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const movieContainer = document.querySelector('.movie-container');
    const inputBox = document.getElementById('searchInput');
    const searchButton = document.getElementById('search-movie');
    const main = document.querySelector('main');
    const contactSection = document.getElementById('contact');

    let currentPage = 1;
    let currentMovieName = '';
    const moviesPerPage = 3;
    const API_KEY = '7390c31e7d4f58c4b9afbc61a12f010e';

    const getMovieInfo = async (movieName, page = 1) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movieName}&page=${page}`
        );
        const data = await response.json();
        console.log('API response:', data);  // Log API response to check if data is returned
        return data;
    } catch (error) {
        console.error('Error fetching movie info:', error);
        alert('Failed to fetch movie data. Please try again.');
    }
};


    // Fetch movie trailers
    const getMovieTrailer = async (movieId) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
            );
            const data = await response.json();
            const trailer = data.results.find(video => video.site === 'YouTube' && video.type === 'Trailer');
            return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
        } catch (error) {
            console.error('Error fetching trailer:', error);
            return null;
        }
    };

    const showMovies = async (data, movieName) => {
        if (!data.results || data.results.length === 0) {
            movieContainer.innerHTML = `<p>${movieName} not available.</p>`;
            return;
        }
    
        console.log('Data to display:', data.results);  // Log data to check what's being passed to showMovies()
    
        if (currentPage === 1) {
            movieContainer.innerHTML = '';  // Clear previous content
        }
    
        const movies = data.results.slice(0, moviesPerPage * currentPage);
        for (const movie of movies) {
            const { id, title, vote_average, genre_ids, release_date, overview, poster_path } = movie;
            const trailerUrl = await getMovieTrailer(id);
    
            const movieDetail = document.createElement('div');
            movieDetail.classList.add('movie-details');
            movieDetail.innerHTML = `
                <div class="movie-poster">
                    <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}">
                </div>
                <div class="movie-info">
                    <h2>${title}</h2>
                    <p><span class="rating">&#11088; ${vote_average}</span></p>
                    <p><strong>Genres:</strong> ${genre_ids.join(', ')}</p>
                    <p><strong>Released:</strong> ${release_date}</p>
                    <p><strong>Overview:</strong> ${overview}</p>
                    ${trailerUrl ? `<iframe src="${trailerUrl.replace('watch?v=', 'embed/')}" frameborder="0" allowfullscreen></iframe>` : '<p>Movie Trailer not found.</p>'}
                </div>
            `;
            movieContainer.appendChild(movieDetail);
        }
    
        // Handle "Get More" button
        if (data.results.length > moviesPerPage * currentPage) {
            let getMoreButton = document.getElementById('get-more-button');
    
            // Create the button if it doesn't exist
            if (!getMoreButton) {
                getMoreButton = document.createElement('button');
                getMoreButton.id = 'get-more-button';
                getMoreButton.textContent = 'Get More';
                movieContainer.appendChild(getMoreButton);
    
                getMoreButton.addEventListener('click', async () => {
                    currentPage++;
                    getMoreButton.remove(); // Remove the button before fetching more
                    const newData = await getMovieInfo(movieName, currentPage);
                    showMovies(newData, movieName);
                });
            }
        }
    };


    // Event Listener for Search Button
    searchButton.addEventListener('click', async () => {
        const movieName = inputBox.value.trim();

        if (movieName) {
            // Clear the main content and search results
           if( main){
            main.remove();
           }
            const searchResults = document.getElementById('searchResults');
            searchResults.innerHTML="";
            if (searchResults){
                searchResults.classList.remove('visible');
            }
            
            // Remove the contact section if it exists
            if (contactSection) {
                contactSection.remove();
            }

            // Set the current movie name and page for pagination
            currentMovieName = movieName;
            currentPage = 1;

            // Fetch movie info and display it
            const data = await getMovieInfo(movieName);
            if (data) {
                showMovies(data, movieName);
            }
            inputBox.value = '';  // Clear the input field after search
        } else {
            alert('Please enter a movie name.');
        }
    });
});
