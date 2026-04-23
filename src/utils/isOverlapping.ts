export const isOverlapping = (
  a: HTMLElement | null,
  b: HTMLElement | null,
): boolean => {
  if (!a || !b) {
    return false;
  }
  const ar = a.getBoundingClientRect();
  const br = b.getBoundingClientRect();
  return (
    ar.right >= br.left &&
    ar.left <= br.right &&
    ar.bottom >= br.top &&
    ar.top <= br.bottom
  );
};

