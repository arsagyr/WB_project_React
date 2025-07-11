package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"react/backend/internal/model"
	"strconv"
	"strings"
)

func EditActor(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "PUT" {
		http.Error(w, "Метод не поддерживается", http.StatusMethodNotAllowed)
		return
	}

	idStr := strings.TrimPrefix(r.URL.Path, "/api/table/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Неверный ID актера", http.StatusBadRequest)
		return
	}

	var updatedActor model.Actor
	err = json.NewDecoder(r.Body).Decode(&updatedActor)
	if err != nil {
		http.Error(w, "Неверный формат данных", http.StatusBadRequest)
		return
	}

	_, err = DB.Exec(`
	UPDATE Names SET Family= $1, Given=$2 WHERE id=(
	SELECT nameid FROM Actors WHERE id=$3
	)
	`, updatedActor.Familyname, updatedActor.Givenname, id)
	if err != nil {
		log.Println(err)
	}
	_, err = DB.Exec(`
	UPDATE Actors SET Nationid = (
		SELECT id FROM Nations
		WHERE Name LIKE $1
	),
	Number=$2, 
	Honorar=$3 
	WHERE id = $4
	`, updatedActor.Nation, updatedActor.Number, updatedActor.Honorar, id)
	if err != nil {
		log.Println(err)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updatedActor)
}
