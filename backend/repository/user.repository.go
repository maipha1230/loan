package repository

import (
	"example/loan/database"
	"example/loan/entity"
)

func UserRegister(user *entity.User) (*entity.User, error) {
	if err := database.DB.Create(user).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func UserFindByUsername(username string) (*entity.User, error) {
	user := entity.User{}
	result := database.DB.Where("username = ? ", username).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}
