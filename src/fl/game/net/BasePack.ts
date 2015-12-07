module fl {
	export class BasePack extends egret.HashObject {

		public static EVENT_PACK_ERR:string = "PackErrorEvent";
		public static HEAD_SIZE:number = 6;
		public static MAX_PACK_SIZE:number = 65536;
		public id:number = 0;
		public size:number = 0;
		public result:number = 0;
		public protoModel:any;
		public protoValue:any;
		
		public constructor(id:number)
		{
			super();
			this.id = id;
		}

		public getBytes():egret.ByteArray
		{
			var bytes:egret.ByteArray = new egret.ByteArray();
			bytes.position = 2;
			bytes.writeUnsignedInt(this.id);
			this.toBytes(bytes);
			bytes.position = 0;
			this.size = bytes.length - fl.BasePack.HEAD_SIZE;
			bytes.writeUnsignedShort(this.size);
			return bytes;
		}

		protected toBytes(bytes:egret.ByteArray)
		{
			if(this.protoValue) {
				BasePack.writeProtoModel(this.protoValue, bytes);
			}
		}

		public writeBytes(bytes:egret.ByteArray)
		{
			this.toBytes(bytes);
		}

		public setBytes(bytes:egret.ByteArray)
		{
			bytes.position = fl.BasePack.HEAD_SIZE;
			this.fromBytes(bytes);
			this.dealError(this.result);
		}

		protected fromBytes(bytes:egret.ByteArray)
		{
			if(this.protoModel) {
				this.protoValue = BasePack.readProtoModel(this.protoModel, bytes);
			}
		}

		public readBytes(bytes:egret.ByteArray)
		{
			this.fromBytes(bytes);
		}

		public resetBytesPos(bytes:egret.ByteArray)
		{
			bytes.position = fl.BasePack.HEAD_SIZE;
		}

		protected dealError(err:number)
		{
			if(err != 0)
			{
				fl.eventMgr.dispatchEvent(new GlobalEvent(fl.BasePack.EVENT_PACK_ERR,err));
				egret.error("[BasePack.dealError] " + this.id + ":" + err);
			}
		}

		public static readProtoModel(m:any, bytes:egret.ByteArray, length:number = -1):any {
			var v:any;
			var tmpBytes:egret.ByteArray = new egret.ByteArray();
			if(length < 0) {
				length = bytes.readUnsignedInt();
			} else if(length == 0) {
				length = bytes.length - bytes.position;
			}
			bytes.readBytes(tmpBytes, 0, length);
			v = m.decode(tmpBytes.buffer);
			return v;
		}
		public static writeProtoModel(v:any, bytes:egret.ByteArray):egret.ByteArray {
			var tmpBytes:egret.ByteArray = new egret.ByteArray(v.toArrayBuffer());
			if(bytes) {
				bytes.writeUnsignedInt(tmpBytes.length);
				bytes.writeBytes(tmpBytes);
			}
			return tmpBytes;
		}
	}
}
