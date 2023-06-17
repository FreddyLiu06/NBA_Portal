import React from 'react'
import { Container, Grid, Button, TextField, Link} from '@mui/material'
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

const FunFactsPage = () => {

    const [tripDub, setTripDub] = useState(true); // State to keep track of which fun fact to display
    const [name, setName] = useState("");
    const [season, setSeason] = useState(-1);
    
    const [tripDubData, setTripDubData] = useState([]);
    const [pageSize, setPageSize] = useState(10);

    const [leadingScorerData, setLeadingScorerData] = useState({});

    const seasonOptions = [
        {value: -1, label: "ALL SEASONS"},
        {value: 2019, label: "2019"},
        {value: 2018, label: "2018"},
        {value: 2017, label: "2017"},
        {value: 2016, label: "2016"},
        {value: 2015, label: "2015"},
        {value: 2014, label: "2014"},
        {value: 2013, label: "2013"},
        {value: 2012, label: "2012"},
        {value: 2011, label: "2011"},
        {value: 2010, label: "2010"},
        {value: 2009, label: "2009"},
    ]

    // On page load call the query that gets the single season scorer
    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/singleSeasonScorer`)
        .then(res => res.json())
        .then(resJson => {
            setLeadingScorerData(resJson);
        })
    }, [])

    // Search for triple double percentage for a specific player
    const search = () => {
        fetch(`http://${config.server_host}:${config.server_port}/tripleDouble?playerName=${name}&season=${season}`)
        .then(res => res.json())
        .then(resJson => {
            if (season === -1) {
                console.log(resJson);
                const playersWithId = resJson.map((player) => ({id: player.PLAYER_NAME, ...player}))
                playersWithId.forEach(player => player.SEASON = "ALL")
                setTripDubData(playersWithId)
            } else {
                const playersWithId = resJson.map((player) => ({id: player.PLAYER_NAME, ...player}))
                setTripDubData(playersWithId)
            }
        })
    }

    // Columns for the table that will display the triple double win percentage
    const tripDubColumns = [
        { field: 'PLAYER_NAME', headerName: 'Player Name', width: 300},
        { field: 'SEASON', headerName: 'Season', width: 125},
        { field: 'WINS', headerName: 'Wins', width: 125},
        { field: 'GAMES', headerName: 'Total Games', width: 125},
        { field: 'WIN_PCT', headerName: 'Win Percentage', width: 150},
    ]

    return (
        <Container>
            <h2>Fun Facts!</h2>
            <Grid container spacing = {6}>
                <Grid xs={3}/>
                <Grid item xs = {3}>
                    <Button onClick={() => setTripDub(false)} variant="contained">Single Season Leading Scorer</Button>
                </Grid>
                <Grid item xs = {3}>
                    <Button onClick={() => setTripDub(true)} variant="contained">Triple Double Win Percentage</Button>
                </Grid>
                <Grid item xs = {3} />
                
                <Grid item xs = {12}>
                    {tripDub ? // Display the fun fact that the user selected from the buttons
                    <>
                    <Grid container spacing={2}>
                        <Grid item xs = {12}>
                            <h3 style={{paddingTop: 10, margin:0}}>Search for a player's win percentage when they get a triple double</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <p>Search by Player Name (Full Name)</p>
                            <TextField label='Name' value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }}/>
                        </Grid>
                        <Grid item xs={6}>
                            <p>Season</p>
                            <Select
                                defaultValue="ALL SEASONS"
                                options={seasonOptions}
                                onChange={(selectedOption) => setSeason(selectedOption.value)}
                                className="basic-single"
                            />
                        </Grid>
                        <Grid item xs = {6}>
                            <p></p>
                            <Button variant="contained" onClick={() => {search()}} style={{ left: '50%', marginTop: 40, width: 100}}>Search</Button>
                        </Grid>
                    </Grid>
                    <DataGrid
                        rows={tripDubData}
                        columns={tripDubColumns}
                        pageSize={pageSize}
                        rowsPerPageOptions={[5, 10, 25]}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        autoHeight
                    />
                    </>
                    : 
                    <>
                    <h3>The Single Season Leading Scorer</h3>
                    <p>Is {leadingScorerData.PLAYER_NAME}, who scored {leadingScorerData["tot_PTS"]} in the {leadingScorerData.SEASON} season.</p>
                    </>
                    }
                </Grid>

            </Grid>    
        </Container>
    )
}

export default FunFactsPage