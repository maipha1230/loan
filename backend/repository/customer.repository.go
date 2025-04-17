package repository

import (
	"example/loan/database"
	"example/loan/entity"
)

func CreateCustomer(customer *entity.Customer) (*entity.Customer, error) {
	if err := database.DB.Create(customer).Error; err != nil {
		return nil, err
	}
	return customer, nil
}

func FindCustomers() ([]entity.Customer, error) {
	customers := []entity.Customer{}
	err := database.DB.Order("created_at ASC").Find(&customers).Error
	return customers, err
}

func UpdateCustomer(customer *entity.Customer) error {
	return database.DB.Save(customer).Error
}

func DeleteCustomer(customer *entity.Customer) error {
	return database.DB.Delete(customer).Error
}

func FindCustomerById(CustomerID uint) (*entity.Customer, error) {
	customer := entity.Customer{}
	result := database.DB.Where("id = ? ", CustomerID).First(&customer)
	if result.Error != nil {
		return nil, result.Error
	}
	return &customer, nil
}

func FindCustomerByPhone(phone string) (*entity.Customer, error) {
	customer := entity.Customer{}
	result := database.DB.Where("phone = ? ", phone).First(&customer)
	if result.Error != nil {
		return nil, result.Error
	}
	return &customer, nil
}

func FindCustomerByEmail(email string) (*entity.Customer, error) {
	customer := entity.Customer{}
	result := database.DB.Where("email = ? ", email).First(&customer)
	if result.Error != nil {
		return nil, result.Error
	}
	return &customer, nil
}
