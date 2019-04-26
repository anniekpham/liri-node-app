require("dotenv").config()
const fs = require('fs')
const axios = require('axios')
const moment = require('moment')
const Spotify = require('node-spotify-api')
const [, , command, ...title] = process.argv
const format = (e) => moment(`${e}`,'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY')

// get data from random.txt search for what it stated
const random = data => {
    let newarr = data.split(',')
    switch (newarr[0]) {
        case 'spotify-this-song':
            spotifythis(newarr[1])
        break
        case 'movie-this':
            moviethis(newarr[1])
        break
        case 'concert-this':
        concertthis(newarr[1])
        break
    }
}

// search spotify
const spotifythis = track => {
    let keys = require("./keys.js")
    let spotify = new Spotify(keys.spotify)
    spotify.search({ type: 'track', query: track, limit: 1})
    .then((data) => {
        let artist = data.tracks.items[0].album.artists[0].name
        let song = data.tracks.items[0].name
        let preview = data.tracks.items[0].external_urls.spotify
        let album = data.tracks.items[0].album.name
        console.log(`
        Artist: ${artist}
        Song: ${song}
        Preview: ${preview}
        ALbum: ${album}
        `)
    })
    .catch(e => console.log(e))
    fs.appendFile('log.txt', `${command},${title.join(' ')}; `, e => e ? console.log(e): console.log())
}

// search movie title
const moviethis = movie => {
    axios.get(`http://www.omdbapi.com/?t=${movie}&apikey=d467d7fe`)
    .then(({data: {Title, Released, imdbRating, Ratings: [, {Value}], Country, Language, Plot, Actors}}) => console.log(`
    Title: ${Title}
    Release Year: ${Released}
    IMDB: ${imdbRating}
    Rotten Tomatoes: ${Value}
    Country: ${Country}
    Language: ${Language}
    Plot: ${Plot}
    Actors: ${Actors}
    `))
    .catch(e => console.log(e, "Please Enter a Valid Title"))
    fs.appendFile('log.txt', `${command},${title.join(' ')}; `, e => e ? console.log(e): console.log())

}

// search for artist's event
const concertthis = artist => {
    axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
    .then(({data: [{venue: {name, city}, datetime}]}) => console.log(`
    Venue name: ${name}
    City: ${city}
    Date: ${format(datetime)}
    `))
    .catch(e => console.log(e, "This artist has no upcoming event"))
    fs.appendFile('log.txt', `${command},${title.join(' ')}; `, e => e ? console.log(e): console.log())

}

switch (command) {
    case 'movie-this':
        if (title.length === 0){
            moviethis('Mr. Nobody')
        } else {
            moviethis(title.join(' '))
        }
    break
    case 'concert-this':
        concertthis(title.join(' '))
    break
    case 'spotify-this-song':
        if (title.length === 0){
            spotifythis('The Sign')
        } else {
            spotifythis(title.join(' '))
        }
    break
    case 'do-what-it-says':
        fs.readFile('random.txt', 'utf8', (e, data) => e ? console.log(e) : random(data))
    break
}