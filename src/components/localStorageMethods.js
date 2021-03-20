export function getTokenFromLocalStorage() {
    console.log("Reading token from locale storage");
    return localStorage.getItem('jwt');
}

export function getUserFromLocalStorage() {
    let user = JSON.parse(localStorage.getItem("user"));
    return user;
}