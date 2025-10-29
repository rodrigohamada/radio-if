# Rádio IF 🎙️

Sistema web desenvolvido como projeto da disciplina **Desenvolvimento Web 2** do Instituto Federal de Campinas. O projeto implementa uma **web rádio completa**, com gerenciamento de notícias, programação de rádio, equipe e usuários, além de um painel administrativo para controle de conteúdo.

---

# Integrantes

Felipe Manganelli Calocci - CP3018938 | 
Matheus da Silva Tosi - CP3019098 | 
Pedro Lopes - CP3019322 | 
Rodrigo Hamada - CP3018873 | 

---

# Repositório

https://github.com/rodrigohamada/radio-if

---

## 💡 Visão Geral

O **Rádio IF** é uma aplicação web que tem como objetivo oferecer uma experiência de rádio online para alunos e professores. Desenvolvido em **Node.js + Express + EJS + MySQL**, o sistema possui páginas públicas e uma área administrativa protegida por autenticação.

---

## 📄 Pitch Técnico

1. **Tema do Sistema**

O sistema será uma plataforma moderna para uma Web Rádio chamada Rádio IF. O objetivo
é oferecer uma transmissão contínua de áudio, com interface responsiva e interativa. O site permitirá acompanhar a programação ao vivo,
conhecer os locutores, ler notícias e enviar mensagens de contato.


2. **Entidades Principais**

Liste as entidades que farão parte do sistema (mínimo de 5), com uma breve explicação de
cada uma.

● Entidade 1: Programa – Representa os programas da rádio, incluindo nome,
descrição e horários de transmissão.
● Entidade 2: Locutor – Representa os apresentadores e DJs responsáveis pelos
programas, com informações biográficas e redes sociais.
● Entidade 3: Notícia – Conteúdos de destaque e artigos culturais publicados pela
rádio.
● Entidade 4: Ouvintes – Usufruem do rádio ouvindo a programação e enviando
pedidos de música.
● Entidade 5: Usuário Administrador – Responsável por gerenciar os conteúdos do site
e atualizar informações da rádio.


3. **Relacionamentos**

Indique como as entidades se relacionam (pelo menos 1 relacionamento N:N).

- Um Locutor pode apresentar vários Programas (1:N).
- Um Programa pode ter múltiplos Locutores (N:N).
- Notícias são cadastradas por Usuários Administradores (1:N).
- Mensagens de Contato são enviadas por ouvintes e ficam armazenadas para consulta (N:1).


4. **Tipos de Dados**

Marque os tipos de dados que estarão presentes no sistema:

[X] Texto
[X] Numérico
[X] Data
[X] URL
[X] Outros: Áudio

5. Telas / Fluxos Principais

![alt text](image.png)


## 🧰 Tecnologias Utilizadas

- **Node.js** – ambiente de execução JavaScript no servidor
- **Express.js** – framework para criação das rotas e controle de requisições
- **EJS** – template engine para renderização das páginas HTML
- **MySQL** – banco de dados relacional para armazenar informações de usuários, equipe, programas e notícias
- **bcrypt.js** – criptografia de senhas
- **dotenv** – gerenciamento de variáveis de ambiente
- **Bootstrap + CSS customizado** – estilização responsiva da interface

---

## ⚙️ Configuração do Ambiente

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=12345
DB_NAME=radio_if
PORT=3306
```

### 3. Inicializar o servidor
```bash
npm start
```

O projeto ficará disponível em:

👉 **http://localhost:3000**

---

## 🗄️ Banco de Dados

O projeto utiliza um banco MySQL com as seguintes tabelas principais:

- **usuarios** – controle de login, autenticação e permissões (admin)
- **equipe** – integrantes exibidos na página "Equipe"
- **programas** – programação de rádio por dia e horário
- **noticias** – notícias publicadas na página principal
- **slides** – imagens do carrossel dinâmico exibido na home
- **contatos** – mensagens enviadas pelo formulário de contato

O schema pode ser criado automaticamente ao importar o arquivo `.sql` de backup.

---

## 🚀 Execução do Projeto

1. Certifique-se de que o MySQL está rodando
2. Configure corretamente o arquivo `.env`
3. Execute o comando:
```bash
npm start
```

4. Acesse o navegador em **http://localhost:3000**

---

## 🔐 Painel Administrativo

O painel administrativo permite gerenciar:

- Notícias
- Programação da rádio
- Equipe
- Usuários do sistema
- Slides do carrossel
- Mensagens de contato

**Acesso:** `/admin`

---

## ✨ Funcionalidades Principais

- 🎵 **Player de rádio ao vivo**
- 📰 **Sistema de notícias dinâmico**
- 📅 **Grade de programação por dia da semana**
- 👥 **Página da equipe com fotos e descrições**
- 📧 **Formulário de contato**
- 🖼️ **Carrossel de slides na home**
- 🔒 **Área administrativa protegida**
- 🔑 **Autenticação de usuários com sessões**

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte da disciplina de Desenvolvimento Web 2 do Instituto Federal de Campinas.
