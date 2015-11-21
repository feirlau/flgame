module fl {
	export class BaseAction extends fl.Actor {

		public eventMgr:fl.EventManager = fl.eventMgr;
		public netMgr:fl.NetManager = fl.netMgr;
		protected mapProtocols:Array<any>;
		public get protocols():Array<any>
		{
			return this.mapProtocols;
		}

		public set protocols(value:Array<any>)
		{
			this.mapProtocols = value;
		}

		public process(data:egret.ByteArray,protocol:number = 0)
		{
		}

		public sendPack(pack:fl.BasePack,netId:string = "")
		{
			this.netMgr.sendPack(pack,netId);
		}

		public sendBytes(bytes:egret.ByteArray,netId:string = "")
		{
			this.netMgr.sendBytes(bytes,netId);
		}

		public dispatchEvent(e:egret.Event)
		{
			this.eventMgr.dispatchEvent(e);
		}

	}
}
