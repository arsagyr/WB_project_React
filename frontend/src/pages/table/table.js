import React, { useState, useEffect } from 'react';
import EditActor from '../../components/edit/edit';
import './table.css';

const ActorsTable = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingActor, setEditingActor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/table');
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        const data = await response.json();
        setActors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


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


  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
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
    );
};

export default ActorsTable;