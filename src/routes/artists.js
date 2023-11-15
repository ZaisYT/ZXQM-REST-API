const { Router } = require('express');
const _ = require('underscore');
const fs = require('fs');

const router = Router();

let artistPath = './src/JSON/artist.json'; 

router.get('/', (req, res) => {
    const art = fs.readFileSync(songsPath, 'utf-8');
    const objetoJson = JSON.parse(art.replace(/[\r\n]/g, ''));

    res.json(objetoJson);
});

router.post('/', (req, res) => {
    const art = fs.readFileSync(songsPath, 'utf-8');
    const objetoJson = JSON.parse(art.replace(/[\r\n]/g, ''));

    const { name, pfp, isPartner, bannerURL, ownedSongs, playlists, featuredSongs } = req.body;
    if (name && pfp && isPartner && bannerURL && ownedSongs && playlists && featuredSongs){
        const id = objetoJson.length;
        const newArtists = {id, ...req.body};
        objetoJson.push(newArtists);
        res.json(objetoJson);
    } else {
        res.status(500).json({error:'Wrong Request!'});
    }

    const newContent = JSON.stringify(objetoJson, null, 4);
    fs.writeFileSync(artistPath, newContent, 'utf8');
});

router.get('/:id', (req, res) => {
    const art = fs.readFileSync(songsPath, 'utf-8');
    const objetoJson = JSON.parse(art.replace(/[\r\n]/g, ''));

    const { id } = req.params
    _.each(objetoJson, (artist, i) => {
        if (artist.id == id){
            res.send(objetoJson[id]);
            return;
        }
    });
    res.status(404).send("not found");
});

router.put('/:id', (req, res) => {
    const art = fs.readFileSync(songsPath, 'utf-8');
    const objetoJson = JSON.parse(art.replace(/[\r\n]/g, ''));

    const { id } = req.params
    const { name, pfp, isPartner, bannerURL, ownedSongs, playlists, featuredSongs } = req.body;
    if (name && pfp && isPartner && bannerURL && ownedSongs && playlists && featuredSongs){
        _.each(objetoJson, (artist, i) => {
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
        res.json(objetoJson);
    } else {
        res.status(500).json({error:'Wrong Request!'});
    }

    const newContent = JSON.stringify(objetoJson, null, 4);
    fs.writeFileSync(artistPath, newContent, 'utf8');
});

router.delete('/:id', (req, res) => {
    const art = fs.readFileSync(songsPath, 'utf-8');
    const objetoJson = JSON.parse(art.replace(/[\r\n]/g, ''));

    const { id } = req.params
    _.each(objetoJson, (artist, i) => {
        if (artist.id == id){
            objetoJson.splice(i, 1);
        }
    });
    res.send(objetoJson);

    const newContent = JSON.stringify(objetoJson, null, 4);
    fs.writeFileSync(artistPath, newContent, 'utf8');
});

module.exports = router;
