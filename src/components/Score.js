import React, { Component } from 'react';
import axios from 'axios';

class Score extends Component {

    constructor(props) {
        super(props);
        this.months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"]
        this.state = {
            numberOfThrees: 0,
            gameID: 0,
            gamePlayed: true,
            nextGame: ""
        }
    }

    async fetchGame(gameDay) {
        try {
            const currentGame = await axios.get("https://www.balldontlie.io/api/v1/games", {
                params: {
                    "dates": [gameDay],
                    "team_ids": [28]
                }
            });
            return currentGame;
        } catch (error) {
            console.log(`Unable to get the current game: ${error.message}`);
        }
    }

    async fetchThrees() {
        try {
            const numberOfThrees = await axios.get("https://www.balldontlie.io/api/v1/stats", {
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
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            const currentDay = new Date().getUTCDate();

            const allGames = await axios.get("https://www.balldontlie.io/api/v1/games", {
                params: {
                    "team_ids": [28],
                    "seasons": [currentYear - 1],
                    "dates": [`${currentYear}-${currentMonth}-${currentDay}`, `${currentYear}-${currentMonth}-${currentDay + 1}`, `${currentYear}-${currentMonth}-${currentDay + 2}`]
                }
            });
            const today = new Date()

            if (allGames.data.data.length) {
                const closest = allGames.data.data.reduce((a, b) => new Date(a.date).getTime() - today.getTime() < new Date(b.date).getTime() - today.getTime() ? a : b);
                return `${this.months[new Date(closest.date).getMonth()]} ${new Date(closest.date).getUTCDate()} ${closest.status}`;
            } else {
                return "Unable to find closest game, probably becuase they're not playing for next few days";
            }
           
        } catch (error) {
            console.log("Experienced error fetching next game");
        }
    }

    renderThrees() {
        if (this.state.numberOfThrees >= 12) {
            return (<div>
                <h4>YES!</h4>
                <p>{this.state.numberOfThrees}</p>
            </div>)
        } else {
            return (<div>
                <h4>NO!</h4>
                <p>{this.state.numberOfThrees} threes were scored. What's the point of even watching basketball?!</p>
            </div>)
        }
    }

    renderEmptyState() {
        if (this.state.gamePlayed) {
            return (<div>
                <p>Tabulating threes...</p>
            </div>)
        } else {
            return (
                <div>
                    <p>Next game is: {this.state.nextGame}</p>
                </div>
            )
        }
    }

    componentDidMount() {
        const currentDay = new Date();
        const formattedDay = `${currentDay.getFullYear()}-${currentDay.getMonth() + 1}-${currentDay.getDate()}`;

        const gamePromise = this.fetchGame(formattedDay);
        gamePromise.then((result) => {
            if (result.data.data.length) {
                this.setState({
                    gameID: result.data.data[0].id
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
            console.log(result);
            this.setState({
                nextGame: result
            })
        });
    }

    render() {
        return (
            <section>
                {this.state.numberOfThrees > 0 ? this.renderThrees() : this.renderEmptyState()}
            </section>
        )
    }
}

export default Score;