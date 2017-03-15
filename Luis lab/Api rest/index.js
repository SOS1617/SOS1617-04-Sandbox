"use strict";
/* global __dirname */

/**
 * PARA PRUEBAS USAR
 * Online Curl Command Line
 * Y pegar lo que nos da en la consola de c9 y ejecutar.
 * 
 * -v muestra codigos de error, etc 
 */
 
var express = require("express"); // Servidor web
var bodyParser = require("body-parser"); // 
var helmet = require("helmet"); // 
var DataStore
var path = require("path");

var port = (process.env.PORT || 10000); // Puerto que usa
var BASE_API_PATH = "/api/v1"; // Versión

var app = express();

var dbFileName = path.join(__dirname, "contacts.db");
var db = new DataStore({
    filename: dbFileName,
    autoload: true
    
})

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

// @see: https://curlbuilder.com/
// @see: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
// @see: https://i.stack.imgur.com/whhD1.png
// @see: https://blog.agetic.gob.bo/2016/07/elegir-un-codigo-de-estado-http-deja-de-hacerlo-dificil/


var contacts = [
    {
        "name": "Felipe",
        "phone": "954000000",
        "email": "example@example.com"
    },
    {
        "name": "Felipe 1",
        "phone": "954000001",
        "email": "example1@example.com"
    },
    {
        "name": "Felipe 2",
        "phone": "954000002",
        "email": "example2@example.com"
    }
];

// Base GET
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /contacts");
    response.redirect(301, BASE_API_PATH + "/contacts");
});


// GET a collection
app.get(BASE_API_PATH + "/contacts", function (request, response) {
    console.log("INFO: new GET request to /contacts");
    response.send(contacts);
});


// GET a single resource
app.get(BASE_API_PATH + "/contacts/:name", function (request, response) {
    console.log("INFO: new GET request to /contacts/:name");
    
    // Variable :name de la url
    var name = request.params.name; 
    
    if(!name){
        response.sendStatus(400) // bad request
    } else {
        // Filtrar contactos para quedarnos solo con los de :name
        var filteredContacts = contacts.filter((contact) => {
            return contact.name === name; // === compara tmb mayusculas
        });
        
        //
        var contactFound = filteredContacts[0];
        
        //
        console.log("INFO: returning contact: " + JSON.stringify(contactFound, 2, null));
        
        //
        response.send(contactFound);
        
        if(filteredContacts.length == 0){
            response.sendStatus(404) // Not Found
        } else {
            response.sendStatus(200) // Ok
        }
    }
});


//POST over a collection
app.post(BASE_API_PATH + "/contacts", function (request, response) {
    var newContact = request.body;
    contacts.push(newContact);
    
    // No contacto
    if(newContact == null || newContact == ""){
        response.sendStatus(400);
    } 
    // Formato erroneo
    else if(!newContact.name|| !newContact.email || !newContact.phone) {
        response.sendStatus(422);
    }
  /* TODO
  // Contacto existente
    else if(){
        response.sendStatus(419);
    }*/
    // OK
    else {
        response.sendStatus(201);
    }
    
    
    // Por hacer comprobaciones:
    //      Contacto existente -> 419
});


//POST over a single resource
app.post(BASE_API_PATH + "/contacts/:name", function (request, response) {
    response.sendStatus(405);
});


//PUT over a collection
app.put(BASE_API_PATH + "/contacts", function (request, response) {
    response.sendStatus(405);
});


//PUT over a single resource
app.put(BASE_API_PATH + "/contacts/:name", function (request, response) {
    var name = request.params.name;
    var updateContact = request.body;
    contacts = contacts.map((c) => {
        if(c.name == name){
            return updateContact; // Contacto actualizado
        } else {
            return c; // Contacto que ya existía
        }
    });
});


//DELETE over a collection
app.delete(BASE_API_PATH + "/contacts", function (request, response) {
    // Vaciar el array
    contacts.length = 0; // Podría hacerse contacts = [], pero es mejor la otra forma.
    response.sendStatus(204);
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/contacts/:name", function (request, response) {
     // Variable :name de la url
    var name = request.params.name; 
    var l1 = contacts.length;
    contacts = contacts.filter((contact) => {
        return contact.name !== name; // === compara tmb mayusculas
    });
    response.sendStatus(204);
});


app.listen(port);
console.log("Magic is happening on port " + port);