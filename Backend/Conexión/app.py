from flask import Flask, request, jsonify, session
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.secret_key = "clave_super_secreta"  # para sesiones

# Configuración de conexión a MySQL
db_config = {
    "host": "10.9.120.5",
    "user": "fa",
    "password": "fa1234",
    "database": "FA15",
    "port": 3306
}

# ---------- Home ----------
@app.route("/")
def home():
    return "Servidor Flask funcionando"

# ---------- Registro de usuarios ----------
@app.route("/registro", methods=["POST"])
def registro():
    data = request.get_json()

    nombre   = data.get("nombre")
    apellido = data.get("apellido")
    email    = data.get("email")
    telefono = data.get("telefono")
    pais     = data.get("pais")
    usuario  = data.get("usuario")
    password = data.get("password")
    admin    = 0  # Por defecto usuario normal

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        sql = """
        INSERT INTO Inversionistas
        (Nombre, Apellido, Email, Telefono, Pais_Residencia, Usuario, Password, Admin)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (nombre, apellido, email, telefono, pais, usuario, password, admin))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Usuario registrado con éxito"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# ---------- Login ----------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    usuario = data.get("usuario")   # <--- cambiamos email por usuario
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
            if user.get("Admin") == 1:
                session["admin"] = True
                return jsonify({"message": "Login de administrador correcto"})
            else:
                return jsonify({"message": "Login exitoso"})  # <--- usuario normal también puede iniciar sesión
        else:
            return jsonify({"error": "Contraseña incorrecta"}), 401

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# ---------- Obtener todos los usuarios (solo admin) ----------
@app.route("/admin/usuarios", methods=["GET"])
def ver_usuarios():
    if not session.get("admin"):
        return jsonify({"error": "No autorizado"}), 403

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT Id_Inversionista, Nombre, Apellido, Email, Telefono, Pais_Residencia, Usuario FROM Inversionistas")
        usuarios = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(usuarios)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# ---------- Obtener todos los inversionistas ----------
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
