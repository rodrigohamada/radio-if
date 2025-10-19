-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: radio_if
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `contatos`
--

DROP TABLE IF EXISTS `contatos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contatos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `nome` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assunto` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_assunto` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensagem` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_envio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `contatos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contatos`
--

LOCK TABLES `contatos` WRITE;
/*!40000 ALTER TABLE `contatos` DISABLE KEYS */;
INSERT INTO `contatos` VALUES (1,1,'Rodrigo','rodrigohamada@hotmail.com.br','Pedidos de m├║sicas','Pedidos de m├║sicas','Alok','2025-10-14 00:56:27'),(2,1,'Rodrigo','rodrigohamada@hotmail.com.br','Feedback','Outros','A r├ídio ├⌐ muito boa!','2025-10-14 02:09:29'),(3,4,'Andressa','andressanmoura09@gmail.com','Pedidos de m├║sicas','Pedidos de m├║sicas','Taylor Swift','2025-10-18 15:53:31');
/*!40000 ALTER TABLE `contatos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipe`
--

DROP TABLE IF EXISTS `equipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `funcao` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipe`
--

LOCK TABLES `equipe` WRITE;
/*!40000 ALTER TABLE `equipe` DISABLE KEYS */;
INSERT INTO `equipe` VALUES (1,'Rodrigo Hamada','Desenvolvedor/Locutor','https://i.postimg.cc/1zLc5n5G/hT5q4Sv.jpg','https://www.instagram.com/_rodrigohamada','https://www.linkedin.com/in/rodrigo-hamada-109654218/','2025-10-18 14:15:51'),(2,'Felipe Manganelli','Desenvolvedor/Locutor','https://i.postimg.cc/8C1gXcVv/225031245-212234624154675-8369634412322290600-n.jpg','https://www.instagram.com/felipemanganelli','https://www.linkedin.com/in/felipe-manganelli-calocci/','2025-10-18 14:22:52'),(3,'Matheus Tosi','Desenvolvedor/Locutor','https://i.postimg.cc/MT2P3rRk/529832621-18519440125006349-7294897563774189640-n.jpg','https://www.instagram.com/matheus_tose','https://www.linkedin.com/in/matheustosi/','2025-10-18 14:25:52'),(4,'Pedro Lopes','Desenvolvedor/Locutor','https://i.postimg.cc/RhjNwfyc/1681506690608.jpg','https://www.instagram.com/alp.pedro','https://www.linkedin.com/in/pedrohenriquealves0102/','2025-10-18 14:28:56');
/*!40000 ALTER TABLE `equipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noticias`
--

DROP TABLE IF EXISTS `noticias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noticias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `conteudo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagem_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_autor` int DEFAULT NULL,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_autor` (`id_autor`),
  CONSTRAINT `noticias_ibfk_1` FOREIGN KEY (`id_autor`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noticias`
--

LOCK TABLES `noticias` WRITE;
/*!40000 ALTER TABLE `noticias` DISABLE KEYS */;
INSERT INTO `noticias` VALUES (1,'≡ƒÄÖ∩╕Å A Web R├ídio do IFSP Campinas est├í no ar!','A mais nova web r├ídio do Instituto Federal de Campinas acaba de ser inaugurada!\r\nDesenvolvida pelos estudantes da turma de Desenvolvimento Web 2, a R├ídio IF chega com o prop├│sito de tornar o dia a dia dos alunos ainda mais din├ómico e informativo.\r\n\r\nO projeto nasceu com o objetivo de promover informa├º├úo, cultura e m├║sica de qualidade para toda a comunidade acad├¬mica. Al├⌐m de ser um espa├ºo de entretenimento, a R├ídio IF tamb├⌐m ser├í um canal de express├úo para os alunos, abrindo espa├ºo para novos projetos, entrevistas e produ├º├╡es sonoras.\r\n\r\nSintonize-se e fa├ºa parte dessa nova experi├¬ncia sonora!','http://www.ubiratan.com.br/wp-content/uploads/2020/06/01-51.jpg',1,'2025-10-17 17:46:22'),(2,'≡ƒÆ╗ Estudantes se preparam para apresentar o projeto de Desenvolvimento Web 2','Os alunos da turma de Desenvolvimento Web 2 do Instituto Federal de Campinas est├úo em contagem regressiva para a apresenta├º├úo final de seus projetos. A atividade faz parte da disciplina ministrada pelo professor Everton Josu├⌐ Meyer da Silva e tem como objetivo integrar teoria e pr├ítica no desenvolvimento de aplica├º├╡es web completas.\r\n\r\nDurante o semestre, os estudantes colocaram em pr├ítica conceitos fundamentais de programa├º├úo, design de interfaces e integra├º├úo com banco de dados, criando sites funcionais e criativos ΓÇö entre eles, a R├ídio IF.\r\n\r\nA apresenta├º├úo marcar├í o encerramento da disciplina e ser├í uma oportunidade para os alunos mostrarem suas habilidades t├⌐cnicas e criativas, al├⌐m de compartilharem suas experi├¬ncias com colegas e docentes.\r\n\r\nMais do que uma avalia├º├úo acad├¬mica, o momento representa a consolida├º├úo de um aprendizado coletivo, que combina inova├º├úo, trabalho em equipe e paix├úo pela tecnologia.','http://www.ubiratan.com.br/wp-content/uploads/2020/06/13-4.jpg',1,'2025-10-17 18:08:11');
/*!40000 ALTER TABLE `noticias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programas`
--

DROP TABLE IF EXISTS `programas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `locutor` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `hora_inicio` time NOT NULL,
  `hora_fim` time NOT NULL,
  `dia_semana` enum('Domingo','Segunda','Ter├ºa','Quarta','Quinta','Sexta','S├íbado') COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programas`
--

LOCK TABLES `programas` WRITE;
/*!40000 ALTER TABLE `programas` DISABLE KEYS */;
INSERT INTO `programas` VALUES (1,'Manh├ú IF','Rodrigo Hamada','Not├¡cias e cultura matinal com convidados especiais','08:00:00','10:00:00','Segunda','2025-10-17 20:34:05'),(2,'Tarde Pop','Felipe Manganelli','Pop internacional e nacional, com os maiores sucessos do momento','14:00:00','16:00:00','Segunda','2025-10-17 20:34:05'),(3,'Morning Show','Pedro Lopes','M├║sica e entrevistas com os alunos do IF','08:00:00','10:00:00','Ter├ºa','2025-10-17 20:34:05'),(4,'Hits da Tarde','Matheus Tosi','Top 40 e cl├íssicos de todos os tempos','14:00:00','16:00:00','Ter├ºa','2025-10-17 20:34:05'),(5,'IF News','Rodrigo Hamada','Informa├º├╡es do campus e atualidades estudantis','08:00:00','09:00:00','Quarta','2025-10-17 20:34:05'),(6,'Rock Universit├írio','Felipe Manganelli','O melhor do rock alternativo e indie','15:00:00','17:00:00','Quarta','2025-10-17 20:34:05'),(7,'Manh├ú Cultural','Pedro Lopes','Debates, entrevistas e cultura acad├¬mica','09:00:00','11:00:00','Quinta','2025-10-17 20:34:05'),(8,'Summer Eletro IF','Matheus Tosi','O melhor da m├║sica eletr├┤nica para animar sua quinta!','19:00:00','21:00:00','Quinta','2025-10-17 20:34:05'),(9,'Flashback IF','Rodrigo Hamada','Os maiores cl├íssicos dos anos 80, 90 e 2000','10:00:00','12:00:00','Sexta','2025-10-17 20:34:05'),(10,'Encerramento da Semana','Equipe IF','Resumo das not├¡cias e m├║sicas escolhidas pelos ouvintes','12:00:00','01:00:00','Sexta','2025-10-17 20:34:05'),(11,'Programa├º├úo Musical - Edi├º├úo de S├íbado','Equipe IF','Playlist da R├ídio IF','08:00:00','00:00:00','S├íbado','2025-10-18 15:14:14'),(12,'Programa├º├úo Musical - Edi├º├úo de Domingo','Equipe IF','Programa├º├úo Musical - Edi├º├úo de Domingo','08:00:00','00:00:00','Domingo','2025-10-18 15:23:49');
/*!40000 ALTER TABLE `programas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slides`
--

DROP TABLE IF EXISTS `slides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `slides` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagem_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `badge` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ordem` int DEFAULT '1',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slides`
--

LOCK TABLES `slides` WRITE;
/*!40000 ALTER TABLE `slides` DISABLE KEYS */;
/*!40000 ALTER TABLE `slides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `celular` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cep` char(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logradouro` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bairro` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cidade` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uf` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `administrador` tinyint(1) DEFAULT '0',
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Rodrigo Hamada','rodrigohamada@hotmail.com.br','$2a$10$dfxjLFdy5H1zh/PRUDJ36uHzPZaP/igwyWBzjh1nZYdv/urzk9UYa','19998689501','','13024200','Rua Doutor Carlos Guimar├úes','143','Cambu├¡','Campinas','SP',1,'2025-10-14 00:25:48','2025-10-14 00:29:11'),(3,'Felipe Manganelli','felipe@hotmail.com','$2a$10$kYNZgDNT46m1jAWGkx33/elmnBquyFSD9JMukpB4PDi0kn1KBmTX2','19912345678','','13015301','Rua Padre Vieira','100','Centro','Campinas','SP',1,'2025-10-18 13:37:01','2025-10-18 13:38:15'),(4,'Andressa Moura','andressanmoura09@gmail.com','$2a$10$ztxO4MBWMkuyCx44MYYok.arZ4.C/lUDXaSRMJs5r/V4srI0.Nkwq','19978001974','19998689501','13035610','Avenida Doutor Carlos de Campos','1024','Vila Industrial','Campinas','SP',0,'2025-10-18 15:51:39','2025-10-18 15:51:39');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-18 23:43:23
