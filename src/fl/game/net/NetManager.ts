module fl {
	export class NetManager extends egret.HashObject {

		public static NET_GAME:string = "GameNet";
		public static instance_:fl.NetManager;
		public static getInstance():fl.NetManager
		{
			if(null == fl.NetManager.instance_)
			{
				fl.NetManager.instance_ = new fl.NetManager();
			}
			return fl.NetManager.instance_;
		}

		private netCache_:fl.Dictionary = new fl.Dictionary();
		public addNet(ip:string,port:number,id:string = fl.NetManager.NET_GAME,netClass:any = null):fl.BaseNet
		{
			var net:fl.BaseNet = this.netCache_.getItem(id);
			if(net == null)
			{
				netClass = netClass || fl.BaseNet;
				net = new netClass(ip,port,id);
				this.netCache_.setItem(id,net);
			}
			return net;
		}

		public getNet(id:string = fl.NetManager.NET_GAME):fl.BaseNet
		{
			id = id || fl.NetManager.NET_GAME;
			var net:fl.BaseNet = <any>this.netCache_.getItem(id);
			return net;
		}

		public setNet(net:fl.BaseNet,id:string = fl.NetManager.NET_GAME):fl.BaseNet
		{
			if(this.netCache_.getItem(id))
			{
				this.removeNet(id);
			}
			this.netCache_.setItem(id,net);
			return net;
		}

		public removeNet(id:string = fl.NetManager.NET_GAME):fl.BaseNet
		{
			var net:fl.BaseNet = null;
			if(this.netCache_.hasOwnProperty(id))
			{
				net = this.netCache_.getItem(id);
				net.close();
				this.netCache_.delItem(id);
			}
			return net;
		}

		public sendPack(pack:fl.BasePack,netId:string = fl.NetManager.NET_GAME)
		{
			this.sendBytes(pack.getBytes(),netId);
		}

		public sendBytes(bytes:dcodeIO.ByteBuffer,netId:string = fl.NetManager.NET_GAME)
		{
			var net:fl.BaseNet = this.getNet(netId);
			net.send(bytes);
		}

		public get isLocalNet():boolean
		{
			var net:fl.BaseNet = this.getNet();
			return net && net.ip.substr(0,8) == "192.168.";
		}

		public set isLocalNet(value:boolean)
		{

		}

	}

	export var netMgr:fl.NetManager = fl.NetManager.getInstance();
}
