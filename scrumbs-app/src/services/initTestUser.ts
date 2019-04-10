

import User from "../models/User";
import Team from "../models/Team";
import Member from "../models/Member";
import Note from "../models/Note";

const scrumbsData = require( "../../mock-data/scrumbs.json" );

export default async function () {

    User.findOne( { email: "andrei@planeeet.com" } )
        .then( res => {

            if ( res ) return;

            const { data } = scrumbsData;

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
                .then( () => console.info( "Database successfully populated." ) )
                .catch( err => {
                    throw new Error( err );
                });

        })
        .catch( err => {
            throw new Error( err );
        });
}