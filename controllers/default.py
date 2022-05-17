import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from gluon.tools import Service

service = Service()

def call():   
    return service()

moviesDf = pd.read_csv("applications/MachineLearningProject/static/movie.csv")

features = ['keywords','cast','genres','director']

for feature in features:
    moviesDf[feature] = moviesDf[feature].fillna('')

def combineFeatures(row):
    return row['keywords'] + " " + row['cast'] + " " + row['genres'] + " " + row['director']

moviesDf["combineFeatures"] = moviesDf.apply(combineFeatures, axis = 1)

cv = CountVectorizer()

matrix = cv.fit_transform(moviesDf["combineFeatures"])

cosineSimilarity = cosine_similarity(matrix)

def getTitle(index):
    return moviesDf[moviesDf.index == index]["title"].values[0]
def getIndex(title):
    return moviesDf[moviesDf.title == title]["index"].values[0]

# Call api
@service.json
def recommendation(input_movie):
    try:
        movieIndex = getIndex(input_movie)
    except:
        movieIndex = -1

    similarMovies = list(enumerate(cosineSimilarity[movieIndex]))
    sortedMoviesList = sorted(similarMovies, key = lambda x: x[1], reverse = True)

    recommendList = []

    i = 0
    if(movieIndex != -1):
        for movie in sortedMoviesList:
            if (getTitle(movie[0]) != input_movie):
                recommendList.append(getTitle(movie[0]))
            i = i + 1
            if i > 10:
                break

    return recommendList
    
