const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');

// settings
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(morgan('dev'));
app.use(cors({ origin: ["localhost:3000","localhost:5173"] }));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// routes
app.use(require('./routes/index'));
app.use('/api/artists', require('./routes/artists'));
app.use('/api/songs', require('./routes/songs'));

// starting the server
app.listen(app.get('port'), () => {
    console.log(`Started server on port ${app.get('port')}`);
});

/*
{
    "name": "System Of A Down",
    "pfp": "https://i.scdn.co/image/ab6761610000517460063d3451ade8f9fab397c2",
    "isPartner": true,
    "bannerURL": "https://i.scdn.co/image/ab676186000010169cfd391ba6c4e6887a9b9490",
    "ownedSongs": [17],
    "playlists": [ null ],
    "featuredSongs": [17]
}
*/
