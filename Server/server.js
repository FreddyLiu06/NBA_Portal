const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

app.get('/random', routes.random);
app.get('/player', routes.player);
app.get('/player_all', routes.player_all_seasons);
app.get('/team', routes.team);
app.get('/allteams', routes.allTeams);

app.get('/team_ranking_pts', routes.team_ranking_pts);
app.get('/team_ranking_reb', routes.team_ranking_reb);
app.get('/team_ranking_ast', routes.team_ranking_ast);
app.get('/team_ranking_fc3_pct', routes.team_ranking_fc3_pct);

app.get('/player_ranking_pts', routes.player_ranking_pts);
app.get('/player_ranking_reb', routes.player_ranking_reb);
app.get('/player_ranking_ast', routes.player_ranking_ast);
app.get('/player_ranking_fc3_pct', routes.player_ranking_fc3_pct);

app.get('/singleSeasonScorer', routes.singleSeasonScorer);
app.get('/tripleDouble', routes.tripleDouble);

app.get('/testview', routes.testView);

app.get('/compare_players', routes.compare_two_players);
app.get('/compare_teams_statistics', routes.comp_team_statistics);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;