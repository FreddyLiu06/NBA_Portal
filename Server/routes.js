const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});

// Route that returns a random player
const random = async (req, res) => {
    connection.query(`
        SELECT * FROM Players
        ORDER BY Rand()
        LIMIT 1
    `, (err, data) => {
        if (err || data.length == 0) {
            console.log(err);
            res.json({})
        } else {
            res.json(data[0]);
        }
    })
}

// Route to return all teams 
const allTeams = async function (req, res) {
  connection.query(`
      SELECT * FROM Teams
  `, (err, data) => {
      if (err || data.length == 0) {
          console.log(err);
          res.json({})
      } else {
          res.json(data);
      }
  })
}


// Route 1a: Gets player stats for ALL seasons
const player_all_seasons = async function (req, res) {
    // This method is called if there is no season specified, we want to aggregate over all seasons
    const player_name = req.query.player_name
    const ptsLow = req.query.ptsLow;
    const ptsHigh = req.query.ptsHigh;
    const astLow = req.query.astLow;
    const astHigh = req.query.astHigh;
    const rebLow = req.query.rebLow;
    const rebHigh = req.query.rebHigh;
    const threepctLow = req.query.threepctLow;
    const threepctHigh = req.query.threepctHigh;
    connection.query(`
        SELECT p.PLAYER_NAME, p.PLAYER_ID, ROUND(AVG(d.PTS),2) AS AVG_PTS, ROUND(AVG(d.AST),2) AS AVG_AST, ROUND(AVG(d.REB),2) AS AVG_REB, ROUND(AVG(d.FG3_PCT),3) AS AVG_FG3_PCT
        FROM GamesDetails d JOIN Players p ON d.PLAYER_ID = p.PLAYER_ID
        WHERE UPPER(p.PLAYER_NAME) LIKE UPPER('%${player_name}%')
        GROUP BY p.PLAYER_NAME
        HAVING AVG_PTS >= ${ptsLow} AND AVG_PTS <= ${ptsHigh} AND AVG_AST >= ${astLow} AND AVG_AST <= ${astHigh} AND AVG_REB >= ${rebLow} AND AVG_REB <= ${rebHigh} AND AVG_FG3_PCT >= ${threepctLow} AND AVG_FG3_PCT <= ${threepctHigh};
    `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
          res.json(data);
        }
      }
    );
};

// Route 1: GET /player  (Player - Query by player name)
const player = async function (req, res) {
    // This method is called when a specific season is being queried for
    const player_name = req.query.player_name;
    const season = req.query.season;
    const ptsLow = req.query.ptsLow;
    const ptsHigh = req.query.ptsHigh;
    const astLow = req.query.astLow;
    const astHigh = req.query.astHigh;
    const rebLow = req.query.rebLow;
    const rebHigh = req.query.rebHigh;
    const threepctLow = req.query.threepctLow;
    const threepctHigh = req.query.threepctHigh;
    connection.query(
            `
            SELECT p.PLAYER_NAME, p.PLAYER_ID, d.SEASON AS season, ROUND(AVG(d.PTS),2) AS AVG_PTS, ROUND(AVG(d.AST),2) AS AVG_AST, ROUND(AVG(d.REB),2) AS AVG_REB, ROUND(AVG(d.FG3_PCT),2) AS AVG_FG3_PCT
            FROM GamesDetails d JOIN Players p ON d.PLAYER_ID = p.PLAYER_ID
            WHERE UPPER(p.PLAYER_NAME) LIKE UPPER('%${player_name}%') AND d.SEASON = '${season}'
            GROUP BY p.PLAYER_NAME
            HAVING AVG_PTS >= ${ptsLow} AND AVG_PTS <= ${ptsHigh} AND AVG_AST >= ${astLow} AND AVG_AST <= ${astHigh} AND AVG_REB >= ${rebLow} AND AVG_REB <= ${rebHigh} AND AVG_FG3_PCT >= ${threepctLow} AND AVG_FG3_PCT <= ${threepctHigh};
            `,
        (err, data) => {
            if (err || data.length === 0) {
            console.log(err);
            res.json({});
            } else {
            res.json(data);
            }
        }
    );
  };
  
  // Route 2: GET /team, query all teams for a given season and get teamwide statistics
  const team = async function (req, res) {

    const season = req.query.season;

    connection.query(
      `
        WITH home AS (
            SELECT t1.TEAM_ID, t1.NICKNAME, SUM(g.PTS_home) AS home_pts, SUM(g.AST_home) AS home_ast, SUM(g.REB_home) AS home_reb, AVG(g.HOME_TEAM_WINS) AS home_wins_avg, COUNT(g.GAME_ID) AS home_tot
            FROM Games g JOIN Teams t1 ON g.HOME_TEAM_ID = t1.TEAM_ID
            WHERE (g.SEASON = ${season})
            GROUP BY t1.TEAM_ID
        ), away AS (
            SELECT t1.TEAM_ID, t1.NICKNAME, SUM(g.PTS_away) AS away_pts, SUM(g.AST_away) AS away_ast, SUM(g.REB_away) AS away_reb, (1 - AVG(g.HOME_TEAM_WINS)) AS away_wins_avg, COUNT(g.GAME_ID) AS away_tot
            FROM Games g JOIN Teams t1 ON g.VISITOR_TEAM_ID = t1.TEAM_ID
            WHERE (g.SEASON = ${season})
            GROUP BY t1.TEAM_ID
        )
        SELECT h.TEAM_ID, h.NICKNAME, ((h.home_pts + a.away_pts) / (h.home_tot + a.away_tot)) AS AVG_PTS, ((h.home_ast + a.away_ast) / (h.home_tot + a.away_tot)) AS AVG_AST, ((h.home_reb + a.away_reb) / (h.home_tot + a.away_tot)) AS AVG_REB, (100 * h.home_wins_avg) AS home_win_pct, (100 * a.away_wins_avg) AS away_win_pct
        FROM home h JOIN away a ON h.TEAM_ID = a.TEAM_ID
        ORDER BY h.NICKNAME;
      `,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }
    );
  };
  
  // Route 3: GET /team_ranking_pts  (Ranking - Rank Teams by pts/game, desc)
  const team_ranking_pts = async function (req, res) {
    const seasonsLow = req.query.seasonLow;
    const seasonsHigh = req.query.seasonHigh;
      connection.query(
        `
        SELECT DISTINCT t.TEAM_ID, t.NICKNAME, g.SEASON, AVG(s.PTS) AS AVG_STAT
                  FROM tot_stat s JOIN Teams t ON s.TEAM_ID = t.TEAM_ID
                                  JOIN Games g ON s.GAME_ID = g.GAME_ID
                  WHERE g.SEASON BETWEEN ${seasonsLow} AND ${seasonsHigh}
                  GROUP BY t.NICKNAME, t.TEAM_ID, g.SEASON
                  ORDER BY AVG(s.PTS) DESC
                  LIMIT 100;
              `,
        (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        }
      );
  };
  
  // Route 4: GET /team_ranking_ast  (Ranking - Rank Teams by ast/game, desc)
  const team_ranking_ast = async function (req, res) {
    const seasonsLow = req.query.seasonLow;
    const seasonsHigh = req.query.seasonHigh;
      connection.query(
        `
        SELECT DISTINCT t.TEAM_ID, t.NICKNAME, g.SEASON, AVG(s.AST) AS AVG_STAT
                  FROM tot_stat s JOIN Teams t ON s.TEAM_ID = t.TEAM_ID
                                  JOIN Games g ON s.GAME_ID = g.GAME_ID
                  WHERE g.SEASON BETWEEN ${seasonsLow} AND ${seasonsHigh}
                  GROUP BY t.NICKNAME, t.TEAM_ID, g.SEASON
                  ORDER BY AVG(s.AST) DESC
                  LIMIT 100;
              `,
        (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        }
      );
  };
  
  // Route 5: GET /team_ranking_reb  (Ranking - Rank Teams by reb/game, desc)
  const team_ranking_reb = async function (req, res) {
    const seasonsLow = req.query.seasonLow;
    const seasonsHigh = req.query.seasonHigh;
  
      connection.query(
        `
        SELECT DISTINCT t.TEAM_ID, t.NICKNAME, g.SEASON, AVG(s.REB) AS AVG_STAT
                  FROM tot_stat s JOIN Teams t ON s.TEAM_ID = t.TEAM_ID
                                  JOIN Games g ON s.GAME_ID = g.GAME_ID
              WHERE g.SEASON BETWEEN ${seasonsLow} AND ${seasonsHigh}
              GROUP BY t.NICKNAME, t.TEAM_ID, g.SEASON
                  ORDER BY AVG(s.REB) DESC
              LIMIT 100;
              `,
        (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        }
      );
  };
  
  // Route 6: GET /team_ranking_fc3_pct  (Ranking - Rank Teams by fc3_pct/game, desc)
  const team_ranking_fc3_pct = async function (req, res) {
    const seasonsLow = req.query.seasonLow;
    const seasonsHigh = req.query.seasonHigh;
      connection.query(
        `
                  SELECT DISTINCT t.TEAM_ID, t.NICKNAME, g.SEASON, (100 * AVG(s.FG3_PCT)) AS AVG_STAT
                  FROM tot_stat s JOIN Teams t ON s.TEAM_ID = t.TEAM_ID
                                  JOIN Games g ON s.GAME_ID = g.GAME_ID
                  WHERE g.SEASON BETWEEN ${seasonsLow} AND ${seasonsHigh}
                  GROUP BY t.NICKNAME, t.TEAM_ID, g.SEASON
                  ORDER BY AVG(s.FG3_PCT) DESC
                  LIMIT 100;
              `,
        (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        }
      );
  };
  
  // Route 7: GET /player_ranking_pts  (Ranking - Rank Players by pts/game, desc)
  const player_ranking_pts = async function (req, res) {
    const seasonsLow = req.query.seasonLow;
    const seasonsHigh = req.query.seasonHigh;
    connection.query(
        `
                  SELECT DISTINCT d.SEASON, d.PLAYER_ID, PLAYER_NAME, AVG(d.PTS) AS AVG_STAT
                  FROM GamesDetails d JOIN Players p ON d.PLAYER_ID = p.PLAYER_ID
                  WHERE d.SEASON BETWEEN ${seasonsLow} AND ${seasonsHigh}
                  GROUP BY d.PLAYER_ID, p.PLAYER_NAME, d.SEASON
                  ORDER BY AVG(d.PTS) DESC
                  LIMIT 100;
              `,
        (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        }
      );
  };
  
  // Route 8: GET /player_ranking_ast  (Ranking - Rank Players by ast/game, desc)
  const player_ranking_ast = async function (req, res) {
    const seasonsLow = req.query.seasonLow;
    const seasonsHigh = req.query.seasonHigh;
      connection.query(
        `
                  SELECT DISTINCT d.SEASON, d.PLAYER_ID, PLAYER_NAME, AVG(d.AST) AS AVG_STAT
                  FROM GamesDetails d JOIN Players p ON d.PLAYER_ID = p.PLAYER_ID
                  WHERE d.SEASON BETWEEN ${seasonsLow} AND ${seasonsHigh}
                  GROUP BY d.PLAYER_ID, p.PLAYER_NAME, d.SEASON
                  ORDER BY AVG(d.AST) DESC
                  LIMIT 100;
              `,
        (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        }
      );
  };
  
  // Route 9: GET /player_ranking_reb  (Ranking - Rank Players by reb/game, desc)
  const player_ranking_reb = async function (req, res) {
    const seasonsLow = req.query.seasonLow;
    const seasonsHigh = req.query.seasonHigh;
      connection.query(
        `
                  SELECT DISTINCT d.SEASON, d.PLAYER_ID, PLAYER_NAME, AVG(d.REB) AS AVG_STAT
                  FROM GamesDetails d JOIN Players p ON d.PLAYER_ID = p.PLAYER_ID
                  WHERE d.SEASON BETWEEN ${seasonsLow} AND ${seasonsHigh}
                  GROUP BY d.PLAYER_ID, p.PLAYER_NAME, d.SEASON
                  ORDER BY AVG(d.REB) DESC
                  LIMIT 100;
              `,
        (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        }
      );
  };
  
  // Route 10: GET /player_ranking_fc3_pct  (Ranking - Rank Players by fc3_pct/game, desc)
  const player_ranking_fc3_pct = async function (req, res) {
    const seasonsLow = req.query.seasonLow;
    const seasonsHigh = req.query.seasonHigh;
      connection.query(
        `
                  SELECT DISTINCT d.SEASON, d.PLAYER_ID, PLAYER_NAME, (100 * AVG(d.FG3_PCT)) AS AVG_STAT
                  FROM GamesDetails d JOIN Players p ON d.PLAYER_ID = p.PLAYER_ID
                  WHERE d.SEASON BETWEEN ${seasonsLow} AND ${seasonsHigh}
                  GROUP BY d.PLAYER_ID, p.PLAYER_NAME, d.SEASON
                  ORDER BY AVG(d.FG3_PCT) DESC
                  LIMIT 100;
              `,
        (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        }
      );
  };

// Route to return triple double ratio for a given player
const tripleDouble = async (req, res) => {

    const playerName = req.query.playerName; // Name of player looking for triple double
    const season = req.query.season;

    // Check if a season was specified, if not then aggregate over all seasons
    if (season == -1) {
      connection.query(`
      WITH home AS (
          SELECT d.PLAYER_ID, d.TEAM_ID, d.SEASON, SUM(case when d.PTS >= 10 AND d.AST >= 10 AND d.REB >= 10 AND g.HOME_TEAM_WINS = 1 then 1 else 0 end) AS home_wins, SUM(case when d.PTS >= 10 AND d.AST >= 10 AND d.REB >= 10 then 1 else 0 end) AS home_tot
          FROM GamesDetails d JOIN Games g ON d.GAME_ID = g.GAME_ID AND d.TEAM_ID = g.HOME_TEAM_ID
          GROUP BY d.PLAYER_ID, d.SEASON
      ), away AS (
          SELECT d.PLAYER_ID, d.TEAM_ID, d.SEASON, SUM(case when d.PTS >= 10 AND d.AST >= 10 AND d.REB >= 10 AND g.HOME_TEAM_WINS = 0 then 1 else 0 end) AS away_wins, SUM(case when d.PTS >= 10 AND d.AST >= 10 AND d.REB >= 10 then 1 else 0 end) AS away_tot
          FROM GamesDetails d JOIN Games g ON d.GAME_ID = g.GAME_ID AND d.TEAM_ID = g.VISITOR_TEAM_ID
          GROUP BY d.PLAYER_ID, d.SEASON
      )
      SELECT p.PLAYER_NAME, SUM(h.home_wins + a.away_wins) AS WINS, SUM(h.home_tot + a.away_tot) AS GAMES, (100 * SUM(h.home_wins + a.away_wins) / SUM(h.home_tot + a.away_tot)) AS WIN_PCT
      FROM home h JOIN away a ON h.PLAYER_ID = a.PLAYER_ID AND h.SEASON = a.SEASON
        LEFT JOIN Players p ON h.PLAYER_ID = p.PLAYER_ID AND h.SEASON = p.SEASON AND h.TEAM_ID = p.TEAM_ID
      WHERE p.PLAYER_NAME = '${playerName}'
      ORDER BY WIN_PCT DESC;
      `, (err, data) => {
          if (err || data.length == 0) {
              console.log(err);
              res.status(400).json({});
          } else {
              res.status(200).json(data);
          }
      })
    } else {
      // If a season was specified then just look at the specific season
      connection.query(`
      WITH home AS (
        SELECT d.PLAYER_ID, d.TEAM_ID, d.SEASON, SUM(case when d.PTS >= 10 AND d.AST >= 10 AND d.REB >= 10 AND g.HOME_TEAM_WINS = 1 then 1 else 0 end) AS home_wins, SUM(case when d.PTS >= 10 AND d.AST >= 10 AND d.REB >= 10 then 1 else 0 end) AS home_tot
        FROM GamesDetails d JOIN Games g ON d.GAME_ID = g.GAME_ID AND d.TEAM_ID = g.HOME_TEAM_ID
        WHERE d.SEASON = ${season}
        GROUP BY d.PLAYER_ID, d.SEASON
      ), away AS (
        SELECT d.PLAYER_ID, d.TEAM_ID, d.SEASON, SUM(case when d.PTS >= 10 AND d.AST >= 10 AND d.REB >= 10 AND g.HOME_TEAM_WINS = 0 then 1 else 0 end) AS away_wins, SUM(case when d.PTS >= 10 AND d.AST >= 10 AND d.REB >= 10 then 1 else 0 end) AS away_tot
        FROM GamesDetails d JOIN Games g ON d.GAME_ID = g.GAME_ID AND d.TEAM_ID = g.VISITOR_TEAM_ID
        WHERE d.SEASON=${season}
        GROUP BY d.PLAYER_ID, d.SEASON
      )
      SELECT p.PLAYER_NAME, h.SEASON, SUM(h.home_wins + a.away_wins) AS WINS, SUM(h.home_tot + a.away_tot) AS GAMES, (100 * SUM(h.home_wins + a.away_wins) / SUM(h.home_tot + a.away_tot)) AS WIN_PCT
      FROM home h JOIN away a ON h.PLAYER_ID = a.PLAYER_ID AND h.SEASON = a.SEASON
        LEFT JOIN Players p ON h.PLAYER_ID = p.PLAYER_ID AND h.SEASON = p.SEASON AND h.TEAM_ID = p.TEAM_ID
      WHERE p.PLAYER_NAME = '${playerName}'
      ORDER BY WIN_PCT DESC;
      `, (err, data) => {
          if (err || data.length == 0) {
              console.log(err);
              res.status(400).json({});
          } else {
              res.status(200).json(data);
          }
      })
    }
    
}

// Route to return player that scored the most points in a single season over all seasons
const singleSeasonScorer = async (req, res) => {
    connection.query(`
    WITH sub AS (
      SELECT d.PLAYER_ID, SUM(d.PTS) AS tot_PTS, d.SEASON, d.TEAM_ID
      FROM GamesDetails d
      GROUP BY d.PLAYER_ID, d.SEASON
    )
    SELECT p.PLAYER_NAME, tot_PTS, sub.SEASON
    FROM sub JOIN Players p ON sub.PLAYER_ID = p.PLAYER_ID AND sub.SEASON = p.SEASON AND sub.TEAM_ID = p.TEAM_ID
    ORDER BY tot_PTS DESC
    LIMIT 1;`, (err, data) => {
        if (err || data.length == 0) {
            console.log(err);
            res.status(400).json({});
        } else {
            res.status(200).json(data[0]);
        }
    })
}



// Route to test if the SQL view works
const testView = async (req, res) => {
    connection.query(`
    SELECT AVG(tot_stat.FG3_PCT)
    FROM tot_stat
    `, (err, data) => {
        if (err) {
            console.log(err);
            res.json({});
        } else {
            console.log(data);
        }
    })
}

// Route to compare statistics between two players
const compare_two_players = async (req, res) => {
    const vars = req.query;
    const pl1 = vars.player_one;
    const pl2 = vars.player_two;
    const season = vars.season;
    if (pl1 == "" || pl2 == "" || season == "") {
        res.json({});
    }
    connection.query(`
        SELECT PLAYER_NAME, AVG(PTS) AS AVG_PTS, AVG(AST) AS AVG_AST, AVG(REB) AS AVG_REB, (100 * AVG(FG3_PCT)) AS AVG_FG3_PCT
        FROM GamesDetails d JOIN Players p ON d.PLAYER_ID = p.PLAYER_ID
                            JOIN Games g ON d.GAME_ID = g.GAME_ID
        WHERE (PLAYER_NAME = '${pl1}' OR PLAYER_NAME = '${pl2}') AND (d.SEASON = ${season})
        GROUP BY PLAYER_NAME;
    `, (err, data) => {
        if (err || data.length == 0) {
            console.log(err);
            res.json({})
        } else {
            res.json(data);
        }
    })
}

// Route to compare statistics between two teams
const comp_team_statistics = async (req, res) => {
    const vars = req.query;
    const team1 = vars.team_one;
    const team2 = vars.team_two;
    const season = vars.season;
    if (team1 == "" || team2 == "" || season == "") {
        res.json({});
    }
    connection.query(`
    WITH home AS (
        SELECT NICKNAME, SUM(PTS_home) AS home_pts, SUM(AST_home) AS home_ast, SUM(REB_home) AS home_reb, AVG(HOME_TEAM_WINS) AS home_wins_avg, COUNT(GAME_ID) AS home_tot
        FROM Games g JOIN Teams t1 ON g.HOME_TEAM_ID = t1.TEAM_ID
        WHERE (NICKNAME = '${team1}' OR NICKNAME = '${team2}') AND (SEASON = ${season})
        GROUP BY NICKNAME
    ), away AS (
        SELECT NICKNAME, SUM(PTS_away) AS away_pts, SUM(AST_away) AS away_ast, SUM(REB_away) AS away_reb, (1 - AVG(HOME_TEAM_WINS)) AS away_wins_avg, COUNT(GAME_ID) AS away_tot
        FROM Games g JOIN Teams t1 ON g.VISITOR_TEAM_ID = t1.TEAM_ID
        WHERE (NICKNAME = '${team1}' OR NICKNAME = '${team2}') AND (SEASON = ${season})
        GROUP BY NICKNAME
    )
    SELECT h.NICKNAME, ((h.home_pts + a.away_pts) / (h.home_tot + a.away_tot)) AS AVG_PTS, ((h.home_ast + a.away_ast) / (h.home_tot + a.away_tot)) AS AVG_AST, 
    ((h.home_reb + a.away_reb) / (h.home_tot + a.away_tot)) AS AVG_REB, (100 * h.home_wins_avg) AS home_win_pct, (100 * a.away_wins_avg) AS away_win_pct
    FROM home h JOIN away a ON h.NICKNAME = a.NICKNAME;`
    , (err, data) => {
        if (err || data.length == 0) {
            console.log(err);
            res.json({})
        } else {
            res.json(data);
        }
    })
};

module.exports = {
    allTeams,
    random,
    singleSeasonScorer,
    testView,
    tripleDouble,
    player,
    team,
    team_ranking_pts,
    team_ranking_ast,
    team_ranking_reb,
    team_ranking_fc3_pct,
    player_ranking_pts,
    player_ranking_ast,
    player_ranking_reb,
    player_ranking_fc3_pct,
    compare_two_players,
    comp_team_statistics,
    player_all_seasons,
};

