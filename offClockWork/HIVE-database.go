package main

import (
	"database/sql"
	"encoding/json"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

const (
	dbUser             = "pi"
	dbPass             = "dpstelecom"
	dbName             = "hive"
	dbAddress          = "127.0.0.1"
	displayRowsPerPage = 6
)

type Database struct {
	db            *sql.DB
	open          bool
	connectString string
	lastID        int64
	lastIDValid   bool
}

type briefSummaryRow struct {
	Sid           int
	Uid           int
	Name          string
	Ctime         string
	Total_time    int
	Protocol      string
	R_improvement float64
	C_improvement float64
}

type fullSummaryRow struct {
	Sid             int
	Uid             int
	Name            string
	Ctime           string
	Total_time      int
	Protocol        string
	Total_cycles    int
	Detected_zones  int
	Lower_zones     int
	Upper_zones     int
	Estim_only      bool
	Leg             string
	Leg_position    string
	Upper_motor_avg int
	Lower_motor_avg int
	Upper_estim     int
	Lower_estim     int
	R_series        string
	Upper_r_series  string
	Lower_r_series  string
	R_improvement   float64
	C_series        string
	Upper_c_series  string
	Lower_c_series  string
	C_improvement   float64
	Settings        string
}

type userRow struct {
}

func NewDatabase() *Database {
	var db = Database{
		open:          false,
		connectString: "",
		lastIDValid:   false,
	}
	return &db
}
func (dbPTR *Database) openDB(user, pass, db, address string) error {
	var err error
	dbPTR.open = false
	dbPTR.connectString = fmt.Sprintf("%s:%s@tcp(%s)/%s", user, pass, address, db)
	dbPTR.db, err = sql.Open("mysql", dbPTR.connectString)
	if err != nil {
		return err
	}
	dbPTR.open = true
	return nil
}

func (dbPTR *Database) reconnectDB() error {
	var err error
	dbPTR.open = false
	dbPTR.db, err = sql.Open("mysql", dbPTR.connectString)
	if err != nil {
		return err
	}
	dbPTR.open = true
	return nil
}

func (dbPTR *Database) closeDB() {
	dbPTR.db.Close()
	dbPTR.open = false
}

func (dbPTR *Database) dbCheck() bool {
	if !dbPTR.open {
		var err error
		if dbPTR.connectString != "" {
			err = dbPTR.reconnectDB()
		} else {
			err = dbPTR.openDB(dbUser, dbPass, dbName, dbAddress)
		}

		if err != nil {
			return false
		}
	}
	return dbPTR.open
}
func (dbPTR *Database) search(name, date1, date2 string, page int) ([]briefSummaryRow, int) {
	var summaryRows []briefSummaryRow
	count := 0
	dbPTR.dbCheck()
	countQuery := "SELECT COUNT(*) FROM summary  WHERE name LIKE ? AND DATE(ctime) BETWEEN DATE(?) AND DATE(?)"
	err := dbPTR.db.QueryRow(countQuery, fmt.Sprintf("%%%v%%", name), date1, date2).Scan(&count)
	if err != nil {
		LogMessage(sqlError, "HIGH", err, countQuery)
		return summaryRows, count
	}
	query := `SELECT sid, uid, name, ctime, total_time, protocol, r_improvement, c_improvement 
			  FROM summary 
			  WHERE name LIKE ? AND DATE(ctime) BETWEEN DATE(?) AND DATE(?)
			  ORDER BY ctime DESC
			  LIMIT ?, ?`
	results, err := dbPTR.db.Query(query, fmt.Sprintf("%%%v%%", name), date1, date2, page*displayRowsPerPage, displayRowsPerPage)
	if err != nil {
		LogMessage(sqlError, "HIGH", err, query)
		return summaryRows, count
	}

	for results.Next() {
		var summary briefSummaryRow
		err = results.Scan(&summary.Sid, &summary.Uid, &summary.Name, &summary.Ctime, &summary.Total_time, &summary.Protocol, &summary.R_improvement, &summary.C_improvement)
		if err != nil {
			LogMessage(sqlError, "HIGH", err, query)
			return summaryRows, count
		}
		summaryRows = append(summaryRows, summary)
	}
	return summaryRows, count
}

func (dbPTR *Database) getBriefSummary(page int) ([]briefSummaryRow, int) {
	var summaryRows []briefSummaryRow
	count := 0
	dbPTR.dbCheck()
	countQuery := "SELECT COUNT(*) FROM summary"
	err := dbPTR.db.QueryRow(countQuery).Scan(&count)
	if err != nil {
		LogMessage(sqlError, "HIGH", err, countQuery)
		return summaryRows, count
	}
	query := `SELECT sid, uid, name, ctime, total_time, protocol, r_improvement, c_improvement 
			  FROM summary
			  ORDER BY sid ASC
			  LIMIT ?, ?`
	results, err := dbPTR.db.Query(query, page*displayRowsPerPage, displayRowsPerPage)
	if err != nil {
		LogMessage(sqlError, "HIGH", err, query)
		return summaryRows, count
	}

	for results.Next() {
		var summary briefSummaryRow
		err = results.Scan(&summary.Sid, &summary.Uid, &summary.Name, &summary.Ctime, &summary.Total_time, &summary.Protocol, &summary.R_improvement, &summary.C_improvement)
		if err != nil {
			LogMessage(sqlError, "HIGH", err, query)
			return summaryRows, count
		}
		summaryRows = append(summaryRows, summary)
	}
	return summaryRows, count
}

func (dbPTR *Database) getFullSummary(sid int) fullSummaryRow {
	var summaryRow fullSummaryRow
	dbPTR.dbCheck()
	query := "SELECT * FROM summary WHERE sid=?"
	err := dbPTR.db.QueryRow(query, sid).Scan(
		&summaryRow.Sid,
		&summaryRow.Uid,
		&summaryRow.Name,
		&summaryRow.Ctime,
		&summaryRow.Total_time,
		&summaryRow.Protocol,
		&summaryRow.Total_cycles,
		&summaryRow.Detected_zones,
		&summaryRow.Lower_zones,
		&summaryRow.Upper_zones,
		&summaryRow.Estim_only,
		&summaryRow.Leg,
		&summaryRow.Leg_position,
		&summaryRow.Upper_motor_avg,
		&summaryRow.Lower_motor_avg,
		&summaryRow.Upper_estim,
		&summaryRow.Lower_estim,
		&summaryRow.R_series,
		&summaryRow.Upper_r_series,
		&summaryRow.Lower_r_series,
		&summaryRow.R_improvement,
		&summaryRow.C_series,
		&summaryRow.Upper_c_series,
		&summaryRow.Lower_c_series,
		&summaryRow.C_improvement,
		&summaryRow.Settings,
	)
	if err != nil {
		LogMessage(sqlError, "HIGH", err, query)
		return summaryRow
	}
	return summaryRow
}

func (dbPTR *Database) deleteSummary(sid int) bool {
	dbPTR.dbCheck()
	query := "DELETE FROM summary WHERE sid=?"
	_, err := dbPTR.db.Exec(query, sid)
	if err != nil {
		LogMessage(sqlError, "HIGH", err, query)
		return false
	}
	return true
}

func (dbPTR *Database) saveSummary(userName, jsonData string) {
	type rawSummaryData struct {
		Total_time      int
		Protocol        string
		Total_cycles    int
		Detected_zones  int
		Lower_zones     int
		Upper_zones     int
		Estim_only      bool
		Leg             string
		Leg_position    string
		Upper_motor_avg int
		Lower_motor_avg int
		Upper_estim     int
		Lower_estim     int
		R_series        []float64
		Upper_r_series  []float64
		Lower_r_series  []float64
		R_improvement   float64
		C_series        []float64
		Upper_c_series  []float64
		Lower_c_series  []float64
		C_improvement   float64
		Settings        string
	}
	var raw rawSummaryData
	dbPTR.dbCheck()
	err := json.Unmarshal([]byte(jsonData), &raw)
	if err != nil {
		LogMessage(jsonError, "HIGH", err, jsonData)
		return
	}
	var rSeries, upperRSeries, lowerRSeries, cSeries, upperCSeries, lowerCSeries []byte
	rSeries, err = json.Marshal(raw.R_series)
	upperRSeries, err = json.Marshal(raw.Upper_r_series)
	lowerRSeries, err = json.Marshal(raw.Lower_r_series)
	cSeries, err = json.Marshal(raw.C_series)
	upperCSeries, err = json.Marshal(raw.Upper_c_series)
	lowerCSeries, err = json.Marshal(raw.Lower_c_series)
	query := `INSERT INTO summary(name, total_time, protocol, total_cycles, detected_zones, lower_zones, upper_zones, estim_only, leg, leg_position, upper_motor_avg, lower_motor_avg,
								  lower_estim, upper_estim, r_series, upper_r_series, lower_r_series, r_improvement, c_series, upper_c_series, lower_c_series, c_improvement, settings) 
								  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	insert, err := dbPTR.db.Exec(query,
		userName,
		raw.Total_time,
		raw.Protocol,
		raw.Total_cycles,
		raw.Detected_zones,
		raw.Lower_zones,
		raw.Upper_zones,
		raw.Estim_only,
		raw.Leg,
		raw.Leg_position,
		raw.Upper_motor_avg,
		raw.Lower_motor_avg,
		raw.Lower_estim,
		raw.Upper_estim,
		string(rSeries),
		string(upperRSeries),
		string(lowerRSeries),
		raw.R_improvement,
		string(cSeries),
		string(upperCSeries),
		string(lowerCSeries),
		raw.C_improvement,
		raw.Settings,
	)
	if err != nil {
		LogMessage(sqlError, "HIGH", err, query)
		return
	}
	dbPTR.lastID, err = insert.LastInsertId()
	if err != nil {
		dbPTR.lastIDValid = false
		return
	}
	dbPTR.lastIDValid = true
}

func (dbPTR *Database) updateUserLog(name string) {
	dbPTR.dbCheck()
	if dbPTR.lastIDValid {
		query := "UPDATE summary SET name = ? WHERE sid = ?"
		_, err := dbPTR.db.Exec(query, name, dbPTR.lastID)
		if err != nil {
			LogMessage(sqlError, "HIGH", err, query)
		}
	}
}

func (dbPTR *Database) saveUser(jsonData string) {
	type UserData struct {
		Name    string
		Sex     string
		Age     int
		Weight  int
		Height  int
		History string
		Misc    string
	}
	var user UserData
	dbPTR.dbCheck()
	err := json.Unmarshal([]byte(jsonData), &user)
	if err != nil {
		return
	}
	query := "INSERT INTO users(name, sex, age, weight, height) VALUES(?, ?, ?, ?, ?)"
	insert, err := dbPTR.db.Query(query, user.Name, user.Sex, user.Age, user.Weight, user.Height)
	if err != nil {
		LogMessage(sqlError, "HIGH", err, query)
		return
	}
	defer insert.Close()
}
