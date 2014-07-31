define([
        'jquery',
        'lodash',
        'input/inputDevice'
    ],
    function(
        $,
        _,
        InputDevice
    ) {
        'use strict';

        var KeyboardDevice = function() {
            InputDevice.call(this);

            // The current key being released or pressed
            this.currentKey = null;

            // A list of all keys that may be down
            this.pressedKeys = {};
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
                var $win = $(window);

                $win.on('keydown', $.proxy(this.onKeyDown, this));
                $win.on('keyup', $.proxy(this.onKeyUp, this));
            },

            /**
            *   This method removes the window event device bindings.
            *
            *   @method removeEvents
            *   @returns {undefined}
            */
            removeEvents: function() {
                var $win = $(window);

                $win.off('keydown', $.proxy(this.onKeyDown, this));
                $win.off('keyup', $.proxy(this.onKeyUp, this));
            },

            /**
            *   This method converts webkit keyCodes to application keycodes.
            *
            *   @method convertKeyCode
            *   @param {webkitKeyCode}
            *   @returns {undefined}
            */
            convertKeyCode: function(webkitKeyCode) {
                // Convert the keyCode
                var keyCode = webkitKeyMapping[webkitKeyCode];

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
                }

                return keyCode;
            },

            /**
            *   This method restores the state of this keyboard device.
            *
            *   @method resetState
            *   @returns {undefined}
            */
            resetState: function() {
                this.currentKey = null;
                for (var val in this.pressedKeys) {
                    if (this.pressedKeys.hasOwnProperty(val)) {
                        this.pressedKeys[val] = false;
                    }
                }
            },

            /**
            *   This method handles webkit keydown events.
            *
            *   @method onKeyDown
            *   @param {event}
            *   @returns {undefined}
            */
            onKeyDown: function(event) {
                event.stopPropagation();
                event.preventDefault();

                // Convert the keyCode
                var keyCode = this.convertKeyCode(event.keyCode);

                // If the keyCode exists and is not ESCAPE
                if (typeof keyCode !== 'undefined' && keyCode !== KeyboardDevice.ESCAPE) {

                    // If this key is not already down
                    if (!this.pressedKeys[keyCode]) {
                        this.pressedKeys[keyCode] = true;
                        this.currentKey = keyCode;

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
            onKeyUp: function(event) {
                event.stopPropagation();
                event.preventDefault();

                // Convert the keyCode
                var keyCode = this.convertKeyCode(event.keyCode);

                // If the keyCode exists and is not ESCAPE
                if (typeof keyCode !== 'undefined' && keyCode !== KeyboardDevice.ESCAPE) {
                    this.pressedKeys[keyCode] = false;
                    this.currentKey = keyCode;

                    this.trigger('keyup', this);

                    // Hack to deal with missing KeyUp signals when CMD is released
                    if ((keyCode === KeyboardDevice.LEFT_WIN 
                      || keyCode === KeyboardDevice.RIGHT_WIN)
                      && (navigator.appVersion.indexOf('Mac') !== -1)) {
                        this.resetState();
                    }
                }
            }
        });

        // Webkit to application keyCode mapping
        var webkitKeyMapping = {
            65   : 0, // A
            66   : 1, // B
            67   : 2, // C
            68   : 3, // D
            69   : 4, // E
            70   : 5, // F
            71   : 6, // G
            72   : 7, // H
            73   : 8, // I
            74   : 9, // J
            75   : 10, // K
            76   : 11, // L
            77   : 12, // M
            78   : 13, // N
            79   : 14, // O
            80   : 15, // P
            81   : 16, // Q
            82   : 17, // R
            83   : 18, // S
            84   : 19, // T
            85   : 20, // U
            86   : 21, // V
            87   : 22, // X
            88   : 23, // W
            89   : 24, // Y
            90   : 25, // Z

            48   : 100, // 0
            49   : 101, // 1
            50   : 102, // 2
            51   : 103, // 3
            52   : 104, // 4
            53   : 105, // 5
            54   : 106, // 6
            55   : 107, // 7
            56   : 108, // 8
            57   : 109, // 9

            37   : 200, // LEFT
            39   : 201, // RIGHT
            38   : 202, // UP
            40   : 203, // DOWN

            16   : 300, // LEFT_SHIFT
            //16 : 301, // RIGHT_SHIFT
            17   : 302, // LEFT_CONTROL
            //17 : 303, // RIGHT_CONTROL
            18   : 304, // LEFT_ALT
            0    : 305, // RIGHT_ALT

            27   : 400, // ESCAPE
            9    : 401, // TAB
            32   : 402, // SPACE
            8    : 403, // BACKSPACE
            13   : 404, // RETURN

            223  : 500, // GRAVE
            173  : 501, // MINUS (mozilla - gecko)
            189  : 501, // MINUS (ie + webkit)
            61   : 502, // EQUALS (mozilla - gecko)
            187  : 502, // EQUALS (ie + webkit)
            219  : 503, // LEFT_BRACKET
            221  : 504, // RIGHT_BRACKET
            59   : 505, // SEMI_COLON (mozilla - gecko)
            186  : 505, // SEMI_COLON (ie + webkit)
            192  : 500, // GRAVE
            188  : 507, // COMMA
            190  : 508, // PERIOD
            222  : 506, // APOSTROPHE

            112  : 600, // F1
            113  : 601, // F2
            114  : 602, // F3
            115  : 603, // F4
            116  : 604, // F5
            117  : 605, // F6
            118  : 606, // F7
            119  : 607, // F8
            120  : 608, // F9
            121  : 609, // F10
            122  : 610, // F11
            123  : 611, // F12
            //45 : 612, // NUMPAD_0 (numlock on/off)
            96   : 612, // NUMPAD_0 (numlock on/off)
            //35 : 613,, // NUMPAD_1 (numlock on/off)
            97   : 613, // NUMPAD_1 (numlock on/off)
            //40 : 614, // NUMPAD_2 (numlock on/off)
            98   : 614, // NUMPAD_2 (numlock on/off)
            //34 : 615, // NUMPAD_3 (numlock on/off)
            99   : 615, // NUMPAD_3 (numlock on/off)
            //37 : 616,, // NUMPAD_4 (numlock on/off)
            100  : 616, // NUMPAD_4 (numlock on/off)
            12   : 617, // NUMPAD_5 (numlock on/off)
            101  : 617, // NUMPAD_5 (numlock on/off)
            144  : 617, // NUMPAD_5 (numlock on/off) and NUMPAD_NUM
            //39 : 618, // NUMPAD_6 (numlock on/off)
            102  : 618, // NUMPAD_6 (numlock on/off)
            //36 : 619, // NUMPAD_7 (numlock on/off)
            103  : 619, // NUMPAD_7 (numlock on/off)
            //38 : 620, // NUMPAD_8 (numlock on/off)
            104  : 620, // NUMPAD_8 (numlock on/off)
            //33 : 621, // NUMPAD_9 (numlock on/off)
            105  : 621, // NUMPAD_9 (numlock on/off)
            //13 : 622, // NUMPAD_ENTER (numlock on/off)
            111  : 623, // NUMPAD_DIVIDE (numlock on/off)
            191  : 623, // NUMPAD_DIVIDE (numlock on/off), mac chrome
            106  : 624, // NUMPAD_MULTIPLY (numlock on/off)
            107  : 625, // NUMPAD_ADD (numlock on/off)
            109  : 626, // NUMPAD_SUBTRACT (numlock on/off)
            91   : 627, // LEFT_WIN
            224  : 627, // LEFT_WIN (mac, firefox)
            92   : 628, // RIGHT_WIN
            93   : 628, // RIGHT_WIN (mac, chrome)
            20   : 631, // CAPS_LOCK
            45   : 632, // INSERT
            46   : 633, // DELETE
            36   : 634, // HOME
            35   : 635, // END
            33   : 636, // PAGE_UP
            34   : 637, // PAGE_DOWN
        };

        // If Mac OS GRAVE can sometimes come through as 0
        if (navigator.appVersion.indexOf('Mac') !== -1) {
            webkitKeyMapping[0] = 500; // GRAVE (mac gecko + safari 5.1)
        }

        // Default input device key mapping
        KeyboardDevice.keyCodes = {
            A : 0,
            B : 1,
            C : 2,
            D : 3,
            E : 4,
            F : 5,
            G : 6,
            H : 7,
            I : 8,
            J : 9,
            K : 10,
            L : 11,
            M : 12,
            N : 13,
            O : 14,
            P : 15,
            Q : 16,
            R : 17,
            S : 18,
            T : 19,
            U : 20,
            V : 21,
            W : 22,
            X : 23,
            Y : 24,
            Z : 25,

            NUMBER_0 : 100,
            NUMBER_1 : 101,
            NUMBER_2 : 102,
            NUMBER_3 : 103,
            NUMBER_4 : 104,
            NUMBER_5 : 105,
            NUMBER_6 : 106,
            NUMBER_7 : 107,
            NUMBER_8 : 108,
            NUMBER_9 : 109,

            LEFT : 200,
            RIGHT : 201,
            UP : 202,
            DOWN : 203,

            LEFT_SHIFT : 300,
            RIGHT_SHIFT : 301,
            LEFT_CONTROL : 302,
            RIGHT_CONTROL : 303,

            LEFT_ALT : 304,
            RIGHT_ALT : 305,
            ESCAPE : 400,
            TAB : 401,
            SPACE :    402,
            BACKSPACE : 403,
            RETURN : 404,
            GRAVE : 500,
            MINUS : 501,
            EQUALS : 502,
            LEFT_BRACKET : 503,
            RIGHT_BRACKET : 504,
            SEMI_COLON : 505,
            APOSTROPHE : 506,
            COMMA : 507,
            PERIOD : 508,
            SLASH: 509,
            BACKSLASH: 510,

            F1 : 600,
            F2 : 601,
            F3 : 602,
            F4 : 603,
            F5 : 604,
            F6 : 605,
            F7 : 606,
            F8 : 607,
            F9 : 608,
            F10 : 609,
            F11 : 610,
            F12 : 611,

            NUMPAD_0 : 612,
            NUMPAD_1 : 613,
            NUMPAD_2 : 614,
            NUMPAD_3 : 615,
            NUMPAD_4 : 616,
            NUMPAD_5 : 617,
            NUMPAD_6 : 618,
            NUMPAD_7 : 619,
            NUMPAD_8 : 620,
            NUMPAD_9 : 621,
            NUMPAD_ENTER : 622,
            NUMPAD_DIVIDE : 623,
            NUMPAD_MULTIPLY : 624,
            NUMPAD_ADD : 625,
            NUMPAD_SUBTRACT : 626,

            LEFT_WIN : 627,
            RIGHT_WIN : 628,
            LEFT_OPTION : 629,
            RIGHT_OPTION : 630,
            CAPS_LOCK : 631,
            INSERT : 632,
            DELETE : 633,
            HOME : 634,
            END : 635,
            PAGE_UP: 636,
            PAGE_DOWN: 637,
            BACK: 638
        };

        return KeyboardDevice;
    }
);
