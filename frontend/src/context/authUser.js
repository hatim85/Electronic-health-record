export const getUser = () => JSON.parse(localStorage.getItem("ehr-user") || "{}");
export const userId = getUser().userId;
export const userRole = getUser().userRole;
