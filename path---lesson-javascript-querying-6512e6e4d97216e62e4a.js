webpackJsonp([0x6c0c41b473a5],{384:function(n,s){n.exports={data:{allPostTitles:{edges:[{node:{frontmatter:{title:"Decoders and Encoders",lesson:2,category:"javascript",chapter:4,type:"lesson"},fields:{slug:"/decoders-and-encoders"}}},{node:{frontmatter:{title:"Getting Started",lesson:2,category:"javascript",chapter:1,type:"lesson"},fields:{slug:"/getting-started"}}},{node:{frontmatter:{title:"Persist",lesson:1,category:"javascript",chapter:3,type:"lesson"},fields:{slug:"/persist"}}},{node:{frontmatter:{title:"Actor Communication",lesson:2,category:"javascript",chapter:2,type:"lesson"},fields:{slug:"/actor-communication"}}},{node:{frontmatter:{title:"Introduction",lesson:1,category:"javascript",chapter:1,type:"lesson"},fields:{slug:"/introduction"}}},{node:{frontmatter:{title:"Hierarchy",lesson:4,category:"javascript",chapter:2,type:"lesson"},fields:{slug:"/hierarchy"}}},{node:{frontmatter:{title:"Querying",lesson:3,category:"javascript",chapter:2,type:"lesson"},fields:{slug:"/querying"}}},{node:{frontmatter:{title:"Snapshotting",lesson:2,category:"javascript",chapter:3,type:"lesson"},fields:{slug:"/snapshotting"}}},{node:{frontmatter:{title:"Stateful Actors",lesson:1,category:"javascript",chapter:2,type:"lesson"},fields:{slug:"/stateful-actors"}}},{node:{frontmatter:{title:"Timeouts",lesson:3,category:"javascript",chapter:3,type:"lesson"},fields:{slug:"/timeouts"}}},{node:{frontmatter:{title:"Supervision",lesson:5,category:"javascript",chapter:2,type:"lesson"},fields:{slug:"/supervision"}}},{node:{frontmatter:{title:"Persistent Queries",lesson:4,category:"javascript",chapter:3,type:"lesson"},fields:{slug:"/persistent-queries"}}}]},postBySlug:{html:'<!-- <a class="remix-button" href="https://glitch.com/edit/#!/remix/nact-contacts-1" target="_blank">\n  <button>\n    <img src="/img/code-fork-symbol.svg"/> REMIX\n  </button>\n</a> -->\n<p>Actor systems don\'t live in a vacuum, they need to be available to the outside world. Commonly actor systems are fronted by REST APIs or RPC frameworks. REST and RPC style access patterns are blocking: a request comes in, it is processed, and finally returned to the sender using the original connection. To help bridge nact\'s non blocking nature, references to actors have a <code>query</code> function. Query returns a promise.</p>\n<p>Similar to <code>dispatch</code>, <code>query</code> pushes a message on to an actor\'s mailbox, but differs in that it also creates a virtual actor. When this virtual actor receives a message, the promise returned by the query resolves. </p>\n<p>In addition to the message, <code>query</code> also takes in a timeout value measured in milliseconds. If a query takes longer than this time to resolve, it times out and the promise is rejected. A time bounded query is very important in a production system; it ensures that a failing subsystem does not cause cascading faults as queries queue up and stress available system resources.</p>\n<p>In this example, we\'ll create a simple single user in-memory address book system. To make it more realistic, we\'ll host it as an express app. You\'ll need to install <code>express</code>, <code>body-parser</code>, <code>uuid</code> and of course <code>nact</code> using npm to get going.</p>\n<blockquote>\n<p>Note: We\'ll expand on this example in later sections.</p>\n</blockquote>\n<p>What are the basic requirements of a basic address book API? It should be able to:</p>\n<ul>\n<li>Create a new contact </li>\n<li>Fetch all contacts</li>\n<li>Fetch a specific contact</li>\n<li>Update an existing contact</li>\n<li>Delete a contact</li>\n</ul>\n<p>To implement this functionality, we\'ll need to create the following endpoints:</p>\n<ul>\n<li>POST <code>/api/contacts</code> - Create a new contact </li>\n<li>GET <code>/api/contacts</code> - Fetch all contacts</li>\n<li>GET <code>/api/contacts</code> - Fetch a specific contact</li>\n<li>PATCH <code>/api/contacts/:contact_id</code> - Update an existing contact</li>\n<li>DELETE <code>/api/contacts/:contact_id</code> - Delete a contact</li>\n</ul>\n<p>Here are the stubs for setting up the server and endpoints:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code><span class="token keyword">const</span> express <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'express\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">express</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> bodyParser <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'body-parser\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>bodyParser<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'/api/contacts\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span>res<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span> <span class="token comment" spellcheck="true">/* Fetch all contacts */</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'/api/contacts/:contact_id\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span>res<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span> <span class="token comment" spellcheck="true">/* Fetch specific contact */</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">\'/api/contacts\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span>res<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span> <span class="token comment" spellcheck="true">/* Create new contact */</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token function">patch</span><span class="token punctuation">(</span><span class="token string">\'/api/contacts/:contact_id\'</span><span class="token punctuation">,</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span>res<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span> <span class="token comment" spellcheck="true">/* Update existing contact */</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token keyword">delete</span><span class="token punctuation">(</span><span class="token string">\'api/contacts/:contact_id\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span>res<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span> <span class="token comment" spellcheck="true">/* Delete contact */</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">.</span>PORT <span class="token operator">||</span> <span class="token number">3000</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token string">`Address book listening on port </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>process<span class="token punctuation">.</span>env<span class="token punctuation">.</span>PORT <span class="token operator">||</span> <span class="token number">3000</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">!`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Because actor are message driven, let us define the message types used between the express api and actor system:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code> <span class="token keyword">const</span> ContactProtocolTypes <span class="token operator">=</span> <span class="token punctuation">{</span>\n   GET_CONTACTS<span class="token punctuation">:</span> <span class="token string">\'GET_CONTACTS\'</span><span class="token punctuation">,</span>\n   GET_CONTACT<span class="token punctuation">:</span> <span class="token string">\'GET_CONTACT\'</span><span class="token punctuation">,</span>\n   UPDATE_CONTACT<span class="token punctuation">:</span> <span class="token string">\'UPDATE_CONTACT\'</span><span class="token punctuation">,</span>\n   REMOVE_CONTACT<span class="token punctuation">:</span> <span class="token string">\'REMOVE_CONTACT\'</span><span class="token punctuation">,</span>\n   CREATE_CONTACT<span class="token punctuation">:</span> <span class="token string">\'CREATE_CONTACT\'</span><span class="token punctuation">,</span>\n   <span class="token comment" spellcheck="true">// Operation sucessful</span>\n   SUCCESS<span class="token punctuation">:</span> <span class="token string">\'SUCCESS\'</span><span class="token punctuation">,</span>\n   <span class="token comment" spellcheck="true">// And finally if the contact is not found</span>\n   NOT_FOUND<span class="token punctuation">:</span> <span class="token string">\'NOT_FOUND\'</span>\n <span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Our contacts actor will need to handle each message type:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code><span class="token keyword">const</span> uuid <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'uuid/v4\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> contactsService <span class="token operator">=</span> <span class="token function">spawn</span><span class="token punctuation">(</span>\n  system<span class="token punctuation">,</span>\n  <span class="token punctuation">(</span>state <span class="token operator">=</span> <span class="token punctuation">{</span> contacts<span class="token punctuation">:</span><span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> msg<span class="token punctuation">,</span> ctx<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span>    \n    <span class="token keyword">if</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span>type <span class="token operator">===</span> GET_CONTACTS<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment" spellcheck="true">// Return all the contacts as an array</span>\n        <span class="token function">dispatch</span><span class="token punctuation">(</span>\n          ctx<span class="token punctuation">.</span>sender<span class="token punctuation">,</span> \n          <span class="token punctuation">{</span> payload<span class="token punctuation">:</span> Object<span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span>state<span class="token punctuation">.</span>contacts<span class="token punctuation">)</span><span class="token punctuation">,</span> type<span class="token punctuation">:</span> SUCCESS <span class="token punctuation">}</span><span class="token punctuation">,</span> \n          ctx<span class="token punctuation">.</span>self\n        <span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>msg<span class="token punctuation">.</span>type <span class="token operator">===</span> CREATE_CONTACT<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> newContact <span class="token operator">=</span> <span class="token punctuation">{</span> id<span class="token punctuation">:</span> <span class="token function">uuid</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token operator">...</span>msg<span class="token punctuation">.</span>payload <span class="token punctuation">}</span><span class="token punctuation">;</span>\n        <span class="token keyword">const</span> nextState <span class="token operator">=</span> <span class="token punctuation">{</span> \n          contacts<span class="token punctuation">:</span> <span class="token punctuation">{</span> <span class="token operator">...</span>state<span class="token punctuation">.</span>contacts<span class="token punctuation">,</span> <span class="token punctuation">[</span>newContact<span class="token punctuation">.</span>id<span class="token punctuation">]</span><span class="token punctuation">:</span> newContact <span class="token punctuation">}</span> \n        <span class="token punctuation">}</span><span class="token punctuation">;</span>\n        <span class="token function">dispatch</span><span class="token punctuation">(</span>ctx<span class="token punctuation">.</span>sender<span class="token punctuation">,</span> <span class="token punctuation">{</span> type<span class="token punctuation">:</span> SUCCESS<span class="token punctuation">,</span> payload<span class="token punctuation">:</span> newContact <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span> nextState<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n        <span class="token comment" spellcheck="true">// All these message types require an existing contact</span>\n        <span class="token comment" spellcheck="true">// So check if the contact exists</span>\n        <span class="token keyword">const</span> contact <span class="token operator">=</span> state<span class="token punctuation">.</span>contacts<span class="token punctuation">[</span>msg<span class="token punctuation">.</span>contactId<span class="token punctuation">]</span><span class="token punctuation">;</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>contact<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">switch</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n              <span class="token keyword">case</span> GET_CONTACT<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n                <span class="token function">dispatch</span><span class="token punctuation">(</span>ctx<span class="token punctuation">.</span>sender<span class="token punctuation">,</span> <span class="token punctuation">{</span> payload<span class="token punctuation">:</span> contact<span class="token punctuation">,</span> type<span class="token punctuation">:</span> SUCCESS <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token keyword">break</span><span class="token punctuation">;</span>\n              <span class="token punctuation">}</span>\n              <span class="token keyword">case</span> REMOVE_CONTACT<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n                <span class="token comment" spellcheck="true">// Create a new state with the contact value to undefined</span>\n                <span class="token keyword">const</span> nextState <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token operator">...</span>state<span class="token punctuation">.</span>contacts<span class="token punctuation">,</span> <span class="token punctuation">[</span>contact<span class="token punctuation">.</span>id<span class="token punctuation">]</span><span class="token punctuation">:</span> undefined <span class="token punctuation">}</span><span class="token punctuation">;</span>\n                <span class="token function">dispatch</span><span class="token punctuation">(</span>ctx<span class="token punctuation">.</span>sender<span class="token punctuation">,</span> <span class="token punctuation">{</span> type<span class="token punctuation">:</span> SUCCESS<span class="token punctuation">,</span> payload<span class="token punctuation">:</span> contact <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token keyword">return</span> nextState<span class="token punctuation">;</span>                 \n              <span class="token punctuation">}</span>\n              <span class="token keyword">case</span> UPDATE_CONTACT<span class="token punctuation">:</span>  <span class="token punctuation">{</span>\n                <span class="token comment" spellcheck="true">// Create a new state with the previous fields of the contact </span>\n                <span class="token comment" spellcheck="true">// merged with the updated ones</span>\n                <span class="token keyword">const</span> updatedContact <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token operator">...</span>contact<span class="token punctuation">,</span> <span class="token operator">...</span>msg<span class="token punctuation">.</span>payload <span class="token punctuation">}</span><span class="token punctuation">;</span>\n                <span class="token keyword">const</span> nextState <span class="token operator">=</span> <span class="token punctuation">{</span> \n                  <span class="token operator">...</span>state<span class="token punctuation">.</span>contacts<span class="token punctuation">,</span>\n                  <span class="token punctuation">[</span>contact<span class="token punctuation">.</span>id<span class="token punctuation">]</span><span class="token punctuation">:</span> updatedContact \n                <span class="token punctuation">}</span><span class="token punctuation">;</span>\n                <span class="token function">dispatch</span><span class="token punctuation">(</span>ctx<span class="token punctuation">.</span>sender<span class="token punctuation">,</span> <span class="token punctuation">{</span> type<span class="token punctuation">:</span> SUCCESS<span class="token punctuation">,</span> payload<span class="token punctuation">:</span> updatedContact <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n                <span class="token keyword">return</span> nextState<span class="token punctuation">;</span>                 \n              <span class="token punctuation">}</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n          <span class="token comment" spellcheck="true">// If it does not, dispatch a not found message to the sender          </span>\n          <span class="token function">dispatch</span><span class="token punctuation">(</span>\n            ctx<span class="token punctuation">.</span>sender<span class="token punctuation">,</span> \n            <span class="token punctuation">{</span> type<span class="token punctuation">:</span> NOT_FOUND<span class="token punctuation">,</span> contactId<span class="token punctuation">:</span> msg<span class="token punctuation">.</span>contactId <span class="token punctuation">}</span><span class="token punctuation">,</span> \n            ctx<span class="token punctuation">.</span>self\n          <span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>      \n    <span class="token comment" spellcheck="true">// Return the current state if unchanged.</span>\n    <span class="token keyword">return</span> state<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">\'contacts\'</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Now to wire up the contact service to the API controllers, we have create a query for each endpoint. For example here is how to wire up the fetch a specific contact endpoint (the others are very similar):</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code>app<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'/api/contacts/:contact_id\'</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span>res<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span> \n  <span class="token keyword">const</span> contactId <span class="token operator">=</span> req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>contact_id<span class="token punctuation">;</span>\n  <span class="token keyword">const</span> msg <span class="token operator">=</span> <span class="token punctuation">{</span> type<span class="token punctuation">:</span> GET_CONTACT<span class="token punctuation">,</span> contactId <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token keyword">try</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">query</span><span class="token punctuation">(</span>contactService<span class="token punctuation">,</span> msg<span class="token punctuation">,</span> <span class="token number">250</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment" spellcheck="true">// Set a 250ms timeout</span>\n    <span class="token keyword">switch</span><span class="token punctuation">(</span>result<span class="token punctuation">.</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">case</span> SUCCESS<span class="token punctuation">:</span> res<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span>result<span class="token punctuation">.</span>payload<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token keyword">break</span><span class="token punctuation">;</span>\n      <span class="token keyword">case</span> NOT_FOUND<span class="token punctuation">:</span> res<span class="token punctuation">.</span><span class="token function">sendStatus</span><span class="token punctuation">(</span><span class="token number">404</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token keyword">break</span><span class="token punctuation">;</span>\n      <span class="token keyword">default</span><span class="token punctuation">:</span>\n        <span class="token comment" spellcheck="true">// This shouldn\'t ever happen, but means that something is really wrong in the application</span>\n        console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>JSON<span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        res<span class="token punctuation">.</span><span class="token function">sendStatus</span><span class="token punctuation">(</span><span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">break</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment" spellcheck="true">// 504 is the gateway timeout response code. Nact only throws on queries to a valid actor reference if the timeout </span>\n    <span class="token comment" spellcheck="true">// expires.</span>\n    res<span class="token punctuation">.</span><span class="token function">sendStatus</span><span class="token punctuation">(</span><span class="token number">504</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Now this is a bit of boilerplate for each endpoint, but could be refactored so as to extract the error handling into a separate function named <code>performQuery</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code><span class="token keyword">const</span> performQuery <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span>msg<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token keyword">try</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">query</span><span class="token punctuation">(</span>contactsService<span class="token punctuation">,</span> msg<span class="token punctuation">,</span> <span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment" spellcheck="true">// Set a 250ms timeout</span>\n    <span class="token keyword">switch</span><span class="token punctuation">(</span>result<span class="token punctuation">.</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">case</span> SUCCESS<span class="token punctuation">:</span> res<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span>result<span class="token punctuation">.</span>payload<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token keyword">break</span><span class="token punctuation">;</span>\n      <span class="token keyword">case</span> NOT_FOUND<span class="token punctuation">:</span> res<span class="token punctuation">.</span><span class="token function">sendStatus</span><span class="token punctuation">(</span><span class="token number">404</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token keyword">break</span><span class="token punctuation">;</span>\n      <span class="token keyword">default</span><span class="token punctuation">:</span>\n        <span class="token comment" spellcheck="true">// This shouldn\'t ever happen, but means that something is really wrong in the application</span>\n        console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>JSON<span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        res<span class="token punctuation">.</span><span class="token function">sendStatus</span><span class="token punctuation">(</span><span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">break</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment" spellcheck="true">// 504 is the gateway timeout response code. Nact only throws on queries to a valid actor reference if the timeout </span>\n    <span class="token comment" spellcheck="true">// expires.</span>\n    res<span class="token punctuation">.</span><span class="token function">sendStatus</span><span class="token punctuation">(</span><span class="token number">504</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>This would allow us to define the endpoints as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code>app<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'/api/contacts\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span>res<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token function">performQuery</span><span class="token punctuation">(</span><span class="token punctuation">{</span> type<span class="token punctuation">:</span> GET_CONTACTS <span class="token punctuation">}</span><span class="token punctuation">,</span> res<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'/api/contacts/:contact_id\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span>res<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> \n  <span class="token function">performQuery</span><span class="token punctuation">(</span><span class="token punctuation">{</span> type<span class="token punctuation">:</span> GET_CONTACT<span class="token punctuation">,</span> contactId<span class="token punctuation">:</span> req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>contact_id <span class="token punctuation">}</span><span class="token punctuation">,</span> res<span class="token punctuation">)</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">\'/api/contacts\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span>res<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token function">performQuery</span><span class="token punctuation">(</span><span class="token punctuation">{</span> type<span class="token punctuation">:</span> CREATE_CONTACT<span class="token punctuation">,</span> payload<span class="token punctuation">:</span> req<span class="token punctuation">.</span>body <span class="token punctuation">}</span><span class="token punctuation">,</span> res<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token function">patch</span><span class="token punctuation">(</span><span class="token string">\'/api/contacts/:contact_id\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span>res<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> \n  <span class="token function">performQuery</span><span class="token punctuation">(</span><span class="token punctuation">{</span> type<span class="token punctuation">:</span> UPDATE_CONTACT<span class="token punctuation">,</span> contactId<span class="token punctuation">:</span> req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>contact_id<span class="token punctuation">,</span> payload<span class="token punctuation">:</span> req<span class="token punctuation">.</span>body <span class="token punctuation">}</span><span class="token punctuation">,</span> res<span class="token punctuation">)</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\napp<span class="token punctuation">.</span><span class="token keyword">delete</span><span class="token punctuation">(</span><span class="token string">\'/api/contacts/:contact_id\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span>res<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> \n  <span class="token function">performQuery</span><span class="token punctuation">(</span><span class="token punctuation">{</span> type<span class="token punctuation">:</span> REMOVE_CONTACT<span class="token punctuation">,</span> contactId<span class="token punctuation">:</span> req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>contact_id <span class="token punctuation">}</span><span class="token punctuation">,</span> res<span class="token punctuation">)</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>This should leave you with a working but very basic contacts service. </p>',
timeToRead:5,excerpt:"Actor systems don't live in a vacuum, they need to be available to the outside world. Commonly actor systems are fronted by REST APIs or RPC...",frontmatter:{title:"Querying",cover:"https://unsplash.it/400/300/?random?BoldMage",date:"11/12/2017",category:"javascript",tags:["getting-started","nact","javascript","nodejs"]},fields:{slug:"/querying"}}},pathContext:{slug:"/querying",category:"javascript"}}}});
//# sourceMappingURL=path---lesson-javascript-querying-6512e6e4d97216e62e4a.js.map