#### 0.8.0 (2019-05-29)

##### Chores

* **deps:**  force latest version & audit fix ([3b069697](https://github.com/lykmapipo/postman/commit/3b069697d84e787cb877cc58e6e52c219c015d83))

##### New Features

*  expose secured kue http ui ([32f85250](https://github.com/lykmapipo/postman/commit/32f852501ecc890f0338d44aa5e251655e1f784e))

#### 0.7.0 (2019-05-29)

##### Chores

* **deps:**
  *  force latest versions ([c9ab2912](https://github.com/lykmapipo/postman/commit/c9ab291242cb23985ea6f3618a5b51c2faf081e8))
  *  force latest version & audit fix ([c66e354e](https://github.com/lykmapipo/postman/commit/c66e354e4f0d8e38d652545271cae4ea970396f9))

##### Tests

*  refactor queue specs to work ([e6ba43c1](https://github.com/lykmapipo/postman/commit/e6ba43c1ad328704a762667891fd9ae674a62a9e))

#### 0.6.0 (2019-05-28)

##### Chores

* **ci:**  add redis on .travis.yml ([9404c48c](https://github.com/lykmapipo/postman/commit/9404c48caf66c816253105cf497f9ba7113ad724))
* **deps:**
  *  force latest version & audit fix ([5cdfce81](https://github.com/lykmapipo/postman/commit/5cdfce81da5062a48d4750cdaba558f95a35ad30))
  *  add push notification dependency ([63105567](https://github.com/lykmapipo/postman/commit/63105567201fc3a4c8662df61f91c855e70b6cc2))

##### Documentation Changes

*  fix typos and remove year from license ([0e35a66c](https://github.com/lykmapipo/postman/commit/0e35a66c5f17990229bc201390ecdc1e5c57c533))
*  add push usage docs ([8a990f7b](https://github.com/lykmapipo/postman/commit/8a990f7b75d2cb1f66855c1500360ded0976587b))

##### New Features

*  expose Push message factory ([649e5f48](https://github.com/lykmapipo/postman/commit/649e5f48879dec628eb31d3d4d984c1303d44736))
*  load fcm push transport ([24499a7f](https://github.com/lykmapipo/postman/commit/24499a7f1d642b599def4b8e1e9fb63ab7128ea5))
*  add message readAt and options ([de8ed1c0](https://github.com/lykmapipo/postman/commit/de8ed1c0d51469fc5b78fe73cf5ba84cc4613f3d))
* **push:**  initial fcm transport implementation ([d030f324](https://github.com/lykmapipo/postman/commit/d030f324d48c9ceb8ebc236375adb56ef62aea77))

##### Tests

*  skip fcm queue integration test ([2fb7a7c5](https://github.com/lykmapipo/postman/commit/2fb7a7c5e065712e42b920d214ca188d0e3ebbc9))
*  fix and improve fcm push transport send specs ([dcefc1e1](https://github.com/lykmapipo/postman/commit/dcefc1e14adb902e793233de137a605de7c01df7))
*  add fcm send specs ([784f46b4](https://github.com/lykmapipo/postman/commit/784f46b44fc31aba7e213bb826727765e21437a8))

#### 0.5.5 (2019-05-21)

##### Chores

* **deps:**
  *  force latest version & audit fix ([9cd183f6](https://github.com/lykmapipo/postman/commit/9cd183f6567f191187e5b6e06c5397df24492575))
  *  force latest version & audit fix ([841cac06](https://github.com/lykmapipo/postman/commit/841cac06aedd2e5dd9e3266a1168430814e8fc77))

#### 0.5.4 (2019-05-12)

##### Chores

* **deps:**  force latest version & audit fix ([3971fddb](https://github.com/lykmapipo/postman/commit/3971fddbe7d30de6f0781bb95bd5fc3653771a57))

#### 0.5.3 (2019-05-01)

##### Chores

* **ci:**  force latest nodejs ([c828574a](https://github.com/lykmapipo/postman/commit/c828574a58904ba3f5e20ac1d4a64ffeab4d5aaf))
* **.npmrc:**  prevent npm version to commit and tag version ([39e85f9e](https://github.com/lykmapipo/postman/commit/39e85f9e725f3956fc3f15166fea8b52e3165a62))
* **deps:**  force latest version & audit fix ([c01578df](https://github.com/lykmapipo/postman/commit/c01578df8ad87ae2d7350bb2eccff6c44348d6b1))

#### 0.5.2 (2019-04-16)

##### Chores

*  remove unused dependencies ([b1112856](https://github.com/lykmapipo/postman/commit/b11128567357af52813bb3d95fa0a4754779e5f4))
*  force latest dependencies ([e0f6fd48](https://github.com/lykmapipo/postman/commit/e0f6fd48d0ae7104edca631f568b610c24284faa))

##### Documentation Changes

*  add code of conduct and contributing guide ([ba6e6d08](https://github.com/lykmapipo/postman/commit/ba6e6d08b703322f50abf144c40cb0fdf0e004d9))

##### Refactors

*  use latest env & force laatest dependencies ([76502599](https://github.com/lykmapipo/postman/commit/76502599a834d5362d517c1f65c3edc4c1529e7b))

##### Tests

*  skip queue tests ([d4fd273a](https://github.com/lykmapipo/postman/commit/d4fd273a7b2f22b2a5b135b3d4aba536dc926253))
*  fix message unsent ([c2c01f0a](https://github.com/lykmapipo/postman/commit/c2c01f0a23cde242c6e1ba9f5ce2e21c7f5bd0a1))
*  fix message sent ([7b9333f6](https://github.com/lykmapipo/postman/commit/7b9333f615a3c0c0644253b5886665f9a6b48796))
*  fix tz ega sms transport ([798e8bf1](https://github.com/lykmapipo/postman/commit/798e8bf18b5cf314d0ee81fd58684fcd2d7d045d))
*  fix smtp transport ([008a50cf](https://github.com/lykmapipo/postman/commit/008a50cf3423bee930b29f3b552df6f9cf14a211))
*  fix infobip transport ([62fc2f07](https://github.com/lykmapipo/postman/commit/62fc2f0796f92804e8fb398f7e24f372eb04c264))
*  fix echo transport ([2155a90f](https://github.com/lykmapipo/postman/commit/2155a90f05f2bbe4dc0234691e2ad5f7cf49a2ce))
*  fix tz ega transport queue & add queue redis cleanups ([00b52eac](https://github.com/lykmapipo/postman/commit/00b52eacd1c7c9370ddfe7187ce50248d1231233))
*  fix smtp transport queue ([ad6b4952](https://github.com/lykmapipo/postman/commit/ad6b49521df71e1b6bb8109d9e2e4b6c39a4612d))
*  fix infobip transport queue ([6fc652ec](https://github.com/lykmapipo/postman/commit/6fc652ec2334cd2127db6498795fd47b8d9f8dbc))
*  fix echo transport queue test ([9997d064](https://github.com/lykmapipo/postman/commit/9997d0644717f2f7afce64e07797e75940571e68))
*  use mongoose test helpers and fix schema unit tests ([d15de0d7](https://github.com/lykmapipo/postman/commit/d15de0d7924eb7f1fdd423d730a6148165c7416b))

