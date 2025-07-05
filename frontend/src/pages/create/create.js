import React, { useState, useEffect } from 'react';

function CreateActor() {
  const [actor, setActor] = useState({
	familyname : '',
	givenname  : '',
	nation     : '',
	number     : '',
	honorar    : ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setActor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8080/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actor),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
      alert('Форма успешно отправлена!');
      
      // Очистка формы после успешной отправки
      setActor({
        familyname : '',
        givenname  : '',
        nation     : '',
        number     : '',
        honorar    : ''
      });

    } catch (error) {
      console.error('Error:', error);
      alert('Произошла ошибка при отправке формы');
    }
  };

  return (
    <div>
      <h3>Добавить актёра</h3>
        <form onSubmit={handleSubmit}>
            <table>
                <tr>
                    <td><label>Фамилия</label></td>
                    <td><input 
                             type="text" 
                            name="familyname" 
                            pattern="[A-Za-zА-Яа-яЁё]+$" 
                            value={actor.familyname}
                            onChange={handleInputChange}
                            required 
                        /></td>
                </tr>
                <tr>
                    <td><label>Имя</label></td>
                    <td><input 
                        type="text" 
                        name="givenname" 
                        pattern="[A-Za-zА-Яа-яЁё]+$" 
                        value={actor.givenname}
                        onChange={handleInputChange}
                        required 
                    /></td>
                </tr>
                <tr>
                    <td><label>Национальность</label></td>
                    <td><input 
                        type="text" 
                        name="nation" 
                        pattern="[A-Za-zА-Яа-яЁё]+$" 
                        value={actor.nation}
                        onChange={handleInputChange}
                        required 
                    /></td>
                </tr>
                <tr>
                    <td><label>Число</label></td>
                    <td><input 
                        type="number" 
                        step="0.0001" 
                        name="number" 
                        pattern="[A-Za-zА-Яа-яЁё]+$" 
                        value={actor.number}
                        onChange={handleInputChange}
                        required 
                    /></td>
                </tr>
                <tr>
                    <td><label>Гонорар</label></td>
                    <td><input 
                    type="number" 
                    step="0.0001" 
                    name="honorar" 
                    pattern="[0-9]{0,}" 
                    value={actor.honorar}
                    onChange={handleInputChange}
                    required 
                    /></td>
                </tr>
                <tr>
                    <td><button type="submit">Добавить актёра</button></td>
                </tr>
            </table>
        </form>
    </div>
  );
}

export default CreateActor;