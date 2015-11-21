module fl {
	export class Modules extends egret.HashObject {

		public static inited:boolean = false;
		public static init(startupFuns:Array<any> = null):Array<any>
		{
			if(fl.Modules.inited)
				return startupFuns;
			fl.Modules.inited = true;

			startupFuns = startupFuns || [];
			startupFuns.push(fl.Modules.registerViews);
			//var register:fl.CompManager = fl.compMgr;
			var f:Function;
			f = function ()
			{
				//register static views
				//register.registerStaticComp(null,TopView,TopViewMediator);
			};
			startupFuns.push(f);
			return startupFuns;
		}

		private static registerViews()
		{
			//register dynamical views
			//var register:fl.CompManager = fl.compMgr;
			//register.registerView(OptionView,null,OptionMediator);
		}
	}
}
