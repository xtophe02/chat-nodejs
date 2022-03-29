let users = [];

function addUser(data) {
  if (!data.username || !data.room) {
    return { error: "Username and room are required!" };
  }

  if (users.some((user) => user.username === data.username)) {
    return { error: "Username already in use" };
  }

  users.push(data);
  return { user: data };
}
function removeUser(id) {
  const userFind = getUser(id);
  users = users.filter((user) => user.id !== id);
  return userFind;
}

function getUser(id) {
  return users.find((user) => user.id === id);
}
function getUsersInRoom(data) {
  return users.filter((user) => user.room === data);
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
// addUser({ username: "chris", room: "lousada" });
// // console.log(users);
// let res = addUser({ username: "", room: "lousada" });
// // console.log(res);
// res = addUser({ username: "chris", room: "lousada" });
// // console.log(res);
// res = addUser({ username: "idalia", room: "lousada" });
// // console.log(res);
// res = removeUser({ username: "chris" });
// // console.log(res);

// addUser({ username: "moreira", room: "boim" });
// addUser({ username: "nicole", room: "boim" });

// res = getUser({ username: "moreira" });
// // console.log("AKI", res);

// res = getUsersInRoom({ room: "boim" });
// console.log(res);
