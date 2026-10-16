const root = document.querySelector<HTMLElement>('#app');

if (root) {
  const heading = document.createElement('h1');
  heading.textContent = 'PlayPiano';
  root.append(heading);
}
