-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: GestionEnMovilidad_BD
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Encuentros`
--

DROP TABLE IF EXISTS `Encuentros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Encuentros` (
  `IdInteraccion` int NOT NULL AUTO_INCREMENT,
  `IdPersona` int NOT NULL,
  `IdEntrevistador` int NOT NULL,
  `IdPunto` int NOT NULL,
  `Observaciones` varchar(2000) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`IdInteraccion`),
  KEY `IdPersona` (`IdPersona`),
  KEY `IdEntrevistador` (`IdEntrevistador`),
  KEY `IdPunto` (`IdPunto`),
  CONSTRAINT `Encuentros_ibfk_1` FOREIGN KEY (`IdPersona`) REFERENCES `PersonaEnMovilidad` (`idPersona`),
  CONSTRAINT `Encuentros_ibfk_2` FOREIGN KEY (`IdEntrevistador`) REFERENCES `Entrevistadores` (`idEntrevistador`),
  CONSTRAINT `Encuentros_ibfk_3` FOREIGN KEY (`IdPunto`) REFERENCES `PuntoGeografico` (`idPunto`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Entrevistadores`
--

DROP TABLE IF EXISTS `Entrevistadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Entrevistadores` (
  `idEntrevistador` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `organizacion` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `rol` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idEntrevistador`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Notificaciones`
--

DROP TABLE IF EXISTS `Notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notificaciones` (
  `idNotificacion` int NOT NULL AUTO_INCREMENT,
  `idEntrevistador` int NOT NULL,
  `titulo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensaje` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `leida` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idNotificacion`),
  KEY `idx_fecha_creacion` (`fecha_creacion` DESC),
  KEY `idx_leida` (`leida`),
  KEY `idx_tipo` (`tipo`),
  KEY `idEntrevistador` (`idEntrevistador`),
  CONSTRAINT `Notificaciones_ibfk_1` FOREIGN KEY (`idEntrevistador`) REFERENCES `Entrevistadores` (`idEntrevistador`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PersonaEnMovilidad`
--

DROP TABLE IF EXISTS `PersonaEnMovilidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PersonaEnMovilidad` (
  `idPersona` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `PrimerApellido` varchar(100) NOT NULL,
  `SegundoApellido` varchar(100) DEFAULT NULL,
  `Estado` varchar(100) DEFAULT NULL,
  `Imagen` longtext,
  `MensajeFamiliares` text,
  `Necesidades` text,
  `DescripcionFisica` text,
  `TrabajadorHogar` varchar(10) DEFAULT NULL,
  `TrabajadorCampo` varchar(10) DEFAULT NULL,
  `SituacionCalle` varchar(50) DEFAULT NULL,
  `LocalidadOrigen` varchar(100) DEFAULT NULL,
  `PaisDestino` varchar(100) DEFAULT NULL,
  `EstadoDestino` varchar(100) DEFAULT NULL,
  `LocalidadDestino` varchar(100) DEFAULT NULL,
  `PuntoEntradaMex` varchar(100) DEFAULT NULL,
  `PuntoEntradaUSA` varchar(100) DEFAULT NULL,
  `Nacionalidad` varchar(100) DEFAULT NULL,
  `FechaNacimiento` date DEFAULT NULL,
  `EstadoCivil` varchar(50) DEFAULT NULL,
  `ViajaConIdentificacion` varchar(10) DEFAULT NULL,
  `Identificacion` varchar(100) DEFAULT NULL,
  `UltimoDomicilio` text,
  `IdiomaMaterno` varchar(100) DEFAULT NULL,
  `HablaEspanol` varchar(10) DEFAULT NULL,
  `OtrosIdiomas` varchar(10) DEFAULT NULL,
  `OtrosIdiomasCual` varchar(100) DEFAULT NULL,
  `Profesion` varchar(100) DEFAULT NULL,
  `EdadMigracion` int DEFAULT NULL,
  `AnoComienzoMigracion` varchar(10) DEFAULT NULL,
  `Motivo` text,
  `NumeroMigraciones` int DEFAULT NULL,
  `RelatoDesaparicion` text,
  `PaisPerdidaContacto` varchar(100) DEFAULT NULL,
  `EstadoPerdidaContacto` varchar(100) DEFAULT NULL,
  `LocalidadPerdidaContacto` varchar(100) DEFAULT NULL,
  `FechaUltimaComunicacion` date DEFAULT NULL,
  `ConfirmacionEntradaPunto` varchar(10) DEFAULT NULL,
  `Sexo` varchar(50) DEFAULT NULL,
  `Genero` varchar(50) DEFAULT NULL,
  `OtroSexoLibre` varchar(100) DEFAULT NULL,
  `HayDenuncia` varchar(10) DEFAULT NULL,
  `HayDenunciaCual` text,
  `HayReporte` varchar(10) DEFAULT NULL,
  `HayReporteCual` text,
  `AvancesDenuncia` varchar(10) DEFAULT NULL,
  `AvancesDenunciaCual` text,
  `LugaresBusqueda` text,
  `NombreQuienBusca` varchar(100) DEFAULT NULL,
  `ApellidoPaternoQuienBusca` varchar(100) DEFAULT NULL,
  `ApellidoMaternoQuienBusca` varchar(100) DEFAULT NULL,
  `ParentescoQuienBusca` varchar(50) DEFAULT NULL,
  `DireccionQuienBusca` text,
  `TelefonoQuienBusca` varchar(50) DEFAULT NULL,
  `CorreoElectronicoQuienBusca` varchar(100) DEFAULT NULL,
  `MensajeQuienBusca` text,
  `InformacionUsadaPara` text,
  `InformacionPublica` varchar(10) DEFAULT NULL,
  `Institucion` varchar(100) DEFAULT NULL,
  `Cargo` varchar(100) DEFAULT NULL,
  `PersonaUltimaComunicacion` varchar(100) DEFAULT NULL,
  `DeportadaAnteriormente` varchar(10) DEFAULT NULL,
  `PaisDeportacion` varchar(100) DEFAULT NULL,
  `FechaUltimaDeportacion` date DEFAULT NULL,
  `Encarcelado` varchar(10) DEFAULT NULL,
  `UbicacionCarcel` text,
  `FechaDetencion` date DEFAULT NULL,
  `IdentificacionDetencionEEUU` varchar(100) DEFAULT NULL,
  `PapelesFalsos` varchar(10) DEFAULT NULL,
  `PapelesFalsosCual` varchar(100) DEFAULT NULL,
  `AcompañantesViaje` text,
  `ConocidosEnExtranjero` text,
  `Estatura` float DEFAULT NULL,
  `Peso` float DEFAULT NULL,
  `Complexion` varchar(50) DEFAULT NULL,
  `ColorPiel` varchar(50) DEFAULT NULL,
  `VelloFacial` varchar(50) DEFAULT NULL,
  `VelloFacialCual` varchar(100) DEFAULT NULL,
  `Lentes` varchar(10) DEFAULT NULL,
  `Cabello` varchar(50) DEFAULT NULL,
  `Embarazada` varchar(10) DEFAULT NULL,
  `MesesEmbarazo` int DEFAULT NULL,
  `NumeroCelular` varchar(50) DEFAULT NULL,
  `SeñalesParticulares` text,
  `Lesiones` text,
  `TipoDientes` varchar(100) DEFAULT NULL,
  `EstadoSalud` text,
  `DescripcionPrendas` text,
  `RedesSociales` text,
  `Situacion` varchar(100) DEFAULT NULL,
  `idEntrevistador` int DEFAULT NULL,
  `idGrupo` int DEFAULT NULL,
  PRIMARY KEY (`idPersona`),
  UNIQUE KEY `idPersona` (`idPersona`),
  KEY `fk_entrevistador` (`idEntrevistador`),
  KEY `fk_persona_grupo` (`idGrupo`),
  CONSTRAINT `fk_entrevistador` FOREIGN KEY (`idEntrevistador`) REFERENCES `Entrevistadores` (`idEntrevistador`),
  CONSTRAINT `fk_persona_grupo` FOREIGN KEY (`idGrupo`) REFERENCES `grupos` (`idGrupo`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PuntoGeografico`
--

DROP TABLE IF EXISTS `PuntoGeografico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PuntoGeografico` (
  `idPunto` int NOT NULL AUTO_INCREMENT,
  `latitud` decimal(10,8) NOT NULL,
  `longitud` decimal(10,8) DEFAULT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`idPunto`)
) ENGINE=InnoDB AUTO_INCREMENT=1367195 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `entidades`
--

DROP TABLE IF EXISTS `entidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entidades` (
  `idNacionalidad` int DEFAULT NULL,
  `idEntidad` int NOT NULL,
  `entidad` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grupos`
--

DROP TABLE IF EXISTS `grupos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupos` (
  `idGrupo` int NOT NULL AUTO_INCREMENT,
  `NombreGrupo` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FechaCreacion` date NOT NULL,
  `NombreEncargado` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `LugarCreacion` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  UNIQUE KEY `idx_grupos_idGrupo` (`idGrupo`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `municipios`
--

DROP TABLE IF EXISTS `municipios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `municipios` (
  `idNacionalidad` int DEFAULT NULL,
  `idEntidad` int DEFAULT NULL,
  `idMunicipio` int NOT NULL,
  `municipio` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `naciones`
--

DROP TABLE IF EXISTS `naciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `naciones` (
  `idNacionalidad` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`idNacionalidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-05 14:47:31
