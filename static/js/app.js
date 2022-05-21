const btn = document.querySelector('.btn');
const recommendList = document.querySelector('.recommend-list');
const inputMovie = document.querySelector('.input-movie');
const loader = document.querySelector('.loader');
const loadmoreData = document.querySelector('.loadmore-data');

let page = 1;
let limit = 8; 

// Change the first letter to uppercase for optimization the search engine
const toTitleCase = (input) => {
    return input
      .split(' ')
      .map((word, index) => {
        if (word === "of" || word === "the" && index !== 0) {
            return word.charAt(0).toLowerCase() + word.slice(1);
        }
        return word.charAt(0).toUpperCase() + word.slice(1)
    })
      .join(' ');
};

function loadMovies(movie) {
    // API recommend
    const recommendApi = 'http://127.0.0.1:8000/MachineLearningProject/default/call' +
                        `/json/recommendation?input_movie=${toTitleCase(movie)}` +
                        `&page=${page}&limit=${limit}`;
    fetch(recommendApi)
    .then(res => res.json())
    .then(movies => {
        if (movies.length > 0) {
            movies.forEach(movie => {
            // Movie poster API
            const imgApi = 'https://api.themoviedb.org/3/search/movie?' +
                          'api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=' + movie;

            fetch(imgApi)
            .then(res => res.json())
            .then(data => {
                    const div = document.createElement('div');
                    div.classList.add('col-sm-3', 'mt-3', 'mb-4');
                    div.innerHTML = `
                            <div class="card" style="width: 16rem;">
                                <img src="http://image.tmdb.org/t/p/w500/${data.results[0].poster_path}" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title">${movie}</h5>
                                </div>
                            </div>`;
                    recommendList.appendChild(div);
                })
            .catch(err => console.log(err));
            })
        }
    })     
}

// Function handle the loadmore with the page value and loading circle
function showLoading() {
    loader.classList.add('active');

    setTimeout(() => {
        if (page < 5) {
            page++;
            loadMovies(loadmoreData.innerHTML);
        }
        setTimeout(() => {loader.classList.remove('active')}, 1000);

    }, 1000);

    if (page >= 5) {
        loader.classList.remove('active');
    }
}

btn.onclick = () => {
    if (inputMovie.value === '') {
        alert('Please input your favorite movie so we can recommend for you!');
    }
    else {
        page = 1;
        loadmoreData.innerHTML = `${inputMovie.value}`;
        recommendList.innerHTML = `
        <h4>Recommend for you if you like ${inputMovie.value}</h4>`;

        loadMovies(inputMovie.value);

        let debound = true;
        // Listen the scroll-down event and showmore when scroll more than the height 
        window.addEventListener('scroll', () => {
            const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
        
            if (scrollTop + clientHeight >= scrollHeight - 5 && debound) {
                debound = false;
                showLoading();

                setTimeout(() => {
                    debound = true;
                }, 3000);
            }
        });

        inputMovie.value = '';
    }
};

document.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        btn.click();
    }
});

