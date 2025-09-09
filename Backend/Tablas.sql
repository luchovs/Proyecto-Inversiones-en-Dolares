-- ==============================
-- TABLA: Inversionistas
-- ==============================
CREATE TABLE Inversionistas (
    Id_Inversionista INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Telefono VARCHAR(20),
    Pais_Residencia VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- ==============================
-- TABLA: Tipos_Inversion
-- ==============================
CREATE TABLE Tipos_Inversion (
    Id_Tipo INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Tipo VARCHAR(50) NOT NULL,
    Descripcion TEXT,
    Riesgo VARCHAR(20) -- Bajo, Medio y Alto'
) ENGINE=InnoDB;

-- ==============================
-- TABLA: Inversiones
-- ==============================
CREATE TABLE Inversiones (
    Id_Inversiones INT AUTO_INCREMENT PRIMARY KEY,
    Id_Inversionista INT NOT NULL,
    Id_Tipo INT NOT NULL,
    Monto_Inicial DECIMAL(12,2) NOT NULL,
    Fecha_Inicio DATE NOT NULL,
    Fecha_Fin DATE,
    Estado VARCHAR(20) NOT NULL, -- Activa, Finalizada y Cancelada
    FOREIGN KEY (Id_Inversionista) REFERENCES Inversionistas(Id_Inversionista),
    FOREIGN KEY (Id_Tipo) REFERENCES Tipos_Inversion(Id_Tipo)
) ENGINE=InnoDB;

-- ==============================
-- TABLA: Transacciones
-- ==============================
CREATE TABLE Transacciones (
    Id_Transaccion INT AUTO_INCREMENT PRIMARY KEY,
    Id_Inversion INT NOT NULL,
    Fecha DATE NOT NULL,
    Tipo_Movimiento VARCHAR(30) NOT NULL, -- Deposito, Retiro, Ganancia y Comision
    Monto DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (Id_Inversion) REFERENCES Inversiones(Id_Inversiones)
) ENGINE=InnoDB;

-- ==============================
-- TABLA: Moneda
-- ==============================
CREATE TABLE Moneda (
    Id_Moneda INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Simbolo VARCHAR(10) NOT NULL,
    Tasa_Cambio_USD DECIMAL(12,4) NOT NULL
) ENGINE=InnoDB;

-- ==============================
-- TABLA: Historial_Rendimiento
-- ==============================
CREATE TABLE Historial_Rendimiento (
    Id_Rendimiento INT AUTO_INCREMENT PRIMARY KEY,
    Id_Inversion INT NOT NULL,
    Fecha DATE NOT NULL,
    Valor_Actual DECIMAL(12,2) NOT NULL,
    Rentabilidad DECIMAL(5,2) NOT NULL, -- Porcentaje de ganancia/perdida
    FOREIGN KEY (Id_Inversion) REFERENCES Inversiones(Id_Inversiones)
) ENGINE=InnoDB;
