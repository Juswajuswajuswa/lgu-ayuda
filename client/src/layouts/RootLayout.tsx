import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div>
      <header></header>

      <main>
        <Outlet />
      </main>

      <footer></footer>
    </div>
  );
}

export default RootLayout;
