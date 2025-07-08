## Description

An Url Shortener Service

## Prerequisites

- An RS256 Private and Public key for JWT Auth
```bash

# Generate Private Key and place to backend folder
openssl genpkey -algorithm RSA -out ./backend/jwt-private.key -pkeyopt rsa_keygen_bits:2048

# Extract Publick Key and place to backend folder
openssl rsa -pubout -in ./backend/jwt-private.key -out ./backend/jwt-public.key
```

## Project setup

### Backend
[See Backend Readme](./backend/README.md)

### Frontend
[See Frontend Readme](./frontend/README.md)