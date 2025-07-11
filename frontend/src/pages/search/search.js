import React, { useState, useEffect } from 'react';
import EditActor from '../../components/edit/edit';
function SearchActor() {
  const [familyname, setFamilyname] = useState('');
  const [givenname, setGivenname] = useState('');
  const [nation, setNation] = useState('');
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingActor, setEditingActor] = useState(null);
  const searchActors = async () => {
    if ((!familyname && !givenname) && !nation) {
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

  const handleDeleteActor = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого актера?')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/table/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении');
      }
      setActors(actors.filter(actor => actor.id !== id));
      alert('Актер успешно удален');
      } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить актера: ' + error.message);
    }
  };

  const handleEditingActor = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/table/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Ошибка при обновлении');
        }

        const updatedActor = await response.json();
        
        setActors(actors.map(actor => 
            actor.id === id ? updatedActor : actor
        ));
        
        setEditingActor(null);
        alert('Данные актера успешно обновлены');
    } catch (error) {
        console.error('Ошибка обновления:', error);
        alert('Не удалось обновить данные: ' + error.message);
    }
};

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
    <div >
      {editingActor ? (
        <EditActor 
            actor={editingActor}
            onSave={ handleEditingActor}
            onCancel={() => setEditingActor(null)}
        />
      ) : (
            <>
              <div class='container'>
                
              <h2 >Список актёров</h2>
              <table class='actorstable'>
                <thead>
                    <th>ID</th>
                    <th>Фамилия</th>
                    <th>Имя</th>
                    <th>Национальность</th>
                    <th>Число фильмов</th>
                    <th>Гонорар (в млн. $)</th>
                    <th></th>
                </thead>
                <tbody>
                  {actors.map((actor) => (
                    <tr key={actor.id}>
                      <td>{actor.id}</td>
                      <td>{actor.familyname}</td>
                      <td>{actor.givenname}</td>
                      <td>{actor.nation}</td>
                      <td>{actor.number}</td>
                      <td>{actor.honorar}</td>
                      <td>
                        <button onClick={() => setEditingActor(actor)}>Редактировать</button>
                        <button onClick={() => handleDeleteActor(actor.id)} class='deleteButton'>Удалить</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </>
      )}
    </div>
    ) : (
          !loading && !error && ((familyname || givenname) || nation) && (
            <div >Актеры не найдены</div>
          )
        )}
      </div>
    </div>
  );
}

export default SearchActor;