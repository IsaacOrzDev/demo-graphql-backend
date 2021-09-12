const express = require('express');
const cors = require('cors');

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { useSofa } = require('sofa-api');

let schema = buildSchema(/* GraphQL */ `
  input AddMusicInput {
    title: String!
    signer: String!
    duration: String!
  }
  type Query {
    getPlaylist: [Music]
    getPlaying: Music
    getPlaylistBySinger(signer: String!): [Music]
  }
  type Mutation {
    addMusic(music: AddMusicInput): Music
    setPlaying(id: Int!): Music
  }
  type Music {
    id: Int!
    title: String!
    signer: String!
    duration: String!
    isPlaying: Boolean
  }
`);

let playlist = [
  {
    id: 0,
    title: '怎麼了',
    signer: '周興哲',
    duration: '3:00',
    isPlaying: true,
  },
  {
    id: 1,
    title: 'Swan Song',
    signer: 'Dua Lipa',
    duration: '3:00',
    isPlaying: false,
  },
  {
    id: 2,
    title: '係咁先啦',
    signer: 'MC $oho & KidNey',
    duration: '3:00',
    isPlaying: false,
  },
  {
    id: 3,
    title: 'The Beginning',
    signer: 'ONE OK ROCK',
    duration: '3:00',
    isPlaying: false,
  },
  {
    id: 4,
    title: "DAYBREAK'S BELL",
    signer: "L'Arc~en~Ciel",
    duration: '3:00',
    isPlaying: false,
  },
];

const getPlaylist = (args) => {
  return playlist;
};

const getPlaying = (args) => {
  return playlist.find((x) => x.isPlaying);
};

const getPlaylistBySinger = (args) => {
  const { singer } = args;
  return playlist.filter((x) => x.singer === singer);
};

const setPlaying = (args) => {
  try {
    const { id } = args;
    playlist = playlist.map((x) => ({ ...x, isPlaying: false }));
    const music = playlist.find((x) => x.id === id);
    music.isPlaying = true;
    playlist = [...playlist.slice(0, id), music, ...playlist.slice(id + 1)];
    return music;
  } catch (err) {
    console.log(err);
  }
};

const addMusic = async (args) => {
  try {
    const { music } = args;
    const newMusic = { id: playlist.length, ...music, isPlaying: false };
    playlist = [...playlist, newMusic];
    return newMusic;
  } catch (err) {
    console.log(err);
  }
};

const root = {
  getPlaylist,
  getPlaying,
  getPlaylistBySinger,
  addMusic,
  setPlaying,
};

const app = express();
app.use(
  cors({
    origin: '*',
  })
);
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);
app.use('/api', useSofa({ schema }));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
