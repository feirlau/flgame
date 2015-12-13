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

		public getBytes():dcodeIO.ByteBuffer
		{
			var bytes:dcodeIO.ByteBuffer = new dcodeIO.ByteBuffer().flip();
			bytes.offset = 2;
			bytes.writeUint32(this.id);
			this.toBytes(bytes);
			bytes.flip();
			this.size = bytes.limit - fl.BasePack.HEAD_SIZE;
			bytes.writeUint16(this.size);
			bytes.offset = 0;
			return bytes;
		}

		protected toBytes(bytes:dcodeIO.ByteBuffer)
		{
			if(this.protoValue) {
				BasePack.writeProtoModel(this.protoValue, bytes);
			}
		}

		public writeBytes(bytes:dcodeIO.ByteBuffer)
		{
			this.toBytes(bytes);
		}

		public setBytes(bytes:dcodeIO.ByteBuffer)
		{
			bytes.offset = fl.BasePack.HEAD_SIZE;
			this.fromBytes(bytes);
			this.dealError(this.result);
		}

		protected fromBytes(bytes:dcodeIO.ByteBuffer)
		{
			if(this.protoModel) {
				this.protoValue = BasePack.readProtoModel(this.protoModel, bytes);
			}
		}

		public readBytes(bytes:dcodeIO.ByteBuffer)
		{
			this.fromBytes(bytes);
		}

		public resetBytesPos(bytes:dcodeIO.ByteBuffer)
		{
			bytes.offset = fl.BasePack.HEAD_SIZE;
		}

		protected dealError(err:number)
		{
			if(err != 0)
			{
				fl.eventMgr.dispatchEvent(new GlobalEvent(fl.BasePack.EVENT_PACK_ERR,err));
				egret.error("[BasePack.dealError] " + this.id + ":" + err);
			}
		}

		public static readProtoModel(m:any, bytes:dcodeIO.ByteBuffer, length:number = -1):any {
			var v:any;
			if(length < 0) {
				length = bytes.readUint32();
			} else if(length == 0) {
				length = bytes.limit - bytes.offset;
			}
			var n:number = bytes.offset + length;
			var tmpBytes:dcodeIO.ByteBuffer = bytes.copy(bytes.offset, n).flip();
			bytes.offset = n;
			v = m.decode(tmpBytes.buffer);
			return v;
		}
		public static writeProtoModel(v:any, bytes:dcodeIO.ByteBuffer):dcodeIO.ByteBuffer {
			var tmpBytes:dcodeIO.ByteBuffer = dcodeIO.ByteBuffer.wrap(v.toArrayBuffer());
			if(bytes) {
				bytes.writeUint32(tmpBytes.limit);
				bytes.append(tmpBytes);
			}
			return tmpBytes;
		}
	}
}
