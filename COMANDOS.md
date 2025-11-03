# Proyecto-Inversiones-en-Dolares - Comandos

Backend:

python -m venv venv
source venv/bin/activate
pip install flask flask-cors mysql-connector-python
pip install python-dotenv
python app.py

Frontend:

npm install
npm run dev

# IP

10.9.120.5:8080

# Test Diseño de Software

Comandos:

pip install Flask pytest pytest-cov
pip install requests faker

pytest-cov: para generar reportes de cobertura.
faker: para generar datos de prueba.
requests: útil para pruebas integradas con servidores reales.

# Test Frontend

npm install --save-dev jest babel-jest @babel/preset-env @babel/preset-react

npm install --save-dev jsdom

npm install --save-dev @testing-library/react @testing-library/jest-dom

npm install --save-dev ts-jest @types/jest

npm run test

npm run test:watch

npm run test:coverage
