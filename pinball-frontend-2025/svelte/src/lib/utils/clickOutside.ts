/**
 * A function for Svelte actions - dispatches 'outclick' when a click happens outside the element
 * @param node This is passed to us via the Svelte Actions API, it refers to the 
 */
export function clickOutside(node: Element) {
  const handleClick = (event: Event) => {
      if (!node.contains(<Node>event.target)) {
          node.dispatchEvent(new CustomEvent('outclick'));
      }
  };

  document.addEventListener('click', handleClick, true);

  return {
      destroy() {
          document.removeEventListener('click', handleClick, true);
      },
  };
}