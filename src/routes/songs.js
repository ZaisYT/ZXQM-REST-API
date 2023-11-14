const { Router } = require('express');
const _ = require('underscore');
const fs = require('fs');

const router = Router();

let songsPath = './src/songs.json'; 

router.get('/', (req, res) => {
    const songs = fs.readFileSync(songsPath, 'utf-8');
    const objetoJson = JSON.parse(songs.replace(/[\r\n]/g, ''));

    res.json(objetoJson);
});

router.post('/', (req, res) => {
    const songs = fs.readFileSync(songsPath, 'utf-8');
    const objetoJson = JSON.parse(songs.replace(/[\r\n]/g, ''));

    const { songName, songArtists, songURL, iconURL, lyricsURI } = req.body;
    if (songName && songArtists && songURL && iconURL && lyricsURI){
        const id = objetoJson.length;
        const newSongs = {id, ...req.body};
        objetoJson.push(newSongs);
        res.json(objetoJson);
    } else {
        res.status(500).json({error:'Wrong Request!'});
    }

    const newContent = JSON.stringify(objetoJson, null, 4);
    fs.writeFileSync(songsPath, newContent, 'utf8');
});

router.get('/:id', (req, res) => {
    const songs = fs.readFileSync(songsPath, 'utf-8');
    const objetoJson = JSON.parse(songs.replace(/[\r\n]/g, ''));

    const { id } = req.params
    _.each(objetoJson, (song, i) => {
        if (song.id == id){
            res.send(objetoJson[id]);
            return;
        }
    });
    res.status(404).send("not found");
});

router.put('/:id', (req, res) => {
    const songs = fs.readFileSync(songsPath, 'utf-8');
    const objetoJson = JSON.parse(songs.replace(/[\r\n]/g, ''));

    const { id } = req.params
    const { songName, songArtists, songURL, iconURL, lyricsURI } = req.body;
    if (songName && songArtists && songURL && iconURL){
        _.each(objetoJson, (song, i) => {
            if (song.song == id){
                song.songName = songName;
                song.songArtists = songArtists;
                song.songURL = songURL;
                song.iconURL = iconURL;
                song.lyricsURI = lyricsURI;
            }
        });
        res.json(objetoJson);
    } else {
        res.status(500).json({error:'Wrong Request!'});
    }

    const newContent = JSON.stringify(objetoJson, null, 4);
    fs.writeFileSync(songsPath, newContent, 'utf8');
});

router.delete('/:id', (req, res) => {
    const songs = fs.readFileSync(songsPath, 'utf-8');
    const objetoJson = JSON.parse(songs.replace(/[\r\n]/g, ''));

    const { id } = req.params
    _.each(objetoJson, (song, i) => {
        if (song.id == id){
            objetoJson.splice(i, 1);
        }
    });
    res.send(objetoJson);

    const newContent = JSON.stringify(objetoJson, null, 4);
    fs.writeFileSync(songsPath, newContent, 'utf8');
});

module.exports = router;
