# Endpoint Documentation

## User
### User Register

Endpoint: api/user/register

Method: POST

Request Body
```json
{
  "username": "username",
  "password": "password",
  "email": "aa@email.com",
  "nama": "aa",
  "alamat": "alamat",
  "telp": "123",
  "nik": "123"
}
```
if email contain petugas.com, the role will be petugas

Response Body
```json
{
    "id": 1,
    "username": "username",
    "password": "hashedpassword",
    "email": "aa@email.com",
    "role": "pelanggan",
    "nama": "aa",
    "alamat": "SMK Telkom",
    "telp": "123",
    "nik": "123"
}
```

### Login User

Endpoint: api/user/login

Method: **POST**

Request Body:
```json
{
    "email":"aa@email.com",
    "password":"password"
}
```

Response Body:
```json
{
    "token": "token",
    "message": "Selamat datang, aa! Anda masuk sebagai pelanggan."
}
```

## Kereta
### Create Kereta

Endpoint: api/kereta/create

Method: **POST**

Request Header:
Bearer Token, Role petugas

Request Body
```json
{
    "namaKereta":"Kereta",
    "deskripsi":"Kereta",
    "kelas":"Ekonomi"
}
```

Response Body
```json
{
    "kereta": {
        "id": 1,
        "namaKereta": "Kereta",
        "deskripsi": "Kereta",
        "kelas": "Ekonomi"
    }
}
```

### Get Kereta
Get all
Endpoint: api/kereta

Get by id
Endpoint: api/kereta/{id}

Method: **GET**

Get all Response Body

```json
{
    "kereta": [
        {
            "id": 1,
            "namaKereta": "Kereta",
            "deskripsi": "Kereta",
            "kelas": "Ekonomi"
        },
        more data...
    ]
}
```

Get by id Response Body
```json
{
    "kereta": {
        "id": 1,
        "namaKereta": "Kereta",
        "deskripsi": "Kereta",
        "kelas": "Ekonomi"
    }
}
```

### Update Kereta

Endpoint: api/kereta/update?id={id}

Method: **PUT**

Request Header: Bearer Token, Role petugas

Request Body
```json
{
    "namaKereta":"Kereta1"
}
```

Response Body
```json
{
    "kereta": {
        "id": 1,
        "namaKereta": "Kereta1",
        "deskripsi": "Kereta",
        "kelas": "Ekonomi"
    }
}
```

### Delete Kereta

Endpoint: api/kereta/delete?id={id}

Method: **DELETE**

Request Header: Bearer Token, Role petugas

Response Body
```json
{
    "message": "Data deleted successfully",
    "data": {
        "id": 1,
        "namaKereta": "Kereta",
        "deskripsi": "Kereta",
        "kelas": "Ekonomi"
    }
}
```

## Gerbong
### Create Gerbong

Endpoint: api/gerbong/create

Method: **POST**

Request Header:
Bearer Token, Role petugas

Request Body
```json
{
    "namaGerbong":"Gerbong 1",
    "kuota": 120,
    "keretaId":1
}
```

Response Body
```json
{
    "gerbong": {
        "id": 1,
        "nama": "Gerbong 1",
        "kuota": 120,
        "keretaId": 1
    }
}
```

### Get Gerbong
Get all
Endpoint: api/gerbong

Get by id
Endpoint: api/gerbong/{id}

Method: **GET**

Get all Response Body

```json
{
    "gerbong": [
        {
            "id": 1,
            "nama": "Gerbong 1",
            "kuota": 120,
            "keretaId": 1
        }
        more data...
    ]
}
```

Get by id Response Body
```json
{
    "gerbong": {
        "id": 1,
        "nama": "Gerbong 1",
        "kuota": 120,
        "keretaId": 1
    }
}
```

### Update Gerbong

Endpoint: api/gerbong/update?id={id}

Method: **PUT**

Request Header: Bearer Token, Role petugas

Request Body
```json
{
    "namaGerbong":"Gerbong 2"
}
```

Response Body
```json
{
    "gerbong": {
        "id": 1,
        "nama": "Gerbong 2",
        "kuota": 120,
        "keretaId": 1
    }
}
```

### Delete Gerbong

Endpoint: api/gerbong/delete?id={id}

Method: **DELETE**

Request Header: Bearer Token, Role petugas

Response Body
```json
{
    "message": "Data deleted successfully",
    "data": {
        "id": 1,
        "nama": "Gerbong 1",
        "kuota": 120,
        "keretaId": 1
    }
}
```

## Kursi
### Create Kursi

Endpoint: api/kursi/create

Method: **POST**

Request Header:
Bearer Token, Role petugas

Request Body
```json
{
    "nomorKursi":"1",
    "gerbongId":1
}
```

Response Body
```json
{
    "id": 1,
    "nomorKursi": "1",
    "gerbongId": 1
}
```

### Get Kursi
Get all
Endpoint: api/kursi

Get by id
Endpoint: api/kursi/{id}

Method: **GET**

Get all Response Body

```json
{
    "kursi": [
        {
            "id": 1,
            "nomorKursi": "1",
            "gerbongId": 1
        },
        more data...
    ]
}
```

Get by id Response Body
```json
{
    "kursi": {
        "id": 1,
        "nomorKursi": "1",
        "gerbongId": 1
    }
}
```

### Update Kursi

Endpoint: api/kursi/update?id={id}

Method: **PUT**

Request Header: Bearer Token, Role petugas

Request Body
```json
{
    "nomorKursi":"2"
}
```

Response Body
```json
{
    "id": 1,
    "nomorKursi": "2",
    "gerbongId": 1
}
```

### Delete Kursi

Endpoint: api/kursi/delete?id={id}

Method: **DELETE**

Request Header: Bearer Token, Role petugas

Response Body
```json
{
    "message": "Data deleted successfully",
    "data": {
        "id": 1,
        "nomorKursi": "2",
        "gerbongId": 1
    }
}
```

## Jadwal
### Create Jadwal

Endpoint: api/jadwal/create

Method: **POST**

Request Header:
Bearer Token, Role petugas

Request Body
```json
{
    "id": 1,
    "keretaId": 1,
    "waktuBerangkat": "08:00",
    "waktuTiba": "10:00",
    "stasiunBerangkat": "Jakarta",
    "stasiunTiba": "Bandung",
    "asalKeberangkatan": "Jakarta",
    "tujuanKeberangkatan": "Bandung",
    "tanggalBerangkat": "2025-01-30T08:00:00.000Z",
    "tanggalKedatangan": "2025-01-30T10:00:00.000Z",
    "harga": 150000,
    "kuota": 100
}
```

Response Body
```json
{
    "id": 5,
    "keretaId": 3,
    "waktuBerangkat": "08:00",
    "waktuTiba": "10:00",
    "stasiunBerangkat": "Jakarta",
    "stasiunTiba": "Bandung",
    "asalKeberangkatan": "Jakarta",
    "tujuanKeberangkatan": "Bandung",
    "tanggalBerangkat": "2025-01-30T08:00:00.000Z",
    "tanggalKedatangan": "2025-01-30T10:00:00.000Z",
    "harga": 150000,
    "kuota": 100
}
```

### Get Jadwal
Get all
Endpoint: api/jadwal

Get by id
Endpoint: api/kursi/{id}

Method: **GET**

Get all Response Body

```json
{
    "jadwal": [
    {
        "id": 1,
        "keretaId": 1,
        "waktuBerangkat": "08:00",
        "waktuTiba": "10:00",
        "stasiunBerangkat": "Jakarta",
        "stasiunTiba": "Bandung",
        "asalKeberangkatan": "Jakarta",
        "tujuanKeberangkatan": "Bandung",
        "tanggalBerangkat": "2025-01-30T08:00:00.000Z",
        "tanggalKedatangan": "2025-01-30T10:00:00.000Z",
        "harga": 150000,
        "kuota": 100,
        "kereta": {
            "id": 1,
            "namaKereta": "Kereta",
            "deskripsi": "Kereta",
            "kelas": "Ekonomi"
        }
    },
        more data...
    ]
}
```

Get by id Response Body
```json
{
    "id": 1,
    "keretaId": 1,
    "waktuBerangkat": "08:00",
    "waktuTiba": "10:00",
    "stasiunBerangkat": "Jakarta",
    "stasiunTiba": "Bandung",
    "asalKeberangkatan": "Jakarta",
    "tujuanKeberangkatan": "Bandung",
    "tanggalBerangkat": "2025-01-30T08:00:00.000Z",
    "tanggalKedatangan": "2025-01-30T10:00:00.000Z",
    "harga": 150000,
    "kuota": 100,
    "kereta": {
        "id": 1,
        "namaKereta": "Kereta",
        "deskripsi": "Kereta",
        "kelas": "Ekonomi"
    }
}
```

### Update Jadwal

Endpoint: api/jadwal/update?id={id}

Method: **PUT**

Request Header: Bearer Token, Role petugas

Request Body
```json
{
    "waktuBerangkat": "09:00",
    "harga": 1
}
```

Response Body
```json
    "id": 1,
    "keretaId": 1,
    "waktuBerangkat": "09:00",
    "waktuTiba": "10:00",
    "stasiunBerangkat": "Jakarta",
    "stasiunTiba": "Bandung",
    "asalKeberangkatan": "Jakarta",
    "tujuanKeberangkatan": "Bandung",
    "tanggalBerangkat": "2025-01-30T08:00:00.000Z",
    "tanggalKedatangan": "2025-01-30T10:00:00.000Z",
    "harga": 1,
    "kuota": 100,
    "kereta": {
        "id": 1,
        "namaKereta": "Kereta",
        "deskripsi": "Kereta",
        "kelas": "Ekonomi"
    }
```

### Delete Kursi

Endpoint: api/jadwal/delete?id={id}

Method: **DELETE**

Request Header: Bearer Token, Role petugas

Response Body
```json
{
{
    "message": "Deleted successfully",
    "data": {
        "id": 1,
        "keretaId": 1,
        "waktuBerangkat": "08:00",
        "waktuTiba": "10:00",
        "stasiunBerangkat": "Jakarta",
        "stasiunTiba": "Bandung",
        "asalKeberangkatan": "Jakarta",
        "tujuanKeberangkatan": "Bandung",
    "tanggalBerangkat": "2025-01-30T08:00:00.000Z",
    "tanggalKedatangan": "2025-01-30T10:00:00.000Z",
        "harga": 150000,
        "kuota": 100
    }
}
}
```

