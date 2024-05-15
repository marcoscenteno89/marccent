import Link from 'next/link';

export default function Apps() {
  return (
    <section className="container-fluid py-5">
      <div className="container-md bg border p-3">
        <h1 className="text-center">Marccent App List</h1>
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="bg-primary p-3 text-center">
                <i className="h1 fa-solid fa-bomb"></i>
              </div>
              <div className="card-body">
                <h5 className="card-title">MineSweeper</h5>
                <p className="card-text">Minesweeper is a single-player logic-based computer game played on a grid of squares. The objective is to clear the grid without detonating any hidden &quot;mines&quot; scattered throughout. Safe squares display numbers indicating the total number of adjacent mines. Players use these clues to strategically identify and flag the mines, progressing through the game by making calculated decisions based on the revealed information. The game offers different difficulty levels and is known for its challenging and strategic gameplay</p>
                <Link href="/apps/minesweeper" className="btn btn-primary">Go to Minesweeper</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="bg-primary p-3 text-center">
                <i className="h1 fa-solid fa-hashtag"></i>
              </div>
              <div className="card-body">
                <h5 className="card-title">Number Puzzle</h5>
                <p className="card-text">A number puzzle is an educational activity that helps children learn and practice various math concepts such as number sequencing, counting, and recognizing numerals. These puzzles often involve matching numbers, counting dots, or arranging number pieces in the correct order. They are designed to enhance problem-solving and cognitive skills while making learning math more engaging for children. Number puzzles can cover a range of numbers, from 0 to 20, 1 to 100, or other specific number ranges.</p>
                <Link href="/apps/numpuz" className="btn btn-primary">Go to Number Puzzle</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="bg-primary p-3 text-center">
                <i className="h1 fa-solid fa-temperature-half"></i>
              </div>
              <div className="card-body">
                <h5 className="card-title">Weather App</h5>
                <p className="card-text">This weather app is a digital application that provides users with up-to-date weather information for their specific location or other selected locations. It typically offers details such as the current temperature, rain forecast, humidity, wind speed, air quality index, and sunrise/sunset times. Some weather apps also include features like hourly and 10-day forecasts, and maps to visualize weather patterns. These app is designed to help users plan their activities and make informed decisions based on the latest weather conditions</p>
                <Link href="/apps/weather" className="btn btn-primary">Go to Weather App</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
