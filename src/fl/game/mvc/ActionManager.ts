module fl {
	export class ActionManager extends egret.HashObject {

		private actionCache_:fl.Dictionary = new fl.Dictionary();
		public static instance_:fl.ActionManager;
		public static getInstance():fl.ActionManager
		{
            if(null == fl.ActionManager.instance_)
            {
                fl.ActionManager.instance_ = new fl.ActionManager();
            }
			return fl.ActionManager.instance_;
		}

		private injector_:fl.IInjector;
		public initActions(injector:fl.IInjector)
		{
			this.injector_ = injector;
			this.injector_.mapValue(fl.ActionManager,this);
		}

		private actionClazz_:Array<any> = [];
		public injectAction(actionClass:any)
		{
			var tmpI:number = this.actionClazz_.indexOf(actionClass);
			if(this.injector_ && actionClass && tmpI == -1)
			{
				this.injector_.mapSingleton(actionClass);
				var action:fl.BaseAction = this.injector_.getInstance(actionClass);
				this.mapAction(action);
				this.actionClazz_.push(actionClass);
			}
		}

		public uninjectAction(actionClass:any)
		{
			var tmpI:number = this.actionClazz_.indexOf(actionClass);
			if(this.injector_ && actionClass && tmpI >= 0)
			{
				var action:fl.BaseAction = this.injector_.getInstance(actionClass);
				this.unmapAction(action);
				this.injector_.unmap(actionClass);
				this.actionClazz_.splice(tmpI,1);
			}
		}

		public mapAction(action:fl.BaseAction)
		{
			if(action)
			{
				for(var protocol_key_a in action.protocols)
				{
					var protocol:any = action.protocols[protocol_key_a];
					if(protocol != null)
						this.setAction(action,protocol);
				}
			}
		}

		public unmapAction(action:fl.BaseAction)
		{
			for(var forinvar__ in this.actionCache_.map)
			{
				var key = this.actionCache_.map[forinvar__][0];
				if(this.actionCache_.getItem(key) == action)
				{
					this.actionCache_.delItem(key);
				}
			}
		}

		public getActionByClass(actionClass:any):fl.BaseAction
		{
			var action:fl.BaseAction;
			var tmpI:number = this.actionClazz_.indexOf(actionClass);
			if(this.injector_ && actionClass && tmpI != -1)
			{
				action = this.injector_.getInstance(actionClass);
			}
			return action;
		}

		public getAction(id:any):fl.BaseAction
		{
			var action:fl.BaseAction = this.actionCache_.getItem(id);
			return action;
		}

		public setAction(action:fl.BaseAction,id:any):fl.BaseAction
		{
			if(this.actionCache_.getItem(id))
			{
				this.removeAction(id);
			}
			this.actionCache_.setItem(id,action);
			return action;
		}

		public removeAction(id:any):fl.BaseAction
		{
			var action:fl.BaseAction = <any>null;
			if(this.actionCache_.hasOwnProperty(id))
			{
				action = this.actionCache_.getItem(id);
				this.actionCache_.delItem(id);
			}
			return action;
		}

	}

    export var actionMgr:fl.ActionManager = fl.ActionManager.getInstance();
}
