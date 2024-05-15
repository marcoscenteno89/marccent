import Numpuz from "../../components/client/numpuz";

export default function NumPuz() {
  return (
    <section className="container-fluid py-5">
      <div className="container-md bg border p-3">
        <h1 className="text-center">NumPuz Puzzle</h1>
        <div className="row">
          <div className="col-md-6">
            <Numpuz />
          </div>
          <div className="col-md-6">
            <p>
              Numpuz is a type of number riddle puzzle that typically involves arranging a set of numbers or symbols in a particular pattern or sequence. Here are some general rules for playing a      Numpuz puzzle:</p>
              <ul className="list-group">
                <li className="list-group-item"><strong>Objective:</strong> The goal of Numpuz is to fill in the missing numbers or symbols in a sequence or pattern, using logical and mathematical reasoning.</li>
                <li className="list-group-item"><strong>Setup:</strong> A Numpuz puzzle typically consists of a grid of squares or cells, with some squares already filled in with numbers or symbols. The player&apos;s task is to fill in the remaining squares to complete the pattern or sequence.</li>
                <li className="list-group-item"><strong>Gameplay:</strong> Each Numpuz puzzle has its own unique rules and patterns, but generally, players use logic and deduction to determine the missing numbers or symbols. Some common techniques include looking for patterns or relationships between adjacent numbers, using basic mathematical operations to derive missing values, and applying deductive reasoning to narrow down the possible values for each square.</li>
                <li className="list-group-item"><strong>Scoring:</strong> Numpuz puzzles are typically not scored, as they are a form of puzzle rather than a competitive game.</li>
                <li className="list-group-item"><strong>Winning and Losing:</strong> There is no &quot;winning&quot; or &quot;losing&quot; in Numpuz, as it is a puzzle that can be solved or completed by finding the correct values for all squares.</li>
              </ul>
            <p>Overall, the rules of Numpuz are relatively simple, but the puzzles themselves can be challenging and require careful observation and logical thinking to solve.</p>
          </div>
        </div>
      </div>
    </section>
  )
}