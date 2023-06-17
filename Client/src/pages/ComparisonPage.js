import React from 'react'
import { Container, Grid, Button, TextField, Link} from '@mui/material'
import { useEffect, useState } from 'react';
import Select from 'react-select';
import {BarChart, XAxis, YAxis, Tooltip, Legend, Bar, CartesianGrid} from 'recharts';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

const ComparisonPage = () => {

    const [comparePlayer, setComparePlayer] = useState(true); // State to keep track of what we are viewing

    // Information for player
    const [playerName1, setPlayerName1] = useState("");
    const [playerName2, setPlayerName2] = useState("");
    const [playerSeason, setPlayerSeason] = useState(2019);
    const [playerData, setPlayerData] = useState([]);

    // Information for team
    const [teamName1, setTeamName1] = useState("");
    const [teamName2, setTeamName2] = useState("");
    const [teamSeason, setTeamSeason] = useState(2019);
    const [teamData, setTeamData] = useState([]);


    const seasonOptions = [
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

    // Search for comparison for two players
    const searchPlayers = () => {
        fetch(`http://${config.server_host}:${config.server_port}/compare_players?player_one=${playerName1}&player_two=${playerName2}&season=${playerSeason}`)
        .then(res => res.json())
        .then(resJson => {
            let chartData = [
                {name: "Points"},
                {name: "Assists"},
                {name: "Rebounds"}
            ]
            // Create object for the bar chart
            resJson.forEach(player => {
                console.log(player.PLAYER_NAME);
                chartData[0][player.PLAYER_NAME] = player.AVG_PTS;
                chartData[1][player.PLAYER_NAME] = player.AVG_AST;
                chartData[2][player.PLAYER_NAME] = player.AVG_REB;
            })
            setPlayerData(chartData);
        })
    }

    // Search for data that compares two teams
    const searchTeams = () => {
        fetch(`http://${config.server_host}:${config.server_port}/compare_teams_statistics?team_one=${teamName1}&team_two=${teamName2}&season=${teamSeason}`)
        .then(res => res.json())
        .then(resJson => {
            let chartData = [
                {name: "Points"},
                {name: "Assists"},
                {name: "Rebounds"}
            ]
            resJson.forEach(team => {
                chartData[0][team.NICKNAME] = team.AVG_PTS;
                chartData[1][team.NICKNAME] = team.AVG_AST;
                chartData[2][team.NICKNAME] = team.AVG_REB;
            })
            setTeamData(chartData);
        })
    }

    return (
        <Container>
            <h2>Compare Two Players or Teams</h2>
            <Grid container spacing = {6}>
                <Grid xs={3}/>
                <Grid item xs = {3}>
                    <Button onClick={() => setComparePlayer(true)} variant="contained">Compare Two Players</Button>
                </Grid>
                <Grid item xs = {3}>
                    <Button onClick={() => setComparePlayer(false)} variant="contained">Compare Two Teams</Button>
                </Grid>
                <Grid item xs = {3} />
                
                <Grid item xs = {12}>
                    {comparePlayer ? // Display the fun fact that the user selected from the buttons
                    <>
                    <Grid container spacing={2}>
                        <Grid item xs = {12}>
                            <h3 style={{paddingTop: 10, margin:0}}>Search for two players to compare</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <p>Search for the first player (Full Name)</p>
                            <TextField label='Name' value={playerName1} onChange={(e) => setPlayerName1(e.target.value)} style={{ width: "100%" }}/>
                        </Grid>
                        <Grid item xs={12}>
                            <p>Search for the second player (Full Name)</p>
                            <TextField label='Name' value={playerName2} onChange={(e) => setPlayerName2(e.target.value)} style={{ width: "100%" }}/>
                        </Grid>
                        <Grid item xs = {8}>
                            <p>Choose the season to compare the two players</p>
                            <Select
                                defaultValue="2019"
                                options={seasonOptions}
                                onChange={(selectedOption) => setPlayerSeason(selectedOption.value)}
                                className="basic-single"
                            />
                        </Grid>
                        <Grid item xs = {12}>
                            <Button variant="contained" onClick={() => {searchPlayers()}} style={{marginTop: 40, width: 100}}>Search</Button>
                        </Grid>
                        <Grid item xs = {12}>
                            <BarChart width={800} height={500} data = {playerData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey={playerName1} fill="#8884d8" />
                                <Bar dataKey={playerName2} fill="#82ca9d" />
                            </BarChart>
                        </Grid>
                    </Grid>
                    </>
                    : 
                    <>
                    <Grid container spacing={2}>
                        <Grid item xs = {12}>
                            <h3 style={{paddingTop: 10, margin:0}}>Search for two teams to compare</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <p>Search for the first team (Nickname)</p>
                            <TextField label='Name' value={teamName1} onChange={(e) => setTeamName1(e.target.value)} style={{ width: "100%" }}/>
                        </Grid>
                        <Grid item xs={12}>
                            <p>Search for the second team (Nickname)</p>
                            <TextField label='Name' value={teamName2} onChange={(e) => setTeamName2(e.target.value)} style={{ width: "100%" }}/>
                        </Grid>
                        <Grid item xs = {8}>
                            <p>Choose the season to compare the two teams</p>
                            <Select
                                defaultValue="2019"
                                options={seasonOptions}
                                onChange={(selectedOption) => setTeamSeason(selectedOption.value)}
                                className="basic-single"
                            />
                        </Grid>
                        <Grid item xs = {12}>
                            <Button variant="contained" onClick={() => {searchTeams()}} style={{marginTop: 40, width: 100}}>Search</Button>
                        </Grid>
                        <Grid item xs = {12}>
                            <BarChart width={800} height={500} data = {teamData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey={teamName1} fill="#8884d8" />
                                <Bar dataKey={teamName2} fill="#82ca9d" />
                            </BarChart>
                        </Grid>
                    </Grid>
                    </>
                    }
                </Grid>

            </Grid>    
        </Container>
    )
}

export default ComparisonPage