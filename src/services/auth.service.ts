export function setSteamId(steamId: string) {
    localStorage.setItem("steamId", steamId);
}

export function getSteamId(): string | null {
    return localStorage.getItem("steamId");
}

export function removeSteamId() {
    localStorage.removeItem("steamId");
}
