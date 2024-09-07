const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(process.env.ATLAS_URI);


// DB Connect
// async function connectDb (req, res) {
//     const client = await MongoClient.connect(process.env.ATLAS_URI);
//     _db = client.db("sportsai");
//     return _db;
// } 

// MLB
async function getMLBToday (req, res) {
    try {
        await client.connect();
        const date = new Date();
        const dateFormat = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Los_Angeles",
            timeZoneName: "short"
        })
        const format = dateFormat.format(date).split(",")[0].split("/");
        const newDate = `${format[2]}-${'0'+format[0].slice(-2)}-${('0'+format[1]).slice(-2)}`;
        const games = await client.db('sportsai').collection('mlb').find({dateOfGame: newDate}).project({
            _id: 1, teamOne: 1, teamTwo: 1, teamOneScore: 1, teamTwoScore: 1, odds: 1, teamOneWinner: 1, 
            teamOnePercentage: 1, teamOneWins: 1, teamOneLosses: 1, teamTwoWins: 1, teamTwoLosses: 1, dateOfGame: 1,
            stadium: 1, time: 1, teamToBetOn: 1, totalScore: 1, teamOnePercentage: 1, overUnderPick: 1, sportsOdds: 1, payout: 1,
            bestMLBook: 1, bestUnpredictedBook: 1, teamOneLineScore: 1, teamTwoLineScore: 1
        })
            .toArray();
        if (games.length === 0) {
            const date = new Date();
            const dateFormat = new Intl.DateTimeFormat("en-US", {
                timeZone: "America/Los_Angeles",
                timeZoneName: "short"
            })
            const format = dateFormat.format(date).split(",")[0].split("/");
            let newDate;
            // Check the date to get today's games
            if (format[1]-1 === 0 && (format[0]-1 === 1 || format[0]-1 === 3 || format[0]-1 === 5 || format[0]-1 === 7 || format[0]-1 === 8 || format[0]-1 === 10 || format[0]-1 === 12)) {
                newDate = `${format[2]}-${'0'+format[0].slice(-2)}-31`;
            } else if (format[1]-1 === 0 && (format[0]-1 === 4 || format[0]-1 === 6 || format[0]-1 === 9 || format[0]-1 === 11)) {
                newDate = `${format[2]}-${'0'+format[0].slice(-2)}-30`;
            } else if (format[1]-1 === 0 && (format[0]-1 === 2)) {
                newDate = `${format[2]}-${'0'+format[0].slice(-2)}-28`;
            }
            else {
                // Format date
                newDate = `${format[2]}-${'0'+format[0].slice(-2)}-${('0'+(format[1]-1)).slice(-2)}`;
            }
            const games = await client.db('sportsai').collection('mlb').find({dateOfGame: newDate}).project({
                _id: 1, teamOne: 1, teamTwo: 1, teamOneScore: 1, teamTwoScore: 1, odds: 1, teamOneWinner: 1, 
                teamOnePercentage: 1, teamOneWins: 1, teamOneLosses: 1, teamTwoWins: 1, teamTwoLosses: 1, dateOfGame: 1,
                stadium: 1, time: 1, teamToBetOn: 1, totalScore: 1, teamOnePercentage: 1, overUnderPick: 1, sportsOdds: 1, payout: 1,
                bestMLBook: 1, bestUnpredictedBook: 1, teamOneLineScore: 1, teamTwoLineScore: 1
            })
            .toArray();
            res.json(games);
        } else {
            res.json(games);
        }
    } catch (err) {
        console.error("Error connecting to database", err)
    } finally {
        await client.close();
    }
}

async function getMLBYesterday (req, res) {
    try {
        await client.connect();
        const date = new Date();
        const dateFormat = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Los_Angeles",
            timeZoneName: "short"
        })
        const format = dateFormat.format(date).split(",")[0].split("/");
        let newDate;
        // Check day of the month incase it is the first of the month for yesterday's games
        if (format[1]-1 === 0 && (format[0]-1 === 1 || format[0]-1 === 3 || format[0]-1 === 5 || format[0]-1 === 7 || format[0]-1 === 8 || format[0]-1 === 10 || format[0]-1 === 12)) {
            newDate = `${format[2]}-${'0'+format[0].slice(-2)}-31`;
        } else if (format[1]-1 === 0 && (format[0]-1 === 4 || format[0]-1 === 6 || format[0]-1 === 9 || format[0]-1 === 11)) {
            newDate = `${format[2]}-${'0'+format[0].slice(-2)}-30`;
        } else if (format[1]-1 === 0 && (format[0]-1 === 2)) {
            newDate = `${format[2]}-${'0'+format[0].slice(-2)}-28`;
        }
         else {
            // Format date
            newDate = `${format[2]}-${'0'+format[0].slice(-2)}-${('0'+(format[1]-1)).slice(-2)}`;
        }
        const games = await client.db('sportsai').collection('mlb').find({dateOfGame: newDate}).project({
            _id: 1, teamOne: 1, teamTwo: 1, teamOneScore: 1, teamTwoScore: 1, odds: 1, teamOneWinner: 1, 
            teamOnePercentage: 1, teamOneWins: 1, teamOneLosses: 1, teamTwoWins: 1, teamTwoLosses: 1, dateOfGame: 1,
            stadium: 1, time: 1, teamToBetOn: 1, totalScore: 1, teamOnePercentage: 1, overUnderPick: 1, sportsOdds: 1, payout: 1,
            bestMLBook: 1, bestUnpredictedBook: 1, teamOneLineScore: 1, teamTwoLineScore: 1
        })
            .toArray();
        res.json(games);
    } catch (err) {
        console.error('Error connecting to database', err);
    } finally {
        await client.close();
    }
}

async function getMLBResults (req, res) {
    try {
        await client.connect();
        const mlbresults = client.db('sportsai').collection('mlbresults');
        const mlb = client.db('sportsai').collection('mlb');
        const games = await mlb.find({payout: {$exists: true}, teamOneWinner: {$ne: null}, teamOneLineScore: {$exists: true}}).toArray();
        const response = await mlbresults.find().toArray();
        let profit = 0;
        let correct = 0
        let incorrect = 0;
        response.map(day => {
            profit += day.profit;
            correct += day.correct;
            incorrect += day.incorrect;
        })
        let allGames = [];
        let profitRolling = 0;
        let gameNum = 1
        let gamesWon = 0
        let gamesLost = 0
        games.map(game => {
            if (gameNum > 200) {
                if ((game.teamOneWinner === 1 && game.teamToBetOn === game.teamOne) || 
                (game.teamOneWinner === 0 && game.teamToBetOn === game.teamTwo)) {
                    profitRolling += game.payout-100;
                    gamesWon++;
                }
                else {
                    profitRolling -= 100;
                    gamesLost++;
                }
                allGames.push({x: gameNum-200, y: profitRolling, payout: game.payout, date: game.dateOfGame})
            }
            gameNum++;
        })

        const date = new Date();
        const dateFormat = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Los_Angeles",
            timeZoneName: "short"
        })
        const format = dateFormat.format(date).split(",")[0].split("/");
        let newDate;
        if (format[1]-1 === 0 && (format[0]-1 === 1 || format[0]-1 === 3 || format[0]-1 === 5 || format[0]-1 === 7 || format[0]-1 === 8 || format[0]-1 === 10 || format[0]-1 === 12)) {
            newDate = `${format[2]}-${'0'+format[0].slice(-2)}-31`;
        } else if (format[1]-1 === 0 && (format[0]-1 === 4 || format[0]-1 === 6 || format[0]-1 === 9 || format[0]-1 === 11)) {
            newDate = `${format[2]}-${'0'+format[0].slice(-2)}-30`;
        } else if (format[1]-1 === 0 && (format[0]-1 === 2)) {
            newDate = `${format[2]}-${'0'+format[0].slice(-2)}-28`;
        }
         else {
            newDate = `${format[2]}-${'0'+format[0].slice(-2)}-${('0'+(format[1]-1)).slice(-2)}`;
        }
        const gamesYes = await client.db('sportsai').collection('mlb').find({dateOfGame: newDate}).project({
            _id: 1, teamOne: 1, teamTwo: 1, teamOneScore: 1, teamTwoScore: 1, odds: 1, teamOneWinner: 1, 
            teamOnePercentage: 1, teamOneWins: 1, teamOneLosses: 1, teamTwoWins: 1, teamTwoLosses: 1, dateOfGame: 1,
            stadium: 1, time: 1, teamToBetOn: 1, totalScore: 1, teamOnePercentage: 1, overUnderPick: 1, sportsOdds: 1, payout: 1,
            bestMLBook: 1, bestUnpredictedBook: 1, teamOneLineScore: 1, teamTwoLineScore: 1
        }).toArray();


        res.json({winPercent: Math.round(gamesWon/(gamesWon+gamesLost)*100), allGameData: allGames, gamesYes})
    } catch (err) {
        console.error('Error connecting to database', err); 
    } finally {
        await client.close();
    }
}


// NFL
async function getNFLToday (req, res) {
    try {
        await client.connect();
        const games = await client.db('sportsai').collection('nfl').find().project({
            _id: 1, teamOne: 1, teamTwo: 1, week: 1, stadium: 1, date: 1, odds: 1, time: 1,
            teamOneWinner: 1, teamOneLineScore: 1, teamTwoLineScore: 1, teamOneScore: 1, teamTwoScore: 1
        })
            .toArray();
        res.json(games);
    } catch (err) {
        console.error("Error connecting to database", err);
    } finally {
        await client.close();
    }
}


// Users 
async function checkForUser (userId) {
    try {
        await client.connect();
        const users = await client.db('sportsai').collection('users').find({userId: userId}).toArray();
        if (users.length == 0) {
            return null;
        }
        return users;
    } catch (err) {
        console.error("Error connecting to database", err);
    } finally {
        await client.close();
    }
}

async function addUser (userId, firstName, lastName, email, profileImage) {
    try {
        await client.connect();
        const user = await client.db('sportsai').collection('users').insertOne({
            userId: userId, firstName: firstName, lastName: lastName, email: email, profileImage: profileImage, dailyEmail: true
        });
        console.log(user);
    } catch (err) {
        console.error("Error connecting to database", err);
    } finally {
        await client.close();
    }
}

async function changePreference (userId, option) {
    try {
        await client.connect();
        const user = await client.db('sportsai').collection('users').updateOne({userId: userId}, {$set: {dailyEmail: option}});
    } catch (err) {
        console.error("Error connecting to database", err);
    } finally {
        await client.close();
    }
}

module.exports = { getMLBToday, getNFLToday, getMLBYesterday, getMLBResults, checkForUser, addUser, changePreference };