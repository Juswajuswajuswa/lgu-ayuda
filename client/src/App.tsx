import { Button } from "./components/ui/button";

function App() {
  const handleClick = () => {
    alert("Button clicked");
  };

  return (
    <>
      <div className="min-h-screen flex flex-col gap-4 bg-gray-100 items-center justify-center">
        <h1 className="text-3xl font-bold underline">LGU Ayuda Distribution</h1>
        <Button variant="outline" onClick={handleClick}>
          Click me
        </Button>
      </div>
    </>
  );
}

export default App;
