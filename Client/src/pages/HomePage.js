import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
const config = require('../config.json');

export default function HomePage() {
    // We use the setState hook to persist information across renders (such as the result of our API calls)

    const [randomPlayer, setRandomPlayer] = useState({});


    useEffect(() => {
        // Fetch request to get random player. Fetch runs asynchronously.
        // The .then() method is called when the fetch request is complete
        // and proceeds to convert the result to a JSON which is finally placed in state.
        fetch(`http://${config.server_host}:${config.server_port}/random`)
        .then(res => res.json())
        .then(resJson => setRandomPlayer(resJson));
        
    }, []); 

    return (
        <Container>
        <h1>Random Player of the Day:</h1>
        <p>{randomPlayer["PLAYER_NAME"]}</p>
        </Container>
    );
};