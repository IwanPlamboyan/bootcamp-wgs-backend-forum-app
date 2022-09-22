# bootcamp-wgs-backend-forum-app
backend forum-app dengan menggunakan express

# BACKEND FORUM APP

Aplikasi backend Forum Sederhana ini merupakan backend dari aplikasi forum yang terdiri dari login, register, dengan jwt, mengolah user, main forum, sub forum, dan diskusi.

## Features

- Login, Register, getToken(merefresh token) dan logout
- Mengelola data user seperti getAllUser, getUserById, editProfileUserById, CreateModerator(user baru dengan roles moderator) dan updateModerator(mengubah roles dari user ke moderator atau sebaliknya)
- Mengelola Main Forum seperti getAllForum(menampilkan semua forum), getAllMainForum, getMainForumById, createMainForum, updateMainForum dan deleteMainForum
- Mengelola Sub Forum seperti getAllSubForum, getSubForumById, createSubForum, updateSubForum dan deleteSubForum
- mengelola diskusi seperti getDiscussionBySubForum, createDiscussion dan deleteDiscussion
- 
## Tech

Aplikasi backend Forum ini dibuat dengan:

- [Express] - sebagai kerangka kerja
- [pg] - untuk koneksi ke postgreSQL
- [sequelize] - untuk mempermudak query sebagai orm
- [bcrypt] - untuk mengenkripsi password
- [jsonwebtoken] - untuk authentication
- [express-fileupload] - untuk mengupload file ke server
- [validator] - untuk validasi
- [cookie-parser] - untuk menyimpan cookie
- [node.js] - sebagai server backend
- [dotenv] - untuk menyimpan variabel

## Installation

install dan jalankan [Node.js](https://nodejs.org/).

Install dependencies.

```sh
cd bootcamp-wgs-backend-forum-app
npm i
```

Jalankan servernya menggunakan perintah berikut.
```sh
nodemon index.js
atau
node index.js
```

## Usage

**Register**
```sh
POST    http://localhost:5000/register
```

**Login**
```sh
POST    http://localhost:5000/login
```

**Merefresh token**
```sh
GET     http://localhost:5000/token
```

**Logout**
```sh
DELETE  http://localhost:5000/logout
```

**Menampilkan semua user**
```sh
GET     http://localhost:5000/users
```

**Menampilkan user berdasarkan id**
```sh
GET     http://localhost:5000/users/:id
```

**Mengubah profile**
```sh
PATCH   http://localhost:5000/users/:id
```

**Membuat Moderator dengan user yang baru**
```sh
POST   http://localhost:5000/users/moderator
```

**Mengubah roles dari mederator ke user atau sebaliknya**
```sh
PATCH   http://localhost:5000/users/moderator/:id
```

**Menampilkan semua Mainforum dan SubForum**
```sh
GET   http://localhost:5000/forum/
```

**Menampilkan semua Mainforum**
```sh
GET   http://localhost:5000/forum/main
```

**Menampilkan semua Mainforum berdasarkan id**
```sh
GET   http://localhost:5000/forum/main/:id
```

**Menambah Main Forum**
```sh
POST   http://localhost:5000/forum/main
```

**Mengubah Main Forum**
```sh
PATCH   http://localhost:5000/forum/main/:id
```

**Menghapus Main Forum**
```sh
DELETE   http://localhost:5000/forum/main/:id
```

**Menampilkan semua Sub Forum**
```sh
GET   http://localhost:5000/forum/sub
```

**Menampilkan Sub Forum berdasarkan id**
```sh
GET   http://localhost:5000/forum/sub/id
```

**Menambah Sub Forum**
```sh
POST   http://localhost:5000/forum/sub
```

**Mengubah Sub Forum berdasarkan id**
```sh
PATCH   http://localhost:5000/forum/sub/:id
```

**Menghapus Sub Forum berdasarkan id**
```sh
DELETE   http://localhost:5000/forum/sub/:id
```

**Menampilkan semua Diskusi berdasarkan id dari sub forum**
```sh
GET   http://localhost:5000/forum/discussion?sub_id=id
```

**Menambah diskusi**
```sh
POST   http://localhost:5000/forum/discussion
```

**Menghapus diskusi berdasarkan id**
```sh
POST   http://localhost:5000/forum/discussion/:id
```
