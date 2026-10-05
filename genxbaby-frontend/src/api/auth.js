// src/api/auth.js
export function saveUserSession({ token, email, role }) {
  localStorage.setItem("genxbaby_token", token);
  localStorage.setItem(
    "genxbaby_user",
    JSON.stringify({ email, role })
  );
}

export function getUserSession() {
  const user = localStorage.getItem("genxbaby_user");
  const token = localStorage.getItem("genxbaby_token");
  return user ? { ...JSON.parse(user), token } : null;
}

export function logoutUser() {
  localStorage.removeItem("genxbaby_token");
  localStorage.removeItem("genxbaby_user");
}
