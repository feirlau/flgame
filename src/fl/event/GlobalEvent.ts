module fl {
	export class GlobalEvent extends egret.Event {

		public data:any;

		public constructor(type:string,data:any = null,bubbles:boolean = false,cancelable:boolean = false)
		{
			super(type,bubbles,cancelable);
			this.data = data;
		}

		public clone():egret.Event
		{
			var tmpEvent:fl.GlobalEvent = new fl.GlobalEvent(this.type,this.data, this.bubbles,this.cancelable);
			return tmpEvent;
		}

	}
}
