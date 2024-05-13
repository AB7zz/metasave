import{a as r,W as u,A as v,C as f,h as A,i,k as h,n as w,j as p,o as g,q as c}from"./index-pF3uMl6W.js";import{B as C}from"./baseSolanaAdapter.esm-IOtjrDpk.js";import{a as P}from"./solanaProvider.esm-TFBU3KlZ.js";function E(o,t,n){return new Promise((e,a)=>{n>0?setTimeout(async()=>{const l=await o();l&&e(l),l||E(o,t,n-1).then(s=>(e(s),s)).catch(s=>a(s))},t):e(!1)})}const _=async function(){var o;let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{interval:1e3,count:3};return typeof window<"u"&&!!((o=window.solana)!==null&&o!==void 0&&o.isPhantom)||await E(()=>{var a;return(a=window.solana)===null||a===void 0?void 0:a.isPhantom},t.interval,t.count)?window.solana:null};class T extends C{constructor(){super(...arguments),r(this,"name",u.PHANTOM),r(this,"adapterNamespace",v.SOLANA),r(this,"currentChainNamespace",f.SOLANA),r(this,"type",A.EXTERNAL),r(this,"status",i.NOT_READY),r(this,"_wallet",null),r(this,"phantomProvider",null),r(this,"_onDisconnect",()=>{this._wallet&&(this._wallet.off("disconnect",this._onDisconnect),this.rehydrated=!1,this.status=this.status===i.CONNECTED?i.READY:i.NOT_READY,this.emit(h.DISCONNECTED))})}get isWalletConnected(){var t;return!!((t=this._wallet)!==null&&t!==void 0&&t.isConnected&&this.status===i.CONNECTED)}get provider(){return this.status!==i.NOT_READY&&this.phantomProvider?this.phantomProvider:null}set provider(t){throw new Error("Not implemented")}async init(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(await super.init(t),super.checkInitializationRequirements(),this._wallet=await _({interval:500,count:3}),!this._wallet)throw w.notInstalled();this.phantomProvider=new P({config:{chainConfig:this.chainConfig}}),this.status=i.READY,this.emit(h.READY,u.PHANTOM);try{p.debug("initializing phantom adapter"),t.autoConnect&&(this.rehydrated=!0,await this.connect())}catch(n){p.error("Failed to connect with cached phantom provider",n),this.emit("ERRORED",n)}}async connect(){var t=this;try{if(super.checkConnectionRequirements(),this.status=i.CONNECTING,this.emit(h.CONNECTING,{adapter:u.PHANTOM}),!this._wallet)throw w.notInstalled();if(this._wallet.isConnected)await this.connectWithProvider(this._wallet);else{const n=this._wallet._handleDisconnect;try{await new Promise((e,a)=>{const l=async()=>{await this.connectWithProvider(this._wallet),e(this.provider)};if(!this._wallet){a(w.notInstalled());return}this._wallet.once("connect",l),this._wallet._handleDisconnect=function(){a(w.windowClosed());for(var s=arguments.length,m=new Array(s),d=0;d<s;d++)m[d]=arguments[d];return n.apply(t._wallet,m)},this._wallet.connect().catch(s=>{a(s)})})}catch(e){throw e instanceof g?e:c.connectionError(e==null?void 0:e.message)}finally{this._wallet._handleDisconnect=n}}if(!this._wallet.publicKey)throw c.connectionError();return this._wallet.on("disconnect",this._onDisconnect),this.provider}catch(n){throw this.status=i.READY,this.rehydrated=!1,this.emit(h.ERRORED,n),n}}async disconnect(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{cleanup:!1};await super.disconnectSession();try{var n;await((n=this._wallet)===null||n===void 0?void 0:n.disconnect()),t.cleanup&&(this.status=i.NOT_READY,this.phantomProvider=null,this._wallet=null),await super.disconnect()}catch(e){this.emit(h.ERRORED,c.disconnectionError(e==null?void 0:e.message))}}async getUserInfo(){if(!this.isWalletConnected)throw c.notConnectedError("Not connected with wallet, Please login/connect first");return{}}async addChain(t){var n;let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;super.checkAddChainRequirements(t,e),(n=this.phantomProvider)===null||n===void 0||n.addChain(t),this.addChainConfig(t)}async switchChain(t){var n;let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;super.checkSwitchChainRequirements(t,e),await((n=this.phantomProvider)===null||n===void 0?void 0:n.switchChain(t)),this.setAdapterSettings({chainConfig:this.getChainConfig(t.chainId)})}async connectWithProvider(t){if(!this.phantomProvider)throw c.connectionError("No phantom provider");return await this.phantomProvider.setupProvider(t),this.status=i.CONNECTED,this.emit(h.CONNECTED,{adapter:u.PHANTOM,reconnected:this.rehydrated}),this.provider}}export{T as PhantomAdapter};
