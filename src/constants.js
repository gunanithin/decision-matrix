export const QUADRANTS = [
  {
    id: "do",
    title: "Do First: Urgent & Important",
    shortTitle: "Do First",
    image: "https://gunanithin.my.canva.site/_assets/media/34dd681b756d4ad187ef655b0376ad5e.png"
  },
  {
    id: "decide",
    title: "Schedule: Important, Not Urgent",
    shortTitle: "Schedule",
    image: "https://gunanithin.my.canva.site/_assets/media/fdc0dcd9e5f1ecc0c477f99175fc9f36.png"
  },
  {
    id: "delegate",
    title: "Delegate: Urgent, Not Important",
    shortTitle: "Delegate",
    image: "https://gunanithin.my.canva.site/_assets/media/0fe1200155f31500bcb606ef72be3589.png"
  },
  {
    id: "delete",
    title: "Don't Do: Neither Urgent Nor Important",
    shortTitle: "Don't Do",
    image: "https://gunanithin.my.canva.site/_assets/media/85b7aed970d33a415364300b038afa4e.png"
  }
];

export function nextQuadrant(current) {
  const idx = QUADRANTS.findIndex(q => q.id === current);
  return QUADRANTS[(idx + 1) % QUADRANTS.length].id;
}
