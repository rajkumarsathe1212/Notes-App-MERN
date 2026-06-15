
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          Notes Manager
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`${
              location.pathname === "/"
                ? "text-blue-600"
                : "text-slate-600"
            }`}
          >
            Home
          </Link>

          <Link
            to="/create"
            className="
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-white
              hover:bg-blue-700
            "
          >
            + New Note
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
