var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
System.register("logger", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ConsoleLogger;
    return {
        setters: [],
        execute: function () {
            ConsoleLogger = (function () {
                function ConsoleLogger() {
                }
                ConsoleLogger.prototype.log = function (level) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    if (level === "debug" && !console.debug) {
                        level = "info";
                    }
                    console[level].apply(console, args);
                };
                ConsoleLogger.prototype.error = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    this.log("error", args);
                };
                ConsoleLogger.prototype.warn = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    this.log("warn", args);
                };
                ConsoleLogger.prototype.info = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    this.log("info", args);
                };
                ConsoleLogger.prototype.debug = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    this.log("debug", args);
                };
                return ConsoleLogger;
            }());
            exports_1("ConsoleLogger", ConsoleLogger);
        }
    };
});
System.register("messages/category", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Category;
    return {
        setters: [],
        execute: function () {
            (function (Category) {
                Category[Category["Action"] = 0] = "Action";
                Category[Category["Event"] = 1] = "Event";
            })(Category || (Category = {}));
            exports_2("Category", Category);
        }
    };
});
System.register("messages/behavior", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Behavior;
    return {
        setters: [],
        execute: function () {
            Behavior = (function () {
                function Behavior() {
                    this.mustPlay = false;
                    this.playable = true;
                }
                return Behavior;
            }());
            exports_3("Behavior", Behavior);
        }
    };
});
System.register("messages/message", ["messages/category", "messages/behavior"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var category_1, behavior_1, Message, Action, Event;
    return {
        setters: [
            function (category_1_1) {
                category_1 = category_1_1;
            },
            function (behavior_1_1) {
                behavior_1 = behavior_1_1;
            }
        ],
        execute: function () {
            Message = (function () {
                function Message(id, category, type, data, timestamp, behavior) {
                    this.id = id;
                    this.category = category;
                    this.type = type;
                    this.data = data;
                    this.timestamp = timestamp;
                    this.behavior = behavior;
                }
                return Message;
            }());
            exports_4("Message", Message);
            Action = (function (_super) {
                __extends(Action, _super);
                function Action(id, type, data, timestamp, behavior) {
                    if (behavior === void 0) { behavior = new behavior_1.Behavior(); }
                    return _super.call(this, id, category_1.Category.Action, type, data, timestamp, behavior) || this;
                }
                return Action;
            }(Message));
            exports_4("Action", Action);
            Event = (function (_super) {
                __extends(Event, _super);
                function Event(id, type, data, timestamp, behavior) {
                    if (behavior === void 0) { behavior = new behavior_1.Behavior(); }
                    return _super.call(this, id, category_1.Category.Event, type, data, timestamp, behavior) || this;
                }
                return Event;
            }(Message));
            exports_4("Event", Event);
        }
    };
});
System.register("messages/callbacks", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("emitter", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var Emitter;
    return {
        setters: [],
        execute: function () {
            Emitter = (function () {
                function Emitter(_logger) {
                    this._logger = _logger;
                    this._receiverStore = new Map();
                    this._subscriberStore = new Map();
                }
                Object.defineProperty(Emitter.prototype, "lastAction", {
                    get: function () {
                        return this._lastAction;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Emitter.prototype, "lastEvent", {
                    get: function () {
                        return this._lastEvent;
                    },
                    enumerable: true,
                    configurable: true
                });
                Emitter.prototype.addReceiver = function (type, receiver) {
                    var lowerType = type.toLowerCase();
                    var existingReceiver = this._receiverStore.get(lowerType);
                    if (existingReceiver) {
                        this._throwError("Double-Decker Emitter: [addReceiver] : Action receiver was already present for type " + type + ": Receiver: " + existingReceiver);
                    }
                    this._logger.debug("Double-Decker Emitter: [addReceiver] : Adding Action receiver for type: " + type + ": Receiver: " + receiver);
                    this._receiverStore.set(lowerType, receiver);
                };
                Emitter.prototype.removeReceiver = function (type, receiver) {
                    var lowerType = type.toLowerCase();
                    var existingReceiver = this._receiverStore.get(lowerType);
                    if (!existingReceiver || receiver !== existingReceiver) {
                        this._throwError("Double-Decker Emitter: [removeReceiver] : Action receiver to remove was not registered for type " + type + ": Receiver: " + receiver);
                    }
                    this._receiverStore.delete(lowerType);
                    this._logger.debug("Double-Decker Emitter: [removeReceiver] : Removed Action receiver for type: " + type + ": Receiver: " + receiver);
                };
                Emitter.prototype.getReceiver = function (type) {
                    this._logger.debug("Double-Decker Emitter: [getReceiver] : Getting Action receiver for type: " + type + ".");
                    return this._receiverStore.get(type.toLowerCase());
                };
                Emitter.prototype.emitAction = function (action) {
                    var receiver = this._receiverStore.get(action.type.toLowerCase());
                    if (!receiver) {
                        this._throwError("Double-Decker Emitter: [emitAction] : Receiver was not registered for type " + action.type + ".");
                    }
                    this._logger.debug("Double-Decker Emitter: [emitAction] : Emitting Action for type: " + action.type + ". Action: " + action + ". Receiver: " + receiver);
                    var result = receiver(action);
                    this._lastAction = action;
                    return Promise.resolve(result);
                };
                Emitter.prototype.addSubscriber = function (type, subscriber) {
                    var lowerType = type.toLowerCase();
                    var subscribers = this._subscriberStore.get(lowerType);
                    if (!subscribers) {
                        this._logger.debug("Double-Decker Emitter: [addSubscriber] : No subscribers registered for type: " + type + ". Registering a new store array.");
                        subscribers = new Array();
                        this._subscriberStore.set(lowerType, subscribers);
                    }
                    subscribers.push(subscriber);
                    this._logger.debug("Double-Decker Emitter: [addSubscriber] : Added subscriber for type: " + type + " : " + subscriber);
                };
                Emitter.prototype.removeSubscriber = function (type, subscriber) {
                    var lowerType = type.toLowerCase();
                    var subscribers = this._subscriberStore.get(lowerType);
                    if (subscribers) {
                        var itemIndex = subscribers.indexOf(subscriber);
                        if (itemIndex >= 0) {
                            subscribers.splice(itemIndex, 1);
                            this._logger.debug("Double-Decker Emitter: [removeSubscriber] : Removed subscriber at index " + itemIndex + ": Subscriber: " + subscriber);
                            return;
                        }
                    }
                    this._throwError("Double-Decker Emitter: [removeSubscriber] : Subscriber to unsubscribe was not registered for type " + type + ": " + subscriber);
                };
                Emitter.prototype.getSubscribers = function (type) {
                    this._logger.debug("Double-Decker Emitter: [getSubscribers] : Getting Event subscribers for type: " + type + ".");
                    return this._subscriberStore.get(type.toLowerCase());
                };
                Emitter.prototype.emitEvent = function (event) {
                    var _this = this;
                    var resultPromises = new Array();
                    var subscribers = this._subscriberStore.get(event.type.toLowerCase());
                    if (subscribers) {
                        subscribers.forEach(function (subscriber) {
                            _this._logger.debug("Double-Decker Emitter: [emitEvent] : Emitting Event for type: " + event.type + ". Event: " + event + ". Subscriber:" + subscriber);
                            resultPromises.push(Promise.resolve(subscriber(event)));
                        });
                    }
                    if (this.lastAction) {
                        event.actionId = this.lastAction.id;
                    }
                    this._lastEvent = event;
                    return resultPromises;
                };
                Emitter.prototype._throwError = function (errorMessage) {
                    this._logger.error(errorMessage);
                    throw new Error(errorMessage);
                };
                return Emitter;
            }());
            exports_6("Emitter", Emitter);
        }
    };
});
System.register("store", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var MemoryStore;
    return {
        setters: [],
        execute: function () {
            MemoryStore = (function () {
                function MemoryStore() {
                    this.actions = new Array();
                    this.events = new Array();
                }
                MemoryStore.prototype.addAction = function (action) {
                    this.actions.push(action);
                };
                MemoryStore.prototype.addEvent = function (event) {
                    this.events.push(event);
                };
                MemoryStore.prototype.clearActions = function () {
                    this.actions.length = 0;
                };
                MemoryStore.prototype.clearEvents = function () {
                    this.events.length = 0;
                };
                return MemoryStore;
            }());
            exports_7("MemoryStore", MemoryStore);
        }
    };
});
System.register("push-id", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    function createId() {
        var now = new Date().getTime();
        var duplicateTime = (now === lastPushTime);
        lastPushTime = now;
        var timeStampChars = new Array(8);
        for (var i = 7; i >= 0; i--) {
            timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
            now = Math.floor(now / 64);
        }
        if (now !== 0) {
            throw new Error("We should have converted the entire timestamp.");
        }
        var id = timeStampChars.join("");
        if (duplicateTime) {
            var j = void 0;
            for (j = 11; j >= 0 && lastRandChars[j] === 63; j--) {
                lastRandChars[j] = 0;
            }
            lastRandChars[j]++;
        }
        else {
            for (var j = 0; j < 12; j++) {
                lastRandChars[j] = Math.floor(Math.random() * 64);
            }
        }
        for (var k = 0; k < 12; k++) {
            id += PUSH_CHARS.charAt(lastRandChars[k]);
        }
        if (id.length !== 20) {
            throw new Error("Length should be 20.");
        }
        return id;
    }
    exports_8("createId", createId);
    var PUSH_CHARS, lastPushTime, lastRandChars;
    return {
        setters: [],
        execute: function () {
            PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
            lastPushTime = 0;
            lastRandChars = [];
            ;
        }
    };
});
System.register("messages/message-contract", ["messages/behavior"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var behavior_2, MessageContract;
    return {
        setters: [
            function (behavior_2_1) {
                behavior_2 = behavior_2_1;
            }
        ],
        execute: function () {
            MessageContract = (function () {
                function MessageContract(type, data, behavior) {
                    if (behavior === void 0) { behavior = new behavior_2.Behavior(); }
                    this.type = type;
                    this.data = data;
                    this.behavior = behavior;
                }
                return MessageContract;
            }());
            exports_9("MessageContract", MessageContract);
        }
    };
});
System.register("message-factory", ["push-id", "messages/message"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var push_id_1, message_1, MessageFactory, DataWithIdMessageFactory;
    return {
        setters: [
            function (push_id_1_1) {
                push_id_1 = push_id_1_1;
            },
            function (message_1_1) {
                message_1 = message_1_1;
            }
        ],
        execute: function () {
            MessageFactory = (function () {
                function MessageFactory() {
                }
                MessageFactory.prototype.CreateAction = function (actionContract) {
                    return new message_1.Action(push_id_1.createId(), actionContract.type.toLowerCase(), actionContract.data, new Date(), actionContract.behavior);
                };
                MessageFactory.prototype.CreateEvent = function (eventContract) {
                    return new message_1.Event(push_id_1.createId(), eventContract.type.toLowerCase(), eventContract.data, new Date(), eventContract.behavior);
                };
                return MessageFactory;
            }());
            exports_10("MessageFactory", MessageFactory);
            DataWithIdMessageFactory = (function () {
                function DataWithIdMessageFactory(idProperty) {
                    if (idProperty === void 0) { idProperty = "id"; }
                    this.idProperty = idProperty;
                }
                DataWithIdMessageFactory.prototype.CreateAction = function (actionContract) {
                    return new message_1.Action(actionContract.data[this.idProperty], actionContract.type.toLowerCase(), actionContract.data, new Date(), actionContract.behavior);
                };
                DataWithIdMessageFactory.prototype.CreateEvent = function (eventContract) {
                    return new message_1.Event(eventContract.data[this.idProperty], eventContract.type.toLowerCase(), eventContract.data, new Date(), eventContract.behavior);
                };
                return DataWithIdMessageFactory;
            }());
            exports_10("DataWithIdMessageFactory", DataWithIdMessageFactory);
        }
    };
});
System.register("bus", ["messages/message-contract"], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var message_contract_1, Bus;
    return {
        setters: [
            function (message_contract_1_1) {
                message_contract_1 = message_contract_1_1;
            }
        ],
        execute: function () {
            Bus = (function () {
                function Bus(_messageFactory, _emitter, _store, _logger) {
                    this._messageFactory = _messageFactory;
                    this._emitter = _emitter;
                    this._store = _store;
                    this._logger = _logger;
                }
                Object.defineProperty(Bus.prototype, "lastAction", {
                    get: function () {
                        return this._emitter.lastAction;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Bus.prototype, "lastEvent", {
                    get: function () {
                        return this._emitter.lastEvent;
                    },
                    enumerable: true,
                    configurable: true
                });
                Bus.prototype.receive = function (type, receiver) {
                    this._emitter.addReceiver(type, receiver);
                    this._logger.debug("Double-Decker Bus: [receive] : Receiver set for " + type + ": " + receiver);
                };
                Bus.prototype.unreceive = function (type, receiver) {
                    var removed = this._emitter.removeReceiver(type.toLowerCase(), receiver);
                    this._logger.debug("Double-Decker Bus: [unreceive] : Receiver removed for " + type + ": " + receiver);
                };
                Bus.prototype.send = function (actionContract) {
                    var action = this._messageFactory.CreateAction(actionContract);
                    this._logger.debug("Double-Decker Bus: [send] : Sending action: " + action);
                    var emitResult = this._emitter.emitAction(action);
                    this._store.addAction(action);
                    return emitResult;
                };
                Bus.prototype.createAndSend = function (type, data) {
                    return this.send(new message_contract_1.MessageContract(type, data));
                };
                Bus.prototype.subscribe = function (type, subscriber) {
                    this._emitter.addSubscriber(type, subscriber);
                    this._logger.debug("Double-Decker Bus: [subscribe] : Appended subscriber for type: " + type + " : " + subscriber);
                };
                Bus.prototype.unsubscribe = function (type, subscriber) {
                    var removed = this._emitter.removeSubscriber(type, subscriber);
                    this._logger.debug("Double-Decker Bus: [unsubscribe] : Subscriber removed for " + type + ": " + subscriber);
                };
                Bus.prototype.publish = function (eventContract) {
                    var event = this._messageFactory.CreateEvent(eventContract);
                    this._logger.debug("Double-Decker Bus: [publish] : Publishing event: " + event);
                    var results = this._emitter.emitEvent(event);
                    this._store.addEvent(event);
                    return results;
                };
                Bus.prototype.createAndPublish = function (type, data) {
                    return this.publish(new message_contract_1.MessageContract(type, data));
                };
                return Bus;
            }());
            exports_11("Bus", Bus);
        }
    };
});
System.register("player", ["messages/category"], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var category_2, Player, ActionPlayer, EventPlayer;
    return {
        setters: [
            function (category_2_1) {
                category_2 = category_2_1;
            }
        ],
        execute: function () {
            Player = (function () {
                function Player(_logger) {
                    this._logger = _logger;
                    this._headPosition = 0;
                }
                Object.defineProperty(Player.prototype, "next", {
                    get: function () {
                        if (this._headPosition < this.messages.length) {
                            var message = this.messages[this._headPosition];
                            this._logger.debug("Double-Decker Hub: [next] : Retrieving next " + this._category + " at position " + this._headPosition + ".", message);
                            return message;
                        }
                        this._logger.debug("Double-Decker Hub: [next] : read head is at max position, no next " + this._category);
                        return undefined;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Player.prototype, "previous", {
                    get: function () {
                        if (this._headPosition > 0) {
                            var position = this._headPosition - 1;
                            var event_1 = this.messages[position];
                            this._logger.debug("Double-Decker Hub: [previous] : Retrieving previous " + this._category + " at position " + position + ".", event_1);
                            return event_1;
                        }
                        this._logger.debug("Double-Decker Hub: [previous] : eventHead is at position 0, no previous " + this._category);
                        return undefined;
                    },
                    enumerable: true,
                    configurable: true
                });
                Player.prototype.setHead = function (position) {
                    if (position < 0 || position >= this.messages.length) {
                        this._throwError("Double-Decker Hub: [setHead] : Attempted to set read head outside of message range. \n        Attempted value:" + position + ". Max value:" + this.messages.length);
                    }
                    this._headPosition = position;
                };
                Player.prototype.setHeadById = function (messageId) {
                    var position = this.messages.findIndex(function (msg) { return msg.id === messageId; });
                    if (position < 0) {
                        this._throwError("Double-Decker Hub: [setHeadById] : Could not find the requested messageId: " + messageId);
                    }
                    this._headPosition = position;
                };
                Player.prototype.playNext = function () {
                    this._logger.debug("Double-Decker Hub: [play] : Playing " + this._category + " : " + this.next);
                    var result = this._playNext();
                    this._headPosition++;
                    return result;
                };
                Player.prototype.play = function (length) {
                    var results = new Array();
                    for (var i = 0; i < length; i++) {
                        results.push(this.playNext());
                    }
                    return results;
                };
                Player.prototype.clear = function () {
                    this._logger.debug("Double-Decker Hub: [reset] : Resetting " + this._category + " hub");
                    this._clearMessages();
                    this._headPosition = 0;
                };
                Player.prototype._throwError = function (errorMessage) {
                    this._logger.error(errorMessage);
                    throw new Error(errorMessage);
                };
                return Player;
            }());
            exports_12("Player", Player);
            ActionPlayer = (function (_super) {
                __extends(ActionPlayer, _super);
                function ActionPlayer(_emitter, _store, logger) {
                    var _this = _super.call(this, logger) || this;
                    _this._emitter = _emitter;
                    _this._store = _store;
                    _this.logger = logger;
                    _this._category = category_2.Category.Action;
                    return _this;
                }
                Object.defineProperty(ActionPlayer.prototype, "messages", {
                    get: function () { return this._store.actions; },
                    enumerable: true,
                    configurable: true
                });
                ActionPlayer.prototype._playNext = function () {
                    if (this.next.behavior.playable) {
                        return this._emitter.emitAction(this.next);
                    }
                };
                ActionPlayer.prototype._clearMessages = function () {
                    this._store.clearActions();
                };
                return ActionPlayer;
            }(Player));
            exports_12("ActionPlayer", ActionPlayer);
            EventPlayer = (function (_super) {
                __extends(EventPlayer, _super);
                function EventPlayer(_emitter, _store, logger) {
                    var _this = _super.call(this, logger) || this;
                    _this._emitter = _emitter;
                    _this._store = _store;
                    _this.logger = logger;
                    _this._category = category_2.Category.Event;
                    return _this;
                }
                Object.defineProperty(EventPlayer.prototype, "messages", {
                    get: function () { return this._store.events; },
                    enumerable: true,
                    configurable: true
                });
                EventPlayer.prototype._playNext = function () {
                    return Promise.all(this._emitter.emitEvent(this.next));
                };
                EventPlayer.prototype._clearMessages = function () {
                    this._store.clearEvents();
                };
                return EventPlayer;
            }(Player));
            exports_12("EventPlayer", EventPlayer);
        }
    };
});
System.register("hub", [], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var Hub;
    return {
        setters: [],
        execute: function () {
            Hub = (function () {
                function Hub(bus, actionPlayer, eventPlayer) {
                    this.bus = bus;
                    this.actionPlayer = actionPlayer;
                    this.eventPlayer = eventPlayer;
                }
                return Hub;
            }());
            exports_13("Hub", Hub);
        }
    };
});
System.register("index", ["messages/category", "messages/message", "messages/message-contract", "messages/behavior", "message-factory", "emitter", "logger", "bus", "player", "store", "hub"], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_14(exports);
    }
    return {
        setters: [
            function (category_3_1) {
                exportStar_1(category_3_1);
            },
            function (message_2_1) {
                exportStar_1(message_2_1);
            },
            function (message_contract_2_1) {
                exportStar_1(message_contract_2_1);
            },
            function (behavior_3_1) {
                exportStar_1(behavior_3_1);
            },
            function (message_factory_1_1) {
                exportStar_1(message_factory_1_1);
            },
            function (emitter_1_1) {
                exportStar_1(emitter_1_1);
            },
            function (logger_1_1) {
                exportStar_1(logger_1_1);
            },
            function (bus_1_1) {
                exportStar_1(bus_1_1);
            },
            function (player_1_1) {
                exportStar_1(player_1_1);
            },
            function (store_1_1) {
                exportStar_1(store_1_1);
            },
            function (hub_1_1) {
                exportStar_1(hub_1_1);
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=index.js.map