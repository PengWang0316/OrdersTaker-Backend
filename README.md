# Orders Taker Back-end

The back-end code for OrdersTaker.

[![Build Status](https://travis-ci.org/PengWang0316/OrdersTaker-Backend.svg?branch=master)](https://travis-ci.org/PengWang0316/OrdersTaker-Backend)  [![Coverage Status](https://coveralls.io/repos/github/PengWang0316/OrdersTaker-Backend/badge.svg?branch=master)](https://coveralls.io/github/PengWang0316/OrdersTaker-Backend?branch=master)  [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

### Simple file structure explanation

- src (source code)
  - routers (all router file in this folder)
    - functions (each router in an individual file)
    - FacebookAuthRouters.js (Integrating all Facebook login code)
    - GoogleAuthRouters.js (Integrating all Google login code)
    - UsernamePasswordRouters.js (Integrating user name and password login code)
    - NormalRouters.js (all other router is intergrated here)
  - utils (some utilities code)
  - App.js (the entry file)
  - MongoDB.js (all database related code)

### Front end repository
[Order Taker Front-end](https://github.com/PengWang0316/OrdersTaker)

### Test :tada: :tada:
Test code is under the __tests__ folder
Jest is using as the test framework
