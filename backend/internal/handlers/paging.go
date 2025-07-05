package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	model "react/backend/internal/model"
	"strconv"
)

type PaginatedResponse struct {
	Data       []model.Actor `json:"data"`
	Total      int           `json:"total"`
	Page       int           `json:"page"`
	PerPage    int           `json:"per_page"`
	TotalPages int           `json:"total_pages"`
}

func GetActors2(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	perPage, _ := strconv.Atoi(r.URL.Query().Get("per_page"))

	if page == 0 {
		page = 1
	}
	if perPage == 0 {
		perPage = 10
	}
	// Значения
	rows, err := DB.Query(`
	SELECT Actors.id, Names.Family, Names.Given, Nations.Name, Number, Honorar FROM Actors
	JOIN Names ON Actors.Nameid=Names.id
	JOIN Nations ON Actors.Nationid=Nations.id
	LIMIT $1 OFFSET $2
	`, perPage, perPage*page)
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

		fmt.Println("1 - ")
		fmt.Println(a.Id, a.Familyname, a.Givenname, a.Nation, a.Number, a.Honorar)

		actors = append(actors, a)
	}

	total := len(actors)
	totalPages := int(math.Ceil(float64(total) / float64(perPage)))

	// Проверка на выход за границы
	if page > totalPages {
		page = totalPages
	}
	// Вычисляем индексы для среза
	start := (page - 1) * perPage
	end := start + perPage
	if end > total {
		end = total
	}

	paginatedData := actors[start:end]

	response := PaginatedResponse{
		Data:       paginatedData,
		Total:      total,
		Page:       page,
		PerPage:    perPage,
		TotalPages: totalPages,
	}

	json.NewEncoder(w).Encode(response)
}
