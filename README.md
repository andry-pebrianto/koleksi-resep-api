<div align="center">
  <img src="./readme/logo.svg" />
</div>
<h3 align="center">Koleksi Resep API</h3>
<p align="center">
  <a href="https://github.com/andry-pebrianto/koleksi-resep-api/issues">Report Bug</a>
</p>

<!-- ABOUT THE PROJECT -->

## About The Project

This is a Restful API repository for Koleksi Resep. This Restful API is built using ExpressJS and PostgreSQL.

### Technology Used

- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Google Auth Library](https://www.npmjs.com/package/google-auth-library)
- [Mailtrap](https://mailtrap.io/)

## Getting Started

### Installation

- Clone this project with `git clone https://github.com/andry-pebrianto/koleksi-resep-api.git
- Install package required with `npm install`
- Setting .env

```bash
APP_NAME=
NODE_ENV=
PORT=
API_URL=
CLIENT_URL=
PGUSER=
PGHOST=
PGPASSWORD=
PGDATABASE=
PGPORT=
GOOGLE_CLIENT_ID=
ACCESS_TOKEN_KEY=
REFRESH_TOKEN_KEY=
MAILTRAP_TOKEN=
EMAIL_FROM=
RUSTFS_ENDPOINT=
RUSTFS_ACCESS_KEY=
RUSTFS_SECRET_KEY=
```

- Migrate database using `npm run migrate up`

### Executing program

- Run program with `npm run dev` for development and `npm run start` for production

<!-- RELATED PROJECT -->

## Related Project

- [Koleksi Resep Client](https://github.com/andry-pebrianto/koleksi-resep-client)
- [Koleksi Resep Demo](https://koleksiresep.andrypebrianto.com)

## Authors

Contributors names and contact info:

1. Andry Pebrianto

- [Linkedin](https://www.linkedin.com/in/andry-pebrianto)

## License

This project is licensed under the MIT License - see the LICENSE file for details
