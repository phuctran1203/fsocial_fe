export function combineIntoAvatarName(firstName, lastName) {
	return (firstName?.charAt(0) || "?") + (lastName?.charAt(0) || "?");
}
export function combineIntoDisplayName(firstName, lastName) {
	return (firstName || "?") + " " + (lastName || "?");
}
