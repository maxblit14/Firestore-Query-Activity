let teams = [
  {
    teamName: "Real Madrid",
    city: "Madrid",
    country: "Spain",
    topScorers: ["Ronaldo", "Benzema", "Hazard"],
    worldwideFans: 798,
  },
  {
    teamName: "Barcelona",
    city: "Barcelona",
    country: "Spain",
    topScorers: ["Messi", "Suarez", "Puyol"],
    worldwideFans: 738,
  },
  {
    teamName: "Manchester United",
    city: "Manchester",
    country: "England",
    topScorers: ["Cantona", "Rooney", "Ronaldo"],
    worldwideFans: 755,
  },
  {
    teamName: "Manchester City",
    city: "Manchester",
    country: "England",
    topScorers: ["Sterling", "Aguero", "Haaland"],
    worldwideFans: 537,
  },
  {
    teamName: "Brazil National Team",
    city: "Not applicable",
    country: "Brazil",
    topScorers: ["Ronaldinho", "Cafu", "Bebeto"],
    worldwideFans: 950,
  },
  {
    teamName: "Argentina National Team",
    city: "Not applicable",
    country: "Argentina",
    topScorers: ["Messi", "Batistuta", "Maradona"],
    worldwideFans: 888,
  },
  {
    teamName: "Atletico Madrid",
    city: "Madrid",
    country: "Spain",
    topScorers: ["Aragonés", "Griezmann", "Torez"],
    worldwideFans: 400,
  },
];

// Adding the Teams collection to firebase

// teams.forEach((team) => {
//   firebase
//     .firestore()
//     .collection("teams")
//     .add(team)
//     .then(() => console.log(`Added ${team.teamName}`))
//     .catch((error) => console.error("Error adding team:", error));
// });

// Task 2

// 1. Show all teams in Spain
console.log(teams.filter((team) => team.country === "Spain"));

// 2. Show all teams in Madrid, Spain
console.log(
  teams.filter((team) => team.country === "Spain" && team.city === "Madrid")
);

// 3. Show all national teams
console.log(teams.filter((team) => team.city === "Not applicable"));

// 4. Show all teams that are not in Spain
console.log(teams.filter((team) => team.country !== "Spain"));

// 5. Show all teams that are not in Spain or England
console.log(
  teams.filter((team) => team.country !== "Spain" && team.country !== "England")
);

// 6. Show all teams in Spain with more than 700M fans
console.log(
  teams.filter((team) => team.country === "Spain" && team.worldwideFans > 700)
);

// 7. Show all teams with a number of fans in the range of 500M and 600M
console.log(
  teams.filter((team) => team.worldwideFans >= 500 && team.worldwideFans <= 600)
);

// 8. Show all teams where Ronaldo is a top scorer
console.log(teams.filter((team) => team.topScorers.includes("Ronaldo")));

// 9. Show all teams where Ronaldo, Maradona, or Messi is a top scorer
console.log(
  teams.filter((team) =>
    team.topScorers.some((player) =>
      ["Ronaldo", "Maradona", "Messi"].includes(player)
    )
  )
);

// Task 3
// Update worldwide fans and team names

// Function to update team details in Firestore
function updateTeamDetails(teamName, updates) {
  db.collection("teams")
    .where("teamName", "==", teamName) // Find the document by teamName
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        // Update the document with the given fields
        db.collection("teams")
          .doc(doc.id)
          .update(updates)
          .then(() => console.log(`Successfully updated ${teamName}`));
      });
    })
    .catch((error) => console.error(`Error finding ${teamName}:`, error));
}

// Function to update the top scorers array
function updateTopScorers(teamName, toRemove, toAdd) {
  db.collection("teams")
    .where("teamName", "==", teamName) // Find the document by teamName
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.error(`No document found for team: ${teamName}`);
        return;
      }

      snapshot.forEach((doc) => {
        // Remove player(s) from topScorers
        db.collection("teams")
          .doc(doc.id)
          .update({
            topScorers: firebase.firestore.FieldValue.arrayRemove(toRemove),
          })
          .then(() => {
            // Add player(s) to topScorers
            db.collection("teams")
              .doc(doc.id)
              .update({
                topScorers: firebase.firestore.FieldValue.arrayUnion(toAdd),
              })
              .then(() =>
                console.log(
                  `Updated top scorers for ${teamName}: Removed ${toRemove}, Added ${toAdd}`
                )
              )
              .catch((error) =>
                console.error(
                  `Error adding ${toAdd} to ${teamName}'s top scorers:`,
                  error
                )
              );
          })
          .catch((error) =>
            console.error(
              `Error removing ${toRemove} from ${teamName}'s top scorers:`,
              error
            )
          );
      });
    })
    .catch((error) => console.error(`Error finding ${teamName}:`, error));
}

// Call the functions to update Real Madrid and Barcelona
updateTeamDetails("Real Madrid", {
  worldwideFans: 811,
  teamName: "Real Madrid FC",
});
updateTopScorers("Real Madrid FC", "Hazard", "Crispo");

updateTeamDetails("Barcelona", {
  worldwideFans: 747,
  teamName: "FC Barcelona",
});
updateTopScorers("FC Barcelona", "Puyol", "Deco");

// Task 4
// Combined updates for jersey colors
const jerseyUpdates = [
  { teamName: "Real Madrid FC", color: { home: "White", away: "Purple" } },
  { teamName: "FC Barcelona", color: { home: "Red", away: "Pink" } },
];

// Update jersey colors in Firestore

let jerseyColors = {
  "Real Madrid FC": {
    home: "White",
    away: "Black",
  },
  "FC Barcelona": {
    home: "Red",
    away: "Gold",
  },
};

// Updating jersey colors for Real Madrid FC
db.collection("teams")
  .where("teamName", "==", "Real Madrid FC")
  .get()
  .then((querySnapshot) => {
    if (!querySnapshot.empty) {
      let docId = querySnapshot.docs[0].id;
      db.collection("teams")
        .doc(docId)
        .update({
          color: jerseyColors["Real Madrid FC"],
        })
        .then(() => {
          console.log("Jersey colors for Real Madrid FC updated successfully.");
        });
    }
  })
  .catch((error) =>
    console.error("Error updating Real Madrid FC jersey colors:", error)
  );

// Updating jersey colors for FC Barcelona
db.collection("teams")
  .where("teamName", "==", "FC Barcelona")
  .get()
  .then((querySnapshot) => {
    if (!querySnapshot.empty) {
      let docId = querySnapshot.docs[0].id;
      db.collection("teams")
        .doc(docId)
        .update({
          color: jerseyColors["FC Barcelona"],
        })
        .then(() => {
          console.log("Jersey colors for FC Barcelona updated successfully.");
        });
    }
  })
  .catch((error) =>
    console.error("Error updating FC Barcelona jersey colors:", error)
  );

// Updating Real Madrid FC's away jersey color to Purple
db.collection("teams")
  .where("teamName", "==", "Real Madrid FC")
  .get()
  .then((querySnapshot) => {
    if (!querySnapshot.empty) {
      let docId = querySnapshot.docs[0].id;
      db.collection("teams")
        .doc(docId)
        .update({
          "color.away": "Purple",
        })
        .then(() => {
          console.log("Real Madrid FC's away jersey color updated to Purple.");
        });
    }
  })
  .catch((error) =>
    console.error("Error updating Real Madrid FC's away jersey color:", error)
  );

// Updating FC Barcelona's away jersey color to Pink
db.collection("teams")
  .where("teamName", "==", "FC Barcelona")
  .get()
  .then((querySnapshot) => {
    if (!querySnapshot.empty) {
      let docId = querySnapshot.docs[0].id;
      db.collection("teams")
        .doc(docId)
        .update({
          "color.away": "Pink",
        })
        .then(() => {
          console.log("FC Barcelona's away jersey color updated to Pink.");
        });
    }
  })
  .catch((error) =>
    console.error("Error updating FC Barcelona's away jersey color:", error)
  );
