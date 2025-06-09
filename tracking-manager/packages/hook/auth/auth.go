package auth

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"errors"
	"log/slog"
	"math/big"
	"os"
	"strings"
)

type JWTAuth struct {
	privateKey *ecdsa.PrivateKey
	publicKey  *ecdsa.PublicKey
}

func parseBase64Std(base64Key string) ([]byte, error) {
	missingPadding := len(base64Key) % 4
	if missingPadding > 0 {
		base64Key += strings.Repeat("=", 4-missingPadding)
	}
	return base64.StdEncoding.DecodeString(base64Key)
}

func parseBase64URL(base64Key string) ([]byte, error) {
	missingPadding := len(base64Key) % 4
	if missingPadding > 0 {
		base64Key += strings.Repeat("=", 4-missingPadding)
	}
	return base64.URLEncoding.DecodeString(base64Key)
}

func parseECDSAPrivateKeyBase64(base64Key string) (*ecdsa.PrivateKey, error) {
	privateKeyBytes, err := parseBase64Std(base64Key)
	if err != nil {
		return nil, errors.New("failed to decode base64 private key: " + err.Error())
	}

	block, _ := pem.Decode(privateKeyBytes)
	if block == nil || block.Type != "EC PRIVATE KEY" {
		return nil, errors.New("failed to parse PEM block containing the EC private key")
	}

	privateKey, err := x509.ParseECPrivateKey(block.Bytes)
	if err != nil {
		return nil, errors.New("failed to parse EC private key: " + err.Error())
	}
	return privateKey, nil
}

func parseECDSAPublicKeyFromXY(base64X, base64Y string) (*ecdsa.PublicKey, error) {
	xBytes, err := parseBase64URL(base64X)
	if err != nil {
		return nil, errors.New("failed to decode base64 X: " + err.Error())
	}

	yBytes, err := parseBase64URL(base64Y)
	if err != nil {
		return nil, errors.New("failed to decode base64 Y: " + err.Error())
	}

	x := new(big.Int).SetBytes(xBytes)
	y := new(big.Int).SetBytes(yBytes)

	curve := elliptic.P256()

	publicKey := &ecdsa.PublicKey{
		Curve: curve,
		X:     x,
		Y:     y,
	}

	return publicKey, nil
}

func NewJWTAuth() (*JWTAuth, error) {
	privateKeyBase64 := os.Getenv("MEDICARE_PRIVATE_KEY")
	if privateKeyBase64 == "" {
		return nil, errors.New("SPX_PRIVATE_KEY environment variable is missing")
	}

	privateKey, err := parseECDSAPrivateKeyBase64(privateKeyBase64)
	if err != nil {
		return nil, err
	}

	publicKeyXBase64 := os.Getenv("MEDICARE_PUBLIC_KEY_X")
	publicKeyYBase64 := os.Getenv("MEDICARE_PUBLIC_KEY_Y")
	if publicKeyXBase64 == "" || publicKeyYBase64 == "" {
		return nil, errors.New("MEDICARE_PUBLIC_KEY_X or MEDICARE_PUBLIC_KEY_Y environment variable is missing")
	}

	publicKey, err := parseECDSAPublicKeyFromXY(publicKeyXBase64, publicKeyYBase64)
	if err != nil {
		return nil, err
	}

	return &JWTAuth{
		privateKey: privateKey,
		publicKey:  publicKey,
	}, nil
}

func (j *JWTAuth) VerifyPublicKey(verifyToken string) bool {
	// Tách verify_token thành X và Y
	parts := strings.Split(verifyToken, ".")
	if len(parts) != 2 {
		slog.Error("Invalid verify_token format")
		return false
	}

	base64X := parts[0]
	base64Y := parts[1]

	clientPublicKey, err := parseECDSAPublicKeyFromXY(base64X, base64Y)
	if err != nil {
		slog.Error("Failed to parse client public key", "error", err)
		return false
	}

	if clientPublicKey.X.Cmp(j.publicKey.X) == 0 && clientPublicKey.Y.Cmp(j.publicKey.Y) == 0 {
		return true
	}
	return false
}
