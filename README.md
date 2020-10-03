# ![alt text](https://github.com/hiby90hou/MyShoppingList/blob/master/graphic%20design/logo_v1/mipmap-hdpi/ic_launcher.png "MyShoppingList Logo") MyShoppingList V2
## An React-native project

MyShoppingList is an android app project which can help people to reduce food waste and help them to save money on food shopping.

I am trying to rebuild my old shopping list project, because I want to have a huge UX improvement, but the old project is unable to support it.

The [original project](https://github.com/hiby90hou/MyShoppingList) was no longer maintained and I also lost my old github account due to Google Authentication error.

## 1. Getting Started for user

MVP is not ready.

## 2. Getting Started for developer

### Prerequisites
1. git
2. npm 6.14.6
3. node v12.18.3
4. react-native-cli
5. expo-cli

### Installing
1. Clone react-native project font end side from git by 
```
$ git clone https://github.com/chang90/MyShoppingListV2.git
```
2. Install dependent packages
```
$ npm install
```
3. Run react-native project on expo
```
expo start
```
4. Download and run expo app, use expo app to scan QR code to visit my app

### Publish project
When expo is started, you can publish it by clicking the publish botton in expo web page.

### Wireframe
![alt text](https://github.com/chang90/MyShoppingListV2/blob/master/wireframe/design1.png 'wireframe1')
![alt text](https://github.com/chang90/MyShoppingListV2/blob/master/wireframe/design2.png 'wireframe2')
![alt text](https://github.com/chang90/MyShoppingListV2/blob/master/wireframe/design3.png 'wireframe3')

### Database design

1. Item table

 | Id     | Name          | Created-date         | Updated-date         | Expiry-date         | Notes       | Status    | Shopping-list-id
 | ---    | ---           | ---                 | ---                 | ---                 | ---         | ---       | ---          
 | 1      | Apple         | 2020-01-01 08:00:00 | 2020-01-01 08:00:00 | 2020-01-04 08:00:00 | Free apple! | 2(brought)| 1
 | 2      | Banana        | 2020-01-02 08:00:00 | 2020-01-02 08:00:00 | null                | null        | 1(require)| 1
 | 3      | Laundry Powder | 2020-01-02 08:00:00 | 2020-01-02 08:00:00 | null                | null        | 3(complete)| 1
 
2. Tags table

| Id       | Name              | Created-date         | Updated-date         | default |  color
| ---      | ---               | ---                 | ---                 | ---     |   ---
| tag-id-1 | easy to expire    | 2020-01-01 08:00:00 | 2020-01-01 08:00:00 | true    |  #ccc
| tag-id-2 | fridge            | 2020-01-01 08:00:00 | 2020-01-01 08:00:00 | false   |  #abc
| tag-id-3 | Laundry           | 2020-01-01 08:00:00 | 2020-01-01 08:00:00 | false   |  #abd

3. Item tag matching table

| Id             | Item-id           | Tag-id              |
| ---            | ---               | ---                 |
| item-tag-id-1  | 1                 | tag-id-1            |
| item-tag-id-2  | 1                 | tag-id-2            |
| item-tag-id-3  | 2                 | tag-id-1            |
| item-tag-id-4  | 3                 | tag-id-3            |

4. Shoppinglist table

| Id       | Name              | Created-date         | Updated-date         | Completed-date       |  user-id
| ---      | ---               | ---                 | ---                 | ---                 |  ---
| 1        | Goods for lunch   | 2020-01-01 08:00:00 | 2020-01-02 08:00:00 | 2020-01-02 08:00:00 | 1

5. User table

| Id       | Name              | Created-date         | Updated-date         | Connect-to-cloud| password
| ---      | ---               | ---                 | ---                 | ---             | ---
| 1        | default user      | 2020-01-01 08:00:00 | 2020-01-01 08:00:00 | false           |  null



## 3. Authors
* **CHANG LIU** - *Initial work* - [hiby90hou](https://github.com/chang90)

<span style="color:red"> I am a Web developer with 2+ years of experience. </span>

<span style="color:red">If you are interesting on me or my project, please contact me by email: </span> <a href="mailto:chang.liu.programmer@gmail.com">chang.liu.programmer@gmail.com</a>   

## License

This project is licensed under the MIT License
