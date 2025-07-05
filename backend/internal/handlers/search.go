package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"react/backend/internal/model"
)

func SearchActors(w http.ResponseWriter, r *http.Request) {
	familyname := (r.URL.Query().Get("familyname"))
	givenname := (r.URL.Query().Get("givenyname"))
	// number, _ := strconv.Atoi(r.URL.Query().Get("number"))
	// honorar, _ := strconv.Atoi(r.URL.Query().Get("honorar"))
	// nation := strings.ToLower(r.URL.Query().Get("nation"))

	familyname = "%" + familyname + "%"
	givenname = "%" + givenname + "%"
	fmt.Println(familyname)

	var results []model.Actor

	rows, err := DB.Query(`
		SELECT Actors.id, Names.Family, Names.Given, Nations.Name, Number, Honorar FROM Actors 
		JOIN Names ON Actors.Nameid=Names.id
		JOIN Nations ON Actors.Nationid=Nations.id
		WHERE ((Names.Family  LIKE $1) AND (Names.Given LIKE $2))
		`,
		familyname, givenname)

	if err != nil {
		log.Println(err)
	}
	for rows.Next() {
		a := model.Actor{}
		err := rows.Scan(&a.Id, &a.Familyname, &a.Givenname, &a.Nation, &a.Number, &a.Honorar)
		if err != nil {
			fmt.Println(err)
			continue
		}
		fmt.Println(a.Id, a.Familyname, a.Givenname, a.Nation, a.Number, a.Honorar)
		results = append(results, a)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(results)
}
