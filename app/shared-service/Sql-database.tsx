'use strict';
import React from 'react';
import * as SQLite from 'expo-sqlite';
import { ShoppingList, CreateShoppingListQuery } from '../Shopping-list/ShoppingList';
import { CreateItemQuery, Item } from '../shopping-list-details/ShoppingListDetails';


var database_name = "ShoppingList.db";

let conn = SQLite.openDatabase(database_name);

const SqlDatabase = {
  getConnection: () => {
    return conn;
  },
  initData: () => {
    const db = SqlDatabase.getConnection();
    db.transaction(tx => {

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

      tx.executeSql("select * from users where id = 1", [], (_, { rows }) => {
        if (rows.length == 0) {
          console.log('create default account with data')
          // Create default user
          const currentDate = new Date().toUTCString();
          tx.executeSql(`insert into users (user_name, created_date, updated_date, connect_to_cloud) values ('default', '${currentDate}','${currentDate}',0);`);

          // Create default shopping list
          tx.executeSql(`insert into shopping_lists (shopping_list_name, created_date, updated_date, user_id) values ('${new Date().toISOString().slice(0, 10)} Shopping list', '${currentDate}','${currentDate}',1);`);

          // Create default tags
          tx.executeSql(`insert into tags (tag_name, created_date, updated_date, default_tag, color) values ('easy to expire', '${currentDate}', '${currentDate}', 1, '#fcc68f'); `);

          tx.executeSql(`insert into tags (tag_name, created_date, updated_date, default_tag, color) values ('fridge', '${currentDate}','${currentDate}', 1, '#a7dfde');`);

          // Create default Item
          tx.executeSql(`insert into items (item_name, created_date, updated_date, notes, status, shoppinglist_id) values ('I am your new fresh item', '${currentDate}','${currentDate}', '', 1, 1);`, [], error =>
            console.log(error)
          );
          // Create Item Tag matching for item
          tx.executeSql(`insert into item_tags (item_id, tag_id) values (1, 1);`);
          tx.executeSql(`insert into item_tags (item_id, tag_id) values (1, 2);`);
        }
      })

    });
  },
  onError: (error: any) => { console.log(error) },
  checkShoppingLists: (userId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const db = SqlDatabase.getConnection();
      try {
        db.transaction((tx) => {
          tx.executeSql(
            `SELECT * from shopping_lists WHERE user_id = ${userId};`,
            [],
            (_, { rows }) => { resolve(rows) }
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
          tx.executeSql(`UPDATE shopping_lists SET shopping_list_name = '${ShoppingListObj.shopping_list_name}', updated_date = '${currentDate}' WHERE id = '${ShoppingListObj.id}';`,
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
          tx.executeSql(`INSERT INTO shopping_lists (shopping_list_name, created_date, updated_date, user_id ) VALUES ('${ShoppingListObj.shopping_list_name}', '${currentDate}','${currentDate}',${userId});`,
            [],
            (_, { rows }) => { resolve(rows) }
          );
        });
      } catch (error) {
        SqlDatabase.onError(error);
        reject(error);
      }

    });
  },
  deleteAllShoppingLists: (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const db = SqlDatabase.getConnection();
      try {
        db.transaction((tx) => {
          tx.executeSql(`DELETE FROM shopping_lists;`,
            [],
            (_, { rows }) => { resolve(rows) }
          );
        });
      } catch (error) {
        SqlDatabase.onError(error);
        reject(error);
      }

    });
  },
  deleteAllUsers: (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const db = SqlDatabase.getConnection();
      try {
        db.transaction((tx) => {
          tx.executeSql(`DELETE FROM users;`,
            [],
            (_, { rows }) => { resolve(rows) }
          );
        });
      } catch (error) {
        SqlDatabase.onError(error);
        reject(error);
      }

    });
  },
  deleteAllItems: (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const db = SqlDatabase.getConnection();
      try {
        db.transaction((tx) => {
          tx.executeSql(`DELETE FROM items;`,
            [],
            (_, { rows }) => { resolve(rows) }
          );
        });
      } catch (error) {
        SqlDatabase.onError(error);
        reject(error);
      }

    });
  },
  checkItemsList: (shoppinglistId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const db = SqlDatabase.getConnection();
      try {
        db.transaction((tx) => {
          tx.executeSql(
            `select * from items LEFT JOIN item_tags on items.id = item_tags.item_id LEFT JOIN tags ON item_tags.tag_id = tags.id where shoppinglist_id = ${shoppinglistId}`,
            [],
            (_, { rows }) => { resolve(rows) }
          );
        });
      } catch (error) {
        SqlDatabase.onError(error);
        reject(error);
      }

    });
  },
  createNewItem: (itemObj: CreateItemQuery, shoppinglistId: string): Promise<any> =>{
    return new Promise((resolve, reject) => {
      const db = SqlDatabase.getConnection();
      try {
        db.transaction((tx) => {
          const currentDate = new Date().toUTCString();
          tx.executeSql(`insert into items (item_name, created_date, updated_date, notes, status, shoppinglist_id) values ('${itemObj.item_name}', '${currentDate}', '${currentDate}', '${itemObj.notes}', ${1}, ${shoppinglistId})`,
            [],
            (_, { rows }) => { resolve(rows) }
          );
        });
      } catch (error) {
        SqlDatabase.onError(error);
        reject(error);
      }

    });
  },
  updateItem: (itemObj: Item): Promise<any> =>{
    return new Promise((resolve, reject) => {
      const db = SqlDatabase.getConnection();
      try {
        db.transaction((tx) => {
          const currentDate = new Date().toUTCString();
          tx.executeSql(`UPDATE items SET item_name = '${itemObj.item_name}', updated_date = '${currentDate}', notes = '${itemObj.notes}' WHERE id = '${itemObj.id}';`,
            [],
            (_, { rows }) => { resolve(rows) }
          );
        });
      } catch (error) {
        SqlDatabase.onError(error);
        reject(error);
      }

    });
  },
  deleteItem: (itemId: string): Promise<any> =>{
    return new Promise((resolve, reject) => {
      const db = SqlDatabase.getConnection();
      try {
        db.transaction((tx) => {
          tx.executeSql(`DELETE FROM items WHERE id = ${itemId};`,
            [],
            (_, { rows }) => { resolve(rows) }
          );
        });
      } catch (error) {
        SqlDatabase.onError(error);
        reject(error);
      }

    });
  },
  deleteAllItemsTags: (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const db = SqlDatabase.getConnection();
      try {
        db.transaction((tx) => {
          tx.executeSql(`DELETE FROM item_tags;`,
            [],
            (_, { rows }) => { resolve(rows) }
          );
        });
      } catch (error) {
        SqlDatabase.onError(error);
        reject(error);
      }

    });
  },
  deleteItemsTagsRelationshipByItemId:  (itemId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const db = SqlDatabase.getConnection();
      try {
        db.transaction((tx) => {
          tx.executeSql(`DELETE FROM item_tags WHERE item_id = ${itemId};`,
            [],
            (_, { rows }) => { resolve(rows) }
          );
        });
      } catch (error) {
        SqlDatabase.onError(error);
        reject(error);
      }

    });
  },
  deleteAllTags: (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const db = SqlDatabase.getConnection();
      try {
        db.transaction((tx) => {
          tx.executeSql(`DELETE FROM tags;`,
            [],
            (_, { rows }) => { resolve(rows) }
          );
        });
      } catch (error) {
        SqlDatabase.onError(error);
        reject(error);
      }

    });
  },
  checkTagList: (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const db = SqlDatabase.getConnection();
      try {
        db.transaction((tx) => {
          tx.executeSql(
            `select id, tag_name as tagName, created_date as createdDate, updated_date as updatedDate, default_tag as defaultTag, color from tags;`,
            [],
            (_, { rows }) => { resolve(rows) }
          );
        });
      } catch (error) {
        SqlDatabase.onError(error);
        reject(error);
      }

    });
  },
  dropTables: (tableName: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const db = SqlDatabase.getConnection();
      try {
        db.transaction((tx) => {
          tx.executeSql("PRAGMA foreign_keys = OFF;")
          tx.executeSql(`DROP TABLE IF EXISTS ${tableName};`,
            [],
            (_, result) => { 
              tx.executeSql("PRAGMA foreign_keys = ON;",[],
              (_, { rows }) => { 
                resolve(rows); 
              })
            }
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

