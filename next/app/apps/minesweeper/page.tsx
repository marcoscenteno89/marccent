import MineSweeper from "../../components/client/minesweeper";

export default function MineSweeperPage() {
  return (
    <section className="container-fluid py-5">
      <div className="container-md bg border rounded p-3">
        <div className="row">
          <div className="col-md-7">
            <MineSweeper />
          </div>
          <div className="col-md-5">
            <h4>About the Game</h4> 
            <p>The object of Minesweeper is to expose all the open areas on the board without hitting an bombs.</p>
            <h4>Instructions</h4>
            <p>Click &quot;Play&quot; to begin the game.</p> 
            <p>Use the left click button on the mouse to select a space on the grid. If you hit a bomb, you lose.</p>
            <p>The numbers on the board represent how many bombs are adjacent to a square. For example, if a square has a &quot;3&quot; on it, then there are 3 bombs next to that square. The bombs could be above, below, right left, or diagonal to the square.</p>
            <p>Avoid all the bombs and expose all the empty spaces to win Minesweeper.</p>
            <p>Tip: Use the numbers to determine where you know a bomb is.</p> 
            <p>Tip: You can right click a square with the mouse to place a flag where you think a bomb is. This allows you to avoid that spot.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
