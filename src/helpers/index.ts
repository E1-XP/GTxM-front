export const scrollTo = (element: Element, top: number, duration: number) => {
  const start = element.scrollTop;
  const difference = top - start;
  let lastTStamp: number | null = null;

  type n = number;
  // by R. Penner http://gizma.com/easing/
  const easeInOutQuad = function(t: n, b: n, c: n, d: n) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const moveScroll = (timeLeft: number = 0) => {
    const calcPos = easeInOutQuad(timeLeft, start, difference, duration);
    element.scrollTop = calcPos;

    timeLeft < duration &&
      requestAnimationFrame(tstamp => {
        const updTimeLeft = lastTStamp
          ? timeLeft + (tstamp - lastTStamp)
          : timeLeft;

        lastTStamp = tstamp;

        moveScroll(updTimeLeft);
      });
  };
  moveScroll();
};
