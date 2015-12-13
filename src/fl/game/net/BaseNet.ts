module fl {
    export class BaseNet extends egret.HashObject {

        public static EVENT_NET_ERR: string = "NetErrorEvent";
        public static EVENT_CLIENT_CLOSE: string = "NetClientCloseEvent";

        public ip: string;
        public port: number;
        private id: string;
        private dataCache_: Array<dcodeIO.ByteBuffer> = new Array<dcodeIO.ByteBuffer>();
        protected socket: egret.WebSocket;
        protected _cachCmd: boolean = false;
        protected _cachQueue: Array<any>;
        private _receBytes: dcodeIO.ByteBuffer;

        public constructor(ip: string, port: number, id: string) {
            super();
            this.id = id;
            this.ip = ip;
            this.port = port;
            this.socket = new egret.WebSocket();
            this.socket.type = egret.WebSocket.TYPE_BINARY;
            this.socket.addEventListener(egret.Event.CONNECT, this.onConnect, this);
            this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceived, this);
            this.socket.addEventListener(egret.Event.CLOSE, this.onClose, this);
            this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);

            this._receBytes = new dcodeIO.ByteBuffer().flip();

            this.open();
        }

        public open() {
            if (!this.socket.connected) {
                this.socket.connect(this.ip, this.port);
            }
        }

        public close() {
            if (this.socket.connected) {
                this.socket.close();
            }
            this.dataCache_ = new Array<dcodeIO.ByteBuffer>();
        }

        public forceClose() {
            this.close();
            fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BaseNet.EVENT_CLIENT_CLOSE));
        }

        protected onConnect(e: egret.Event) {
            var data: dcodeIO.ByteBuffer = this.dataCache_.shift();
            while (data) {
                this.send(data);
                data = this.dataCache_.shift();
            }
        }

        protected notifyClose() {
            fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BaseNet.EVENT_NET_ERR, this.id));
        }

        protected onClose(e: egret.Event) {
            egret.log("[BaseNet.onClose] " + e);
            this.notifyClose();
        }

        protected onError(e: egret.IOErrorEvent) {
            egret.error("[BaseNet.onError] " + e);
            this.notifyClose();
        }

        public send(bytes: dcodeIO.ByteBuffer) {
            if (this.socket.connected) {
                var eb:egret.ByteArray = new egret.ByteArray(bytes.toArrayBuffer());
                this.socket.writeBytes(eb, 0, eb.length);
                this.socket.flush();
            }
            else {
                this.dataCache_.push(bytes);
            }
        }

        protected onReceived(e: egret.ProgressEvent) {
            var tmpBytes: egret.ByteArray = new egret.ByteArray();
            this.socket.readBytes(tmpBytes);
            if (tmpBytes.length == 0) {
                return;
            }
            this._receBytes.offset = this._receBytes.limit;
            this._receBytes.append(tmpBytes.buffer).flip();
            while (this.processPacks());
        }

        private processPacks(): boolean {
            if (this._receBytes.limit < fl.BasePack.HEAD_SIZE) {
                return false;
            }
            this._receBytes.offset = 0;
            var firstPackageLenght: number = this._receBytes.readUint16();
            firstPackageLenght = firstPackageLenght + fl.BasePack.HEAD_SIZE;
            if (this._receBytes.limit < firstPackageLenght) {
                return false;
            }
            if (firstPackageLenght > 2 * fl.BasePack.MAX_PACK_SIZE) {
                throw new Error("[BaseSocket.processPacks] unknow package size: " + firstPackageLenght);
            }
            var tmpBytes: dcodeIO.ByteBuffer = this._receBytes.copy(0, fl.BasePack.HEAD_SIZE).flip();
            var bodyBytes: dcodeIO.ByteBuffer = new dcodeIO.ByteBuffer().flip();
            var n:number = firstPackageLenght - fl.BasePack.HEAD_SIZE;
            if (n > 0) {
                this._receBytes.copyTo(bodyBytes, 0, fl.BasePack.HEAD_SIZE, firstPackageLenght);
                bodyBytes.offset = n;
                bodyBytes.flip();
            }
            tmpBytes.offset = 2;
            var protocolNumber: number = tmpBytes.readUint32();
            if (protocolNumber >>> 31 == 1) {
                egret.log("compressed protocol: " + protocolNumber);
                protocolNumber = protocolNumber & 0x7FFFFFFF;
                //decryption
                bodyBytes = this.decryption(bodyBytes);
            }
            tmpBytes.offset = fl.BasePack.HEAD_SIZE;
            if (bodyBytes.limit) {
                tmpBytes.mark();
                tmpBytes.append(bodyBytes).flip();
                tmpBytes.reset();
            }
            this.processOrCache(protocolNumber, tmpBytes);

            //reset left bytes
            tmpBytes = new dcodeIO.ByteBuffer().flip();
            n = this._receBytes.limit - firstPackageLenght;
            if (n > 0) {
                this._receBytes.copyTo(tmpBytes, 0, firstPackageLenght, this._receBytes.limit);
                tmpBytes.offset = n;
                tmpBytes.flip();
            }
            this._receBytes.clear().flip();
            if (tmpBytes.limit > 0) {
                this._receBytes.append(tmpBytes).flip();
                return true;
            }
            else {
                return false;
            }
        }
        /**
         * decrypt the data if need
         **/
        protected decryption(bytes: dcodeIO.ByteBuffer) {
            return bytes;
        }
        public cachCmd(b: boolean) {
            this._cachCmd = b;
            if (b) {
                if (null == this._cachQueue)
                    this._cachQueue = [];
            }
            else {
                if (this._cachQueue != null) {
                    while (this._cachQueue.length > 0) {
                        var cach: any = this._cachQueue.shift();
                        this.processCmd(cach["protocol"], cach["data"]);
                    }
                }
            }
        }

        protected noCachCmd(p: number): boolean {
            return false;
        }
        protected processOrCache(protocol: number, data: dcodeIO.ByteBuffer) {
            if (false == this._cachCmd || this.noCachCmd(protocol))
                this.processCmd(protocol, data);
            else
                this._cachQueue.push({ protocol: protocol, data: data });
        }
        protected processCmd(protocol: number, data: dcodeIO.ByteBuffer) {
            var tick: number = egret.getTimer();
            var action: fl.BaseAction = fl.actionMgr.getAction(protocol);
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
            var diffTick: number = egret.getTimer() - tick;
            if (diffTick >= 50) {
                egret.warn("[BaseNet.processCmd] handeltime: id:" + protocol + " time:" + diffTick);
            }
        }
    }
}
