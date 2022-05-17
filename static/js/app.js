const btn = document.querySelector('.btn');
const recommendList = document.querySelector('.recommend-list');
const inputMovie = document.querySelector('.input-movie');

// Change the first letter to uppercase for optimization the search engine
const toTitleCase = (input) => {
    return input
      .split(' ')
      .map(word => {
        if (word === "of" || word === "the") {
            return word.charAt(0).toLowerCase() + word.slice(1);
        }
        return word.charAt(0).toUpperCase() + word.slice(1)
    })
      .join(' ');
};

btn.onclick = () => {
    if (inputMovie.value === '') {
        alert('Please input your favorite movie so we can recommend for you!');
    }
    else {
        // API recommend
        const recommendApi = 'http://127.0.0.1:8000/MachineLearningProject/default/call' +
                           '/json/recommendation?input_movie=' + 
                            toTitleCase(inputMovie.value);

        fetch(recommendApi)
        .then(res => res.json())
        .then(movies => {
            if (movies.length > 0) {
                const htmlsData = movies.map(movie => {
                // Movie poster API
                const imgApi = 'https://api.themoviedb.org/3/search/movie?' +
                             'api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=' + movie;

                // Return the fetch Promise object
                return fetch(imgApi)
                    .then(res => res.json())
                    .then(data => {
                        return `        
                            <div class="col-sm mt-3 mb-4 ml-3">
                                <div class="card" style="width: 20rem;">
                                <img src="http://image.tmdb.org/t/p/w500/${data.results[0].poster_path}" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title">${movie}</h5>
                                </div>
                                </div>
                            </div>`
                    })
                })

                // Foreach Promise in htmlsData, we resolve the promise add to Html
                recommendList.innerHTML = `
                    <h4>Recommend for you if you like 
                    ${inputMovie.value}</h4>
                `;
                htmlsData.forEach(htmlData => {
                    Promise.resolve(htmlData).then(html => {
                        recommendList.innerHTML += html;
                    });
                });
            }
            else 
                recommendList.innerHTML = '<h4>No results!</h4>';

            inputMovie.value = '';  
        })
    }
};

document.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        btn.click();
    }
});