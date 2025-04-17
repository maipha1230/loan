package database

import (
	"fmt"

	"example/loan/config"
	"example/loan/entity"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB *gorm.DB
	// err error
)

func ConnectDB() {
	dsn := getDBConnectionString()
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database: " + err.Error())
	}
	err = db.AutoMigrate(&entity.Customer{}, &entity.CustomerLoan{}, &entity.Payment{}, &entity.User{}, &entity.Loan{})
	if err != nil {
		panic("failed to migrate database: " + err.Error())
	}
	DB = db
}

func getDBConnectionString() string {
	config.LoadEnv()
	host := config.GetEnv("DB_HOST")
	user := config.GetEnv("DB_USER")
	password := config.GetEnv("DB_PASSWORD")
	dbname := config.GetEnv("DB_NAME")
	port := config.GetEnv("DB_PORT")
	timezone := config.GetEnv("DB_TIMEZONE")

	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=%s",
		host, user, password, dbname, port, timezone)
}
