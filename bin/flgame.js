var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fl;
(function (fl) {
    var EventManager = (function (_super) {
        __extends(EventManager, _super);
        function EventManager() {
            _super.apply(this, arguments);
            this.eventListeners_ = new fl.Dictionary();
        }
        EventManager.getInstance = function () {
            fl.EventManager.instance_ = fl.EventManager.instance_ || new fl.EventManager();
            return fl.EventManager.instance_;
        };
        EventManager.prototype.dispatchEvent = function (event) {
            var _self__ = this;
            if (_self__.hasEventListener(event.type) || event.bubbles) {
                return _super.prototype.dispatchEvent.call(this, event);
            }
            return true;
        };
        EventManager.prototype.addEventListener = function (type, listener, thisObject, useCapture, priority) {
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            var tmpType = type + "_" + useCapture;
            var listeners = this.eventListeners_.getItem(tmpType);
            if (listeners == null) {
                listeners = new Array();
                this.eventListeners_.setItem(tmpType, listeners);
            }
            var i = listeners.indexOf(listener);
            if (i == -1) {
                _super.prototype.addEventListener.call(this, type, listener, null, useCapture, priority);
                listeners.push(listener);
            }
        };
        EventManager.prototype.removeEventListener = function (type, listener, thisObject, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            var tmpType = type + "_" + useCapture;
            var listeners = this.eventListeners_.getItem(tmpType);
            var i = listeners ? listeners.indexOf(listener) : -1;
            if (i != -1) {
                _super.prototype.removeEventListener.call(this, type, listener, null, useCapture);
                listeners.splice(i, 1);
            }
        };
        EventManager.prototype.removeListeners = function (type, useCapture) {
            if (type === void 0) { type = null; }
            if (useCapture === void 0) { useCapture = false; }
            var tmpType;
            if (type) {
                tmpType = type + "_" + useCapture;
                var listeners = this.eventListeners_.getItem(tmpType);
                for (var listener_key_a in listeners) {
                    var listener = listeners[listener_key_a];
                    this.removeEventListener(type, listener, null, useCapture);
                }
                this.eventListeners_.delItem(tmpType);
            }
            else {
                for (var forinvar__ in this.eventListeners_.map) {
                    tmpType = this.eventListeners_.map[forinvar__][0];
                    if (tmpType) {
                        this.removeListeners(tmpType, useCapture);
                    }
                }
            }
        };
        EventManager.prototype.removeAllListeners = function () {
            this.removeListeners(null, false);
            this.removeListeners(null, true);
        };
        return EventManager;
    })(egret.EventDispatcher);
    fl.EventManager = EventManager;
    fl.eventMgr = fl.EventManager.getInstance();
})(fl || (fl = {}));
var fl;
(function (fl) {
    var GlobalEvent = (function (_super) {
        __extends(GlobalEvent, _super);
        function GlobalEvent(type, data, bubbles, cancelable) {
            if (data === void 0) { data = null; }
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            _super.call(this, type, bubbles, cancelable);
            this.data = data;
        }
        GlobalEvent.prototype.clone = function () {
            var tmpEvent = new fl.GlobalEvent(this.type, this.bubbles, this.cancelable);
            tmpEvent.data = this.data;
            return tmpEvent;
        };
        return GlobalEvent;
    })(egret.Event);
    fl.GlobalEvent = GlobalEvent;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var ActionManager = (function (_super) {
        __extends(ActionManager, _super);
        function ActionManager() {
            _super.apply(this, arguments);
            this.actionCache_ = new fl.Dictionary();
            this.actionClazz_ = [];
        }
        ActionManager.getInstance = function () {
            if (null == fl.ActionManager.instance_) {
                fl.ActionManager.instance_ = new fl.ActionManager();
            }
            return fl.ActionManager.instance_;
        };
        ActionManager.prototype.initActions = function (injector) {
            this.injector_ = injector;
            this.injector_.mapValue(fl.ActionManager, this);
        };
        ActionManager.prototype.injectAction = function (actionClass) {
            var tmpI = this.actionClazz_.indexOf(actionClass);
            if (this.injector_ && actionClass && tmpI == -1) {
                this.injector_.mapSingleton(actionClass);
                var action = this.injector_.getInstance(actionClass);
                this.mapAction(action);
                this.actionClazz_.push(actionClass);
            }
        };
        ActionManager.prototype.uninjectAction = function (actionClass) {
            var tmpI = this.actionClazz_.indexOf(actionClass);
            if (this.injector_ && actionClass && tmpI >= 0) {
                var action = this.injector_.getInstance(actionClass);
                this.unmapAction(action);
                this.injector_.unmap(actionClass);
                this.actionClazz_.splice(tmpI, 1);
            }
        };
        ActionManager.prototype.mapAction = function (action) {
            if (action) {
                for (var protocol_key_a in action.protocols) {
                    var protocol = action.protocols[protocol_key_a];
                    if (protocol != null)
                        this.setAction(action, protocol);
                }
            }
        };
        ActionManager.prototype.unmapAction = function (action) {
            for (var forinvar__ in this.actionCache_.map) {
                var key = this.actionCache_.map[forinvar__][0];
                if (this.actionCache_.getItem(key) == action) {
                    this.actionCache_.delItem(key);
                }
            }
        };
        ActionManager.prototype.getActionByClass = function (actionClass) {
            var action;
            var tmpI = this.actionClazz_.indexOf(actionClass);
            if (this.injector_ && actionClass && tmpI != -1) {
                action = this.injector_.getInstance(actionClass);
            }
            return action;
        };
        ActionManager.prototype.getAction = function (id) {
            var action = this.actionCache_.getItem(id);
            return action;
        };
        ActionManager.prototype.setAction = function (action, id) {
            if (this.actionCache_.getItem(id)) {
                this.removeAction(id);
            }
            this.actionCache_.setItem(id, action);
            return action;
        };
        ActionManager.prototype.removeAction = function (id) {
            var action = null;
            if (this.actionCache_.hasOwnProperty(id)) {
                action = this.actionCache_.getItem(id);
                this.actionCache_.delItem(id);
            }
            return action;
        };
        return ActionManager;
    })(egret.HashObject);
    fl.ActionManager = ActionManager;
    fl.actionMgr = fl.ActionManager.getInstance();
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Actions = (function (_super) {
        __extends(Actions, _super);
        function Actions() {
            _super.apply(this, arguments);
        }
        Actions.init = function () {
            if (fl.Actions.inited)
                return;
            fl.Actions.inited = true;
            //inject actions
        };
        Actions.injectAction = function (actionClass) {
            fl.actionMgr.injectAction(actionClass);
        };
        Actions.uninjectAction = function (actionClass) {
            fl.actionMgr.uninjectAction(actionClass);
        };
        Actions.inited = false;
        return Actions;
    })(egret.HashObject);
    fl.Actions = Actions;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var BaseAction = (function (_super) {
        __extends(BaseAction, _super);
        function BaseAction() {
            _super.apply(this, arguments);
            this.eventMgr = fl.eventMgr;
            this.netMgr = fl.netMgr;
        }
        Object.defineProperty(BaseAction.prototype, "protocols", {
            get: function () {
                return this.mapProtocols;
            },
            set: function (value) {
                this.mapProtocols = value;
            },
            enumerable: true,
            configurable: true
        });
        BaseAction.prototype.process = function (data, protocol) {
            if (protocol === void 0) { protocol = 0; }
        };
        BaseAction.prototype.sendPack = function (pack, netId) {
            if (netId === void 0) { netId = ""; }
            this.netMgr.sendPack(pack, netId);
        };
        BaseAction.prototype.sendBytes = function (bytes, netId) {
            if (netId === void 0) { netId = ""; }
            this.netMgr.sendBytes(bytes, netId);
        };
        BaseAction.prototype.dispatchEvent = function (e) {
            this.eventMgr.dispatchEvent(e);
        };
        return BaseAction;
    })(fl.Actor);
    fl.BaseAction = BaseAction;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var GameContext = (function (_super) {
        __extends(GameContext, _super);
        function GameContext(contextView) {
            if (contextView === void 0) { contextView = null; }
            _super.call(this, contextView, false);
        }
        GameContext.getInstance = function (contextView) {
            if (contextView === void 0) { contextView = null; }
            contextView = contextView;
            var tmpIns = fl.GameContext.instances_.getItem(contextView);
            if (!tmpIns) {
                tmpIns = new fl.GameContext(contextView);
                fl.GameContext.instances_.setItem(contextView, tmpIns);
            }
            return tmpIns;
        };
        GameContext.prototype.createEventDispatcher = function () {
            return fl.eventMgr;
        };
        GameContext.prototype.startup = function () {
            this.injector.mapValue(fl.EventManager, fl.eventMgr);
            fl.actionMgr.initActions(this.injector);
            _super.prototype.startup.call(this);
        };
        GameContext.prototype.mapView = function (viewClassOrName, mediatorClass, viewIns, injectViewAs, autoCreate, autoRemove) {
            if (viewIns === void 0) { viewIns = null; }
            if (injectViewAs === void 0) { injectViewAs = null; }
            if (autoCreate === void 0) { autoCreate = true; }
            if (autoRemove === void 0) { autoRemove = true; }
            this.mediatorMap.mapView(viewClassOrName, mediatorClass, injectViewAs, autoCreate, autoRemove);
            viewIns && viewIns["stage"] && this.mediatorMap.createMediator(viewIns);
        };
        GameContext.prototype.unmapView = function (viewClassOrName) {
            this.mediatorMap.unmapView(viewClassOrName);
        };
        GameContext.prototype.injectAction = function (actionClass) {
            fl.actionMgr.injectAction(actionClass);
        };
        GameContext.prototype.uninjectAction = function (actionClass) {
            fl.actionMgr.uninjectAction(actionClass);
        };
        GameContext.instances_ = new fl.Dictionary();
        return GameContext;
    })(fl.Context);
    fl.GameContext = GameContext;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var GameMediator = (function (_super) {
        __extends(GameMediator, _super);
        function GameMediator() {
            _super.apply(this, arguments);
            this.viewList_ = new Array();
            this.actionList_ = new Array();
        }
        GameMediator.prototype.onRemove = function () {
            this.unmapActions();
            this.unmapMediators();
            _super.prototype.onRemove.call(this);
        };
        GameMediator.prototype.unmapMediators = function () {
            for (var tmpView_key_a in this.viewList_) {
                var tmpView = this.viewList_[tmpView_key_a];
                this.mediatorMap.unmapView(tmpView);
            }
            this.viewList_.splice(0, this.viewList_.length);
        };
        GameMediator.prototype.mapMediator = function (viewClazzOrName, mediaClazz, viewIns, injectViewAs, autoCreate, autoRemove) {
            if (viewIns === void 0) { viewIns = null; }
            if (injectViewAs === void 0) { injectViewAs = null; }
            if (autoCreate === void 0) { autoCreate = true; }
            if (autoRemove === void 0) { autoRemove = true; }
            var i = this.viewList_.indexOf(viewClazzOrName);
            if (i != -1) {
                console.log("[mapMediator] Mediator Class has already been mapped to a View Class in this context - " + viewClazzOrName);
            }
            else {
                this.mediatorMap.mapView(viewClazzOrName, mediaClazz, injectViewAs, autoCreate, autoRemove);
                viewIns && viewIns["stage"] && this.mediatorMap.createMediator(viewIns);
                this.viewList_.push(viewClazzOrName);
            }
        };
        GameMediator.prototype.unmapMediator = function (viewClazzOrName) {
            var i = this.viewList_.indexOf(viewClazzOrName);
            if (i != -1) {
                this.mediatorMap.unmapView(viewClazzOrName);
                this.viewList_.splice(i, 1);
            }
            else {
                console.log("[unmapMediator] Mediator Class has not been mapped to a View Class in this context - " + viewClazzOrName);
            }
        };
        GameMediator.prototype.unmapActions = function () {
            for (var tmpAction_key_a in this.actionList_) {
                var tmpAction = this.actionList_[tmpAction_key_a];
                this.actionManager.uninjectAction(tmpAction);
            }
            this.actionList_.splice(0, this.actionList_.length);
        };
        GameMediator.prototype.injectAction = function (actionClass) {
            var i = this.actionList_.indexOf(actionClass);
            if (i != -1) {
                console.log("[injectAction] Action Class has already been injected in this context - " + actionClass);
            }
            else {
                this.actionManager.injectAction(actionClass);
                this.actionList_.push(actionClass);
            }
        };
        GameMediator.prototype.uninjectAction = function (actionClass) {
            var i = this.actionList_.indexOf(actionClass);
            if (i != -1) {
                this.actionManager.uninjectAction(actionClass);
                this.actionList_.splice(i, 1);
            }
            else {
                console.log("[uninjectAction] Action Class has not been injected in this context - " + actionClass);
            }
        };
        return GameMediator;
    })(fl.Mediator);
    fl.GameMediator = GameMediator;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Modules = (function (_super) {
        __extends(Modules, _super);
        function Modules() {
            _super.apply(this, arguments);
        }
        Modules.init = function (startupFuns) {
            if (startupFuns === void 0) { startupFuns = null; }
            if (fl.Modules.inited)
                return startupFuns;
            fl.Modules.inited = true;
            startupFuns = startupFuns || [];
            startupFuns.push(fl.Modules.registerViews);
            //var register:fl.CompManager = fl.compMgr;
            var f;
            f = function () {
                //register static views
                //register.registerStaticComp(null,TopView,TopViewMediator);
            };
            startupFuns.push(f);
            return startupFuns;
        };
        Modules.registerViews = function () {
            //register dynamical views
            //var register:fl.CompManager = fl.compMgr;
            //register.registerView(OptionView,null,OptionMediator);
        };
        Modules.inited = false;
        return Modules;
    })(egret.HashObject);
    fl.Modules = Modules;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var BaseNet = (function (_super) {
        __extends(BaseNet, _super);
        function BaseNet(ip, port, id) {
            _super.call(this);
            this.dataCache_ = new Array();
            this._cachCmd = false;
            this.id = id;
            this.ip = ip;
            this.port = port;
            this.socket = new egret.WebSocket();
            this.socket.type = egret.WebSocket.TYPE_BINARY;
            this.socket.addEventListener(egret.Event.CONNECT, this.onConnect, this);
            this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceived, this);
            this.socket.addEventListener(egret.Event.CLOSE, this.onClose, this);
            this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
            this._receBytes = new egret.ByteArray();
            this.open();
        }
        BaseNet.prototype.open = function () {
            if (!this.socket.connected) {
                this.socket.connect(this.ip, this.port);
            }
        };
        BaseNet.prototype.close = function () {
            if (this.socket.connected) {
                this.socket.close();
            }
            this.dataCache_ = new Array();
        };
        BaseNet.prototype.forceClose = function () {
            this.close();
            fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BaseNet.EVENT_CLIENT_CLOSE));
        };
        BaseNet.prototype.onConnect = function (e) {
            var data = this.dataCache_.shift();
            while (data) {
                this.send(data);
                data = this.dataCache_.shift();
            }
        };
        BaseNet.prototype.notifyClose = function () {
            fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BaseNet.EVENT_NET_ERR, this.id));
        };
        BaseNet.prototype.onClose = function (e) {
            egret.log("[BaseNet.onClose] " + e);
            this.notifyClose();
        };
        BaseNet.prototype.onError = function (e) {
            egret.error("[BaseNet.onError] " + e);
            this.notifyClose();
        };
        BaseNet.prototype.send = function (bytes) {
            if (this.socket.connected) {
                this.socket.writeBytes(bytes, 0, bytes.length);
                this.socket.flush();
            }
            else {
                this.dataCache_.push(bytes);
            }
        };
        BaseNet.prototype.onReceived = function (e) {
            var tempBytes = new egret.ByteArray();
            this.socket.readBytes(tempBytes);
            if (tempBytes.length == 0) {
                return;
            }
            this._receBytes.position = this._receBytes.length;
            this._receBytes.writeBytes(tempBytes, 0, tempBytes.length);
            while (this.processPacks())
                ;
        };
        BaseNet.prototype.processPacks = function () {
            var _self__ = this;
            if (this._receBytes.length < fl.BasePack.HEAD_SIZE) {
                return false;
            }
            this._receBytes.position = 0;
            var firstPackageLenght = this._receBytes.readUnsignedShort();
            firstPackageLenght = firstPackageLenght + fl.BasePack.HEAD_SIZE;
            if (this._receBytes.length < firstPackageLenght) {
                return false;
            }
            if (firstPackageLenght > 2 * fl.BasePack.MAX_PACK_SIZE) {
                throw new Error("[BaseSocket.processPacks] unknow package size: " + firstPackageLenght);
            }
            var tmpBytes = new egret.ByteArray();
            tmpBytes.writeBytes(this._receBytes, 0, fl.BasePack.HEAD_SIZE);
            var bodyBytes = new egret.ByteArray();
            if (firstPackageLenght != fl.BasePack.HEAD_SIZE) {
                bodyBytes.writeBytes(this._receBytes, fl.BasePack.HEAD_SIZE, firstPackageLenght - fl.BasePack.HEAD_SIZE);
            }
            tmpBytes.position = 2;
            var protocolNumber = tmpBytes.readUnsignedInt();
            if (protocolNumber >>> 31 == 1) {
                egret.log("compressed protocol: " + protocolNumber);
                protocolNumber = protocolNumber & 0x7FFFFFFF;
                //decryption
                bodyBytes = this.decryption(bodyBytes);
            }
            tmpBytes.position = fl.BasePack.HEAD_SIZE;
            if (bodyBytes.length) {
                tmpBytes.writeBytes(bodyBytes, 0, bodyBytes.length);
                tmpBytes.position = fl.BasePack.HEAD_SIZE;
            }
            this.processOrCache(protocolNumber, tmpBytes);
            //reset left bytes
            tmpBytes = new egret.ByteArray();
            if (this._receBytes.length > firstPackageLenght) {
                tmpBytes.writeBytes(this._receBytes, firstPackageLenght, this._receBytes.length - firstPackageLenght);
            }
            this._receBytes.length = 0;
            this._receBytes.position = 0;
            if (tmpBytes.length > 0) {
                this._receBytes.writeBytes(tmpBytes, 0, tmpBytes.length);
                return true;
            }
            else {
                return false;
            }
        };
        /**
         * decrypt the data if need
         **/
        BaseNet.prototype.decryption = function (bytes) {
            return bytes;
        };
        BaseNet.prototype.cachCmd = function (b) {
            this._cachCmd = b;
            if (b) {
                if (null == this._cachQueue)
                    this._cachQueue = [];
            }
            else {
                if (this._cachQueue != null) {
                    while (this._cachQueue.length > 0) {
                        var cach = this._cachQueue.shift();
                        this.processCmd(cach["protocol"], cach["data"]);
                    }
                }
            }
        };
        BaseNet.prototype.noCachCmd = function (p) {
            return false;
        };
        BaseNet.prototype.processOrCache = function (protocol, data) {
            if (false == this._cachCmd || this.noCachCmd(protocol))
                this.processCmd(protocol, data);
            else
                this._cachQueue.push({ protocol: protocol, data: data });
        };
        BaseNet.prototype.processCmd = function (protocol, data) {
            var tick = egret.getTimer();
            var action = fl.actionMgr.getAction(protocol);
            if (action) {
                action.process(data, protocol);
            }
            else {
                action = fl.actionMgr.getAction(fl.Protocol.getProtocolType(protocol));
                if (action) {
                    action.process(data, protocol);
                }
                else {
                    egret.error("[BaseNet.processCmd] unknow protocol " + protocol);
                }
            }
            var diffTick = egret.getTimer() - tick;
            if (diffTick >= 50) {
                egret.warn("[BaseNet.processCmd] handeltime: id:" + protocol + " time:" + diffTick);
            }
        };
        BaseNet.EVENT_NET_ERR = "NetErrorEvent";
        BaseNet.EVENT_CLIENT_CLOSE = "NetClientCloseEvent";
        return BaseNet;
    })(egret.HashObject);
    fl.BaseNet = BaseNet;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var BasePack = (function (_super) {
        __extends(BasePack, _super);
        function BasePack(id) {
            _super.call(this);
            this.id = 0;
            this.size = 0;
            this.result = 0;
            this.id = id;
        }
        BasePack.prototype.getBytes = function () {
            var bytes = new egret.ByteArray();
            bytes.position = 2;
            bytes.writeUnsignedInt(this.id);
            this.toBytes(bytes);
            bytes.position = 0;
            this.size = bytes.length - fl.BasePack.HEAD_SIZE;
            bytes.writeUnsignedShort(this.size);
            return bytes;
        };
        BasePack.prototype.toBytes = function (bytes) {
        };
        BasePack.prototype.writeBytes = function (bytes) {
            this.toBytes(bytes);
        };
        BasePack.prototype.setBytes = function (bytes) {
            bytes.position = fl.BasePack.HEAD_SIZE;
            this.fromBytes(bytes);
            this.dealError(this.result);
        };
        BasePack.prototype.fromBytes = function (bytes) {
        };
        BasePack.prototype.readBytes = function (bytes) {
            this.fromBytes(bytes);
        };
        BasePack.prototype.resetBytesPos = function (bytes) {
            bytes.position = fl.BasePack.HEAD_SIZE;
        };
        BasePack.prototype.dealError = function (err) {
            if (err != 0) {
                fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BasePack.EVENT_PACK_ERR, err));
                egret.error("[BasePack.dealError] " + this.id + ":" + err);
            }
        };
        BasePack.EVENT_PACK_ERR = "PackErrorEvent";
        BasePack.HEAD_SIZE = 6;
        BasePack.MAX_PACK_SIZE = 65536;
        return BasePack;
    })(egret.HashObject);
    fl.BasePack = BasePack;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var GameNet = (function (_super) {
        __extends(GameNet, _super);
        function GameNet(ip, port, id) {
            _super.call(this, ip, port, id);
            this.cachCmd(true);
        }
        GameNet.prototype.noCachCmd = function (p) {
            return false;
        };
        return GameNet;
    })(fl.BaseNet);
    fl.GameNet = GameNet;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var NetManager = (function (_super) {
        __extends(NetManager, _super);
        function NetManager() {
            _super.apply(this, arguments);
            this.netCache_ = new fl.Dictionary();
        }
        NetManager.getInstance = function () {
            if (null == fl.NetManager.instance_) {
                fl.NetManager.instance_ = new fl.NetManager();
            }
            return fl.NetManager.instance_;
        };
        NetManager.prototype.addNet = function (ip, port, id, netClass) {
            if (id === void 0) { id = fl.NetManager.NET_GAME; }
            if (netClass === void 0) { netClass = null; }
            var net = this.netCache_.getItem(id);
            if (net == null) {
                netClass = netClass || fl.BaseNet;
                net = new netClass(ip, port, id);
                this.netCache_.setItem(id, net);
            }
            return net;
        };
        NetManager.prototype.getNet = function (id) {
            if (id === void 0) { id = fl.NetManager.NET_GAME; }
            id = id || fl.NetManager.NET_GAME;
            var net = this.netCache_.getItem(id);
            return net;
        };
        NetManager.prototype.setNet = function (net, id) {
            if (id === void 0) { id = fl.NetManager.NET_GAME; }
            if (this.netCache_.getItem(id)) {
                this.removeNet(id);
            }
            this.netCache_.setItem(id, net);
            return net;
        };
        NetManager.prototype.removeNet = function (id) {
            if (id === void 0) { id = fl.NetManager.NET_GAME; }
            var net = null;
            if (this.netCache_.hasOwnProperty(id)) {
                net = this.netCache_.getItem(id);
                net.close();
                this.netCache_.delItem(id);
            }
            return net;
        };
        NetManager.prototype.sendPack = function (pack, netId) {
            if (netId === void 0) { netId = fl.NetManager.NET_GAME; }
            this.sendBytes(pack.getBytes(), netId);
        };
        NetManager.prototype.sendBytes = function (bytes, netId) {
            if (netId === void 0) { netId = fl.NetManager.NET_GAME; }
            var net = this.getNet(netId);
            net.send(bytes);
        };
        Object.defineProperty(NetManager.prototype, "isLocalNet", {
            get: function () {
                var net = this.getNet();
                return net && net.ip.substr(0, 8) == "192.168.";
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        NetManager.NET_GAME = "GameNet";
        return NetManager;
    })(egret.HashObject);
    fl.NetManager = NetManager;
    fl.netMgr = fl.NetManager.getInstance();
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Protocol = (function (_super) {
        __extends(Protocol, _super);
        function Protocol() {
            _super.call(this);
        }
        Protocol.getProtocolType = function (p) {
            p = p / fl.Protocol.CMD_TYPE_BASE;
            return Math.floor(p);
        };
        Protocol.protocolEvent = function (v) {
            return "EVENT_PROTOCOL_" + v;
        };
        Protocol.CMD_TYPE_BASE = 100000;
        Protocol._inited = false;
        return Protocol;
    })(egret.HashObject);
    fl.Protocol = Protocol;
})(fl || (fl = {}));
//# sourceMappingURL=flgame.js.map