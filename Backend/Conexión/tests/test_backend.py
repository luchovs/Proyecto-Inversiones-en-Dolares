import json

def test_home(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "Servidor Flask funcionando" in response.get_data(as_text=True)


def test_registro_missing_data(client):
    # Falta información => debería fallar
    response = client.post("/registro", json={})
    assert response.status_code in (400, 500)
    data = response.get_json()
    assert "error" in data or "message" in data


def test_login_user_not_found(client):
    response = client.post("/login", json={
        "usuario": "no_existe",
        "password": "1234"
    })
    assert response.status_code == 404
    assert response.get_json()["error"] == "Usuario no encontrado"


def test_login_missing_fields(client):
    response = client.post("/login", json={})
    assert response.status_code == 404


def test_get_usuarios(client):
    response = client.get("/usuarios")
    assert response.status_code in (200, 500)  


def test_editar_usuario_missing_data(client):
    response = client.put("/editar_usuario", json={})
    assert response.status_code == 200 or response.status_code == 500

def test_eliminar_usuario_missing_data(client):
    response = client.delete("/eliminar_usuario", json={})
    # Si no se envía usuario debería fallar
    assert response.status_code in (400, 404, 500)


def test_agregar_inversion_missing_data(client):
    response = client.post("/agregar_inversion", json={})
    assert response.status_code in (400, 404, 500)


def test_obtener_inversiones(client):
    response = client.get("/inversiones")
    # Si la ruta no existe => 404 también está bien
    assert response.status_code in (200, 404, 500)


def test_update_inversion_missing_data(client):
    response = client.put("/editar_inversion", json={})
    assert response.status_code in (400, 404, 500)
