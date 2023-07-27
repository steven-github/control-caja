import "./App.css";
import DataForm from "./DataForm";

function App() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center p-6">Control de Caja</h1>
      {/* <img src="https://www.readypizzacr.com/image/92689584-09.jpg" alt="Ready Pizza" className="mx-auto" width="200" /> */}
      <DataForm />
    </div>
  );
}

export default App;
