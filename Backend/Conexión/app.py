from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta # 🌟 NUEVA IMPORTACIÓN

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.secret_key = "clave_super_secreta"

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

# 🔹 Registro normal (usuarios o admins)
@app.route("/registro", methods=["POST"])
def registro():
    data = request.get_json()
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        sql = """
        INSERT INTO Inversionistas
        (Nombre, Apellido, Email, Telefono, Pais_Residencia, Usuario, Password, Rol)
        VALUES (%s, %s, %s, %s, %s, %s, %s, 'usuario')
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
        return jsonify({"error": str(err)}), 400


# 🔹 Login: devuelve Id_Inversionista y rol
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
            return jsonify({"error": "Usuario no encontrado"}), 400
        if user["Password"] == password:
            user_data = {
                "id_inversionista": user["Id_Inversionista"], 
                "nombre": user["Nombre"],
                "apellido": user["Apellido"],
                "email": user["Email"],
                "telefono": user["Telefono"],
                "pais": user["Pais_Residencia"],
                "usuario": user["Usuario"],
                "rol": user.get("Rol", "usuario")
            }
            return jsonify({"message": "Login exitoso", "usuario": user_data})
        else:
            return jsonify({"error": "Contraseña incorrecta"}), 401
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 404

# ----------------------------------------------------
# 🌟 ENDPOINT ACTUALIZADO PARA CALCULAR FECHA_FIN EN PYTHON 🌟
# ----------------------------------------------------
@app.route("/registrar_inversion", methods=["POST"])
def registrar_inversion():
    data = request.get_json()
    
    # 🌟 Lógica de Cálculo de Fecha en el Backend 🌟
    fecha_inicio_str = data.get("fecha_inicio")
    dias = data.get("dias") # El frontend envía el número de días aquí
    
    try:
        # Convertir la fecha de inicio de string a objeto date
        fecha_inicio_dt = datetime.strptime(fecha_inicio_str, '%Y-%m-%d').date()
        
        # Calcular la fecha de finalización
        if dias is not None and dias > 0:
            fecha_fin_dt = fecha_inicio_dt + timedelta(days=dias)
            fecha_fin_sql = fecha_fin_dt.strftime('%Y-%m-%d')
        else:
            fecha_fin_sql = None # Si no hay días, se mantiene nulo
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        sql = """
        INSERT INTO Inversiones
        (Id_Inversionista, Id_Tipo, Monto_Inicial, Fecha_Inicio, Fecha_Fin, Estado)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (
            data.get("id_inversionista"),
            data.get("id_tipo"),
            data.get("monto_inicial"),
            fecha_inicio_str,  # Usamos la fecha de inicio enviada
            fecha_fin_sql,     # 🔑 FECHA DE FIN CALCULADA EN PYTHON
            data.get("estado"),
        ))
        conn.commit()
        cursor.close()
        conn.close()
        # Devolvemos la fecha final calculada para el frontend
        return jsonify({"message": "Inversión registrada con éxito", "fecha_fin": fecha_fin_sql}), 201
    
    except ValueError as ve:
        return jsonify({"error": "Formato de fecha o días inválido: " + str(ve)}), 400
    except mysql.connector.Error as err:
        print(f"Error de MySQL: {err}")
        return jsonify({"error": str(err)}), 400


# 🔹 Nuevo endpoint solo para admins
@app.route("/usuarios", methods=["GET"])
def obtener_inversionistas():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT Id_Inversionista, Nombre, Apellido, Email, Telefono, Pais_Residencia, Usuario, Rol FROM Inversionistas")
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
        return jsonify({"error": str(err)}), 200
    
# 🔹 Actualizar usuario por ID (solo para admin)
@app.route("/usuarios/<int:id>", methods=["PUT"])
def actualizar_usuario(id):
    data = request.get_json()
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        sql = """
        UPDATE Inversionistas
        SET Nombre=%s, Apellido=%s, Email=%s, Telefono=%s, Pais_Residencia=%s, Usuario=%s, Rol=%s
        WHERE Id_Inversionista=%s
        """
        cursor.execute(sql, (
            data.get("Nombre"),
            data.get("Apellido"),
            data.get("Email"),
            data.get("Telefono"),
            data.get("Pais_Residencia"),
            data.get("Usuario"),
            data.get("Rol"),
            id
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Usuario actualizado correctamente"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400


# 🔹 Eliminar usuario (solo para admin)
@app.route("/usuarios/<int:id>", methods=["DELETE"])
def eliminar_usuario(id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Inversionistas WHERE Id_Inversionista = %s", (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Usuario eliminado correctamente"})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400


if __name__ == "__main__":
    app.run(port=8080, debug=True)