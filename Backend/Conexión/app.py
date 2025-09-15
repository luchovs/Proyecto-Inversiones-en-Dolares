from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuración de conexión a MySQL con puerto
db_config = {
    "host": "10.9.120.5",
    "user": "fa",
    "password": "fa1234",
    "database": "FA15",
    "port": 3306
}

@app.route("/")
def home():
    return "Servidor Flask funcionando"

@app.route("/registro", methods=["POST"])
def registro():
    data = request.get_json()

    nombre   = data.get("nombre")
    apellido = data.get("apellido")
    email    = data.get("email")
    telefono = data.get("telefono")
    pais     = data.get("pais")
    password = data.get("password")

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        sql = """
        INSERT INTO Inversionistas
        (Nombre, Apellido, Email, Telefono, Pais_Residencia)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (nombre, apellido, email, telefono, pais))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Usuario registrado con éxito"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    
@app.route("/inversionistas", methods=["GET"])
def obtener_inversionistas():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Inversionistas")
        resultados = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(resultados)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500 

if __name__ == "__main__":
    app.run(port=8080, debug=True)