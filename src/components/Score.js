import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { BALLDONTLIEGAME_API_URL, BALLDONTLIESTAT_API_URL } from '../constants/balldontlie_api';
import { RAPTORSID, THREESNEEDED } from '../constants/raptors';
import { PRESENTDAYFORMATTED, YESTERDAYFORMATTED, TOMORROWFORMATTED, DAYAFTERTOMORROWFORMATTED } from '../constants/date';

class Score extends Component {

    constructor(props) {
        super(props);
        this.months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"]
        this.state = {
            numberOfThrees: 0,
            gameID: 0,
            gamePlayed: true,
            previousDayGame: false,
            nextGame: ""
        }
    }

    async fetchGame() {
        try {
            const currentGame = await axios.get(`${BALLDONTLIEGAME_API_URL}`, {
                params: {
                    "dates": [`${PRESENTDAYFORMATTED}`, `${YESTERDAYFORMATTED}`],
                    "team_ids": [RAPTORSID]
                }
            });
            return currentGame;
        } catch (error) {
            console.log(`Unable to get the current game: ${error.message}`);
        }
    }

    async fetchThrees() {
        try {
            const numberOfThrees = await axios.get(`${BALLDONTLIESTAT_API_URL}`, {
                params: {
                    "game_ids": [this.state.gameID],
                }
            });

            if (numberOfThrees.data.data.length) {
                let threesMade = numberOfThrees.data.data.filter((playerStats) => {
                    return playerStats.team.abbreviation === "TOR"
                }).map((playerStats) => {
                    return playerStats.fg3m;
                }).reduce((sum, threesMade) => {
                    return sum + threesMade;
                });
    
                this.setState({
                    numberOfThrees: threesMade
                });
            } else {
                this.setState({
                    gamePlayed: false
                })
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    async fetchNextGame() {
        try {            
            const allGames = await axios.get(`${BALLDONTLIEGAME_API_URL}`, {
                params: {
                    "team_ids": [RAPTORSID],
                    "seasons": [moment().subtract(1, 'year').year()],
                    "dates": [`${PRESENTDAYFORMATTED}`, `${TOMORROWFORMATTED}`, `${DAYAFTERTOMORROWFORMATTED}`]
                }
            });

            if (allGames.data.data.length) {
                const closest = allGames.data.data.reduce((a, b) => moment(a.date).isBefore(moment()) < moment(b.date).isBefore(moment()) ? a : b);
                return `${this.months[moment(closest.date).month()]} ${moment(closest.date).utc().date()}, ${closest.status}`;
            } else {
                return "Unable to find closest game, probably becuase they're not playing for next few days";
            }
           
        } catch (error) {
            console.log("Experienced error fetching next game");
        }
    }

    renderThrees() {
        return this.state.numberOfThrees >= THREESNEEDED ? this.renderSuccess() : this.renderFailure() 
    }

    renderSuccess() {
        return (
            <div>
                <h1>YES!</h1>
                {this.state.previousDayGame ? (
                    <p>The Raptors scored {this.state.numberOfThrees} threes yesterday. GO GET YOUR FRIES NOW!</p>
                ) : (
                    <p>The current threes total is: {this.state.numberOfThrees}!</p>
                )}
            </div>
        )
    }

    renderFailure() {
        return (
            <div>
                <h1>NO!</h1>
                <p>Only {this.state.numberOfThrees} threes were scored. What's the point of even watching basketball?!</p>
            </div>
        )
    }

    renderLoadingState() {
        return (
            <div>
                <p>Tabulating threes...</p>
            </div>
        )
    }

    renderNextGame() {
        return (
            <div>
                <h1>Next game is: </h1>
                <p>{this.state.nextGame}</p>
            </div>
        )
    }

    renderDefaultState() {
        return this.state.gamePlayed ? this.renderLoadingState() : this.renderNextGame()
    }

    componentDidMount() {
        let priorGame = false;

        const gamePromise = this.fetchGame();
        gamePromise.then((result) => {
            if (result.data.data.length) {
                if (!moment(result.data.data[0].date).isSame(moment(), 'day')) {
                    priorGame = true
                } 

                this.setState({
                    gameID: result.data.data[0].id,
                    previousDayGame: priorGame
                }, () => {
                    this.fetchThrees();
                })
            } else { // If API is not returning anything, there isn't a game happening today
                this.setState({
                    gamePlayed: false
                });
            }
        });
        
        const nextGamePromise = this.fetchNextGame();
        nextGamePromise.then((result) => {
            this.setState({
                nextGame: result
            })
        });
    }

    render() {
        return (
            <section className="Score__Component">
                {this.state.numberOfThrees > 0 ? this.renderThrees() : this.renderDefaultState()}
            </section>
        )
    }
}

export default Score;