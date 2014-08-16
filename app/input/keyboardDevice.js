define([
        'lodash',
        'input/inputDevice'
    ],
    function(
        _,
        InputDevice
    ) {
        'use strict';

        var KeyboardDevice = function() {
            InputDevice.call(this);

            // The current key being released or pressed
            this.currentKey  = null;
            this.currentChar = null;

            // Modifier keys (active state)
            this.capsLockKey = false;
            this.shiftKey    = false;

            // A list of all keys that may be down
            this.pressedKeys = {};

            // Internal variables to keep track of what keydown code responds to the keypress code
            this._currentKeyDown  = null;
            this._keyMappingPairs = {};

            // Easy access to the keyCodes from an instance
            this.keyCodes = KeyboardDevice.keyCodes;
        };

        KeyboardDevice.prototype = _.create(InputDevice.prototype, {
            constructor: KeyboardDevice,

            /**
            *   This method binds this device to window events.
            *
            *   @method init
            *   @returns {undefined}
            */
            initEvents: function() {
                this._onKeyDown  = this.onKeyDown.bind(this);
                this._onKeyPress = this.onKeyPress.bind(this);
                this._onKeyUp    = this.onKeyUp.bind(this);

                window.addEventListener('keydown', this._onKeyDown, false);
                window.addEventListener('keypress', this._onKeyPress, false);
                window.addEventListener('keyup', this._onKeyUp, false);
            },

            /**
            *   This method removes the window event device bindings.
            *
            *   @method removeEvents
            *   @returns {undefined}
            */
            removeEvents: function() {
                window.removeEventListener('keydown', this._onKeyDown, false);
                window.removeEventListener('keypress', this._onKeyPress, false);
                window.removeEventListener('keyup', this._onKeyUp, false);
            },

            /**
            *   This method handles the keydown event for non-alphabetic keys.
            *
            *   @method onKeyDown
            *   @returns {undefined}
            */
            onKeyDown: function() {

                this._keydown = event.keyCode;

                var keyCode = specialKeyMappings[event.keyCode];

                // If the keyCode exists
                if (typeof keyCode !== 'undefined') {

                    // Differentiate left CTRL from right CTRL
                    var keyLocation;
                    if (typeof event.location === 'number') {
                        keyLocation = event.location;
                    } else {
                        keyLocation = event.keyLocation;
                    }

                    // DOM_KEY_LOCATION_STANDARD = 0x00;
                    // DOM_KEY_LOCATION_LEFT     = 0x01;
                    // DOM_KEY_LOCATION_RIGHT    = 0x02;
                    // DOM_KEY_LOCATION_NUMPAD   = 0x03;
                    // DOM_KEY_LOCATION_MOBILE   = 0x04;
                    // DOM_KEY_LOCATION_JOYSTICK = 0x05;

                    // Webkit does not provide different keyCodes for left and right versions of keys
                    if (keyLocation === 2) {
                        keyCode = keyCode + 1;
                    }

                    // If this key is not already down
                    if (!this.pressedKeys[keyCode]) {
                        this.pressedKeys[keyCode] = true;

                        this.currentKey  = keyCode;
                        this.currentChar = characterMapping[keyCode] || '';

                        if (keyCode === KeyCodes.CapsLock) {
                            this.capsLockKey = !this.capsLockKey;
                        }

                        if (keyCode === KeyCodes.LeftShift || keyCode === KeyCodes.RightShift) {
                            this.shiftKey = !this.shiftKey;
                        }

                        console.log('keydown ' + this.currentKey + ' => ' + this.currentChar);
                        this.trigger('keydown', this);
                    }
                }
            },


            /**
            *   Webkit gives no method to detect if capslock is down inside
            *   keydown/keyup. We must listen to keypress to get that
            *   information.
            *
            *   @method onKeyPress
            *   @returns {undefined}
            */
            onKeyPress: function() {
                // Note: The specialKeyMappings keys do not trigger the keypress event

                // Convert the keyCode
                var keyCode = standardKeyMappings[event.keyCode];

                // If the keyCode exists
                if (typeof keyCode !== 'undefined') {

                    // Useful for determining the character case for the alpha keys
                    var isUpperCaseAlpha = (event.keyCode >= 65 && event.keyCode <= 90);

                    // If shift is not down, but the key is uppercase, the caps lock key is active
                    if (isUpperCaseAlpha && !event.shiftKey) {
                        this.capsLockKey = true;
                    } else {
                        this.capsLockKey = false;
                    }

                    // If this key is not already down
                    if (!this.pressedKeys[keyCode]) {
                        this.pressedKeys[keyCode] = true;

                        this.currentKey = keyCode;

                        if (isUpperCaseAlpha) {
                            this.currentChar = upperCaseMapping[keyCode] || '';
                        } else {
                            this.currentChar = characterMapping[keyCode] || '';
                        }

                        // The keyup event does not recieve the same key events as keypress
                        this._keyMappingPairs[this._keydown] = keyCode;

                        console.log('keypress ' + this.currentKey + ' => ' + this.currentChar);

                        this.trigger('keydown', this);
                    }
                }
            },

            /**
            *   This method handles webkit keyup events.
            *
            *   @method onKeyUp
            *   @param {event}
            *   @returns {undefined}
            */
            onKeyUp: (function() {

                // This function calls the 'keyup' event if the keyCode is pressed
                var handleKeyCode = function(keyCode) {
                    var isKeyPressed = this.pressedKeys[keyCode];
                    if (isKeyPressed) {
                        this.pressedKeys[keyCode] = false;
                        this.currentKey = keyCode;

                        var isUpperCaseAlpha = (this.shiftKey || this.capsLockKey) 
                                            && (keyCode >= KeyCodes.A && keyCode <= KeyCodes.Z);

                        if (isUpperCaseAlpha) {
                            this.currentChar = upperCaseMapping[keyCode] || '';
                        } else {
                            this.currentChar = characterMapping[keyCode] || '';
                        }

                        if (keyCode === KeyCodes.CapsLock) {
                            this.capsLockKey = !this.capsLockKey;
                        }

                        if (keyCode === KeyCodes.LeftShift || keyCode === KeyCodes.RightShift) {
                            this.shiftKey = !this.shiftKey;
                        }

                        console.log('keyup ' + this.currentKey + ' => ' + this.currentChar);
                        this.trigger('keyup', this);
                    }
                };
                
                // Actual onKeyUp method
                return function(event) {

                    var keyCode = specialKeyMappings[event.keyCode] || standardKeyMappings[event.keyCode];

                    // Differentiate left CTRL from right CTRL
                    var keyLocation;
                    if (typeof event.location === 'number') {
                        keyLocation = event.location;
                    } else {
                        keyLocation = event.keyLocation;
                    }

                    // DOM_KEY_LOCATION_STANDARD = 0x00;
                    // DOM_KEY_LOCATION_LEFT     = 0x01;
                    // DOM_KEY_LOCATION_RIGHT    = 0x02;
                    // DOM_KEY_LOCATION_NUMPAD   = 0x03;
                    // DOM_KEY_LOCATION_MOBILE   = 0x04;
                    // DOM_KEY_LOCATION_JOYSTICK = 0x05;

                    // Webkit does not provide different keyCodes for left and right versions of keys
                    if (keyLocation === 2) {
                        keyCode = keyCode + 1;
                    }

                    // Convert the keyCode
                    handleKeyCode.call(this, keyCode);

                    // Handle both 'A' and 'a' keyup events
                    handleKeyCode.call(this, this._keyMappingPairs[event.keyCode]);
                };

            })(),

            /**
            *   This method returns the current key being pressed.
            *
            *   @method getCurrentKey
            *   @returns {undefined}
            */
            getCurrentKey: function() {
                return this.currentKey;
            }
        });

        var KeyCodes = KeyboardDevice.keyCodes = {
            None              : 0,    //  Not assigned (never returned as the result of a keystroke).

            A                 : 100,  //  'a' key.
            B                 : 101,  //  'b' key.
            C                 : 102,  //  'c' key.
            D                 : 103,  //  'd' key.
            E                 : 104,  //  'e' key.
            F                 : 105,  //  'f' key.
            G                 : 106,  //  'g' key.
            H                 : 107,  //  'h' key.
            I                 : 108,  //  'i' key.
            J                 : 109,  //  'j' key.
            K                 : 110,  //  'k' key.
            L                 : 111,  //  'l' key.
            M                 : 112,  //  'm' key.
            N                 : 113,  //  'n' key.
            O                 : 114,  //  'o' key.
            P                 : 115,  //  'p' key.
            Q                 : 116,  //  'q' key.
            R                 : 117,  //  'r' key.
            S                 : 118,  //  's' key.
            T                 : 119,  //  't' key.
            U                 : 120,  //  'u' key.
            V                 : 121,  //  'v' key.
            W                 : 122,  //  'w' key.
            X                 : 123,  //  'x' key.
            Y                 : 124,  //  'y' key.
            Z                 : 125,  //  'z' key.

            Exclaim           : 200,  //  Exclamation mark key '!'.
            DoubleQuote       : 201,  //  Double quote key '"'.
            Hash              : 202,  //  Hash key '#'.
            Dollar            : 203,  //  Dollar sign key '$'.
            Percent           : 204,  //  Percent key '%'.
            Ampersand         : 205,  //  Ampersand key '&'.
            Quote             : 206,  //  Quote key '.
            LeftParen         : 207,  //  Left Parenthesis key '('.
            RightParen        : 208,  //  Right Parenthesis key ')'.
            Asterisk          : 209,  //  Asterisk key '*'.
            Plus              : 210,  //  Plus key '+'.
            Comma             : 211,  //  Comma ',' key.
            Minus             : 212,  //  Minus '-' key.
            Period            : 213,  //  Period '.' key.
            Slash             : 214,  //  Slash '/' key.
            Colon             : 215,  //  Colon ':' key.
            Semicolon         : 216,  //  Semicolon ';' key.
            Less              : 217,  //  Less than '<' key.
            Equals            : 218,  //  Equals '=' key.
            Greater           : 219,  //  Greater than '>' key.
            Question          : 220,  //  Question mark '?' key.
            At                : 221,  //  At key '@'.
            LeftBracket       : 222,  //  Left square bracket key '['.
            Backslash         : 223,  //  Backslash key '\'.
            RightBracket      : 224,  //  Right square bracket key ']'.
            LeftCurlyBracket  : 225,  //  Left square bracket key '{'.
            Pipe              : 226,  //  Backslash key '|'.
            RightCurlyBracket : 227,  //  Right square bracket key '}'.
            Caret             : 228,  //  Caret key '^'.
            Underscore        : 229,  //  Underscore '_' key.
            BackQuote         : 230,  //  Back quote key '`'.
            Tilde             : 231,  //  Tilde key '~'.
            Space             : 232,  //  Space key.
            Tab               : 233,  //  The tab key.

            Number0           : 300,  //  Numeric keypad 0.
            Number1           : 301,  //  Numeric keypad 1.
            Number2           : 302,  //  Numeric keypad 2.
            Number3           : 303,  //  Numeric keypad 3.
            Number4           : 304,  //  Numeric keypad 4.
            Number5           : 305,  //  Numeric keypad 5.
            Number6           : 306,  //  Numeric keypad 6.
            Number7           : 307,  //  Numeric keypad 7.
            Number8           : 308,  //  Numeric keypad 8.
            Number9           : 309,  //  Numeric keypad 9.

            UpArrow           : 400,  //  Up arrow key.
            DownArrow         : 401,  //  Down arrow key.
            RightArrow        : 402,  //  Right arrow key.
            LeftArrow         : 403,  //  Left arrow key.

            Insert            : 500,  //  Insert key key.
            Home              : 501,  //  Home key.
            End               : 502,  //  End key.
            PageUp            : 503,  //  Page up.
            PageDown          : 504,  //  Page down.

            Backspace         : 600,  //  The backspace key.
            Delete            : 601,  //  The forward delete key.
            Return            : 602,  //  Return key.
            Escape            : 603,  //  Escape key.

            CapsLock          : 700,  //  Capslock key.
            LeftShift         : 701,  //  Left shift key.
            RightShift        : 702,  //  Right shift key.
            LeftControl       : 703,  //  Left Control key.
            RightControl      : 704,  //  Right Control key.
            LeftAlt           : 705,  //  Left Alt key.
            RightAlt          : 706,  //  Right Alt key.
            LeftCommand       : 707,  //  Left Command key.
            RightCommand      : 708,  //  Right Command key.

            F1                : 800,  //  F1 function key.
            F2                : 801,  //  F2 function key.
            F3                : 802,  //  F3 function key.
            F4                : 803,  //  F4 function key.
            F5                : 804,  //  F5 function key.
            F6                : 805,  //  F6 function key.
            F7                : 806,  //  F7 function key.
            F8                : 807,  //  F8 function key.
            F9                : 808,  //  F9 function key.
            F10               : 809,  //  F10 function key.
            F11               : 810,  //  F11 function key.
            F12               : 811   //  F12 function key.
        };

        var standardKeyMappings = {
            32  : KeyCodes.Space,             //  Space key.
            33  : KeyCodes.Exclaim,           //  Exclamation mark key '!'.
            34  : KeyCodes.DoubleQuote,       //  Double quote key '"'.
            35  : KeyCodes.Hash,              //  Hash key '#'.
            36  : KeyCodes.Dollar,            //  Dollar sign key '$'.
            37  : KeyCodes.Percent,           //  Percent key '%'.
            38  : KeyCodes.Ampersand,         //  Ampersand key '&'.
            39  : KeyCodes.Quote,             //  Quote key '.
            40  : KeyCodes.LeftParen,         //  Left Parenthesis key '('.
            41  : KeyCodes.RightParen,        //  Right Parenthesis key ')'.
            42  : KeyCodes.Asterisk,          //  Asterisk key '*'.
            43  : KeyCodes.Plus,              //  Plus key '+'.
            44  : KeyCodes.Comma,             //  Comma ',' key.
            45  : KeyCodes.Minus,             //  Minus '-' key.
            46  : KeyCodes.Period,            //  Period '.' key.
            47  : KeyCodes.Slash,             //  Slash '/' key.
            58  : KeyCodes.Colon,             //  Colon ':' key.
            59  : KeyCodes.Semicolon,         //  Semicolon ';' key.
            60  : KeyCodes.Less,              //  Less than '<' key.
            61  : KeyCodes.Equals,            //  Equals '=' key.
            62  : KeyCodes.Greater,           //  Greater than '>' key.
            63  : KeyCodes.Question,          //  Question mark '?' key.
            64  : KeyCodes.At,                //  At key '@'.
            91  : KeyCodes.LeftBracket,       //  Left square bracket key '['.
            92  : KeyCodes.Backslash,         //  Backslash key '\'.
            93  : KeyCodes.RightBracket,      //  Right square bracket key ']'.
            123 : KeyCodes.LeftCurlyBracket,  //  Left square bracket key '{'.
            124 : KeyCodes.Pipe,              //  Backslash key '|'.
            125 : KeyCodes.RightCurlyBracket, //  Right square bracket key '}'.
            94  : KeyCodes.Caret,             //  Caret key '^'.
            95  : KeyCodes.Underscore,        //  Underscore '_' key.
            96  : KeyCodes.BackQuote,         //  Back quote key '`'.
            126 : KeyCodes.Tilde,             //  Back quote key '~'.

            65  : KeyCodes.A,                 //  'A' key.
            66  : KeyCodes.B,                 //  'B' key.
            67  : KeyCodes.C,                 //  'C' key.
            68  : KeyCodes.D,                 //  'D' key.
            69  : KeyCodes.E,                 //  'E' key.
            70  : KeyCodes.F,                 //  'F' key.
            71  : KeyCodes.G,                 //  'G' key.
            72  : KeyCodes.H,                 //  'H' key.
            73  : KeyCodes.I,                 //  'I' key.
            74  : KeyCodes.J,                 //  'J' key.
            75  : KeyCodes.K,                 //  'K' key.
            76  : KeyCodes.L,                 //  'L' key.
            77  : KeyCodes.M,                 //  'M' key.
            78  : KeyCodes.N,                 //  'N' key.
            79  : KeyCodes.O,                 //  'O' key.
            80  : KeyCodes.P,                 //  'P' key.
            81  : KeyCodes.Q,                 //  'Q' key.
            82  : KeyCodes.R,                 //  'R' key.
            83  : KeyCodes.S,                 //  'S' key.
            84  : KeyCodes.T,                 //  'T' key.
            85  : KeyCodes.U,                 //  'U' key.
            86  : KeyCodes.V,                 //  'V' key.
            87  : KeyCodes.W,                 //  'W' key.
            88  : KeyCodes.X,                 //  'X' key.
            89  : KeyCodes.Y,                 //  'Y' key.
            90  : KeyCodes.Z,                 //  'Z' key.

            97  : KeyCodes.A,                 //  'a' key.
            98  : KeyCodes.B,                 //  'b' key.
            99  : KeyCodes.C,                 //  'c' key.
            100 : KeyCodes.D,                 //  'd' key.
            101 : KeyCodes.E,                 //  'e' key.
            102 : KeyCodes.F,                 //  'f' key.
            103 : KeyCodes.G,                 //  'g' key.
            104 : KeyCodes.H,                 //  'h' key.
            105 : KeyCodes.I,                 //  'i' key.
            106 : KeyCodes.J,                 //  'j' key.
            107 : KeyCodes.K,                 //  'k' key.
            108 : KeyCodes.L,                 //  'l' key.
            109 : KeyCodes.M,                 //  'm' key.
            110 : KeyCodes.N,                 //  'n' key.
            111 : KeyCodes.O,                 //  'o' key.
            112 : KeyCodes.P,                 //  'p' key.
            113 : KeyCodes.Q,                 //  'q' key.
            114 : KeyCodes.R,                 //  'r' key.
            115 : KeyCodes.S,                 //  's' key.
            116 : KeyCodes.T,                 //  't' key.
            117 : KeyCodes.U,                 //  'u' key.
            118 : KeyCodes.V,                 //  'v' key.
            119 : KeyCodes.W,                 //  'w' key.
            120 : KeyCodes.X,                 //  'x' key.
            121 : KeyCodes.Y,                 //  'y' key.
            122 : KeyCodes.Z,                 //  'z' key.

            48  : KeyCodes.Number0,           //  Numeric 0.
            49  : KeyCodes.Number1,           //  Numeric 1.
            50  : KeyCodes.Number2,           //  Numeric 2.
            51  : KeyCodes.Number3,           //  Numeric 3.
            52  : KeyCodes.Number4,           //  Numeric 4.
            53  : KeyCodes.Number5,           //  Numeric 5.
            54  : KeyCodes.Number6,           //  Numeric 6.
            55  : KeyCodes.Number7,           //  Numeric 7.
            56  : KeyCodes.Number8,           //  Numeric 8.
            57  : KeyCodes.Number9            //  Numeric 9.
        };

        var specialKeyMappings = {
            9   : KeyCodes.Tab,               //  The tab key.

            38  : KeyCodes.UpArrow,           //  Up arrow key.
            40  : KeyCodes.DownArrow,         //  Down arrow key.
            39  : KeyCodes.RightArrow,        //  Right arrow key.
            37  : KeyCodes.LeftArrow,         //  Left arrow key.

            45  : KeyCodes.Insert,            //  Insert key key.
            36  : KeyCodes.Home,              //  Home key.
            35  : KeyCodes.End,               //  End key.
            33  : KeyCodes.PageUp,            //  Page up.
            34  : KeyCodes.PageDown,          //  Page down.

            8   : KeyCodes.Backspace,         //  The backspace key.
            46  : KeyCodes.Delete,            //  The forward delete key.
            13  : KeyCodes.Return,            //  Return key.
            27  : KeyCodes.Escape,            //  Escape key.

            20  : KeyCodes.CapsLock,          //  Capslock key.
          //16  : KeyCodes.RightShift,        //  Right shift key.
            16  : KeyCodes.LeftShift,         //  Left shift key.
          //17  : KeyCodes.RightControl,      //  Right Control key.
            17  : KeyCodes.LeftControl,       //  Left Control key.
          //18  : KeyCodes.RightAlt,          //  Right Alt key.
            18  : KeyCodes.LeftAlt,           //  Left Alt key.

            91  : KeyCodes.LeftCommand,       //  Left Command key.
            93  : KeyCodes.RightCommand,      //  Right Command key.

            112 : KeyCodes.F1,                //  F1 function key.
            113 : KeyCodes.F2,                //  F2 function key.
            114 : KeyCodes.F3,                //  F3 function key.
            115 : KeyCodes.F4,                //  F4 function key.
            116 : KeyCodes.F5,                //  F5 function key.
            117 : KeyCodes.F6,                //  F6 function key.
            118 : KeyCodes.F7,                //  F7 function key.
            119 : KeyCodes.F8,                //  F8 function key.
            120 : KeyCodes.F9,                //  F9 function key.
            121 : KeyCodes.F10,               //  F10 function key.
            122 : KeyCodes.F11,               //  F11 function key.
            123 : KeyCodes.F12                //  F12 function key.
        };

        var characterMapping = {};
        characterMapping[KeyCodes.Exclaim]           = '!';
        characterMapping[KeyCodes.DoubleQuote]       = '"';
        characterMapping[KeyCodes.Hash]              = '#';
        characterMapping[KeyCodes.Dollar]            = '$';
        characterMapping[KeyCodes.Percent]           = '%';
        characterMapping[KeyCodes.Ampersand]         = '&';
        characterMapping[KeyCodes.Quote]             = '\'';
        characterMapping[KeyCodes.LeftParen]         = '(';
        characterMapping[KeyCodes.RightParen]        = ')';
        characterMapping[KeyCodes.Asterisk]          = '*';
        characterMapping[KeyCodes.Plus]              = '+';
        characterMapping[KeyCodes.Comma]             = ',';
        characterMapping[KeyCodes.Minus]             = '-';
        characterMapping[KeyCodes.Period]            = '.';
        characterMapping[KeyCodes.Slash]             = '/';
        characterMapping[KeyCodes.Colon]             = ':';
        characterMapping[KeyCodes.Semicolon]         = ';';
        characterMapping[KeyCodes.Less]              = '<';
        characterMapping[KeyCodes.Equals]            = '=';
        characterMapping[KeyCodes.Greater]           = '>';
        characterMapping[KeyCodes.Question]          = '?';
        characterMapping[KeyCodes.At]                = '@';
        characterMapping[KeyCodes.LeftBracket]       = '[';
        characterMapping[KeyCodes.Backslash]         = '\\';
        characterMapping[KeyCodes.RightBracket]      = ']';
        characterMapping[KeyCodes.LeftCurlyBracket]  = '{';
        characterMapping[KeyCodes.Pipe]              = '|';
        characterMapping[KeyCodes.RightCurlyBracket] = '}';
        characterMapping[KeyCodes.Caret]             = '^';
        characterMapping[KeyCodes.Underscore]        = '_';
        characterMapping[KeyCodes.BackQuote]         = '`';
        characterMapping[KeyCodes.Tilde]             = '~';
        characterMapping[KeyCodes.Space]             = ' ';
        characterMapping[KeyCodes.Tab]               = '\t';
        characterMapping[KeyCodes.Return]            = '\n';
        characterMapping[KeyCodes.Backspace]         = '\b';

        characterMapping[KeyCodes.Number0]           = '0';
        characterMapping[KeyCodes.Number1]           = '1';
        characterMapping[KeyCodes.Number2]           = '2';
        characterMapping[KeyCodes.Number3]           = '3';
        characterMapping[KeyCodes.Number4]           = '4';
        characterMapping[KeyCodes.Number5]           = '5';
        characterMapping[KeyCodes.Number6]           = '6';
        characterMapping[KeyCodes.Number7]           = '7';
        characterMapping[KeyCodes.Number8]           = '8';
        characterMapping[KeyCodes.Number9]           = '9';

        characterMapping[KeyCodes.A]                 = 'a';
        characterMapping[KeyCodes.B]                 = 'b';
        characterMapping[KeyCodes.C]                 = 'c';
        characterMapping[KeyCodes.D]                 = 'd';
        characterMapping[KeyCodes.E]                 = 'e';
        characterMapping[KeyCodes.F]                 = 'f';
        characterMapping[KeyCodes.G]                 = 'g';
        characterMapping[KeyCodes.H]                 = 'h';
        characterMapping[KeyCodes.I]                 = 'i';
        characterMapping[KeyCodes.J]                 = 'j';
        characterMapping[KeyCodes.K]                 = 'k';
        characterMapping[KeyCodes.L]                 = 'l';
        characterMapping[KeyCodes.M]                 = 'm';
        characterMapping[KeyCodes.N]                 = 'n';
        characterMapping[KeyCodes.O]                 = 'o';
        characterMapping[KeyCodes.P]                 = 'p';
        characterMapping[KeyCodes.Q]                 = 'q';
        characterMapping[KeyCodes.R]                 = 'r';
        characterMapping[KeyCodes.S]                 = 's';
        characterMapping[KeyCodes.T]                 = 't';
        characterMapping[KeyCodes.U]                 = 'u';
        characterMapping[KeyCodes.V]                 = 'v';
        characterMapping[KeyCodes.W]                 = 'w';
        characterMapping[KeyCodes.X]                 = 'x';
        characterMapping[KeyCodes.Y]                 = 'y';
        characterMapping[KeyCodes.Z]                 = 'z';

        var upperCaseMapping = {};
        upperCaseMapping[KeyCodes.A]                 = 'A';
        upperCaseMapping[KeyCodes.B]                 = 'B';
        upperCaseMapping[KeyCodes.C]                 = 'C';
        upperCaseMapping[KeyCodes.D]                 = 'D';
        upperCaseMapping[KeyCodes.E]                 = 'E';
        upperCaseMapping[KeyCodes.F]                 = 'F';
        upperCaseMapping[KeyCodes.G]                 = 'G';
        upperCaseMapping[KeyCodes.H]                 = 'H';
        upperCaseMapping[KeyCodes.I]                 = 'I';
        upperCaseMapping[KeyCodes.J]                 = 'J';
        upperCaseMapping[KeyCodes.K]                 = 'K';
        upperCaseMapping[KeyCodes.L]                 = 'L';
        upperCaseMapping[KeyCodes.M]                 = 'M';
        upperCaseMapping[KeyCodes.N]                 = 'N';
        upperCaseMapping[KeyCodes.O]                 = 'O';
        upperCaseMapping[KeyCodes.P]                 = 'P';
        upperCaseMapping[KeyCodes.Q]                 = 'Q';
        upperCaseMapping[KeyCodes.R]                 = 'R';
        upperCaseMapping[KeyCodes.S]                 = 'S';
        upperCaseMapping[KeyCodes.T]                 = 'T';
        upperCaseMapping[KeyCodes.U]                 = 'U';
        upperCaseMapping[KeyCodes.V]                 = 'V';
        upperCaseMapping[KeyCodes.W]                 = 'W';
        upperCaseMapping[KeyCodes.X]                 = 'X';
        upperCaseMapping[KeyCodes.Y]                 = 'Y';
        upperCaseMapping[KeyCodes.Z]                 = 'Z';

        return KeyboardDevice;
    }
);
