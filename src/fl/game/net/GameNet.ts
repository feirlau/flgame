/// <reference path="BaseNet" />

module fl {
	export class GameNet extends fl.BaseNet {


		public constructor(ip:string,port:number,id:string)
		{
			super(ip,port,id);
			this.cachCmd(true);
		}

		protected noCachCmd(p:number):boolean
		{
			return false;
		}
	}
}
