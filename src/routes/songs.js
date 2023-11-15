const { Router } = require('express');
const _ = require('underscore');
const fs = require('fs');
const nodegit = require('nodegit');

const router = Router();

async function commitandpush(){
    // Inicializa el repositorio Git
    const repository = await nodegit.Repository.open('https://github.com/ZaisYT/ZXQM-REST-API.git');

    // Añade los cambios al área de preparación (staging)
    const index = await repository.refreshIndex();
    await index.addAll();
    await index.write();
    const oid = await index.writeTree();

    // Obtiene el árbol del commit actual
    const head = await nodegit.Reference.nameToId(repository, 'HEAD');
    const parent = await repository.getCommit(head);

    // Crea un objeto de firma para el commit
    const firma = nodegit.Signature.now('Zais', 'xice1572@hotmail.com');

    // Crea el objeto de commit
    const commitId = await repository.createCommit('HEAD', firma, firma, mensajeCommit, oid, [parent]);

    // console.log('Commit exitoso:', commitId.toString());

    // Empuja los cambios al repositorio remoto en GitHub
    const remote = await repository.getRemote('origin');
    const credenciales = nodegit.Cred.userpassPlaintextNew('ZaisYT', 'Vicentito2008.'); // Reemplaza con tus credenciales
    await remote.push(['refs/heads/main:refs/heads/main'], {
      callbacks: {
        credentials: () => credenciales
      }
    });
}

let songsPath = './src/JSON/songs.json'; 

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
    commitandpush();
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
    commitandpush();
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
    commitandpush();
});

module.exports = router;
