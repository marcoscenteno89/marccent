const dt = new Date();

const Bomb = () => {
  const hover = (a) => a.target.style.background = 'none';
  return (
  <i className="fa-solid fa-bomb"
    onMouseOver={hover.bind(this)}
    onMouseLeave={hover.bind(this)}
    style={{backgroundColor: 'none !important'}}
    >
    </i>
  )
}

const Flag = () => {
  const hover = (a) => a.target.style.background = 'none';
  return (
  <i className="fa-solid fa-flag"
    onMouseOver={hover.bind(this)}
    onMouseLeave={hover.bind(this)}
    style={{backgroundColor: 'none !important'}}
    >
  </i>)
}

export { dt, Bomb, Flag }