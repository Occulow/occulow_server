# Occulow Server
This is a django server with two apps: api and occulow. The api app is responsible for all api endpoints ('/v1/...'), and the occulow app is responsible for serving the front-end.

## Dev setup

### Backend

The backend is Python 3.5 running Django 1.10.2. Running `pip install -r requirements.txt` will install the necessary python packages. The dev server is started with the command `python manage.py runserver`, and defaults to `localhost:8000`.

### Frontend

The frontend is built using React, so there's a bit more tooling required to make changes. Ensure that [npm](https://www.npmjs.com/get-npm) is installed, and run `npm install` while inside the `occulow` app directory. This should install all of the dev and production dependencies.

Once packages are installed, there are two npm scripts used to build the react code: `npm run build` and `npm run watch`. `npm run build` will build all `.jsx` files inside the `/static/js/src/` directory, and bundle them together into `/static/js/dist/bundle.js`. `npm run watch` will watch the source directory and run the build process every time a file is saved.

## Prod setup

### Circus
[Circus](https://circus.readthedocs.io/en/latest/) is used to manage the mqtt worker process.