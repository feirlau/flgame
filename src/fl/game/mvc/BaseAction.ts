module fl {
	export class BaseAction extends fl.Actor {
		protected mapProtocols:Array<any>;
		public get protocols():Array<any>
		{
			return this.mapProtocols;
		}

		public set protocols(value:Array<any>)
		{
			this.mapProtocols = value;
		}

		public get eventDispatcher():egret.IEventDispatcher {
			return fl.eventMgr;
		}
		
		public process(data:dcodeIO.ByteBuffer,protocol:number = 0)
		{
		}

		public sendPack(pack:fl.BasePack,netId:string = "")
		{
			fl.netMgr.sendPack(pack,netId);
		}

		public sendBytes(bytes:dcodeIO.ByteBuffer,netId:string = "")
		{
			fl.netMgr.sendBytes(bytes,netId);
		}

		public dispatchEvent(e:egret.Event)
		{
			this.eventDispatcher.dispatchEvent(e);
		}

	}
}
