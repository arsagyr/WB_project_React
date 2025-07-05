package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"react/backend/internal/model"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
)

func DeleteHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	var nameid int
	row := DB.QueryRow(`
	SELECT Nameid FROM Actors 
	WHERE id=$1
	`, id)
	err := row.Scan(&nameid)
	if err != nil {
		log.Println(err)
	}
	_, err = DB.Exec("DELETE FROM Actors WHERE id = $1", id)
	if err != nil {
		log.Println(err)
	}

	_, err = DB.Exec("DELETE FROM Names WHERE id = $1", nameid)
	if err != nil {
		log.Println(err)
	}

	http.Redirect(w, r, "/", 301)
}

func DeleteActorHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != "DELETE" {
		http.Error(w, "Метод не поддерживается", http.StatusMethodNotAllowed)
		return
	}

	// Получаем ID из URL
	idStr := strings.TrimPrefix(r.URL.Path, "/api/table/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Неверный ID актера", http.StatusBadRequest)
		return
	}

	var nameid int
	row := DB.QueryRow(`
	SELECT Nameid FROM Actors 
	WHERE id=$1
	`, id)
	err = row.Scan(&nameid)
	if err != nil {
		log.Println(err)
	}
	_, err = DB.Exec("DELETE FROM Actors WHERE id = $1", id)
	if err != nil {
		log.Println(err)
	}

	_, err = DB.Exec("DELETE FROM Names WHERE id = $1", nameid)
	if err != nil {
		log.Println(err)
	}

	rows, err := DB.Query(`
	SELECT Actors.id, Names.Family, Names.Given, Nations.Name, Number, Honorar FROM Actors
	JOIN Names ON Actors.Nameid=Names.id
	JOIN Nations ON Actors.Nationid=Nations.id
	`)
	if err != nil {
		log.Println(err)
	}
	defer rows.Close()
	actors := []model.Actor{}

	for rows.Next() {
		a := model.Actor{}
		err := rows.Scan(&a.Id, &a.Familyname, &a.Givenname, &a.Nation, &a.Number, &a.Honorar)
		if err != nil {
			fmt.Println(err)
			continue
		}
		actors = append(actors, a)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(actors)
	// json.NewEncoder(w).Encode(map[string]string{"message": "Актер успешно удален"})
}
