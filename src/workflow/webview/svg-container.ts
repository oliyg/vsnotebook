import { debounce } from 'throttle-debounce';

export function svgContainer() {
  // set element size
  let svg: SVGSVGElement | null = document.querySelector("svg");
  if (svg) { setSize(svg, window.innerWidth, window.innerHeight); }
  window.addEventListener('resize', debounce(200, () => {
    console.log("TCL: svgContainer -> resize");
    if (svg) { setSize(svg, window.innerWidth, window.innerHeight); }
  }));
}

function setSize(element: SVGSVGElement, width: number, height: number): void {
  element.setAttribute("width", String(width));
  element.setAttribute("height", String(height));
  element.setAttribute(
    "viewBox",
    `-40 -40 ${window.innerWidth + 40} ${window.innerHeight + 40}`
  );
}
