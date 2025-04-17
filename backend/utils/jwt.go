package utils

import (
	"example/loan/config"

	"github.com/golang-jwt/jwt/v4"
)

func GenerateJWT(data map[string]any) (string, error) {
	config.LoadEnv()
	claims := jwt.MapClaims(data)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.GetEnv("JWT_SECRET")))
}

func ValidateJWT(tokenString string) (*jwt.Token, error) {
	config.LoadEnv()
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.NewValidationError("unexpected signing method", jwt.ValidationErrorSignatureInvalid)
		}
		return []byte(config.GetEnv("JWT_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	if _, ok := token.Claims.(jwt.MapClaims); !ok || !token.Valid {
		return nil, jwt.NewValidationError("invalid token", jwt.ValidationErrorSignatureInvalid)
	}

	return token, nil
}
