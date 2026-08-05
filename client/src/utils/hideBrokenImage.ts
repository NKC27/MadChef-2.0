// Spoonacular occasionally returns image URLs that 404. Rather than showing
// the browser's broken-image glyph, hide the element so the card just falls
// back to its plain dark background.
export const hideBrokenImage = (
  event: React.SyntheticEvent<HTMLImageElement>,
) => {
  event.currentTarget.style.display = 'none';
};
