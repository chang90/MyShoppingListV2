'use strict';
import React from 'react';
import * as SQLite from 'expo-sqlite';


var database_name = "ShoppingList.db";

let conn = SQLite.openDatabase(database_name);

const SqlDatabase = {
    getConnection: () => {
        return conn;
    }
}

export default SqlDatabase;