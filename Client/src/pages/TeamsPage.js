import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Select from 'react-select';

const config = require('../config.json');

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [season, setSeason] = useState(2019);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/allteams`)
      .then(res => res.json())
      .then(resJson => {
        const teamWithId = resJson.map(team => ({id: team.TEAM_ID, ...team}))
        setTeams(teamWithId)
      });
  }, []);

  const teamQuery = (season) => {
    setSeason(season);
    fetch(`http://${config.server_host}:${config.server_port}/team?season=${season}`)
    .then(res => res.json())
    .then(resJson => {
      console.log(resJson);
      const teamWithId = resJson.map(team => ({id: team.TEAM_ID, ...team}))
      setData(teamWithId)
    });
  }
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

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  const columns = [
    { field: 'TEAM_ID', headerName: 'Team ID', width: 75},
    { field: 'ABBREVIATION', headerName: 'Abbreviation', width: 100},
    { field: 'NICKNAME', headerName: 'Nickname', width: 100},
    { field: 'YEARFOUNDED', headerName: 'Year Founded', width: 125 },
    { field: 'CITY', headerName: 'City' , width: 100},
    { field: 'ARENA', headerName: 'Arena', width: 150 },
    { field: 'OWNER', headerName: 'Owner' , width: 150},
    { field: 'GENERALMANAGER', headerName: 'General Manager' , width: 150},
    { field: 'HEADCOACH', headerName: 'Head Coach', width: 150 },
    { field: 'DLEAGUEAFFILIATION', headerName: 'D League Affiliation', width: 150 },
  ]

  const gameColumn = [
    { field: 'NICKNAME', headerName: 'Nickname', width: 180},
    { field: 'AVG_PTS', headerName: 'Average Points', width: 180},
    { field: 'AVG_AST', headerName: 'Average Assists', width: 180},
    { field: 'AVG_REB', headerName: 'Average Rebounds', width: 180},
    { field: 'home_win_pct', headerName: 'Home Win %', width: 180},
    { field: 'away_win_pct', headerName: 'Away Win %', width: 180},
  ]

  return (
    <Container>
      <h2>General Team Information</h2>
      <DataGrid
        rows={teams}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      <h2>Team Yearly Statistics</h2>
      <Grid item xs={2}>
          <p>Season</p>
          <Select
            options={seasonOptions}
            onChange={(selectedOption) => {teamQuery(selectedOption.value)}}
            className="basic-single"
          />
      </Grid>
      <br></br>
        <DataGrid
        rows={data}
        columns={gameColumn}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      /> 
    </Container>
  );
}