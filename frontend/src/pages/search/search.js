import React, { useState, useEffect } from 'react';

function SearchActor() {
  const [familyname, setFamilyname] = useState('');
  const [givenname, setGivenname] = useState('');
  const [number, setNumber] = useState('');
  const [honorar, setHonorar] = useState('');
  const [nation, setNation] = useState('');
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchActors = async () => {
    if (!familyname && !givenname) {
      setActors([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (familyname) params.append('familyname', familyname);
      if (givenname) params.append('givenname', givenname);
      // if (number) params.append('number', number);
      // if (honorar) params.append('honorar', honorar);
      // if (nation) params.append('nation', nation);

      const response = await fetch(`http://localhost:8080/api/search?${params.toString()}`);
      if (!response.ok) throw new Error('Ошибка сервера');
      const data = await response.json();
      setActors(data || []);
    } catch (err) {
      setError(err.message);
      setActors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchActors();
    }, 500);

    return () => clearTimeout(timer);
  }, [familyname, givenname]);

  return (
    <div className="actor-search-container">
      <h2>Поиск актеров</h2>
      
      <div className="search-filters">
        <input
          type="text"
          value={familyname}
          onChange={(e) => setFamilyname(e.target.value)}
          placeholder="Фамилия"
        />
        <input
          type="text"
          value={givenname}
          onChange={(e) => setGivenname(e.target.value)}
          placeholder="Имя"
        />
        {/* <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Минимальное число фильмов"
        />
        
        <input
          type="number"
          value={honorar}
          onChange={(e) => setHonorar(e.target.value)}
          placeholder="Минимальный гонорар ($)"
        />
        
        <input
          type="text"
          value={nation}
          onChange={(e) => setNation(e.target.value)}
          placeholder="Национальность"
        /> */}
      </div>

      {loading && <div className="loading">Загрузка...</div>}
      {error && <div className="error">{error}</div>}

      <div className="actors-list">
        {actors.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Национальность</th>
                <th>Число фильмов</th>
                <th>Гонорар ($)</th>
              </tr>
            </thead>
            <tbody>
              {actors.map((actor) => (
                <tr key={actor.id}>
                  <td>{actor.id}</td>
                  <td>{actor.givenname}</td>
                  <td>{actor.familyname}</td>
                  <td>{actor.nation}</td>
                  <td>{actor.number}</td>
                  <td>{parseInt(actor.honorar).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && !error && (familyname || givenname) && (
            <div className="no-results">Актеры не найдены</div>
          )
        )}
      </div>
    </div>
  );
}

export default SearchActor;