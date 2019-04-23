require("dotenv").config()
// var keys = require("./keys.js")
// var spotify = new Spotify(keys.spotify)
// const fs = require('fs')
// omdb: d467d7fe
const axios = require('axios')
const [, , ...title] = process.argv
axios.get(`http://www.omdbapi.com/?t=${title.join(' ')}&apikey=d467d7fe`)

    .then(({data: {Title, Released, imdbRating, Ratings: [, {Value}], Country, Language, Plot, Actors}}) => console.log(`
    Title: ${Title}
    Release Year: ${Released}
    IMDB: ${imdbRating}
    Rotten Tomatoes: ${Value}
    Country: ${Country}
    Language: ${Language}
    Plot: ${Plot}
    Actors: ${Actors}`))
    .catch(e => console.log( e, "Please Enter a Valid Title"))
