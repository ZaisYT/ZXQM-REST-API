const { Router } = require('express');
const _ = require('underscore');

const router = Router();

const songs = require('../songs.json');

router.get('/', (req, res) => {
    res.json(songs);
});

router.post('/', (req, res) => {
    const { songName, songArtists, songURL, iconURL, lyricsURI } = req.body;
    if (songName && songArtists && songURL && iconURL && lyricsURI){
        const id = songs.length;
        const newSongs = {id, ...req.body};
        songs.push(newSongs);
        res.json(songs);
    } else {
        res.status(500).json({error:'Wrong Request!'});
    }
});

router.get('/:id', (req, res) => {
    const { id } = req.params
    _.each(songs, (song, i) => {
        if (song.id == id){
            res.send(songs[id]);
            return;
        }
    });
    res.status(404).send("not found");
});

router.put('/:id', (req, res) => {
    const { id } = req.params
    const { songName, songArtists, songURL, iconURL, lyricsURI } = req.body;
    if (songName && songArtists && songURL && iconURL && lyricsURI){
        _.each(songs, (song, i) => {
            if (song.song == id){
                song.songName = songName;
                song.songArtists = songArtists;
                song.songURL = songURL;
                song.iconURL = iconURL;
                song.lyricsURI = lyricsURI;
            }
        });
        res.json(songs);
    } else {
        res.status(500).json({error:'Wrong Request!'});
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params
    _.each(songs, (song, i) => {
        if (song.id == id){
            songs.splice(i, 1);
        }
    });
    res.send(songs);
});

module.exports = router;
