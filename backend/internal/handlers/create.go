package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"react/backend/internal/model"
)

func CreateActor(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var newActor model.Actor
	err := json.NewDecoder(r.Body).Decode(&newActor)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println(newActor.Familyname)
	fmt.Println(newActor.Givenname)

	_, err = DB.Exec(`
		INSERT INTO Names (Family, Given)
		VALUES ($1, $2);
	`, newActor.Familyname, newActor.Givenname)
	if err != nil {
		log.Println(err)
	}
	row := DB.QueryRow(`
	SELECT id FROM Nations WHERE Name LIKE $1;
	`, newActor.Nation)
	nationid := 0
	err = row.Scan(&nationid)
	if err != nil {
		log.Println(err)
	}
	_, err = DB.Exec(`
		INSERT INTO Actors (nameid, nationid, number, honorar)
		VALUES  (
		(SELECT COALESCE(MAX(Id), 0) FROM  Names), 
		$1, $2, $3
		);
	`, nationid, newActor.Number, newActor.Honorar)
	if err != nil {
		log.Println(err)
	}

	// Отправляем ответ
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Form data received",
	})
}
