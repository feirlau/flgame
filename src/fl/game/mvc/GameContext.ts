module fl {
	export class GameContext extends fl.Context {

		public static instances_:fl.Dictionary = new fl.Dictionary();
		public static getInstance(contextView:egret.DisplayObjectContainer = null):fl.GameContext
		{
			contextView = contextView;
			var tmpIns:fl.GameContext = fl.GameContext.instances_.getItem(contextView);
			if(!tmpIns) {
				tmpIns = new fl.GameContext(contextView);
				fl.GameContext.instances_.setItem(contextView, tmpIns);
			}
			return tmpIns;
		}


		public constructor(contextView:egret.DisplayObjectContainer = null)
		{
			super(contextView, false);
		}

		protected createEventDispatcher():egret.IEventDispatcher {
			return fl.eventMgr;
		}

		public startup()
		{
			this.injector.mapValue(fl.EventManager, fl.eventMgr);
			fl.actionMgr.initActions(this.injector);
			super.startup();
		}

		public mapView(viewClassOrName:any,mediatorClass:any,viewIns:any = null,injectViewAs:any = null,autoCreate:boolean = true,autoRemove:boolean = true)
		{
			this.mediatorMap.mapView(viewClassOrName,mediatorClass,injectViewAs,autoCreate,autoRemove);
			viewIns && viewIns["stage"] && this.mediatorMap.createMediator(viewIns);
		}

		public unmapView(viewClassOrName:any)
		{
			this.mediatorMap.unmapView(viewClassOrName);
		}

		protected injectAction(actionClass:any)
		{
			fl.actionMgr.injectAction(actionClass);
		}

		protected uninjectAction(actionClass:any)
		{
			fl.actionMgr.uninjectAction(actionClass);
		}
	}
}
