from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Cargar variables del archivo .env
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.secret_key = os.getenv("SECRET_KEY", "clave_por_defecto")

# Configuración de la base de datos desde .env
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
    "port": int(os.getenv("DB_PORT", 3306))
}

@app.route("/")
def home():
    return "Servidor Flask funcionando"

@app.route("/registro", methods=["POST"])
def registro():
    data = request.get_json()
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        sql = """
        INSERT INTO Inversionistas
        (Nombre, Apellido, Email, Telefono, Pais_Residencia, Usuario, Password)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (
            data.get("nombre"),
            data.get("apellido"),
            data.get("email"),
            data.get("telefono"),
            data.get("pais"),
            data.get("usuario"),
            data.get("password"),
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Usuario registrado con éxito"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    usuario = data.get("usuario")
    password = data.get("password")
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Inversionistas WHERE Usuario=%s", (usuario,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        if user["Password"] == password:
            user_data = {
                "nombre": user["Nombre"],
                "apellido": user["Apellido"],
                "email": user["Email"],
                "telefono": user["Telefono"],
                "pais": user["Pais_Residencia"],
                "usuario": user["Usuario"]
            }
            return jsonify({"message": "Login exitoso", "usuario": user_data})
        else:
            return jsonify({"error": "Contraseña incorrecta"}), 401
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

@app.route("/editar_usuario", methods=["PUT"])
def editar_usuario():
    data = request.get_json()
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        sql = """
        UPDATE Inversionistas
        SET Nombre=%s, Apellido=%s, Email=%s, Telefono=%s, Pais_Residencia=%s
        WHERE Usuario=%s
        """
        cursor.execute(sql, (
            data.get("nombre"),
            data.get("apellido"),
            data.get("email"),
            data.get("telefono"),
            data.get("pais"),
            data.get("usuario")
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Datos actualizados correctamente"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

if __name__ == "__main__":
    app.run(port=int(os.getenv("PORT", 8080)), debug=True)
