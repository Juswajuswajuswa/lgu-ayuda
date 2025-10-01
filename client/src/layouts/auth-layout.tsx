import { Outlet } from "react-router-dom";

function AuthLayout() {
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

export default AuthLayout;
