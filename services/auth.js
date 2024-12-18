const sessionIdToUserMap = new Map();

function setUser(id, user) {
  sessionIdToUserMap.set(id, user);
}

function getUser(id) {
  return sessionIdToUserMap.get(id);
}
function logout(sessionId) {
  sessionIdToUserMap.delete(sessionId);
}
module.exports = { setUser, getUser,logout };
