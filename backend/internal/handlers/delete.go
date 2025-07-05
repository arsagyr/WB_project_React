package handlers

import (
	"log"
	"net/http"

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
