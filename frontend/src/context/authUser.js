export const getUser = () => JSON.parse(localStorage.getItem("ehr-user") || "{}");
export const getUserId=() => getUser().userID;
export const getUserRole=() => getUser().userRole;
