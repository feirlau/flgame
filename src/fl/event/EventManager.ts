module fl {
	export class EventManager extends egret.EventDispatcher {

		public static instance_:fl.EventManager;
		public static getInstance():fl.EventManager
		{
			fl.EventManager.instance_ = fl.EventManager.instance_ || new fl.EventManager();
			return fl.EventManager.instance_;
		}

		public dispatchEvent(event:egret.Event):boolean
		{
			var _self__:any = this;
			if(_self__.hasEventListener(event.type) || event.bubbles)
			{
				return super.dispatchEvent(event);
			}
			return true;
		}

		private eventListeners_:fl.Dictionary = new fl.Dictionary();
		public addEventListener(type:string,listener:Function,thisObject:any,useCapture:boolean = false,priority:number = 0)
		{
			var tmpType:string = type + "_" + useCapture;
			var listeners:Array<any> = <any>this.eventListeners_.getItem(tmpType);
			if(listeners == null)
			{
				listeners = new Array();
				this.eventListeners_.setItem(tmpType,listeners);
			}
			var i:number = listeners.indexOf(listener);
			if(i == -1)
			{
				super.addEventListener(type,listener,null,useCapture,priority);
				listeners.push(listener);
			}
		}

		public removeEventListener(type:string,listener:Function,thisObject:any,useCapture:boolean = false)
		{
			var tmpType:string = type + "_" + useCapture;
			var listeners:Array<any> = <any>this.eventListeners_.getItem(tmpType);
			var i:number = listeners?listeners.indexOf(listener):-1;
			if(i != -1)
			{
				super.removeEventListener(type,listener,null,useCapture);
				listeners.splice(i,1);
			}
		}

		public removeListeners(type:string = null,useCapture:boolean = false)
		{
			var tmpType:string;
			if(type)
			{
				tmpType = type + "_" + useCapture;
				var listeners:Array<any> = <any>this.eventListeners_.getItem(tmpType);
				for(var listener_key_a in listeners)
				{
					var listener:Function = listeners[listener_key_a];
					this.removeEventListener(type,listener,null,useCapture);
				}
				this.eventListeners_.delItem(tmpType);
			}
			else
			{
				for(var forinvar__ in this.eventListeners_.map)
				{
					tmpType = this.eventListeners_.map[forinvar__][0];
					if(tmpType)
					{
						this.removeListeners(tmpType,useCapture);
					}
				}
			}
		}

		public removeAllListeners()
		{
			this.removeListeners(null,false);
			this.removeListeners(null,true);
		}

	}
	export var eventMgr:EventManager = fl.EventManager.getInstance();
}
