import Weather from "../../components/client/weather";

export default function WeatherApp() {
  return (
    <section className="container-fluid py-5">
      <div className="container-md bg border rounded p-3">
      <h1 className="text-center">Weather App</h1>
        <Weather />
      </div>
    </section>
  )
}
