import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import Select from 'react-select';

import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function PlayersPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);

  // Search parameters
  const [name, setName] = useState('');
  const [season, setSeason] = useState(-1);
  const [pts, setPts] = useState([0, 40]);
  const [ast, setAst] = useState([0, 15]);
  const [reb, setReb] = useState([0, 18]);
  const [threepct, setThreepct] = useState([0, 1]);

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

  const search = () => {
    // If a season is not specified use the route that aggregates over all seasons
    if (season === -1) {
      fetch(`http://${config.server_host}:${config.server_port}/player_all?player_name=${name}&ptsLow=${pts[0]}&ptsHigh=${pts[1]}&astLow=${ast[0]}&astHigh=${ast[1]}&rebLow=${reb[0]}&rebHigh=${reb[1]}&threepctLow=${threepct[0]}&threepctHigh=${threepct[1]}`)
      .then(res => res.json())
      .then(resJson => {
        const playersWithId = resJson.map((player) => ({id: player.PLAYER_ID, ...player}))
        playersWithId.forEach(player => player.season = "ALL")
        setData(playersWithId)
      });
    } else {
      // If a season is specified then query with the given season
      fetch(`http://${config.server_host}:${config.server_port}/player?player_name=${name}&season=${season}&ptsLow=${pts[0]}&ptsHigh=${pts[1]}&astLow=${ast[0]}&astHigh=${ast[1]}&rebLow=${reb[0]}&rebHigh=${reb[1]}&threepctLow=${threepct[0]}&threepctHigh=${threepct[1]}`)
      .then(res => res.json())
      .then(resJson => {
        const playersWithId = resJson.map((player) => ({id: player.PLAYER_ID, ...player}))
        setData(playersWithId)
      });
    }
    
  }


  // Columns for player table that will display all of players' stats
  const columns = [
    { field: 'PLAYER_NAME', headerName: 'Player Name', width: 300},
    { field: 'season', headerName: 'Season', width: 125},
    { field: 'AVG_PTS', headerName: 'Points', width: 125},
    { field: 'AVG_AST', headerName: 'Assists', width: 125},
    { field: 'AVG_REB', headerName: 'Rebounds', width: 125},
    { field: 'AVG_FG3_PCT', headerName: '3PT Percentage', width: 150},
  ]

  return (
    <Container>
      <h2>Search Players</h2>
      <Grid container spacing={6}>
        <Grid item xs={12}>
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
        <Grid item xs={6}>
          <p>Points</p>
          <Slider
            value={pts}
            min={0}
            max={40}
            step={1}
            onChange={(e, newValue) => setPts(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>Assists</p>
          <Slider
            value={ast}
            min={0}
            max={15}
            step={0.1}
            onChange={(e, newValue) => setAst(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={4}>
          <p>Rebounds</p>
          <Slider
            value={reb}
            min={0}
            max={18}
            step={0.1}
            onChange={(e, newValue) => setReb(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={4}>
          <p>3PT Percentage</p>
          <Slider
            value={threepct}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, newValue) => setThreepct(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}