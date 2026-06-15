
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import CreateNote from "./pages/CreateNote";
import EditNote from "./pages/EditNote";
import ViewNote from "./pages/ViewNote";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateNote />} />
        <Route path="/edit/:id" element={<EditNote />} />
        <Route path="/note/:id" element={<ViewNote />} />
      </Route>
    </Routes>
  );
}

export default App;
