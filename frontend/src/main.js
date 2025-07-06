import {  BrowserRouter, Routes, Route, Link} from 'react-router-dom';
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
  return (
    <nav>
      <Link to="/">Главная</Link> |   
      <Link to="/api/table">Таблица актёров</Link> | 
      <Link to="/api/create">Добавить актёра</Link> |  
      <Link to="/api/search">Искать актёра</Link>
    </nav>
);
}

function NotFound() {
  return (
  <div>404 - Страница не найдена</div>
);
}

function Main() {
  return (
  <div>
  <h1>Главная страница</h1>
    <p>Проект системы, работающий с данными на основе технологий ЯП Go и React, а также СУБД PostgreSQL.</p>
    <p>Система обладает функциями записи данных актёров в базе, получения записей, их изменения и удаления.</p>
    <p>Данные представлены в виде сущностей, обладающими свойствами фамилии, имени, национальности, число фильмов и гонорар в млн. долларов.</p>
    <p>Навигация осуществляется по ссылкам сверху.</p>
    <img src="./logo192.png"/>
  </div>
);
}


export default App;