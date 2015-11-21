module fl {
	export class GameMediator extends fl.Mediator {

		public eventManager:fl.EventManager;
		public actionManager:fl.ActionManager;
		public onRemove()
		{
			this.unmapActions();
			this.unmapMediators();
			super.onRemove();
		}

		private viewList_:Array<any> = new Array();
		protected unmapMediators()
		{
			for(var tmpView_key_a in this.viewList_)
			{
				var tmpView:any = this.viewList_[tmpView_key_a];
				this.mediatorMap.unmapView(tmpView);
			}
			this.viewList_.splice(0,this.viewList_.length);
		}

		protected mapMediator(viewClazzOrName:any,mediaClazz:any,viewIns:any = null,injectViewAs:any = null,autoCreate:boolean = true,autoRemove:boolean = true)
		{
			var i:number = this.viewList_.indexOf(viewClazzOrName);
			if(i != -1)
			{
				console.log("[mapMediator] Mediator Class has already been mapped to a View Class in this context - " + viewClazzOrName);
			}
			else
			{
				this.mediatorMap.mapView(viewClazzOrName,mediaClazz,injectViewAs,autoCreate,autoRemove);
				viewIns && viewIns["stage"] && this.mediatorMap.createMediator(viewIns);
				this.viewList_.push(viewClazzOrName);
			}
		}

		protected unmapMediator(viewClazzOrName:any)
		{
			var i:number = this.viewList_.indexOf(viewClazzOrName);
			if(i != -1)
			{
				this.mediatorMap.unmapView(viewClazzOrName);
				this.viewList_.splice(i,1);
			}
			else
			{
				console.log("[unmapMediator] Mediator Class has not been mapped to a View Class in this context - " + viewClazzOrName);
			}
		}

		private actionList_:Array<any> = new Array();
		protected unmapActions()
		{
			for(var tmpAction_key_a in this.actionList_)
			{
				var tmpAction:any = this.actionList_[tmpAction_key_a];
				this.actionManager.uninjectAction(tmpAction);
			}
			this.actionList_.splice(0,this.actionList_.length);
		}

		protected injectAction(actionClass:any)
		{
			var i:number = this.actionList_.indexOf(actionClass);
			if(i != -1)
			{
				console.log("[injectAction] Action Class has already been injected in this context - " + actionClass);
			}
			else
			{
				this.actionManager.injectAction(actionClass);
				this.actionList_.push(actionClass);
			}
		}

		protected uninjectAction(actionClass:any)
		{
			var i:number = this.actionList_.indexOf(actionClass);
			if(i != -1)
			{
				this.actionManager.uninjectAction(actionClass);
				this.actionList_.splice(i,1);
			}
			else
			{
				console.log("[uninjectAction] Action Class has not been injected in this context - " + actionClass);
			}
		}

	}
}
