import React, { useState } from 'react';

function EditActor({ actor, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        id: actor.id,
        familyname: actor.familyname,
        givenname: actor.givenname,
        nation: actor.nation,
        number: actor.number,
        honorar: actor.honorar
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(actor.id, formData);
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
        }
    };

    return (
        <div class='container'>
            <h2>Редактирование актера</h2>
            <form onSubmit={handleSubmit}>
            <table>
            <tr>
                    <td><label>Фамилия:</label></td>
                    <td><input
                        type="text"
                        name="familyname"
                        value={formData.familyname}
                        onChange={handleChange}
                        required
                    /></td>
                </tr>
                <tr>
                    <td><label>Имя:</label></td>
                    <td><input
                        type="text"
                        name="givenname"
                        value={formData.givenname}
                        onChange={handleChange}
                        required
                    /></td>
                </tr>
                <tr>
                    <td><label>Национальность:</label></td>
                    <td><input
                        type="text"
                        name="nation"
                        value={formData.nation}
                        onChange={handleChange}
                    /></td>
                </tr>
                <tr>
                    <td> <label>Число фильмов:</label></td>
                    <td><input
                        type="number"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        min="0"
                    /></td>
                </tr>
                <tr>
                    <td><label>Гонорар ($):</label></td>

                    <td><input
                    type="number" 
                    name="honorar" 
                    value={formData.honorar}
                    onChange={handleChange}
                    step="0.0001" 
                    /></td>
                </tr>
                <tr>
                    <td><button type="submit" className="save-btn">Сохранить</button></td>
                    <td><button type="button" onClick={onCancel} className="cancel-btn">Отмена</button></td>
                </tr>
            </table>
            </form>
        </div>
    );
}

export default EditActor;