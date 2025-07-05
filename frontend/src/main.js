import {  BrowserRouter, Routes, Route, Router, Link} from 'react-router-dom';
import SearchActor from './pages/search/search.js';
import ActorsTable from './pages/table/table.js';
import CreateActor from './pages/create/create.js';

function App() {
  return (
    <BrowserRouter>
      <Nav />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/api/table" element={<ActorsTable /> } />
            <Route path="/api/create" element={<CreateActor />} />
            <Route path="/api/search" element={<SearchActor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
    
    </BrowserRouter>
    
  );
}

function Nav(){
  return (<nav>
          <Link to="/">Главная</Link> |   
          <Link to="/api/table">Таблица актёров</Link> | 
          <Link to="/api/create">Добавить актёра</Link> |  
          <Link to="/api/search">Искать актёра</Link>
      </nav>);
}

function Main() {
  return (
  <h1>Главная страница</h1>
);
}

function NotFound() {
  return (
  <div>404 - Страница не найдена</div>
);
}

export default App;