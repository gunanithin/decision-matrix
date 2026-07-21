export const QUADRANTS = [
  {
    id: "do",
    title: "DO",
    subtitle: "do it now",
    color: "#8c9b5b"
  },
  {
    id: "decide",
    title: "DECIDE",
    subtitle: "schedule a time to do it later",
    color: "#eb6d63"
  },
  {
    id: "delegate",
    title: "DELEGATE",
    subtitle: "can someone else do this for you?",
    color: "#df9d50"
  },
  {
    id: "delete",
    title: "DELETE",
    subtitle: "eliminate it",
    color: "#1fa4a7"
  }
];

export function nextQuadrant(current) {
  const idx = QUADRANTS.findIndex(q => q.id === current);
  return QUADRANTS[(idx + 1) % QUADRANTS.length].id;
}
