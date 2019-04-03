

import { Router, Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";


import User from "../models/User";
import Team from "../models/Team";
import Member from "../models/Member";
import Note from "../models/Note";



class DataHelper {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post( "/populate", this.populate );
        this.router.get( "/populate", this.poplateQuick );
        this.router.get( "/drop", this.drop );
    }



    /**
     * Populate API that accepts a JSON input and populates the database
     *
     * EXAMPLE INPUT FORMAT :
     *
     * {
            "data":[
                {
                    "user":{
                        "name":"Andrei Gaspar",
                        "email":"andrei@scrumbs.com",
                        "password":"asd123"
                    },
                    "teams":[
                        {
                            "name":"Scrum Team",
                            "isDefault":true
                        },
                        {
                            "name":"Avengers",
                            "isDefault":false
                        }
                    ],
                    "members":[
                        {
                            "teams":[
                                "Scrum Team"
                            ],
                            "name":"Stephen Hodges",
                            "notes":[
                                {
                                    "content":"Two factor authentication implemented",
                                    "date":"11/28/2018",
                                    "isImpediment":false,
                                    "isSolved":false
                                }
                            ]
                        }
                    ]
                }
            ]
        }
     *
     * User accounts should be added to the data array
     * The account contains a user, teams, and members
     * Teams can be currently listed on the member as an array of strings containing the team names
     *
     * @param {Request} req
     * @param {Response} res
     * @param {e.NextFunction} next
     */
    public populate(req: Request, res: Response, next: NextFunction) {

        const { data } = req.body;

        let promises = [];

        for ( let account of data ) {

            const { user, teams, members } = account;

            const userData = new User( user );
            promises.push( userData.save() );

            let teamData = [];

            for ( let team of teams ) {

                const t = new Team({
                    owner: userData._id,
                    name: team.name,
                    isDefault: team.isDefault
                });

                teamData.push( t );

                promises.push( t.save() );
            }

            for ( let member of members ) {

                const m = new Member({
                    owner: userData._id,
                    name: member.name
                });

                m.teams = teamData.filter( t => member.teams.indexOf( t.name ) !== -1 ).map( t => t._id );

                const notes = member.notes;

                for ( let note of notes ) {

                    const teamId = teamData.filter( t => note.team === t.name )[0]._id;

                    const n = new Note({
                        owner: userData._id,
                        content: note.content,
                        date: new Date( note.date ),
                        isImpediment: note.isImpediment,
                        isSolved: note.isSolved,
                        member: m._id,
                        team: teamId
                    });

                    m.notes.push( n._id );

                    promises.push( n.save() );
                }

                promises.push( m.save() );
            }
        }


        Promise.all( promises as any )
            .then( () => res.send( "Database successfully populated." ) )
            .catch( next );
    }



    public poplateQuick(req: Request, res: Response, next: NextFunction) {
        console.info("Collections populate has been initiated." );

        /** USER */
        const andrei = new User({
            name: "Andrei Gaspar",
            email: "andrei@planeeet.com",
            password: "asd123"
        });

        const team1 = new Team({
            name: "Scrum Team",
            owner: andrei,
            isDefault: true
        });


        const memberStephen = new Member({
            name: "Stephen Hodges",
            owner: andrei
        });


        const noteStephen1 = new Note({
            owner: andrei,
            member: memberStephen,
            team: team1,
            content: "Two factor authentication implemented",
            date: new Date( 2018, 11, 28 )
        });


        const noteStephen2 = new Note({
            owner: andrei,
            member: memberStephen,
            team: team1,
            content: "Added Passport as an authentication middleware, configured strategies for Google, Twitter and LinkeIn. Working on task listing component, made a release to the test environment",
            date: new Date( 2018, 11, 28 )
        });


        const noteStephen3 = new Note({
            owner: andrei,
            member: memberStephen,
            team: team1,
            content: "Need the .json translation files for the localization, it works with mock data",
            date: new Date( 2018, 11, 29 ),
            isBlocker: true
        });


        const noteStephen4 = new Note({
            owner: andrei,
            member: memberStephen,
            team: team1,
            content: "Working on adding social media authentication",
            date: new Date( 2018, 11, 29 )
        });


        const noteStephen5 = new Note({
            owner: andrei,
            member: memberStephen,
            team: team1,
            content: "Sales team has an urgent feature request, but specs are not clear",
            date: new Date( 2018, 11, 29 )
        });


        const noteStephen6 = new Note({
            owner: andrei,
            member: memberStephen,
            team: team1,
            content: "Released version 2.0.8 to the production environment, ad a meeting with QA about prioritizing bug fixes; Fixed bugs 1405, 1406, 1420 and sent them to QA, continuing with 1411 and 1413",
            date: new Date( 2018, 11, 29 )
        });


        const noteStephen7 = new Note({
            owner: andrei,
            member: memberStephen,
            team: team1,
            content: "Implemented remember me feature on a separate branch, testing it today and merging it back to master",
            date: new Date( 2018, 11, 29 ),
            isBlocker: true,
            isSolved: true
        });


        const noteStephen8 = new Note({
            owner: andrei,
            member: memberStephen,
            team: team1,
            content: "Authentication JavaScript implemented",
            date: new Date( 2018, 11, 29 )
        });

        memberStephen.teams.push( team1._id );
        memberStephen.notes.push( noteStephen1._id );
        memberStephen.notes.push( noteStephen2._id );
        memberStephen.notes.push( noteStephen3._id );
        memberStephen.notes.push( noteStephen4._id );
        memberStephen.notes.push( noteStephen5._id );
        memberStephen.notes.push( noteStephen6._id );
        memberStephen.notes.push( noteStephen7._id );
        memberStephen.notes.push( noteStephen8._id );


        const memberLee = new Member({
            name: "Lee Simon",
            owner: andrei
        });

        memberLee.teams.push( team1._id );


        const memberVictoria = new Member({
            name: "Victoria Terry",
            owner: andrei
        });

        memberVictoria.teams.push( team1._id );


        const memberEstelle = new Member({
            name: "Estelle Cruz",
            owner: andrei
        });

        memberEstelle.teams.push( team1._id );


        const memberSteve = new Member({
            name: "Steve Cannon",
            owner: andrei
        });

        memberSteve.teams.push( team1._id );


        const memberGordon = new Member({
            name: "Gordon Hunt",
            owner: andrei
        });

        memberGordon.teams.push( team1._id );


        const memberCharles = new Member({
            name: "Charles Hughes",
            owner: andrei
        });

        memberCharles.teams.push( team1._id );


        const memberIsabel = new Member({
            name: "Isabel Estrada",
            owner: andrei
        });

        memberIsabel.teams.push( team1._id );


        const team2 = new Team({
            name: "Echipa Racheta",
            owner: andrei
        });

        const memberChiki = new Member({
            name: "Chiki Chan",
            owner: andrei
        });

        memberChiki.teams.push( team2._id );

        const memberJocka = new Member({
            name: "Jocka Mester",
            owner: andrei
        });

        memberJocka.teams.push( team2._id );

        Promise.all([
            andrei.save(),
            team1.save(),
            team2.save(),
            memberStephen.save()
        ])
            .then( () => Promise.all([
                    noteStephen1.save(),
                    noteStephen2.save(),
                    noteStephen3.save(),
                    noteStephen4.save(),
                    noteStephen5.save(),
                    noteStephen6.save(),
                    noteStephen7.save(),
                    noteStephen8.save()
                ]))
            .then(() => Promise.all([
                    memberLee.save(),
                    memberVictoria.save(),
                    memberEstelle.save(),
                    memberSteve.save(),
                    memberGordon.save(),
                    memberCharles.save(),
                    memberIsabel.save(),
                    memberChiki.save(),
                    memberJocka.save()
            ]) )
            .then( () => res.send( "Database successfully populated." ) )
            .catch( next );

    }



    public drop(req: Request, res: Response, next: NextFunction) {
        console.info("Collections drop has been initiated." );

        const { users, teams, members, notes, invitations } = mongoose.connection.collections;

        if ( ! users )          res.send( "Users collection not found" );
        if ( ! teams )          res.send( "Records collection not found" );
        if ( ! members )        res.send( "Logs collection not found" );
        if ( ! notes )          res.send( "Logs collection not found" );

        users.drop( () => {
            teams.drop( () => {
                members.drop( () => {

                    if ( ! invitations ) {
                        res.send( "Collections dropped" );
                    } else {
                        invitations.drop( () => {
                            res.send( "Collections dropped" );
                        })
                    }

                });
            });
        });

    }

}



export default new DataHelper().router;
