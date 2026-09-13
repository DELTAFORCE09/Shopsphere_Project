export const getUserRole = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
};

export const isAdmin = () => {
  return getUserRole() === "ADMIN";
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};