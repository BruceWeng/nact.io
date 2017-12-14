webpackJsonp([0x41528127cbbbc800],{"./node_modules/json-loader/index.js!./.cache/json/lesson-javascript-persist.json":function(n,s){n.exports={data:{allPostTitles:{edges:[{node:{frontmatter:{title:"Getting Started",lesson:2,category:"javascript",chapter:1,type:"lesson"},fields:{slug:"/getting-started"}}},{node:{frontmatter:{title:"Persist",lesson:1,category:"javascript",chapter:3,type:"lesson"},fields:{slug:"/persist"}}},{node:{frontmatter:{title:"Actor Communication",lesson:2,category:"javascript",chapter:2,type:"lesson"},fields:{slug:"/actor-communication"}}},{node:{frontmatter:{title:"Hierarchy",lesson:4,category:"javascript",chapter:2,type:"lesson"},fields:{slug:"/hierarchy"}}},{node:{frontmatter:{title:"Snapshotting",lesson:2,category:"javascript",chapter:3,type:"lesson"},fields:{slug:"/snapshotting"}}},{node:{frontmatter:{title:"Timeouts",lesson:3,category:"javascript",chapter:3,type:"lesson"},fields:{slug:"/timeouts"}}},{node:{frontmatter:{title:"Stateful Actors",lesson:1,category:"javascript",chapter:2,type:"lesson"},fields:{slug:"/stateful-actors"}}},{node:{frontmatter:{title:"Querying",lesson:3,category:"javascript",chapter:2,type:"lesson"},fields:{slug:"/querying"}}},{node:{frontmatter:{title:"Introduction",lesson:1,category:"javascript",chapter:1,type:"lesson"},fields:{slug:"/introduction"}}}]},postBySlug:{html:'<a class="remix-button" href="https://glitch.com/edit/#!/remix/nact-contacts-3" target="_blank">\n  <button>\n    <img src="/img/code-fork-symbol.svg"/> REMIX\n  </button>\n</a>\n<p>The contacts service we\'ve been working on <em>still</em> isn\'t very useful. While we\'ve extended the service to support multiple users, it has the unfortunate limitation that it loses the contacts each time the machine restarts. To remedy this, nact extends stateful actors by adding a new method: <code>persist</code> </p>\n<p>To use <code>persist</code>, the first thing we need to do is specify a persistence engine. Currently only a <a href="https://github.com/ncthbrt/nact-persistence-postgres">PostgreSQL</a> engine is available (though it should be easy to create your own). To work with the PostgreSQL engine, install the persistent provider package using the command <code>npm install --save nact-persistence-postgres</code>.  Assuming you\'ve stored a connection string to a running database instance under the environment variable <code>DATABASE_URL</code> , we\'ll need to modify the code creating the system to look something like the following:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> start<span class="token punctuation">,</span> configurePersistence<span class="token punctuation">,</span> spawnPersistent <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'nact\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> PostgresPersistenceEngine <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'nact-persistence-postgres\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> connectionString <span class="token operator">=</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span>DATABASE_URL<span class="token punctuation">;</span>\n<span class="token keyword">const</span> system <span class="token operator">=</span> <span class="token function">start</span><span class="token punctuation">(</span><span class="token function">configurePersistence</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">PostgresPersistenceEngine</span><span class="token punctuation">(</span>connectionString<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>The <code>configurePersistence</code> method adds the the persistence plugin to the system using the specified persistence engine.</p>\n<p>Now the only remaining work is to modify the contacts service to allow persistence. We want to save messages which modify state and replay them when the actor starts up again. When the actor start up, it first receives all the persisted messages and then can begin processing new ones. </p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code><span class="token keyword">const</span> spawnUserContactService <span class="token operator">=</span> <span class="token punctuation">(</span>parent<span class="token punctuation">,</span> userId<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token function">spawnPersistent</span><span class="token punctuation">(</span>\n  parent<span class="token punctuation">,</span>\n  <span class="token keyword">async</span> <span class="token punctuation">(</span>state <span class="token operator">=</span> <span class="token punctuation">{</span> contacts<span class="token punctuation">:</span><span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> msg<span class="token punctuation">,</span> ctx<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span>    \n    <span class="token keyword">if</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span>type <span class="token operator">===</span> GET_CONTACTS<span class="token punctuation">)</span> <span class="token punctuation">{</span>        \n      \t<span class="token function">dispatch</span><span class="token punctuation">(</span>ctx<span class="token punctuation">.</span>sender<span class="token punctuation">,</span> <span class="token punctuation">{</span> payload<span class="token punctuation">:</span> Object<span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span>state<span class="token punctuation">.</span>contacts<span class="token punctuation">)</span><span class="token punctuation">,</span> type<span class="token punctuation">:</span> SUCCESS <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>msg<span class="token punctuation">.</span>type <span class="token operator">===</span> CREATE_CONTACT<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> newContact <span class="token operator">=</span> <span class="token punctuation">{</span> id<span class="token punctuation">:</span> <span class="token function">uuid</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token operator">...</span>msg<span class="token punctuation">.</span>payload <span class="token punctuation">}</span><span class="token punctuation">;</span>\n        <span class="token keyword">const</span> nextState <span class="token operator">=</span> <span class="token punctuation">{</span> contacts<span class="token punctuation">:</span> <span class="token punctuation">{</span> <span class="token operator">...</span>state<span class="token punctuation">.</span>contacts<span class="token punctuation">,</span> <span class="token punctuation">[</span>newContact<span class="token punctuation">.</span>id<span class="token punctuation">]</span><span class="token punctuation">:</span> newContact <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n      \t\n      \t<span class="token comment" spellcheck="true">// We only want to save messages which haven\'t been previously persisted </span>\n      \t<span class="token comment" spellcheck="true">// Note the persist call should always be awaited. If persist is not awaited, </span>\n      \t<span class="token comment" spellcheck="true">// then the actor will process the next message in the queue before the </span>\n      \t<span class="token comment" spellcheck="true">// message has been safely committed. </span>\n        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span>ctx<span class="token punctuation">.</span>recovering<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">await</span> ctx<span class="token punctuation">.</span><span class="token function">persist</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n      \t\n      \t<span class="token comment" spellcheck="true">// Safe to dispatch while recovering. </span>\n      \t<span class="token comment" spellcheck="true">// The message just goes to Nobody and is ignored.      </span>\n        <span class="token function">dispatch</span><span class="token punctuation">(</span>ctx<span class="token punctuation">.</span>sender<span class="token punctuation">,</span> <span class="token punctuation">{</span> type<span class="token punctuation">:</span> SUCCESS<span class="token punctuation">,</span> payload<span class="token punctuation">:</span> newContact <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>            \n        <span class="token keyword">return</span> nextState<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> contact <span class="token operator">=</span> state<span class="token punctuation">.</span>contacts<span class="token punctuation">[</span>msg<span class="token punctuation">.</span>contactId<span class="token punctuation">]</span><span class="token punctuation">;</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>contact<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">switch</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n              <span class="token keyword">case</span> GET_CONTACT<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n                <span class="token function">dispatch</span><span class="token punctuation">(</span>ctx<span class="token punctuation">.</span>sender<span class="token punctuation">,</span> <span class="token punctuation">{</span> payload<span class="token punctuation">:</span> contact<span class="token punctuation">,</span> type<span class="token punctuation">:</span> SUCCESS <span class="token punctuation">}</span><span class="token punctuation">,</span> ctx<span class="token punctuation">.</span>self<span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token keyword">break</span><span class="token punctuation">;</span>\n              <span class="token punctuation">}</span>\n              <span class="token keyword">case</span> REMOVE_CONTACT<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n                <span class="token keyword">const</span> nextState <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token operator">...</span>state<span class="token punctuation">.</span>contacts<span class="token punctuation">,</span> <span class="token punctuation">[</span>contact<span class="token punctuation">.</span>id<span class="token punctuation">]</span><span class="token punctuation">:</span> undefined <span class="token punctuation">}</span><span class="token punctuation">;</span>\n                <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span>ctx<span class="token punctuation">.</span>recovering<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">await</span> ctx<span class="token punctuation">.</span><span class="token function">persist</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n                <span class="token function">dispatch</span><span class="token punctuation">(</span>ctx<span class="token punctuation">.</span>sender<span class="token punctuation">,</span> <span class="token punctuation">{</span> type<span class="token punctuation">:</span> SUCCESS<span class="token punctuation">,</span> payload<span class="token punctuation">:</span> contact <span class="token punctuation">}</span><span class="token punctuation">,</span> ctx<span class="token punctuation">.</span>self<span class="token punctuation">)</span><span class="token punctuation">;</span>                  \n                <span class="token keyword">return</span> nextState<span class="token punctuation">;</span>                 \n              <span class="token punctuation">}</span>\n              <span class="token keyword">case</span> UPDATE_CONTACT<span class="token punctuation">:</span>  <span class="token punctuation">{</span>\n                <span class="token keyword">const</span> updatedContact <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token operator">...</span>contact<span class="token punctuation">,</span> <span class="token operator">...</span>msg<span class="token punctuation">.</span>payload <span class="token punctuation">}</span><span class="token punctuation">;</span>\n                <span class="token keyword">const</span> nextState <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token operator">...</span>state<span class="token punctuation">.</span>contacts<span class="token punctuation">,</span> <span class="token punctuation">[</span>contact<span class="token punctuation">.</span>id<span class="token punctuation">]</span><span class="token punctuation">:</span> updatedContact <span class="token punctuation">}</span><span class="token punctuation">;</span>\n                <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span>ctx<span class="token punctuation">.</span>recovering<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">await</span> ctx<span class="token punctuation">.</span><span class="token function">persist</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>                \n                <span class="token function">dispatch</span><span class="token punctuation">(</span>ctx<span class="token punctuation">.</span>sender<span class="token punctuation">,</span><span class="token punctuation">{</span> type<span class="token punctuation">:</span> SUCCESS<span class="token punctuation">,</span> payload<span class="token punctuation">:</span> updatedContact <span class="token punctuation">}</span><span class="token punctuation">,</span> ctx<span class="token punctuation">.</span>self<span class="token punctuation">)</span><span class="token punctuation">;</span>                \n                <span class="token keyword">return</span> nextState<span class="token punctuation">;</span>                 \n              <span class="token punctuation">}</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>          \n          <span class="token function">dispatch</span><span class="token punctuation">(</span>ctx<span class="token punctuation">.</span>sender<span class="token punctuation">,</span> <span class="token punctuation">{</span> type<span class="token punctuation">:</span> NOT_FOUND<span class="token punctuation">,</span> contactId<span class="token punctuation">:</span> msg<span class="token punctuation">.</span>contactId <span class="token punctuation">}</span><span class="token punctuation">,</span> ctx<span class="token punctuation">.</span>sender<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">return</span> state<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token comment" spellcheck="true">// Persistence key. If we want to restore actor state,</span>\n  <span class="token comment" spellcheck="true">// the key must be the same. Be careful about namespacing here. </span>\n  <span class="token comment" spellcheck="true">// For example if we\'d just used userId, another developer might accidentally</span>\n  <span class="token comment" spellcheck="true">// use the same key for an actor of a different type. This could cause difficult to </span>\n  <span class="token comment" spellcheck="true">// debug runtime errors</span>\n  <span class="token template-string"><span class="token string">`contacts:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>userId<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">`</span></span><span class="token punctuation">,</span>\n  userId\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>',timeToRead:2,excerpt:"The contacts service we've been working on  still  isn't very useful. While we've extended the service to support multiple users, it has the...",frontmatter:{title:"Persist",cover:"https://unsplash.it/400/300/?random?BoldMage",date:"11/12/2017",category:"javascript",tags:["getting-started","nact","javascript","nodejs"]},fields:{slug:"/persist"}}},pathContext:{slug:"/persist",category:"javascript"}}}});
//# sourceMappingURL=path---lesson-javascript-persist-8e0bc312e7673c596e1c.js.map