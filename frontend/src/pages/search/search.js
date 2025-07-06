import React, { useState, useEffect } from 'react';

function SearchActor() {
  const [familyname, setFamilyname] = useState('');
  const [givenname, setGivenname] = useState('');
  const [nation, setNation] = useState('');
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchActors = async () => {
    if (!familyname && !givenname && !nation) {
      setActors([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (familyname) params.append('familyname', familyname);
      if (givenname) params.append('givenname', givenname);
      if (nation) params.append('nation', nation);

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
  }, [familyname, givenname, nation]);

  return (
      <div class='container'>
      <h2>Поиск актеров</h2>
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
        <input
          type="text"
          value={nation}
          onChange={(e) => setNation(e.target.value)}
          placeholder="Национальность"
        /> 

      {loading && <div className="loading">Загрузка...</div>}
      {error && <div className="error">{error}</div>}

      <div>
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
                  <td>{actor.familyname}</td>
                  <td>{actor.givenname}</td>
                  <td>{actor.nation}</td>
                  <td>{actor.number}</td>
                  <td>{parseInt(actor.honorar).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && !error && (familyname || givenname || nation) && (
            <div >Актеры не найдены</div>
          )
        )}
      </div>
    </div>
  );
}

export default SearchActor;