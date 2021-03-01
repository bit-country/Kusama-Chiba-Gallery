/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common/MessageTypes.js":
/*!************************************!*\
  !*** ./src/common/MessageTypes.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PLAYER_MOVE\": () => (/* binding */ PLAYER_MOVE),\n/* harmony export */   \"PLAYER_STOP\": () => (/* binding */ PLAYER_STOP),\n/* harmony export */   \"PLAYER_JOINED\": () => (/* binding */ PLAYER_JOINED),\n/* harmony export */   \"PLAYER_CHAT\": () => (/* binding */ PLAYER_CHAT),\n/* harmony export */   \"BROADCAST_PLAYER_JOINED\": () => (/* binding */ BROADCAST_PLAYER_JOINED),\n/* harmony export */   \"BROADCAST_PLAYER_POSITION\": () => (/* binding */ BROADCAST_PLAYER_POSITION),\n/* harmony export */   \"BROADCAST_CHAT\": () => (/* binding */ BROADCAST_CHAT),\n/* harmony export */   \"BROADCAST_CHAT_INIT\": () => (/* binding */ BROADCAST_CHAT_INIT)\n/* harmony export */ });\n// player movement - client side\nvar PLAYER_MOVE = \"PLAYER_MOVE\";\nvar PLAYER_STOP = \"PLAYER_STOP\";\nvar PLAYER_JOINED = \"PLAYER_JOINED\"; // send chat content to server\n\nvar PLAYER_CHAT = \"PLAYER_CHAT\"; // server side announcement\n\nvar BROADCAST_PLAYER_JOINED = \"BROADCAST_PLAYER_JOINED\";\nvar BROADCAST_PLAYER_POSITION = \"BROADCAST_PLAYER_POSITION\"; // broadcast chat content to everyone\n\nvar BROADCAST_CHAT = \"BROADCAST_CHAT\";\nvar BROADCAST_CHAT_INIT = \"BROADCAST_CHAT_INIT\";\n\n//# sourceURL=webpack://chiba-gallery/./src/common/MessageTypes.js?");

/***/ }),

/***/ "./src/common/Player.js":
/*!******************************!*\
  !*** ./src/common/Player.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var _colyseus_schema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @colyseus/schema */ \"@colyseus/schema\");\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\n/* eslint-disable */\n\n\nvar Player = /*#__PURE__*/function (_Schema) {\n  _inherits(Player, _Schema);\n\n  var _super = _createSuper(Player);\n\n  function Player() {\n    _classCallCheck(this, Player);\n\n    return _super.apply(this, arguments);\n  }\n\n  return Player;\n}(_colyseus_schema__WEBPACK_IMPORTED_MODULE_0__.Schema);\n\n\n(0,_colyseus_schema__WEBPACK_IMPORTED_MODULE_0__.defineTypes)(Player, {\n  name: \"string\",\n  entityId: \"number\",\n  sessionId: \"string\",\n  x: \"number\",\n  y: \"number\",\n  z: \"number\",\n  heading: \"number\",\n  joinedTime: \"string\",\n  leaveTime: \"string\",\n  character: \"string\"\n});\n\n//# sourceURL=webpack://chiba-gallery/./src/common/Player.js?");

/***/ }),

/***/ "./src/common/StateHandler.js":
/*!************************************!*\
  !*** ./src/common/StateHandler.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ StateHandler)\n/* harmony export */ });\n/* harmony import */ var _colyseus_schema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @colyseus/schema */ \"@colyseus/schema\");\n/* harmony import */ var _Player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Player.js */ \"./src/common/Player.js\");\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\n/* eslint-disable */\n\n\n\nvar StateHandler = /*#__PURE__*/function (_Schema) {\n  _inherits(StateHandler, _Schema);\n\n  var _super = _createSuper(StateHandler);\n\n  function StateHandler() {\n    var _this;\n\n    _classCallCheck(this, StateHandler);\n\n    _this = _super.call(this);\n    _this.players = new _colyseus_schema__WEBPACK_IMPORTED_MODULE_0__.MapSchema();\n    return _this;\n  }\n\n  return StateHandler;\n}(_colyseus_schema__WEBPACK_IMPORTED_MODULE_0__.Schema);\n\n\n(0,_colyseus_schema__WEBPACK_IMPORTED_MODULE_0__.defineTypes)(StateHandler, {\n  players: {\n    map: _Player_js__WEBPACK_IMPORTED_MODULE_1__.default\n  }\n});\n\n//# sourceURL=webpack://chiba-gallery/./src/common/StateHandler.js?");

/***/ }),

/***/ "./src/server/ChatService.js":
/*!***********************************!*\
  !*** ./src/server/ChatService.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Read\": () => (/* binding */ Read),\n/* harmony export */   \"Write\": () => (/* binding */ Write)\n/* harmony export */ });\n/* harmony import */ var _DBConnection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DBConnection */ \"./src/server/DBConnection.js\");\n\nvar Read = function Read(collection, filter) {\n  return (0,_DBConnection__WEBPACK_IMPORTED_MODULE_0__.getDocuments)(collection, filter);\n};\nvar Write = function Write(data, collection) {\n  (0,_DBConnection__WEBPACK_IMPORTED_MODULE_0__.insertDocument)(data, collection);\n};\n\n//# sourceURL=webpack://chiba-gallery/./src/server/ChatService.js?");

/***/ }),

/***/ "./src/server/DBConnection.js":
/*!************************************!*\
  !*** ./src/server/DBConnection.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"insertDocument\": () => (/* binding */ insertDocument),\n/* harmony export */   \"getDocuments\": () => (/* binding */ getDocuments),\n/* harmony export */   \"ConnectToDb\": () => (/* binding */ ConnectToDb),\n/* harmony export */   \"CloseConnection\": () => (/* binding */ CloseConnection)\n/* harmony export */ });\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n\nvar dbName = \"Gallery\";\nvar dbClient = null;\nvar db = null;\nvar insertDocument = function insertDocument(data, collectionToInsert) {\n  var collection = db.collection(collectionToInsert);\n  collection.insert(data, function (err, result) {\n    console.log(\"Inserted documents into the collection\");\n  });\n};\nvar getDocuments = function getDocuments(collectionToGet) {\n  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {\n    room: \"lobby\"\n  };\n  var collection = db.collection(collectionToGet);\n  return collection.find(filter).sort({\n    time: -1\n  }).limit(100).toArray().then(function (docs) {\n    return docs;\n  });\n};\nvar ConnectToDb = function ConnectToDb() {\n  // Connection URL\n  var url = process.env.dbConnectionString; // Use connect method to connect to the server\n\n  mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient.connect(url, function (err, client) {\n    console.log(\"Connected successfully to server\");\n    dbClient = client;\n    db = client.db(dbName);\n  });\n};\nvar CloseConnection = function CloseConnection() {\n  dbClient.close();\n};\n\n//# sourceURL=webpack://chiba-gallery/./src/server/DBConnection.js?");

/***/ }),

/***/ "./src/server/GameRoom.js":
/*!********************************!*\
  !*** ./src/server/GameRoom.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GameRoom\": () => (/* binding */ GameRoom)\n/* harmony export */ });\n/* harmony import */ var colyseus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! colyseus */ \"colyseus\");\n/* harmony import */ var colyseus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(colyseus__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _common_StateHandler_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/StateHandler.js */ \"./src/common/StateHandler.js\");\n/* harmony import */ var _common_Player_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/Player.js */ \"./src/common/Player.js\");\n/* harmony import */ var _common_MessageTypes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/MessageTypes.js */ \"./src/common/MessageTypes.js\");\n/* harmony import */ var _ChatService_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ChatService.js */ \"./src/server/ChatService.js\");\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n/* eslint-disable */\n\n\n\n\n\n\nfunction randomPosition(min, max) {\n  return Math.random() * (max - min) + min;\n}\n\nfunction getCurrentTime() {\n  return new Date().toLocaleTimeString([], {\n    timeStyle: \"short\"\n  });\n}\n\nvar GameRoom = /*#__PURE__*/function (_Room) {\n  _inherits(GameRoom, _Room);\n\n  var _super = _createSuper(GameRoom);\n\n  function GameRoom() {\n    var _this;\n\n    _classCallCheck(this, GameRoom);\n\n    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    _this = _super.call.apply(_super, [this].concat(args));\n\n    _defineProperty(_assertThisInitialized(_this), \"maxClients\", 50);\n\n    return _this;\n  }\n\n  _createClass(GameRoom, [{\n    key: \"onCreate\",\n    value: function onCreate(options) {\n      var _this2 = this;\n\n      this.setState(new _common_StateHandler_js__WEBPACK_IMPORTED_MODULE_1__.default()); // event check\n\n      this.onMessage(_common_MessageTypes_js__WEBPACK_IMPORTED_MODULE_3__.PLAYER_MOVE, function (client, _ref) {\n        var position = _ref.position,\n            rotation = _ref.rotation,\n            direction = _ref.direction;\n        var player = _this2.state.players[client.sessionId];\n        player.x = position._x;\n        player.y = position._y;\n        player.z = position._z;\n\n        _this2.broadcast(_common_MessageTypes_js__WEBPACK_IMPORTED_MODULE_3__.BROADCAST_PLAYER_POSITION, {\n          movement: _common_MessageTypes_js__WEBPACK_IMPORTED_MODULE_3__.PLAYER_MOVE,\n          sessionId: client.sessionId,\n          position: {\n            x: position._x,\n            y: position._y,\n            z: position._z\n          },\n          rotation: rotation,\n          direction: direction\n        }, {\n          except: client\n        });\n      });\n      this.onMessage(_common_MessageTypes_js__WEBPACK_IMPORTED_MODULE_3__.PLAYER_STOP, function (client) {\n        _this2.broadcast(_common_MessageTypes_js__WEBPACK_IMPORTED_MODULE_3__.BROADCAST_PLAYER_POSITION, {\n          movement: _common_MessageTypes_js__WEBPACK_IMPORTED_MODULE_3__.PLAYER_STOP,\n          sessionId: client.sessionId\n        }, {\n          except: client\n        });\n      });\n      this.onMessage(_common_MessageTypes_js__WEBPACK_IMPORTED_MODULE_3__.PLAYER_CHAT, function (client, _ref2) {\n        var content = _ref2.content,\n            room = _ref2.room;\n        console.log(client);\n        var data = {\n          room: _this2.roomName,\n          content: content,\n          sender: _this2.state.players[client.id].name,\n          senderId: client.id,\n          time: new Date().toLocaleString()\n        }; //chatService.Write(data, \"Chat\");\n\n        _this2.broadcast(_common_MessageTypes_js__WEBPACK_IMPORTED_MODULE_3__.BROADCAST_CHAT, data);\n      });\n    }\n  }, {\n    key: \"onJoin\",\n    value: function onJoin(client, _ref3) {\n      var name = _ref3.name,\n          character = _ref3.character;\n\n      //  this.clients[0].send()\n      if (typeof this.state.players[client.sessionId] === \"undefined\") {\n        // chatService.Read(\"Chat\", { room: this.roomName }).then((chat) => {\n        //   if (chat) {\n        //     client.send(BROADCAST_CHAT_INIT, chat);\n        //   }\n        // });\n        var player = new _common_Player_js__WEBPACK_IMPORTED_MODULE_2__.default();\n        player.name = name;\n        player.x = 0;\n        player.y = 0;\n        player.z = 0;\n        player.character = character;\n        player.joinedTime = getCurrentTime();\n        player.sessionId = client.sessionId;\n        this.state.players[client.sessionId] = player;\n        this.broadcast(_common_MessageTypes_js__WEBPACK_IMPORTED_MODULE_3__.BROADCAST_PLAYER_JOINED, {\n          playerName: name\n        });\n      }\n    }\n  }, {\n    key: \"onLeave\",\n    value: function onLeave(client) {\n      console.log(\"\".concat(client.sessionId, \" left\"));\n      this.state.players[client.sessionId].leaveTime = getCurrentTime();\n      this.broadcast(\"removePlayer\", {\n        sessionId: client.sessionId,\n        player: this.state.players[client.sessionId]\n      });\n      delete this.state.players[client.sessionId];\n    }\n  }, {\n    key: \"onDispose\",\n    value: function onDispose() {// return new Promise((resolve, reject) => {\n      //   doDatabaseOperation((err, data) => {\n      //     if (err) {\n      //       reject(err);\n      //     } else {\n      //       resolve(data);\n      //     }\n      //   });\n      // });\n    }\n  }]);\n\n  return GameRoom;\n}(colyseus__WEBPACK_IMPORTED_MODULE_0__.Room);\n\n//# sourceURL=webpack://chiba-gallery/./src/server/GameRoom.js?");

/***/ }),

/***/ "./src/server/index.js":
/*!*****************************!*\
  !*** ./src/server/index.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"port\": () => (/* binding */ port)\n/* harmony export */ });\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var colyseus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! colyseus */ \"colyseus\");\n/* harmony import */ var colyseus__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(colyseus__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _GameRoom_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./GameRoom.js */ \"./src/server/GameRoom.js\");\n/* harmony import */ var _DBConnection_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DBConnection.js */ \"./src/server/DBConnection.js\");\n\n\n\n\n\n\n\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\n\nvar port = process.env.PORT || 2657;\nvar app = express__WEBPACK_IMPORTED_MODULE_1___default()();\napp.use(cors__WEBPACK_IMPORTED_MODULE_2___default()());\napp.use(express__WEBPACK_IMPORTED_MODULE_1___default().json());\napp.use(express__WEBPACK_IMPORTED_MODULE_1___default().static(\"./src/client/\")); // Create HTTP & WebSocket servers\n\nvar server = http__WEBPACK_IMPORTED_MODULE_0___default().createServer(app);\nvar gameServer = new colyseus__WEBPACK_IMPORTED_MODULE_3__.Server({\n  server: server,\n  express: app,\n  pingInterval: 1000\n});\ngameServer.define(\"lobby\", _GameRoom_js__WEBPACK_IMPORTED_MODULE_4__.GameRoom);\napp.post(\"/room/new\", function (request, response) {\n  gameServer.define(request.body.name, _GameRoom_js__WEBPACK_IMPORTED_MODULE_4__.GameRoom);\n  console.log(\"Created: \".concat(request.body.name));\n  return response.status(201).send(\"Created: \".concat(request.body.name));\n});\nserver.listen(port); //ConnectToDb();\n\nconsole.log(\"Listening on \".concat(port));\n\n//# sourceURL=webpack://chiba-gallery/./src/server/index.js?");

/***/ }),

/***/ "@colyseus/schema":
/*!***********************************!*\
  !*** external "@colyseus/schema" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@colyseus/schema");;

/***/ }),

/***/ "colyseus":
/*!***************************!*\
  !*** external "colyseus" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("colyseus");;

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");;

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");;

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");;

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");;

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/server/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;