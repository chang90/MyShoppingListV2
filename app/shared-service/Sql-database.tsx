'use strict';
import React from 'react';
import * as SQLite from 'expo-sqlite';
import { ShoppingList, CreateShoppingListQuery } from '../Shopping-list/ShoppingList';


var database_name = "ShoppingList.db";

let conn = SQLite.openDatabase(database_name);

const SqlDatabase = {
    getConnection: () => {
        return conn;
    },
    initData: () => {
        const db = SqlDatabase.getConnection();
        db.transaction(tx => {
    
            // Clean up old DB data
            console.log('drop table')
            tx.executeSql("PRAGMA foreign_keys = OFF;")
            tx.executeSql("DELETE FROM item_tags;", [],
                function (error) {
                    console.log("delete");
                    console.log(error)
                }
            );
            tx.executeSql("DROP TABLE IF EXISTS item_tags;", [],
                function (error) {
                    console.log("item_tags table Could not delete");
                    console.log(error)
                }
            );
            tx.executeSql("DROP TABLE IF EXISTS tags;");
            tx.executeSql("DROP TABLE IF EXISTS items;", [],
                function (error) {
                    console.log("item table Could not delete");
                }
            );
            tx.executeSql("DROP TABLE IF EXISTS shopping_lists;");
            tx.executeSql("DROP TABLE IF EXISTS users;");
            tx.executeSql("PRAGMA foreign_keys = ON;")
    
            // Init database and set up default value
            // Create Users table
            tx.executeSql(
                "create table if not exists users (id integer primary key not null, user_name text, created_date text, updated_date text, password text, connect_to_cloud boolean);");
    
            // Create Shopping Lists table
            tx.executeSql(
                "create table if not exists shopping_lists (id integer primary key not null, shopping_list_name text, created_date text, updated_date text, completed_date text, user_id integer);");
    
            // Create Tags table
            tx.executeSql(
                "create table if not exists tags (id integer primary key not null, tag_name text, created_date text, updated_date text, default_tag boolean, color string);");
    
            // Create Items table
            tx.executeSql(
                "create table if not exists items (id integer primary key not null, item_name text, created_date text, updated_date text, expiry_date text, notes text, status number not null, shoppinglist_id integer not null);");
    
            // Create Item Tag matching table
            tx.executeSql(
                "create table if not exists item_tags (id INTEGER PRIMARY KEY NOT NULL, item_id INTEGER REFERENCES items(id), tag_id INTEGER REFERENCES tags(id));");
    
            tx.executeSql("select * from shopping_lists", [], (_, { rows }) => {
                console.log('shopping_lists', rows)
            }
            )
            tx.executeSql("select * from users where id = 1", [], (_, { rows }) => {
                console.log('users', rows)
                if (rows.length == 0) {
                    // Create default user
                    const currentDate = new Date().toUTCString();
                    tx.executeSql(`insert into users (user_name, created_date, updated_date, connect_to_cloud) values ('default', '${currentDate}','${currentDate}',0);`);
    
                    // Create default shopping list
                    tx.executeSql(`insert into shopping_lists (shopping_list_name, created_date, updated_date, user_id) values ('${new Date().toISOString().slice(0, 10)} Shopping list', '${currentDate}','${currentDate}',1);`);
    
                    // Create default tags
                    tx.executeSql(`insert into tags (tag_name, created_date, updated_date, default_tag, color) values ('easy to expire', '${currentDate}','${currentDate}', true, '#fcc68f';`);
    
                    tx.executeSql(`insert into tags (tag_name, created_date, updated_date, default_tag, color) values ('fridge', '${currentDate}','${currentDate}', true, '#a7dfde';`);
    
                    // Create default Item
                    tx.executeSql(`insert into items (item_name, created_date, updated_date, status, shoppinglist_id) values ('I am your new fresh item', '${currentDate}','${currentDate}', 1, 1;`);
    
                    // Create Item Tag matching for item
                    tx.executeSql(`insert into item_tags (item_id, tag_id) values (1, 1);`);
                    tx.executeSql(`insert into item_tags (item_id, tag_id) values (1, 2);`);
                }
            })
    
        });
    },
    onError: (error: any) =>{ console.log(error)},
    checkShoppingLists: (userId: string): Promise<any> => {
        console.log('checkShoppingLists')
        return new Promise((resolve, reject) => {
            const db = SqlDatabase.getConnection();
            try {
                db.transaction((tx) => {
                    tx.executeSql(
                        `SELECT * from shopping_lists WHERE user_id = ${userId};`, 
                        [],
                        (_, { rows }) => {resolve(rows)}
                    );
                });
            } catch (error) {
                SqlDatabase.onError(error);
                reject(error);
            }

        });
    },
    updateShoppingList: (ShoppingListObj: ShoppingList): Promise<any> => {
        return new Promise((resolve, reject) => {
            const db = SqlDatabase.getConnection();
            try {
                db.transaction((tx) => {
                    const currentDate = new Date().toUTCString();
                    tx.executeSql( `UPDATE shopping_lists SET shopping_list_name = '${ShoppingListObj.shopping_list_name}', updated_date = '${currentDate}' WHERE id = '${ShoppingListObj.id}';`, 
                        [],
                        (_, { rows }) => resolve(rows)
                    );
                });
            } catch (error) {
                SqlDatabase.onError(error);
                reject(error);
            }

        });
    },
    createShoppingList: (ShoppingListObj: CreateShoppingListQuery, userId: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const db = SqlDatabase.getConnection();
            try {
                db.transaction((tx) => {
                    const currentDate = new Date().toUTCString();
                    tx.executeSql( `INSERT INTO shopping_lists (shopping_list_name, created_date, updated_date, user_id ) VALUES ('${ShoppingListObj.shopping_list_name}', '${currentDate}','${currentDate}',${userId});`, 
                        [],
                        (_, { rows }) => {resolve(rows)}
                    );
                });
            } catch (error) {
                SqlDatabase.onError(error);
                reject(error);
            }

        });
    }
    
}

export default SqlDatabase;

