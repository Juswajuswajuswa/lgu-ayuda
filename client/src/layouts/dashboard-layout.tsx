import { Outlet } from "react-router-dom";

function DashboardLayout() {
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

export default DashboardLayout;
