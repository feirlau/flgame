module fl {
	export class Actions extends egret.HashObject {

		public static inited:boolean = false;
		public static init()
		{
			if(fl.Actions.inited)
				return ;
			fl.Actions.inited = true;
			//inject actions
		}

		public static injectAction(actionClass:any)
		{
			fl.actionMgr.injectAction(actionClass);
		}

		public static uninjectAction(actionClass:any)
		{
			fl.actionMgr.uninjectAction(actionClass);
		}

	}
}
