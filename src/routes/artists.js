const { Router } = require('express');
const _ = require('underscore');

const router = Router();

const artists = require('../artists.json');

router.get('/', (req, res) => {
    res.json(artists);
});

router.post('/', (req, res) => {
    const { name, pfp, isPartner, bannerURL, ownedSongs, playlists, featuredSongs } = req.body;
    if (name && pfp && isPartner && bannerURL && ownedSongs && playlists && featuredSongs){
        const id = artists.length;
        const newArtists = {id, ...req.body};
        artists.push(newArtists);
        res.json(artists);
    } else {
        res.status(500).json({error:'Wrong Request!'});
    }
});

router.get('/:id', (req, res) => {
    const { id } = req.params
    _.each(artists, (artist, i) => {
        if (artist.id == id){
            res.send(artists[id]);
            return;
        }
    });
    res.status(404).send("not found");
});

router.put('/:id', (req, res) => {
    const { id } = req.params
    const { name, pfp, isPartner, bannerURL, ownedSongs, playlists, featuredSongs } = req.body;
    if (name && pfp && isPartner && bannerURL && ownedSongs && playlists && featuredSongs){
        _.each(artists, (artist, i) => {
            if (artist.id == id){
                artist.name = name;
                artist.pfp = pfp;
                artist.isPartner = isPartner;
                artist.bannerURL = bannerURL;
                artist.ownedSongs = ownedSongs;
                artist.playlists = playlists;
                artist.featuredSongs = featuredSongs;
            }
        });
        res.json(artists);
    } else {
        res.status(500).json({error:'Wrong Request!'});
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params
    _.each(artists, (artist, i) => {
        if (artist.id == id){
            artists.splice(i, 1);
        }
    });
    res.send(artists);
});

module.exports = router;
