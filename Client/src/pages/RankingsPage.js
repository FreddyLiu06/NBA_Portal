import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import Select from 'react-select';
import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [qr, setQueryMark] = useState(-1);
  const [season, setSeason] = useState([2009,2019]);
  const [team_qr, setTeamMark] = useState(-1);
  const [team_season, setTeamSeason] = useState([2009,2019]);
  const [teams, setTeams] = useState([]);

  const queryOptions = [
    {value: 1, label: "PTS"},
    {value: 2, label: "AST"},
    {value: 3, label: "REB"},
    {value: 4, label: "3PT PCT"},
  ]

  const search = () => {
    if (qr === 1) {
        console.log(season[0]);
        console.log(season[1]);
      fetch(`http://${config.server_host}:${config.server_port}/player_ranking_pts?seasonLow=${season[0]}&seasonHigh=${season[1]}`)
      .then(res => res.json())
      .then(resJson => {
        const playersWithId = resJson.map((player) => ({id: parseInt(player.PLAYER_ID.toString()+player.SEASON.toString()), ...player}))
        setData(playersWithId)
      });
    } else if (qr === 2) {
      fetch(`http://${config.server_host}:${config.server_port}/player_ranking_ast?seasonLow=${season[0]}&seasonHigh=${season[1]}`)
      .then(res => res.json())
      .then(resJson => {
        const playersWithId = resJson.map((player) => ({id: parseInt(player.PLAYER_ID.toString()+player.SEASON.toString()), ...player}))
        setData(playersWithId)
      });
    } else if (qr === 3) {
        fetch(`http://${config.server_host}:${config.server_port}/player_ranking_reb?seasonLow=${season[0]}&seasonHigh=${season[1]}`)
        .then(res => res.json())
        .then(resJson => {
            const playersWithId = resJson.map((player) => ({id: parseInt(player.PLAYER_ID.toString()+player.SEASON.toString()), ...player}))
            setData(playersWithId)
        });   
    } else if (qr === 4) {
        fetch(`http://${config.server_host}:${config.server_port}/player_ranking_fc3_pct?seasonLow=${season[0]}&seasonHigh=${season[1]}`)
        .then(res => res.json())
        .then(resJson => {
            const playersWithId = resJson.map((player) => ({id: parseInt(player.PLAYER_ID.toString()+player.SEASON.toString()), ...player}))
            setData(playersWithId)
        }); 
    }
  }

  const searchTeam = () => {
    if (team_qr === 1) {
      fetch(`http://${config.server_host}:${config.server_port}/team_ranking_pts?seasonLow=${team_season[0]}&seasonHigh=${team_season[1]}`)
      .then(res => res.json())
      .then(resJson => {
        const teamWithId = resJson.map(team => ({id: team.TEAM_ID.toString()+team.SEASON.toString(), ...team}))
        setTeams(teamWithId)
      });
    } else if (team_qr === 2) {
      fetch(`http://${config.server_host}:${config.server_port}/team_ranking_ast?seasonLow=${team_season[0]}&seasonHigh=${team_season[1]}`)
      .then(res => res.json())
      .then(resJson => {
        const teamWithId = resJson.map(team => ({id: team.TEAM_ID.toString()+team.SEASON.toString(), ...team}))
        setTeams(teamWithId)
      });
    } else if (team_qr === 3) {
        fetch(`http://${config.server_host}:${config.server_port}/team_ranking_reb?seasonLow=${team_season[0]}&seasonHigh=${team_season[1]}`)
        .then(res => res.json())
        .then(resJson => {
            const teamWithId = resJson.map(team => ({id: team.TEAM_ID.toString()+team.SEASON.toString(), ...team}))
            setTeams(teamWithId)
        });   
    } else if (team_qr === 4) {
        fetch(`http://${config.server_host}:${config.server_port}/team_ranking_fc3_pct?seasonLow=${team_season[0]}&seasonHigh=${team_season[1]}`)
        .then(res => res.json())
        .then(resJson => {
            const teamWithId = resJson.map(team => ({id: team.TEAM_ID.toString()+team.SEASON.toString(), ...team}))
            setTeams(teamWithId)
        }); 
    }
  }

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const player_columns = [
    { field: 'PLAYER_NAME', headerName: 'Name', width: 420},
    { field: 'SEASON', headerName: 'Season', width: 420},
    { field: 'AVG_STAT', headerName: 'Average Stat', width: 420},
  ]

  const team_columns = [
    { field: 'NICKNAME', headerName: 'Name', width: 420},
    { field: 'SEASON', headerName: 'Season', width: 420},
    { field: 'AVG_STAT', headerName: 'Average Stat', width: 420},
  ]
  return (
    <Container>
      <h2>Teams</h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <p>Choose Category</p>
          <Select
            options={queryOptions}
            onChange={(selectedOption) => setTeamMark(selectedOption.value)}
            className="basic-single"
          />
        </Grid>
        <Grid item xs={6}>
          <p>Season</p>
          <Slider
            value={team_season}
            min={2009}
            max={2019}
            step={1}
            onChange={(e, newValue) => setTeamSeason(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
      </Grid>
      <br></br>
      <Button onClick={() => searchTeam() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h3>Rankings Results</h3>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={teams}
        columns={team_columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      <br></br>
      <br></br>
      <h2>Players</h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <p>Choose Category</p>
          <Select
            defaultValue="ALL SEASONS"
            options={queryOptions}
            onChange={(selectedOption) => setQueryMark(selectedOption.value)}
            className="basic-single"
          />
        </Grid>
        <Grid item xs={6}>
          <p>Season</p>
          <Slider
            value={season}
            min={2009}
            max={2019}
            step={1}
            onChange={(e, newValue) => setSeason(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
      </Grid>
      <br></br>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h3>Ranking Results</h3>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={data}
        columns={player_columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}