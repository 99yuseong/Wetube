/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/js/editChannel.js":
/*!**************************************!*\
  !*** ./src/client/js/editChannel.js ***!
  \**************************************/
/***/ (() => {

eval("function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\nvar editChannelForm = document.querySelector('.edit-channel-form');\nvar inputName = editChannelForm.querySelector('.input-name');\nvar inputAvatar = editChannelForm.querySelector('.input-avatar');\nvar nameMsg = editChannelForm.querySelector('.name-msg');\nvar avatar = editChannelForm.querySelector('.avatar');\n\nvar nameCheck = /*#__PURE__*/function () {\n  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {\n    var url, check;\n    return regeneratorRuntime.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            url = window.location.pathname;\n            _context.next = 3;\n            return fetch(\"\".concat(url, \"/name\"), {\n              method: 'POST',\n              headers: {\n                'Content-Type': 'application/json'\n              },\n              body: JSON.stringify({\n                name: inputName.value\n              })\n            });\n\n          case 3:\n            _context.next = 5;\n            return _context.sent.json();\n\n          case 5:\n            check = _context.sent;\n\n            if (check.name === 'taken') {\n              nameMsg.innerText = inputName.value === '' ? '' : 'Channel name is already taken';\n            } else {// check.name === 'valid'\n              // valid 아닐때 버튼 누르면 required\n            }\n\n          case 7:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function nameCheck() {\n    return _ref.apply(this, arguments);\n  };\n}();\n\nvar showAvatar = function showAvatar() {\n  var reader = new FileReader();\n\n  reader.onload = function (e) {\n    avatar.src = e.target.result;\n  };\n\n  reader.readAsDataURL(inputAvatar.files[0]);\n};\n\ninputName.addEventListener('input', nameCheck);\ninputAvatar.addEventListener('change', showAvatar);\n\n//# sourceURL=webpack://project_wetube/./src/client/js/editChannel.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/editChannel.js"]();
/******/ 	
/******/ })()
;