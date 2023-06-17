CREATE DATABASE NBA;
USE NBA;

CREATE TABLE Teams(
    TEAM_ID int PRIMARY KEY,
    MIN_YEAR int,
    MAX_YEAR int,
    ABBREVIATION varchar(255),
    NICKNAME varchar(255),
    YEARFOUNDED int,
    CITY varchar(255),
    ARENA varchar(255),
    ARENACAPACITY int,
    OWNER varchar(255),
    GENERALMANAGER varchar(255),
    HEADCOACH varchar(255),
    DLEAGUEAFFILIATION varchar(255)
);

CREATE TABLE Players(
    PLAYER_NAME varchar(255),
    TEAM_ID int,
    PLAYER_ID int,
    SEASON int,
    PRIMARY KEY (TEAM_ID, PLAYER_ID, SEASON),
    FOREIGN KEY (TEAM_ID) REFERENCES Teams(TEAM_ID)
);

CREATE TABLE Ranking(
    TEAM_ID int,
    SEASON int,
    CONFERENCE varchar(255),
    TEAM varchar(255),
    G int,
    W int,
    L int,
    W_PCT float,
    HOME_RECORD varchar(255),
    ROAD_RECORD varchar(255),
    PRIMARY KEY (TEAM_ID, SEASON),
    FOREIGN KEY (TEAM_ID) REFERENCES Teams(TEAM_ID)
);

CREATE TABLE Games(
    GAME_ID int PRIMARY KEY,
    GAME_DATE_EST DATE,
    GAME_STATUS_TEXT varchar(255),
    HOME_TEAM_ID int,
    VISITOR_TEAM_ID int,
    SEASON int,
    PTS_home int,
    FG_PCT_home float,
    FT_PCT_home float,
    FG3_PCT_home float,
    AST_home int,
    REB_home int,
    PTS_away int,
    FG_PCT_away float,
    FT_PCT_away float,
    FG3_PCT_away float,
    AST_away int,
    REB_away int,
    HOME_TEAM_WINS int,
    FOREIGN KEY (HOME_TEAM_ID) REFERENCES Teams(TEAM_ID),
    FOREIGN KEY (VISITOR_TEAM_ID) REFERENCES Teams(TEAM_ID)
);

CREATE TABLE GamesDetails(
    GAME_ID int,
    TEAM_ID int,
    PLAYER_ID int,
    SEASON int,
    START_POSITION varchar(255),
    MIN float,
    FGM float,
    FGA float,
    FG_PCT float,
    FG3M float,
    FG3A float,
    FG3_PCT float,
    FTM float,
    FTA float,
    FT_PCT float,
    OREB float,
    DREB float,
    REB float,
    AST float,
    STL float,
    BLK float,
    TURNO float,
    PF float,
    PTS float,
    PLUS_MINUS float,
    PRIMARY KEY (GAME_ID, TEAM_ID, PLAYER_ID, SEASON),
    FOREIGN KEY (TEAM_ID, PLAYER_ID, SEASON) REFERENCES Players(TEAM_ID, PLAYER_ID, SEASON),
    FOREIGN KEY (TEAM_ID) REFERENCES Teams(TEAM_ID)
);
