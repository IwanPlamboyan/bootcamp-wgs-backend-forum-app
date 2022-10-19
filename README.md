# bootcamp-wgs-backend-forum-app

backend forum-app dengan menggunakan express

# BACKEND FORUM APP

Aplikasi backend Forum Sederhana ini merupakan backend dari aplikasi forum yang terdiri dari login, register, dengan jwt, mengolah user, category, postingan, dan Comment/diskusi.

## Features

- Login, Register, getToken(merefresh token) dan logout
- Mengelola data user seperti getAllUser, getUserById, editProfileUserById, CreateModerator(user baru dengan roles moderator) dan updateModerator(mengubah roles dari user ke moderator atau sebaliknya)
- Mengelola Category seperti getAllCategory, getCategoryById, createCategory, updateCategory dan deleteCategory
- Mengelola Postingan seperti getAllPost, getPostById, createPost, updatePost dan deletePost
- mengelola Comment/diskusi seperti getCommentByPost, createComment dan deleteComment
-

## Tech

Aplikasi backend Forum ini dibuat dengan:

- [Express] - sebagai kerangka kerja
- [pg] - untuk koneksi ke postgreSQL
- [sequelize] - untuk mempermudak query sebagai orm
- [bcrypt] - untuk mengenkripsi password
- [jsonwebtoken] - untuk authentication
- [cors] - untuk membatasi permintaan HTTP
- [express-fileupload] - untuk mengupload file ke server
- [validator] - untuk validasi
- [cookie-parser] - untuk menyimpan cookie
- [node.js] - sebagai server backend
- [dotenv] - untuk menyimpan variabel
- [validator] - untuk memvalidasi

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

**Menampilkan semua Category**

```sh
GET   http://localhost:5000/forum/category
```

**Menampilkan semua Category berdasarkan id**

```sh
GET   http://localhost:5000/forum/category/:id
```

**Menambah Category**

```sh
POST   http://localhost:5000/forum/category
```

**Mengubah Category**

```sh
PATCH   http://localhost:5000/forum/category/:id
```

**Menghapus Category**

```sh
DELETE   http://localhost:5000/forum/category/:id
```

**Menampilkan semua Postingan**

```sh
GET   http://localhost:5000/forum/post
```

**Menampilkan Postingan berdasarkan id**

```sh
GET   http://localhost:5000/forum/post/id
```

**Menambah Postingan**

```sh
POST   http://localhost:5000/forum/post
```

**Mengubah Postingan berdasarkan id**

```sh
PATCH   http://localhost:5000/forum/post/:id
```

**Menghapus Postingan berdasarkan id**

```sh
DELETE   http://localhost:5000/forum/post/:id
```

**Menampilkan semua Comment/diskusi berdasarkan id dari Postingan**

```sh
GET   http://localhost:5000/forum/comment?post_id=id
```

**Menambah Comment/diskusi**

```sh
POST   http://localhost:5000/forum/comment
```

**Menghapus diskusi berdasarkan id**

```sh
POST   http://localhost:5000/forum/comment/:id
```
